import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Apps } from '../../components/apps/apps';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-apps-page',
  imports: [NextSteps, PageShell, Apps],
  template: `
    <app-page-shell title="Apps">
      <app-apps />
      <app-next-steps page="/apps" />
    </app-page-shell>
  `,
})
export class AppsPage {}
