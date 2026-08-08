import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Guidance } from '../../components/guidance/guidance';

@Component({
  selector: 'app-guidance-page',
  imports: [PageShell, Guidance],
  template: `
    <app-page-shell title="Guidance">
      <app-guidance />
    </app-page-shell>
  `,
})
export class GuidancePage {}
