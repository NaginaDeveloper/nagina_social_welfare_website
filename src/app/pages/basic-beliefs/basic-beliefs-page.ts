import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { BasicBeliefs } from '../../components/basic-beliefs/basic-beliefs';

@Component({
  selector: 'app-basic-beliefs-page',
  imports: [PageShell, BasicBeliefs],
  template: `
    <app-page-shell title="Basic Beliefs">
      <app-basic-beliefs />
    </app-page-shell>
  `,
})
export class BasicBeliefsPage {}
