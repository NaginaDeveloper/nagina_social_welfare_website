import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { ZakatRules } from '../../components/zakat-rules/zakat-rules';

@Component({
  selector: 'app-zakat-rules-page',
  imports: [PageShell, ZakatRules],
  template: `
    <app-page-shell title="Zakat Rules">
      <app-zakat-rules />
    </app-page-shell>
  `,
})
export class ZakatRulesPage {}
