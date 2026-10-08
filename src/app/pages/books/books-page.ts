import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Books } from '../../components/books/books';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-books-page',
  imports: [NextSteps, PageShell, Books],
  template: `
    <app-page-shell title="Books">
      <app-books />
      <app-next-steps page="/books" />
    </app-page-shell>
  `,
})
export class BooksPage {}
