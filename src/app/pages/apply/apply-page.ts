import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { ApplyForm } from '../../components/apply/apply-form';
import { ApplyIntake } from '../../components/apply/apply-intake';

@Component({
  selector: 'app-apply-page',
  imports: [PageShell, ApplyIntake, ApplyForm],
  template: `
    <app-page-shell title="Online admission">
      <app-apply-intake />
      <app-apply-form />
    </app-page-shell>
  `,
})
export class ApplyPage {}
