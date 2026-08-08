import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Privacy } from '../../components/privacy/privacy';

@Component({
  selector: 'app-privacy-page',
  imports: [PageShell, Privacy],
  template: `
    <app-page-shell title="Privacy">
      <app-privacy />
    </app-page-shell>
  `,
})
export class PrivacyPage {}
