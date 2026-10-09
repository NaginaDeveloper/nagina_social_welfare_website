import type { UpcomingEvent } from '../config/upcoming-events.config';
import { SITE_ORIGIN } from './seo.config';

const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/** schema.org FAQPage; entries must mirror the questions and answers visible on the page. */
export function faqPageJsonLd(entries: readonly FaqEntry[], pageUrl: string): object | null {
  const mainEntity = entries
    .filter((e) => e.question.trim() && e.answer.trim())
    .map((e) => ({
      '@type': 'Question',
      name: e.question.trim(),
      acceptedAnswer: { '@type': 'Answer', text: e.answer.trim() },
    }));
  if (mainEntity.length === 0) return null;
  return { '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${pageUrl}#faq`, mainEntity };
}

/** "2026-09-27" + "18:30" -> "2026-09-27T18:30:00+01:00" (Europe/London, DST aware). */
export function londonIso(date: string, time: string, addDays = 0): string {
  const base = new Date(`${date}T${time}:00Z`);
  base.setUTCDate(base.getUTCDate() + addDays);
  const local = base.toISOString().slice(0, 19);
  const zone =
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', timeZoneName: 'longOffset' })
      .formatToParts(base)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const offset = zone === 'GMT' ? '+00:00' : zone.replace('GMT', '');
  return `${local}${offset}`;
}

function plainText(html: string | undefined): string {
  return (html ?? '')
    .replace(/<\/p>\s*/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteUrl(url: string): string {
  return url.startsWith('/') ? `${SITE_ORIGIN}${url}` : url;
}

/** schema.org Event for a one-off, dated gathering; null for recurring programmes. */
export function eventJsonLd(event: UpcomingEvent): object | null {
  if (!event.date) return null;
  const time = event.time ?? '00:00';
  const startDate = event.time ? londonIso(event.date, time) : event.date;
  const endDate = event.endTime
    ? londonIso(event.date, event.endTime, event.endsNextDay ? 1 : 0)
    : undefined;
  const images = [event.image, ...(event.images ?? []).map((i) => i.url)]
    .filter((u): u is string => !!u)
    .map(absoluteUrl);
  const description = plainText(event.summary) || plainText(event.highlights);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${SITE_ORIGIN}/events/#${event.id}`,
    name: event.title,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: event.venue.split(',')[0].trim(), address: event.venue },
    ...(images.length ? { image: [...new Set(images)] } : {}),
    ...(description ? { description } : {}),
    organizer: { '@id': ORGANIZATION_ID },
    url: `${SITE_ORIGIN}/events/`,
  };
}
