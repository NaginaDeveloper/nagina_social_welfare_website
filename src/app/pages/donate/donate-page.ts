import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Donations } from '../../components/donations/donations';

@Component({
  selector: 'app-donate-page',
  imports: [PageShell, Donations],
  template: `
    <app-page-shell title="Donate">
      <app-donations />
    </app-page-shell>
  `,
})
export class DonatePage {}
