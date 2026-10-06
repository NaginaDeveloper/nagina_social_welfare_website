import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Portals } from '../../components/portals/portals';

@Component({
  selector: 'app-portals-page',
  imports: [PageShell, Portals],
  template: `
    <app-page-shell title="Sign in">
      <app-portals />
    </app-page-shell>
  `,
})
export class PortalsPage {}
