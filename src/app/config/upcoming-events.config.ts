export interface UpcomingEvent {
  readonly id: string;
  readonly title: string;
  readonly titleUr: string;
  /** ISO date YYYY-MM-DD for a one-off programme. */
  readonly date?: string;
  /** Optional start time HH:mm (Europe/London) when `date` is set. */
  readonly time?: string;
  /** Optional end time HH:mm; if `endsNextDay`, this is the next morning. */
  readonly endTime?: string;
  /** Night programmes that continue past midnight (e.g. Isha till Fajr). */
  readonly endsNextDay?: boolean;
  readonly whenLabel?: string;
  readonly whenLabelUr?: string;
  readonly highlights?: string;
  readonly highlightsUr?: string;
  readonly summary?: string;
  readonly summaryUr?: string;
  readonly host?: string;
  readonly hostUr?: string;
  /** Primary / poster image (first of `images` when from CMS). */
  readonly image?: string;
  readonly imageAlt?: string;
  /** Extra images from the admin catalog (poster is also first here). */
  readonly images?: readonly { readonly id: string; readonly url: string; readonly alt?: string }[];
  readonly recurring?: string;
  readonly recurringUr?: string;
  readonly audience: string;
  readonly audienceUr: string;
  readonly venue: string;
  readonly whatsappPrefill: string;
}

/**
 * Standing (recurring) programmes only. Dated one-off events are published
 * from MDI Admin into Firebase Storage `events/catalog.json`.
 */
export const STANDING_PROGRAMMES: readonly UpcomingEvent[] = [
  {
    id: 'namaz-course',
    title: 'Let’s Learn Salah (prayer)',
    titleUr: 'نماز سیکھیں',
    recurring: 'Weekly course',
    recurringUr: 'ہفتہ وار کورس',
    audience: 'Open to all',
    audienceUr: 'سب کے لیے',
    venue: 'Markaz Deen-e-Islam, Peterborough',
    whatsappPrefill:
      'Assalamu alaikum, I would like to join the Let’s Learn Salah (prayer) course at Markaz Deen-e-Islam.',
  },
  {
    id: 'sisters',
    title: 'Sisters gathering — Let’s learn Islam',
    titleUr: 'بہنوں کی محفل — اسلام سیکھیں',
    recurring: 'Monthly',
    recurringUr: 'ماہانہ',
    audience: 'Sisters',
    audienceUr: 'بہنیں',
    venue: 'Markaz Deen-e-Islam, Peterborough',
    whatsappPrefill:
      'Assalamu alaikum, I would like to attend the sisters gathering (Let’s learn Islam).',
  },
  {
    id: 'zikr-fikr',
    title: 'Remembrance & reflection (Zikr & Fikr)',
    titleUr: 'ذکر و فکر',
    recurring: 'Remembrance and reflection evenings',
    recurringUr: 'ذکر و فکر کی شامیں',
    audience: 'Families welcome',
    audienceUr: 'خاندان خوش آمدید',
    venue: 'Markaz Deen-e-Islam, Peterborough',
    whatsappPrefill:
      'Assalamu alaikum, please tell me the next Remembrance & reflection (Zikr & Fikr) evening at Markaz Deen-e-Islam.',
  },
];

/** @deprecated Prefer STANDING_PROGRAMMES + EventsService catalog. */
export const UPCOMING_EVENTS = STANDING_PROGRAMMES;

export function londonDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const year = parts.find((part) => part.type === 'year')?.value ?? '2026';
  return `${year}-${month}-${day}`;
}

/** True once the event’s London calendar date has passed. */
export function isEventPast(event: UpcomingEvent, now = new Date()): boolean {
  if (!event.date) {
    return false;
  }
  return londonDateString(now) > event.date;
}

export function isEventToday(event: UpcomingEvent, now = new Date()): boolean {
  return !!event.date && londonDateString(now) === event.date;
}

export function isEventUpcoming(event: UpcomingEvent, now = new Date()): boolean {
  if (!event.date) {
    return true;
  }
  return londonDateString(now) <= event.date;
}

export function listedEvents(
  now = new Date(),
  events: readonly UpcomingEvent[] = STANDING_PROGRAMMES,
): readonly UpcomingEvent[] {
  return events
    .filter((event) => isEventUpcoming(event, now))
    .slice()
    .sort((a, b) => {
      if (a.date && b.date) return a.date.localeCompare(b.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return 0;
    });
}

export function pastEvents(
  now = new Date(),
  events: readonly UpcomingEvent[] = STANDING_PROGRAMMES,
): readonly UpcomingEvent[] {
  return events
    .filter((event) => isEventPast(event, now))
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/** Dated live events first (soonest), then recurring programmes. */
export function nextSpotlightEvent(
  now = new Date(),
  events: readonly UpcomingEvent[] = STANDING_PROGRAMMES,
): UpcomingEvent | null {
  const open = listedEvents(now, events);
  const dated = open
    .filter((event) => event.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return dated[0] ?? open[0] ?? null;
}

export function googleCalendarUrl(event: UpcomingEvent): string | null {
  if (!event.date) {
    return null;
  }
  const start = event.time
    ? compactStamp(event.date, event.time)
    : event.date.replaceAll('-', '');
  let end: string;
  if (event.time && event.endTime) {
    const endDate = event.endsNextDay ? addDaysIso(event.date, 1) : event.date;
    end = compactStamp(endDate, event.endTime);
  } else if (event.time) {
    end = compactStamp(event.date, addHours(event.time, 2));
  } else {
    end = nextDayCompact(event.date);
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    location: event.venue,
    details: event.summary ?? 'Nagina Social Welfare · Markaz Deen-e-Islam',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function eventImageList(
  event: UpcomingEvent,
): readonly { readonly id: string; readonly url: string; readonly alt?: string }[] {
  if (event.images?.length) {
    return event.images;
  }
  if (event.image) {
    return [{ id: `${event.id}-poster`, url: event.image, alt: event.imageAlt ?? event.title }];
  }
  return [];
}

function compactStamp(date: string, time: string): string {
  return `${date.replaceAll('-', '')}T${time.replace(':', '')}00`;
}

function addDaysIso(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nextDayCompact(date: string): string {
  return addDaysIso(date, 1).replaceAll('-', '');
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = ((h || 0) + hours) * 60 + (m || 0);
  const hh = String(Math.floor((total / 60) % 24)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}
