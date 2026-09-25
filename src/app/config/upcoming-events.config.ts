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
 *
 * Local dated events below ship with the site build when a gathering needs to
 * go live before (or without) an admin catalog publish. Catalog entries with
 * the same `id` win over these.
 */
export const LOCAL_DATED_EVENTS: readonly UpcomingEvent[] = [
  {
    id: 'zikr-fikr-2026-09-27',
    title: 'Zikr & Fikr — Remembrance & Reflection',
    titleUr: 'ذکر و فکر — یاد اور غور',
    date: '2026-09-27',
    time: '18:30',
    endTime: '20:00',
    whenLabel: 'Sunday, 27 September 2026 · 6:30–8:00pm',
    whenLabelUr: 'اتوار، ۲۷ ستمبر ۲۰۲۶ · ۶:۳۰–۸:۰۰ شام',
    highlights: 'Main topics: Al-Sidq (the virtue of truthfulness) & Zikr and Fikr',
    highlightsUr: 'بنیادی موضوعات: الصدق (سچائی کی فضیلت) اور ذکر و فکر',
    summary:
      '<p><strong>Weekly spiritual &amp; reflection gathering</strong> for brothers and youngsters.</p>' +
      '<p>Main topics: <strong>Al-Sidq</strong> (the virtue of truthfulness) and <strong>Zikr and Fikr</strong>.</p>' +
      '<p>A gathering to remember Allah and learn the Sunnah of Prophet Muhammad ﷺ. Your presence is warmly invited.</p>' +
      '<p>Sunday 27 September · 6:30pm–8:00pm · Markaz Deen-e-Islam, 103 Burmer Road, Peterborough PE1 3HT</p>',
    summaryUr:
      '<p><strong>ہفتہ وار روحانی اور غور و فکر کی محفل</strong> — صرف بھائیوں اور نوجوانوں کے لیے۔</p>' +
      '<p>بنیادی موضوعات: <strong>الصدق</strong> (سچائی کی فضیلت) اور <strong>ذکر و فکر</strong>۔</p>' +
      '<p>اللہ کی یاد اور نبی کریم ﷺ کی سنت سیکھنے کی محفل۔ آپ کی آمد مبارک ہوگی۔</p>' +
      '<p>اتوار ۲۷ ستمبر · شام ۶:۳۰–۸:۰۰ · مرکز دین اسلام، ۱۰۳ برمر روڈ، پیٹربرو</p>',
    image: '/gallery/poster-zikr-fikr-sep-2026.webp',
    imageAlt:
      'Zikr and Fikr weekly gathering poster — Sunday 27 September 2026, 6:30–8:00pm at Markaz Deen-e-Islam',
    images: [
      {
        id: 'zikr-fikr-2026-09-27-poster',
        url: '/gallery/poster-zikr-fikr-sep-2026.webp',
        alt: 'Zikr and Fikr — Remembrance & Reflection, 27 September 2026',
      },
    ],
    audience: 'Brothers & youngsters only',
    audienceUr: 'صرف بھائیوں اور نوجوانوں کے لیے',
    venue: 'Markaz Deen-e-Islam, 103 Burmer Road, Peterborough PE1 3HT',
    whatsappPrefill:
      'Assalamu alaikum, I would like to attend Zikr & Fikr (Remembrance & Reflection) on Sunday 27 September at Markaz Deen-e-Islam.',
  },
];

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
