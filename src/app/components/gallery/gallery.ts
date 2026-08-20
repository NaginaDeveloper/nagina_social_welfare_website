import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import {
  googleCalendarUrl,
  isEventToday,
  listedEvents,
  pastEvents,
  type UpcomingEvent,
} from '../../config/upcoming-events.config';
import { LanguageService } from '../../i18n/language.service';
import { GALLERY_ITEMS, type GalleryItem } from './gallery-data';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
})
export class Gallery {
  protected readonly i18n = inject(LanguageService);
  protected readonly facebookUrl = ORGANIZATION.facebookUrl;
  protected readonly facebookPhotosUrl = ORGANIZATION.facebookPhotosUrl;
  protected readonly instagramUrl = ORGANIZATION.instagramUrl;
  protected readonly youtubeUrl = ORGANIZATION.youtubeUrl;

  protected readonly activeItem = signal<GalleryItem | null>(null);
  protected readonly items = GALLERY_ITEMS;
  protected readonly programmes = listedEvents();
  protected readonly pastProgrammes = pastEvents();

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

  protected openPoster(event: UpcomingEvent): void {
    if (!event.image) {
      return;
    }
    this.openItem({
      id: `${event.id}-poster`,
      src: event.image,
      alt: event.imageAlt ?? event.title,
      caption: event.title,
    });
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

  protected eventHighlights(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur'
      ? (event.highlightsUr ?? '')
      : (event.highlights ?? '');
  }

  protected eventSummary(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur' ? (event.summaryUr ?? '') : (event.summary ?? '');
  }

  protected eventHost(event: UpcomingEvent): string {
    return this.i18n.lang() === 'ur' ? (event.hostUr ?? '') : (event.host ?? '');
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
