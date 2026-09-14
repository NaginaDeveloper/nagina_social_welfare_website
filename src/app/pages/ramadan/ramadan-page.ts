import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Ramadan } from '../../components/ramadan/ramadan';

@Component({
  selector: 'app-ramadan-page',
  imports: [PageShell, Ramadan],
  template: `
    <app-page-shell title="Ramadan">
      <app-ramadan />
    </app-page-shell>
  `,
})
export class RamadanPage {}
