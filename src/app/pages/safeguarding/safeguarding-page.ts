import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Safeguarding } from '../../components/safeguarding/safeguarding';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-safeguarding-page',
  imports: [NextSteps, PageShell, Safeguarding],
  template: `
    <app-page-shell title="Safeguarding">
      <app-safeguarding />
      <app-next-steps page="/safeguarding" />
    </app-page-shell>
  `,
})
export class SafeguardingPage {}
