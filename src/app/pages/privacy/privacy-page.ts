import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Privacy } from '../../components/privacy/privacy';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-privacy-page',
  imports: [NextSteps, PageShell, Privacy],
  template: `
    <app-page-shell title="Privacy">
      <app-privacy />
      <app-next-steps page="/privacy" />
    </app-page-shell>
  `,
})
export class PrivacyPage {}
