import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { KhatmeNabuwwat } from '../../components/khatme-nabuwwat/khatme-nabuwwat';

@Component({
  selector: 'app-khatme-nabuwwat-page',
  imports: [PageShell, KhatmeNabuwwat],
  template: `
    <app-page-shell title="Khatme Nabuwwat">
      <app-khatme-nabuwwat />
    </app-page-shell>
  `,
})
export class KhatmeNabuwwatPage {}
