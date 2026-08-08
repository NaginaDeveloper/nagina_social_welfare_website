import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { OurWork } from '../../components/our-work/our-work';

@Component({
  selector: 'app-work-page',
  imports: [PageShell, OurWork],
  template: `
    <app-page-shell title="Our Work">
      <app-our-work />
    </app-page-shell>
  `,
})
export class WorkPage {}
