import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Books } from '../../components/books/books';

@Component({
  selector: 'app-books-page',
  imports: [PageShell, Books],
  template: `
    <app-page-shell title="Books">
      <app-books />
    </app-page-shell>
  `,
})
export class BooksPage {}
