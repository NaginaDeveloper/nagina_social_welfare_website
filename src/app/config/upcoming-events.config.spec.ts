import { describe, expect, it } from 'vitest';
import {
  isEventPast,
  isEventToday,
  isEventUpcoming,
  listedEvents,
  nextSpotlightEvent,
  pastEvents,
} from './upcoming-events.config';

const mehfil = {
  id: 'mehfil-naat-2026',
  title: 'Grand Annual Mehfil-e-Naat',
  titleUr: 'محفل',
  date: '2026-08-24',
  audience: 'Brothers',
  audienceUr: 'بھائی',
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
    expect(isEventPast(mehfil, new Date('2026-08-25T01:00:00+01:00'))).toBe(true);
    expect(isEventUpcoming(mehfil, new Date('2026-08-25T01:00:00+01:00'))).toBe(false);
    expect(pastEvents(new Date('2026-08-25T10:00:00+01:00')).some((e) => e.id === 'mehfil-naat-2026')).toBe(
      true,
    );
    expect(listedEvents(new Date('2026-08-25T10:00:00+01:00')).some((e) => e.id === 'mehfil-naat-2026')).toBe(
      false,
    );
  });

  it('features the dated gathering on the home spotlight while live', () => {
    const next = nextSpotlightEvent(new Date('2026-08-22T09:00:00+01:00'));
    expect(next?.id).toBe('mehfil-naat-2026');
  });
});
