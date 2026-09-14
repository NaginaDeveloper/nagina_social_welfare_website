import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Duas } from '../../components/duas/duas';

@Component({
  selector: 'app-duas-page',
  imports: [PageShell, Duas],
  template: `
    <app-page-shell title="Daily Duas">
      <app-duas />
    </app-page-shell>
  `,
})
export class DuasPage {}
