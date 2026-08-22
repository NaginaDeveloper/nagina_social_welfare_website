import { describe, expect, it } from 'vitest';
import {
  isEventPast,
  isEventToday,
  isEventUpcoming,
  listedEvents,
  nextSpotlightEvent,
  pastEvents,
  type UpcomingEvent,
} from './upcoming-events.config';

const mehfil: UpcomingEvent = {
  id: 'mehfil-naat-2026',
  title: 'Grand Annual Mehfil-e-Naat',
  titleUr: 'محفل',
  date: '2026-08-24',
  audience: 'Brothers',
  audienceUr: 'بھائی',
  venue: 'Markaz',
  whatsappPrefill: 'test',
  images: [
    {
      id: 'img1',
      url: 'https://example.com/poster.png',
      alt: 'Poster',
    },
  ],
};

const namaz: UpcomingEvent = {
  id: 'namaz-course',
  title: 'Let’s Learn Namaz',
  titleUr: 'نماز',
  recurring: 'Weekly',
  audience: 'All',
  audienceUr: 'سب',
  venue: 'Markaz',
  whatsappPrefill: 'test',
};

describe('upcoming event dates', () => {
  it('stays upcoming before and on the event day', () => {
    expect(isEventUpcoming(mehfil, new Date('2026-08-20T12:00:00+01:00'))).toBe(true);
    expect(isEventUpcoming(mehfil, new Date('2026-08-24T22:00:00+01:00'))).toBe(true);
    expect(isEventToday(mehfil, new Date('2026-08-24T22:00:00+01:00'))).toBe(true);
    expect(isEventPast(mehfil, new Date('2026-08-24T23:30:00+01:00'))).toBe(false);
  });

  it('moves to past after the London calendar date', () => {
    const pool = [mehfil, namaz];
    expect(isEventPast(mehfil, new Date('2026-08-25T01:00:00+01:00'))).toBe(true);
    expect(isEventUpcoming(mehfil, new Date('2026-08-25T01:00:00+01:00'))).toBe(false);
    expect(pastEvents(new Date('2026-08-25T10:00:00+01:00'), pool).some((e) => e.id === 'mehfil-naat-2026')).toBe(
      true,
    );
    expect(listedEvents(new Date('2026-08-25T10:00:00+01:00'), pool).some((e) => e.id === 'mehfil-naat-2026')).toBe(
      false,
    );
  });

  it('features the dated gathering on the home spotlight while live', () => {
    const next = nextSpotlightEvent(new Date('2026-08-22T09:00:00+01:00'), [mehfil, namaz]);
    expect(next?.id).toBe('mehfil-naat-2026');
  });

  it('sorts latest dated events soonest-first', () => {
    const later: UpcomingEvent = { ...mehfil, id: 'later', date: '2026-09-01' };
    const listed = listedEvents(new Date('2026-08-01T12:00:00+01:00'), [later, mehfil]);
    expect(listed.map((e) => e.id)).toEqual(['mehfil-naat-2026', 'later']);
  });

  it('keeps standing programmes out of past', () => {
    expect(isEventPast(namaz, new Date('2030-01-01T12:00:00+00:00'))).toBe(false);
    expect(listedEvents(new Date('2030-01-01T12:00:00+00:00'), [namaz])).toHaveLength(1);
  });
});
