import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Sermons } from '../../components/sermons/sermons';

@Component({
  selector: 'app-sermons-page',
  imports: [PageShell, Sermons],
  template: `
    <app-page-shell title="Sermons">
      <app-sermons />
    </app-page-shell>
  `,
})
export class SermonsPage {}
