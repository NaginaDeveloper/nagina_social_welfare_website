import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KUTUB_SITTAH, findHadithBook } from '../data/kutub-sittah';
import type {
  HadithApiSectionResponse,
  HadithBookCatalog,
  HadithChapterDetail,
  HadithChapterSummary,
  HadithEntry,
} from '../models/hadith';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

@Injectable({ providedIn: 'root' })
export class HadithService {
  private readonly booksSignal = signal<readonly HadithBookCatalog[]>(KUTUB_SITTAH);
  private readonly currentBookSignal = signal<HadithBookCatalog | null>(null);
  private readonly currentChapterSignal = signal<HadithChapterDetail | null>(null);
  private readonly loadingChapterSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly bookQuerySignal = signal('');
  private readonly chapterQuerySignal = signal('');
  private readonly showEnglishSignal = signal(false);

  private readonly cache = new Map<string, HadithChapterDetail>();

  readonly books = this.booksSignal.asReadonly();
  readonly currentBook = this.currentBookSignal.asReadonly();
  readonly currentChapter = this.currentChapterSignal.asReadonly();
  readonly loadingChapter = this.loadingChapterSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly bookQuery = this.bookQuerySignal.asReadonly();
  readonly chapterQuery = this.chapterQuerySignal.asReadonly();
  readonly showEnglish = this.showEnglishSignal.asReadonly();

  readonly filteredBooks = computed(() => {
    const q = this.bookQuerySignal().trim().toLowerCase();
    const all = this.booksSignal();
    if (!q) return all;
    return all.filter(
      (b) =>
        b.slug.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q) ||
        b.nameAr.includes(q) ||
        b.nameUr.includes(q),
    );
  });

  readonly filteredChapters = computed(() => {
    const book = this.currentBookSignal();
    if (!book) return [] as readonly HadithChapterSummary[];
    const q = this.chapterQuerySignal().trim().toLowerCase();
    if (!q) return book.chapters;
    return book.chapters.filter(
      (c) =>
        String(c.number) === q ||
        c.englishName.toLowerCase().includes(q) ||
        c.urduName.includes(q) ||
        c.arabicName.includes(q),
    );
  });

  constructor(private readonly http: HttpClient) {}

  setBookQuery(value: string): void {
    this.bookQuerySignal.set(value);
  }

  setChapterQuery(value: string): void {
    this.chapterQuerySignal.set(value);
  }

  toggleEnglish(): void {
    this.showEnglishSignal.update((v) => !v);
  }

  openBook(slug: string): void {
    const book = findHadithBook(slug) ?? this.booksSignal().find((b) => b.slug === slug);
    if (!book) {
      this.errorSignal.set('Unable to open this blessed collection right now.');
      return;
    }
    this.errorSignal.set(null);
    this.chapterQuerySignal.set('');
    this.currentChapterSignal.set(null);
    this.currentBookSignal.set(book);
  }

  backToBooks(): void {
    this.currentBookSignal.set(null);
    this.currentChapterSignal.set(null);
    this.chapterQuerySignal.set('');
    this.errorSignal.set(null);
  }

  backToChapters(): void {
    this.currentChapterSignal.set(null);
    this.errorSignal.set(null);
  }

  async openChapter(chapterNumber: number): Promise<void> {
    const book = this.currentBookSignal();
    if (!book) return;

    this.errorSignal.set(null);
    const cacheKey = `${book.slug}:${chapterNumber}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.currentChapterSignal.set(cached);
      return;
    }

    this.loadingChapterSignal.set(true);
    this.currentChapterSignal.set(null);
    try {
      const [arabic, urdu, english] = await Promise.all([
        this.fetchSection(`ara-${book.slug}`, chapterNumber),
        this.fetchSection(`urd-${book.slug}`, chapterNumber),
        this.fetchSection(`eng-${book.slug}`, chapterNumber),
      ]);

      const chapterMeta =
        book.chapters.find((c) => c.number === chapterNumber) ??
        ({
          number: chapterNumber,
          englishName: `Chapter ${chapterNumber}`,
          urduName: `Chapter ${chapterNumber}`,
          arabicName: `Chapter ${chapterNumber}`,
        } satisfies HadithChapterSummary);

      const detail = this.mergeChapter(book, chapterMeta, arabic, urdu, english);
      this.cache.set(cacheKey, detail);
      this.currentChapterSignal.set(detail);
    } catch (err) {
      this.errorSignal.set('Unable to open this blessed chapter right now.');
      console.error(err);
    } finally {
      this.loadingChapterSignal.set(false);
    }
  }

  prevChapter(): void {
    const book = this.currentBookSignal();
    const chapter = this.currentChapterSignal();
    if (!book || !chapter) return;
    const idx = book.chapters.findIndex((c) => c.number === chapter.chapterNumber);
    if (idx <= 0) return;
    void this.openChapter(book.chapters[idx - 1].number);
  }

  nextChapter(): void {
    const book = this.currentBookSignal();
    const chapter = this.currentChapterSignal();
    if (!book || !chapter) return;
    const idx = book.chapters.findIndex((c) => c.number === chapter.chapterNumber);
    if (idx < 0 || idx >= book.chapters.length - 1) return;
    void this.openChapter(book.chapters[idx + 1].number);
  }

  hasPrevChapter(): boolean {
    const book = this.currentBookSignal();
    const chapter = this.currentChapterSignal();
    if (!book || !chapter) return false;
    const idx = book.chapters.findIndex((c) => c.number === chapter.chapterNumber);
    return idx > 0;
  }

  hasNextChapter(): boolean {
    const book = this.currentBookSignal();
    const chapter = this.currentChapterSignal();
    if (!book || !chapter) return false;
    const idx = book.chapters.findIndex((c) => c.number === chapter.chapterNumber);
    return idx >= 0 && idx < book.chapters.length - 1;
  }

  private fetchSection(edition: string, chapterNumber: number): Promise<HadithApiSectionResponse> {
    const url = `${CDN_BASE}/${edition}/sections/${chapterNumber}.min.json`;
    return firstValueFrom(this.http.get<HadithApiSectionResponse>(url));
  }

  private mergeChapter(
    book: HadithBookCatalog,
    chapter: HadithChapterSummary,
    arabic: HadithApiSectionResponse,
    urdu: HadithApiSectionResponse,
    english: HadithApiSectionResponse,
  ): HadithChapterDetail {
    const urduByNumber = new Map<number, string>();
    for (const h of urdu.hadiths ?? []) {
      if (typeof h.hadithnumber === 'number') {
        urduByNumber.set(h.hadithnumber, (h.text ?? '').trim());
      }
    }
    const englishByNumber = new Map<number, string>();
    for (const h of english.hadiths ?? []) {
      if (typeof h.hadithnumber === 'number') {
        englishByNumber.set(h.hadithnumber, (h.text ?? '').trim());
      }
    }

    // Prefer English list order as the canonical numbering spine when Arabic is sparse.
    const spine = (english.hadiths ?? arabic.hadiths ?? []).filter(
      (h) => typeof h.hadithnumber === 'number',
    );
    const arabicByNumber = new Map<number, string>();
    for (const h of arabic.hadiths ?? []) {
      if (typeof h.hadithnumber === 'number') {
        arabicByNumber.set(h.hadithnumber, (h.text ?? '').replace(/^\uFEFF/, '').trim());
      }
    }

    const seen = new Set<number>();
    const hadiths: HadithEntry[] = [];
    for (const h of spine) {
      const num = h.hadithnumber as number;
      if (seen.has(num)) continue;
      seen.add(num);
      hadiths.push({
        hadithNumber: num,
        arabicNumber: h.arabicnumber ?? num,
        arabic: arabicByNumber.get(num) ?? '',
        urdu: urduByNumber.get(num) ?? '',
        english: englishByNumber.get(num) ?? (h.text ?? '').trim(),
        referenceBook: h.reference?.book ?? chapter.number,
        referenceHadith: h.reference?.hadith ?? num,
      });
    }

    // Include any Arabic-only numbers missed by the English spine.
    for (const [num, text] of arabicByNumber) {
      if (seen.has(num)) continue;
      seen.add(num);
      hadiths.push({
        hadithNumber: num,
        arabicNumber: num,
        arabic: text,
        urdu: urduByNumber.get(num) ?? '',
        english: englishByNumber.get(num) ?? '',
        referenceBook: chapter.number,
        referenceHadith: num,
      });
    }

    hadiths.sort((a, b) => a.hadithNumber - b.hadithNumber);

    return {
      bookSlug: book.slug,
      bookNameEn: book.nameEn,
      bookNameAr: book.nameAr,
      bookNameUr: book.nameUr,
      chapterNumber: chapter.number,
      chapterNameEn: chapter.englishName,
      chapterNameUr: chapter.urduName,
      chapterNameAr: chapter.arabicName,
      hadiths,
    };
  }
}
