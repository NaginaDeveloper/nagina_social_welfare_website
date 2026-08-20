import { Component, OnInit, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { FormsModule } from '@angular/forms';
import { BOOKS_PLACEHOLDER_URL, BooksService } from '../../services/books.service';
import type { Book } from '../../models/book';

@Component({
  selector: 'app-books',
  imports: [FormsModule],
  templateUrl: './books.html',
})
export class Books implements OnInit {
  protected readonly i18n = inject(LanguageService);

  protected readonly books = inject(BooksService);
  protected search = '';

  ngOnInit(): void {
    void this.books.load();
  }

  protected onSearch(value: string): void {
    this.search = value;
    this.books.setQuery(value);
  }

  protected bookHref(book: Book): string {
    return this.books.bookUrl(book);
  }

  protected onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = BOOKS_PLACEHOLDER_URL;
  }
}
