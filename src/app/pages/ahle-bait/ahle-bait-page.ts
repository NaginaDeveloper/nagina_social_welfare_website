import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { AhleBait } from '../../components/ahle-bait/ahle-bait';

@Component({
  selector: 'app-ahle-bait-page',
  imports: [PageShell, AhleBait],
  template: `
    <app-page-shell title="Ahle Bait">
      <app-ahle-bait />
    </app-page-shell>
  `,
})
export class AhleBaitPage {}
