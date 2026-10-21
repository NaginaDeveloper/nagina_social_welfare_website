import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Terms } from '../../components/terms/terms';

@Component({
  selector: 'app-terms-page',
  imports: [PageShell, Terms],
  template: `
    <app-page-shell title="Terms & Conditions">
      <app-terms />
    </app-page-shell>
  `,
})
export class TermsPage {}
