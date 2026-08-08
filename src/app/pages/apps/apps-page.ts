import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Apps } from '../../components/apps/apps';

@Component({
  selector: 'app-apps-page',
  imports: [PageShell, Apps],
  template: `
    <app-page-shell title="Apps">
      <app-apps />
    </app-page-shell>
  `,
})
export class AppsPage {}
