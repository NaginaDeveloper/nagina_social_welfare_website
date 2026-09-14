import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Peterborough } from '../../components/peterborough/peterborough';

@Component({
  selector: 'app-peterborough-page',
  imports: [PageShell, Peterborough],
  template: `
    <app-page-shell title="Peterborough">
      <app-peterborough />
    </app-page-shell>
  `,
})
export class PeterboroughPage {}
