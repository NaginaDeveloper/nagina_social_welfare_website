import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Book, BookCatalog } from '../models/book';

/** Firebase Storage bucket for the Seedha Rasta book library. */
export const FIREBASE_STORAGE_BUCKET = 'nagina-social-welfare-uk.firebasestorage.app';

/** Public download URL for an object in the books library bucket. */
export function firebaseStorageUrl(objectPath: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(objectPath)}?alt=media`;
}

export const BOOKS_CATALOG_URL = firebaseStorageUrl('books/catalog.json');
export const BOOKS_PLACEHOLDER_URL = firebaseStorageUrl('books/covers/placeholder.svg');

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly booksSignal = signal<Book[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly querySignal = signal('');

  readonly books = this.booksSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();

  readonly filteredBooks = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    const all = this.booksSignal();
    if (!q) return all;
    return all.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.language.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q),
    );
  });

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<void> {
    if (this.loadedSignal() && !this.errorSignal()) return;
    try {
      const catalog = await firstValueFrom(this.http.get<BookCatalog>(BOOKS_CATALOG_URL));
      this.booksSignal.set((catalog.books ?? []).map((book) => this.normalize(book)));
      this.loadedSignal.set(true);
      this.errorSignal.set(null);
    } catch (err) {
      this.errorSignal.set('Unable to load the book catalogue right now.');
      this.loadedSignal.set(true);
      console.error(err);
    }
  }

  setQuery(value: string): void {
    this.querySignal.set(value);
  }

  /** Open the PDF directly from Firebase Storage. */
  bookUrl(book: Book): string {
    return book.pdfUrl || firebaseStorageUrl(`books/pdfs/${book.slug}.pdf`);
  }

  private normalize(book: Book): Book {
    return {
      ...book,
      coverUrl: this.resolveAsset(book.coverUrl, `books/covers/${basename(book.coverUrl || book.slug + '.jpg')}`),
      pdfUrl: this.resolveAsset(book.pdfUrl, `books/pdfs/${basename(book.pdfUrl || book.slug + '.pdf')}`),
    };
  }

  private resolveAsset(urlOrPath: string, fallbackObjectPath: string): string {
    if (!urlOrPath) return firebaseStorageUrl(fallbackObjectPath);
    if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
    const cleaned = urlOrPath.replace(/^\/+/, '');
    // Legacy hosting paths → Storage objects
    if (cleaned.startsWith('assets/books/')) {
      return firebaseStorageUrl(cleaned.replace(/^assets\//, ''));
    }
    if (cleaned.startsWith('books/')) {
      return firebaseStorageUrl(cleaned);
    }
    return firebaseStorageUrl(fallbackObjectPath);
  }
}

function basename(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}
