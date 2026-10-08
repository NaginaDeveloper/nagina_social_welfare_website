import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Sermons } from '../../components/sermons/sermons';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-sermons-page',
  imports: [NextSteps, PageShell, Sermons],
  template: `
    <app-page-shell title="Sermons">
      <app-sermons />
      <app-next-steps page="/sermons" />
    </app-page-shell>
  `,
})
export class SermonsPage {}
