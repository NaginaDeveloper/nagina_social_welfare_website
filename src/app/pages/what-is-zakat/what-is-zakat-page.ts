import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { WhatIsZakat } from '../../components/what-is-zakat/what-is-zakat';

@Component({
  selector: 'app-what-is-zakat-page',
  imports: [PageShell, WhatIsZakat],
  template: `
    <app-page-shell title="What is Zakat?">
      <app-what-is-zakat />
    </app-page-shell>
  `,
})
export class WhatIsZakatPage {}
