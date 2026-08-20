import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { ApplyForm } from '../../components/apply/apply-form';

@Component({
  selector: 'app-apply-page',
  imports: [PageShell, ApplyForm],
  template: `
    <app-page-shell title="Apply">
      <app-apply-form />
    </app-page-shell>
  `,
})
export class ApplyPage {}
