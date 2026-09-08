import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { ZakatCalculator } from '../../components/zakat-calculator/zakat-calculator';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-zakat-page',
  imports: [PageShell, ZakatCalculator],
  template: `
    <app-page-shell [title]="i18n.t('nav.zakat')">
      <app-zakat-calculator />
    </app-page-shell>
  `,
})
export class ZakatPage {
  protected readonly i18n = inject(LanguageService);
}
