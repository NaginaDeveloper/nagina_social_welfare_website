import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { BasicBeliefs } from '../../components/basic-beliefs/basic-beliefs';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-basic-beliefs-page',
  imports: [NextSteps, PageShell, BasicBeliefs],
  template: `
    <app-page-shell title="Basic Beliefs">
      <app-basic-beliefs />
      <app-next-steps page="/basic-beliefs" />
    </app-page-shell>
  `,
})
export class BasicBeliefsPage {}
