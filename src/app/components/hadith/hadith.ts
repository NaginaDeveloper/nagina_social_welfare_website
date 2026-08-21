import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../i18n/language.service';
import { HadithService } from '../../services/hadith.service';
import type { HadithBookCatalog, HadithChapterSummary } from '../../models/hadith';

@Component({
  selector: 'app-hadith',
  imports: [FormsModule],
  templateUrl: './hadith.html',
})
export class Hadith {
  protected readonly i18n = inject(LanguageService);
  protected readonly hadith = inject(HadithService);

  protected bookSearch = '';
  protected chapterSearch = '';

  protected onBookSearch(value: string): void {
    this.bookSearch = value;
    this.hadith.setBookQuery(value);
  }

  protected onChapterSearch(value: string): void {
    this.chapterSearch = value;
    this.hadith.setChapterQuery(value);
  }

  protected openBook(book: HadithBookCatalog): void {
    this.chapterSearch = '';
    this.hadith.openBook(book.slug);
  }

  protected openChapter(chapter: HadithChapterSummary): void {
    void this.hadith.openChapter(chapter.number);
  }

  protected backToBooks(): void {
    this.hadith.backToBooks();
  }

  protected backToChapters(): void {
    this.hadith.backToChapters();
  }

  protected prevChapter(): void {
    this.hadith.prevChapter();
  }

  protected nextChapter(): void {
    this.hadith.nextChapter();
  }

  protected chapterLabel(chapter: HadithChapterSummary): string {
    return this.i18n.isUr() ? chapter.urduName || chapter.englishName : chapter.englishName;
  }

  protected bookDisplayName(book: HadithBookCatalog): string {
    return this.i18n.isUr() ? book.nameUr : book.nameEn;
  }
}
