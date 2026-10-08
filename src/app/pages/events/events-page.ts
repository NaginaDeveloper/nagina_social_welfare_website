import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Gallery } from '../../components/gallery/gallery';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-events-page',
  imports: [NextSteps, PageShell, Gallery],
  template: `
    <app-page-shell title="Events">
      <app-gallery />
      <app-next-steps page="/events" />
    </app-page-shell>
  `,
})
export class EventsPage {}
