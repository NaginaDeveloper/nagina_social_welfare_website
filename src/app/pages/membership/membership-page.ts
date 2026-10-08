import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { MembershipForm } from '../../components/membership/membership-form';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-membership-page',
  imports: [NextSteps, PageShell, MembershipForm],
  template: `
    <app-page-shell title="Community membership">
      <app-membership-form />
      <app-next-steps page="/membership" />
    </app-page-shell>
  `,
})
export class MembershipPage {}
