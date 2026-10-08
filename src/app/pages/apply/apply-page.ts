import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { ApplyForm } from '../../components/apply/apply-form';
import { ApplyIntake } from '../../components/apply/apply-intake';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-apply-page',
  imports: [NextSteps, PageShell, ApplyIntake, ApplyForm],
  template: `
    <app-page-shell title="Online admission">
      <app-apply-intake />
      <app-apply-form />
      <app-next-steps page="/apply" />
    </app-page-shell>
  `,
})
export class ApplyPage {}
