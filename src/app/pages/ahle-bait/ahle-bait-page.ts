import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { AhleBait } from '../../components/ahle-bait/ahle-bait';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-ahle-bait-page',
  imports: [NextSteps, PageShell, AhleBait],
  template: `
    <app-page-shell title="Ahl al-Bayt">
      <app-ahle-bait />
      <app-next-steps page="/ahle-bait" />
    </app-page-shell>
  `,
})
export class AhleBaitPage {}
