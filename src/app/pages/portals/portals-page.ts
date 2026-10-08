import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Portals } from '../../components/portals/portals';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-portals-page',
  imports: [NextSteps, PageShell, Portals],
  template: `
    <app-page-shell title="Sign in">
      <app-portals />
      <app-next-steps page="/portals" />
    </app-page-shell>
  `,
})
export class PortalsPage {}
