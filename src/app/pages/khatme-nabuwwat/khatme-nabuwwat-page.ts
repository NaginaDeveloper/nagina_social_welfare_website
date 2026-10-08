import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { KhatmeNabuwwat } from '../../components/khatme-nabuwwat/khatme-nabuwwat';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-khatme-nabuwwat-page',
  imports: [NextSteps, PageShell, KhatmeNabuwwat],
  template: `
    <app-page-shell title="Finality of Prophethood">
      <app-khatme-nabuwwat />
      <app-next-steps page="/khatme-nabuwwat" />
    </app-page-shell>
  `,
})
export class KhatmeNabuwwatPage {}
