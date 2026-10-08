import { Component, inject } from '@angular/core';
import { PageShell } from '../page-shell';
import { Guides } from '../../components/guides/guides';
import { LanguageService } from '../../i18n/language.service';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-guides-page',
  imports: [NextSteps, PageShell, Guides],
  template: `
    <app-page-shell [title]="i18n.t('nav.guides')">
      <app-guides />
      <app-next-steps page="/guides" />
    </app-page-shell>
  `,
})
export class GuidesPage {
  protected readonly i18n = inject(LanguageService);
}
