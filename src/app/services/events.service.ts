import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  STANDING_PROGRAMMES,
  listedEvents,
  nextSpotlightEvent,
  pastEvents,
  type UpcomingEvent,
} from '../config/upcoming-events.config';
import { firebaseStorageUrl } from './books.service';

export interface EventsCatalogImage {
  readonly id: string;
  readonly url: string;
  readonly alt?: string;
}

export interface EventsCatalogItem {
  readonly id: string;
  readonly title: string;
  readonly titleUr?: string;
  readonly description?: string;
  readonly descriptionUr?: string;
  readonly date: string;
  readonly time?: string;
  readonly venue?: string;
  readonly whatsappPrefill?: string;
  readonly images?: readonly EventsCatalogImage[];
}

export interface EventsCatalog {
  readonly version?: number;
  readonly generatedAt?: string;
  readonly events?: readonly EventsCatalogItem[];
}

export const EVENTS_CATALOG_URL = firebaseStorageUrl('events/catalog.json');

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly catalogEvents = signal<UpcomingEvent[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private loadPromise: Promise<void> | null = null;

  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Dated CMS events + standing programmes (for splitting Latest / Past). */
  readonly allEvents = computed(() => [...this.catalogEvents(), ...STANDING_PROGRAMMES]);

  readonly latestEvents = computed(() =>
    listedEvents(new Date(), this.allEvents()).filter((e) => !!e.date),
  );

  readonly pastDatedEvents = computed(() => pastEvents(new Date(), this.allEvents()));

  readonly standingProgrammes = computed(() => STANDING_PROGRAMMES);

  readonly spotlightEvent = computed(() => nextSpotlightEvent(new Date(), this.allEvents()));

  async load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this.fetchCatalog();
    return this.loadPromise;
  }

  private async fetchCatalog(): Promise<void> {
    try {
      const catalog = await firstValueFrom(this.http.get<EventsCatalog>(EVENTS_CATALOG_URL));
      const mapped = (catalog.events ?? []).map((item) => this.toUpcoming(item));
      this.catalogEvents.set(mapped);
      this.errorSignal.set(null);
    } catch (err) {
      console.error(err);
      this.catalogEvents.set([]);
      this.errorSignal.set('Unable to load published events right now.');
    } finally {
      this.loadedSignal.set(true);
    }
  }

  private toUpcoming(item: EventsCatalogItem): UpcomingEvent {
    const images = (item.images ?? []).filter((img) => !!img.url);
    const primary = images[0];
    const whenLabel = formatWhenLabel(item.date, item.time);
    return {
      id: item.id,
      title: item.title,
      titleUr: item.titleUr?.trim() || item.title,
      date: item.date,
      time: item.time || undefined,
      whenLabel,
      whenLabelUr: whenLabel,
      summary: item.description ?? '',
      summaryUr: item.descriptionUr?.trim() || item.description || '',
      image: primary?.url,
      imageAlt: primary?.alt ?? item.title,
      images,
      audience: 'Open to all',
      audienceUr: 'سب کے لیے',
      venue: item.venue?.trim() || 'Markaz Deen-e-Islam, Peterborough',
      whatsappPrefill:
        item.whatsappPrefill?.trim() ||
        `Assalamu alaikum, I would like to attend ${item.title} on ${item.date} at Markaz Deen-e-Islam.`,
    };
  }
}

function formatWhenLabel(date: string, time?: string): string {
  try {
    const d = new Date(`${date}T12:00:00`);
    const datePart = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    if (!time) return datePart;
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'pm' : 'am';
    const hour12 = ((h + 11) % 12) + 1;
    const mins = String(m ?? 0).padStart(2, '0');
    return `${datePart} · ${hour12}:${mins}${ampm}`;
  } catch {
    return time ? `${date} · ${time}` : date;
  }
}
