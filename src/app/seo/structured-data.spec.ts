import { describe, expect, it } from 'vitest';
import type { UpcomingEvent } from '../config/upcoming-events.config';
import { eventJsonLd, faqPageJsonLd, londonIso } from './structured-data';

const EVENT: UpcomingEvent = {
  id: 'zikr-fikr-2026-09-27',
  title: 'Zikr & Fikr',
  titleUr: 'ذکر و فکر',
  date: '2026-09-27',
  time: '18:30',
  endTime: '20:00',
  summary: '<p><strong>Weekly</strong> gathering &amp; reflection.</p><p>All welcome.</p>',
  audience: 'Brothers',
  audienceUr: 'بھائی',
  venue: 'Markaz Deen-e-Islam, 103 Burmer Road, Peterborough PE1 3HT',
  whatsappPrefill: 'Hi',
};

describe('londonIso', () => {
  it('uses +01:00 in British Summer Time and +00:00 in winter', () => {
    expect(londonIso('2026-09-27', '18:30')).toBe('2026-09-27T18:30:00+01:00');
    expect(londonIso('2026-12-13', '18:30')).toBe('2026-12-13T18:30:00+00:00');
  });

  it('rolls over to the next day for overnight programmes', () => {
    expect(londonIso('2026-09-27', '04:30', 1)).toBe('2026-09-28T04:30:00+01:00');
  });
});

describe('eventJsonLd', () => {
  it('describes a dated gathering with offset times, plain-text description and organizer', () => {
    const node = eventJsonLd(EVENT) as Record<string, unknown>;
    expect(node['@type']).toBe('Event');
    expect(node['startDate']).toBe('2026-09-27T18:30:00+01:00');
    expect(node['endDate']).toBe('2026-09-27T20:00:00+01:00');
    expect(node['description']).toBe('Weekly gathering & reflection. All welcome.');
    expect(node['location']).toMatchObject({ name: 'Markaz Deen-e-Islam' });
    expect(node['organizer']).toEqual({ '@id': 'https://www.naginasocialwelfare.co.uk/#organization' });
  });

  it('skips recurring programmes without a date', () => {
    expect(eventJsonLd({ ...EVENT, date: undefined })).toBeNull();
  });

  it('ends the next morning for overnight events', () => {
    const node = eventJsonLd({ ...EVENT, time: '21:00', endTime: '04:30', endsNextDay: true }) as Record<string, unknown>;
    expect(node['endDate']).toBe('2026-09-28T04:30:00+01:00');
  });
});

describe('faqPageJsonLd', () => {
  it('maps questions and answers and drops empty entries', () => {
    const node = faqPageJsonLd(
      [
        { question: 'What is Tawhid?', answer: 'Oneness of Allah.' },
        { question: ' ', answer: 'ignored' },
      ],
      'https://www.naginasocialwelfare.co.uk/basic-beliefs/',
    ) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(mainEntityNames(node)).toEqual(['What is Tawhid?']);
    expect(node.mainEntity[0].acceptedAnswer.text).toBe('Oneness of Allah.');
  });

  it('returns null when there is nothing to mark up', () => {
    expect(faqPageJsonLd([], 'https://x/')).toBeNull();
  });
});

function mainEntityNames(node: { mainEntity: { name: string }[] }): string[] {
  return node.mainEntity.map((q) => q.name);
}
