import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { MembershipForm } from '../../components/membership/membership-form';

@Component({
  selector: 'app-membership-page',
  imports: [PageShell, MembershipForm],
  template: `
    <app-page-shell title="Community membership">
      <app-membership-form />
    </app-page-shell>
  `,
})
export class MembershipPage {}
