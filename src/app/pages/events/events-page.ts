import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Gallery } from '../../components/gallery/gallery';

@Component({
  selector: 'app-events-page',
  imports: [PageShell, Gallery],
  template: `
    <app-page-shell title="Events">
      <app-gallery />
    </app-page-shell>
  `,
})
export class EventsPage {}
