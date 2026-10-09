import { Component, DestroyRef, effect, inject } from '@angular/core';
import { PageShell } from '../page-shell';
import { Gallery } from '../../components/gallery/gallery';
import { NextSteps } from '../../components/next-steps/next-steps';
import { EventsService } from '../../services/events.service';
import { SeoService } from '../../seo/seo.service';
import { eventJsonLd } from '../../seo/structured-data';

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
export class EventsPage {
  private readonly events = inject(EventsService);
  private readonly seo = inject(SeoService);

  constructor() {
    // Upcoming one-off gatherings only; recurring programmes have no start date to mark up.
    effect(() => {
      const nodes = this.events
        .latestEvents()
        .map((event) => eventJsonLd(event))
        .filter((node): node is object => node !== null);
      this.seo.setExtraJsonLd('events', nodes);
    });
    inject(DestroyRef).onDestroy(() => this.seo.setExtraJsonLd('events', null));
  }
}
