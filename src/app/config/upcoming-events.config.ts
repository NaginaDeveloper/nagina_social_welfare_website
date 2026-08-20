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
  readonly image?: string;
  readonly imageAlt?: string;
  readonly recurring?: string;
  readonly recurringUr?: string;
  readonly audience: string;
  readonly audienceUr: string;
  readonly venue: string;
  readonly whatsappPrefill: string;
}

/**
 * Dated gatherings and recurring programmes. Dated items move to Past
 * after their London calendar date (the event day itself stays Upcoming / Today).
 */
export const UPCOMING_EVENTS: readonly UpcomingEvent[] = [
  {
    id: 'mehfil-naat-2026',
    title: 'Grand Annual Mehfil-e-Naat',
    titleUr: 'سالانہ عظمتِ مصطفیٰ ﷺ و با برکت محفلِ نعت',
    date: '2026-08-24',
    time: '21:30',
    endTime: '05:00',
    endsNextDay: true,
    whenLabel: 'Monday 24 August 2026 · After Isha (9:30pm) till Fajr',
    whenLabelUr: 'پیر 24 اگست 2026 · بعد نمازِ عشاء (رات 9:30) تا فجر',
    highlights: 'Naat recitation, Zikr-e-Elahi, Salat-ul-Tasbeeh and fellowship',
    highlightsUr: 'مدحِ رسول ﷺ، ذکرِ الٰہی، صلوٰۃ التسبیح اور باہمی ملاقات',
    summary:
      'Assalamu Alaikum Wa Rahmatullah Wa Barakatuh. By the grace of Allah, Markaz Deen-e-Islam invites you to a night of Naat, Zikr and Salat-ul-Tasbeeh from Isha until Fajr. Your presence will illuminate this gathering — please also invite fellow Naat Khawans. Hosted by Sajid Mahmood Yousufi.',
    summaryUr:
      'السلام علیکم ورحمۃ اللہ وبرکاتہ! اللہ تعالیٰ کے فضل سے مرکزِ دینِ اسلام کے زیرِ اہتمام شبِ نعت و ذکرِ الٰہی — عشاء سے فجر تک تلاوت، نعت خوانی، ذکر، صلوٰۃ التسبیح اور برادرانہ ملاقات۔ برائے کرم دیگر نعت خواں حضرات کو بھی مدعو کیجیے۔ منجانب ساجد محمود یوسفی۔',
    host: 'Sajid Mahmood Yousufi · Markaz Deen-e-Islam',
    hostUr: 'ساجد محمود یوسفی · مرکزِ دینِ اسلام',
    image: 'gallery/poster-mehfil-naat-2026.png',
    imageAlt:
      'Grand Annual Mehfil-e-Naat poster — Monday 24 August 2026 at Markaz Deen-e-Islam, from Isha till Fajr',
    audience: 'Brothers · Naat Khawans and lovers of the Prophet ﷺ',
    audienceUr: 'بھائی · ثناء خوانانِ مصطفیٰ ﷺ',
    venue: 'Markaz Deen-e-Islam, 103 Burmer Road, Peterborough PE1 3HT',
    whatsappPrefill:
      'Assalamu alaikum, I would like to attend the Grand Annual Mehfil-e-Naat on Monday 24 August at Markaz Deen-e-Islam (after Isha till Fajr).',
  },
  {
    id: 'namaz-course',
    title: 'Let’s Learn Namaz',
    titleUr: 'نماز سیکھیں',
    recurring: 'Weekly course',
    recurringUr: 'ہفتہ وار کورس',
    audience: 'Open to all',
    audienceUr: 'سب کے لیے',
    venue: 'Markaz Deen-e-Islam, Peterborough',
    whatsappPrefill:
      'Assalamu alaikum, I would like to join the Let’s Learn Namaz course at Markaz Deen-e-Islam.',
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
    title: 'Zikr & Fikr',
    titleUr: 'ذکر و فکر',
    recurring: 'Remembrance and reflection evenings',
    recurringUr: 'ذکر و فکر کی شامیں',
    audience: 'Families welcome',
    audienceUr: 'خاندان خوش آمدید',
    venue: 'Markaz Deen-e-Islam, Peterborough',
    whatsappPrefill:
      'Assalamu alaikum, please tell me the next Zikr & Fikr evening at Markaz Deen-e-Islam.',
  },
];

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

export function listedEvents(now = new Date()): readonly UpcomingEvent[] {
  return UPCOMING_EVENTS.filter((event) => isEventUpcoming(event, now));
}

export function pastEvents(now = new Date()): readonly UpcomingEvent[] {
  return UPCOMING_EVENTS.filter((event) => isEventPast(event, now)).slice().sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  );
}

/** Dated live events first (soonest), then recurring programmes. */
export function nextSpotlightEvent(now = new Date()): UpcomingEvent | null {
  const open = listedEvents(now);
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
