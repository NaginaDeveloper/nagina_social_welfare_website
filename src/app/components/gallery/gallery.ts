import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import {
  eventImageList,
  googleCalendarUrl,
  isEventToday,
  type UpcomingEvent,
} from '../../config/upcoming-events.config';
import { LanguageService } from '../../i18n/language.service';
import { EventsService } from '../../services/events.service';
import { eventDescriptionHtml } from '../../utils/event-html';
import { GALLERY_ITEMS, type GalleryItem } from './gallery-data';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
})
export class Gallery implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly events = inject(EventsService);
  protected readonly facebookUrl = ORGANIZATION.facebookUrl;
  protected readonly facebookPhotosUrl = ORGANIZATION.facebookPhotosUrl;
  protected readonly instagramUrl = ORGANIZATION.instagramUrl;
  protected readonly youtubeUrl = ORGANIZATION.youtubeUrl;

  protected readonly activeItem = signal<GalleryItem | null>(null);
  protected readonly items = GALLERY_ITEMS;

  protected readonly programmes = computed(() => this.events.latestEvents());
  protected readonly pastProgrammes = computed(() => this.events.pastDatedEvents());
  protected readonly regularProgrammes = computed(() => this.events.standingProgrammes());

  ngOnInit(): void {
    void this.events.load();
  }

  protected openItem(item: GalleryItem): void {
    this.activeItem.set(item);
    document.body.style.overflow = 'hidden';
  }

  protected closeItem(): void {
    this.activeItem.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activeItem()) {
      this.closeItem();
    }
  }

  protected openPoster(event: UpcomingEvent, imageUrl?: string): void {
    const images = eventImageList(event);
    const target = imageUrl
      ? images.find((img) => img.url === imageUrl) ?? images[0]
      : images[0];
    if (!target) {
      return;
    }
    this.openItem({
      id: target.id || `${event.id}-poster`,
      src: target.url,
      alt: target.alt ?? event.imageAlt ?? event.title,
      caption: event.title,
    });
  }

  protected imagesFor(event: UpcomingEvent) {
    return eventImageList(event);
  }

  protected eventTitle(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur' ? event.titleUr : event.title;
  }

  protected eventWhen(event: UpcomingEvent): string {
    if (this.i18n.lang() === 'ur') {
      return event.whenLabelUr ?? event.recurringUr ?? event.audienceUr;
    }
    return event.whenLabel ?? event.recurring ?? event.audience;
  }

  protected eventAudience(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur' ? event.audienceUr : event.audience;
  }

  protected eventSummary(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur' ? (event.summaryUr ?? '') : (event.summary ?? '');
  }

  protected eventSummaryHtml(event: UpcomingEvent): string {
    return eventDescriptionHtml(this.eventSummary(event));
  }

  protected isToday(event: UpcomingEvent): boolean {
    return isEventToday(event);
  }

  protected rsvpHref(event: UpcomingEvent): string {
    return whatsappHref(event.whatsappPrefill);
  }

  protected calendarHref(event: UpcomingEvent): string | null {
    return googleCalendarUrl(event);
  }
}
