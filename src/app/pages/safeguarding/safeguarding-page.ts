import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Safeguarding } from '../../components/safeguarding/safeguarding';

@Component({
  selector: 'app-safeguarding-page',
  imports: [PageShell, Safeguarding],
  template: `
    <app-page-shell title="Safeguarding">
      <app-safeguarding />
    </app-page-shell>
  `,
})
export class SafeguardingPage {}
