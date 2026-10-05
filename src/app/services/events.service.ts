import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  LOCAL_DATED_EVENTS,
  STANDING_PROGRAMMES,
  listedEvents,
  nextSpotlightEvent,
  pastEvents,
  type UpcomingEvent,
} from '../config/upcoming-events.config';
import { firebaseStorageUrl } from './books.service';
import { CampusService } from './campus.service';
import { campusTown, type Campus } from '../models/campus';

/** Events published before the madrasa choice carry no campus; they were all at this one. */
const LEGACY_EVENT_CAMPUS_ID = 'peterborough';

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
  /** Campus profile id; blank or missing means Peterborough. */
  readonly campusId?: string;
  /** Campus phone saved on the event, e.g. "+44 7872 340123". */
  readonly contactPhone?: string;
  readonly images?: readonly EventsCatalogImage[];
}

export interface EventsCatalog {
  readonly version?: number;
  readonly generatedAt?: string;
  readonly events?: readonly EventsCatalogItem[];
}

export const EVENTS_CATALOG_URL = firebaseStorageUrl('events/catalog.json');

function mergeDatedEvents(
  catalog: readonly UpcomingEvent[],
  local: readonly UpcomingEvent[],
): UpcomingEvent[] {
  const byId = new Map<string, UpcomingEvent>();
  for (const event of local) {
    byId.set(event.id, event);
  }
  for (const event of catalog) {
    byId.set(event.id, event);
  }
  return [...byId.values()];
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly campuses = inject(CampusService);
  private readonly catalogEvents = signal<UpcomingEvent[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private loadPromise: Promise<void> | null = null;

  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Dated CMS + local dated events + standing programmes. */
  readonly allEvents = computed(() => [
    ...mergeDatedEvents(this.catalogEvents(), LOCAL_DATED_EVENTS),
    ...STANDING_PROGRAMMES,
  ]);

  readonly latestEvents = computed(() =>
    listedEvents(new Date(), this.allEvents()).filter((e) => !!e.date),
  );

  readonly pastDatedEvents = computed(() => pastEvents(new Date(), this.allEvents()));

  readonly standingProgrammes = computed(() => STANDING_PROGRAMMES);

  readonly spotlightEvent = computed(() => nextSpotlightEvent(new Date(), this.allEvents()));

  /** Soonest upcoming dated gathering (for the site-wide ticker). */
  readonly latestDatedEvent = computed(() => {
    const dated = this.latestEvents();
    return dated[0] ?? null;
  });

  async load(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;
    this.loadPromise = this.fetchCatalog();
    return this.loadPromise;
  }

  private async fetchCatalog(): Promise<void> {
    try {
      const [catalog] = await Promise.all([
        firstValueFrom(this.http.get<EventsCatalog>(EVENTS_CATALOG_URL)),
        this.campuses.load(),
      ]);
      const mapped = (catalog.events ?? []).map((item) =>
        toUpcomingEvent(item, this.campuses.byId(item.campusId?.trim() || LEGACY_EVENT_CAMPUS_ID)),
      );
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
}

/** Catalog item → event card; venue and WhatsApp fall back to the event's madrasa. */
export function toUpcomingEvent(item: EventsCatalogItem, campus: Campus | null): UpcomingEvent {
  const images = (item.images ?? []).filter((img) => !!img.url);
  const primary = images[0];
  const whenLabel = formatWhenLabel(item.date, item.time);
  const digits = eventWhatsappDigits(item) || campus?.whatsappDigits || '';
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
    venue: item.venue?.trim() || (campus ? `${campus.displayName}, ${campusTown(campus)}` : ''),
    whatsappPrefill:
      item.whatsappPrefill?.trim() ||
      `Assalamu alaikum, I would like to attend ${item.title} on ${item.date}.`,
    ...(digits ? { whatsappDigits: digits } : {}),
  };
}

/** WhatsApp digits from the campus phone saved on the event (UK numbers only). */
export function eventWhatsappDigits(item: Pick<EventsCatalogItem, 'contactPhone'>): string {
  const digits = (item.contactPhone ?? '').replace(/\D/g, '');
  return /^44\d{9,10}$/.test(digits) ? digits : '';
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
