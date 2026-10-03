import { Component, inject } from '@angular/core';
import { PageShell } from '../page-shell';
import { Guides } from '../../components/guides/guides';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-guides-page',
  imports: [PageShell, Guides],
  template: `
    <app-page-shell [title]="i18n.t('nav.guides')">
      <app-guides />
    </app-page-shell>
  `,
})
export class GuidesPage {
  protected readonly i18n = inject(LanguageService);
}
