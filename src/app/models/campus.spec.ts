import { describe, expect, it } from 'vitest';
import { FEE_TERM, campusFeeTerm } from '../components/apply/apply-form';
import { eventWhatsappDigits, toUpcomingEvent } from '../services/events.service';
import { madrasaNode } from '../seo/seo.service';
import {
  campusStoredCoords,
  campusMapsEmbedUrl,
  campusDirectionsUrl,
  campusTown,
  parsePostcodeLookup,
  posterCaption,
  campusWhatsappHref,
  fillTowns,
  joinTowns,
  parseCampusCatalog,
  type Campus,
} from './campus';

const PETERBOROUGH: Campus = {
  id: 'peterborough',
  displayName: 'Markaz Deen-e-Islam',
  cityLabel: 'Peterborough',
  addressLine: '103 Burmer Road, Peterborough PE1 3HT',
  postcode: 'PE1 3HT',
  phoneDisplay: '+44 7831 684738',
  phoneE164: '+447831684738',
  whatsappDigits: '447831684738',
  monthlyFeeGbp: null,
  addressConfirmed: true,
};

const MANCHESTER: Campus = {
  id: 'manchester',
  displayName: 'Quran Academy',
  cityLabel: 'Quran Academy',
  addressLine: 'Partington Community Centre, Manchester M31 4FL',
  postcode: 'M31 4FL',
  phoneDisplay: '+44 7872 340123',
  phoneE164: '+447872340123',
  whatsappDigits: '447872340123',
  monthlyFeeGbp: 30,
  addressConfirmed: true,
};

describe('campus helpers', () => {
  it('takes the town from the address, not the display label', () => {
    expect(campusTown(PETERBOROUGH)).toBe('Peterborough');
    expect(campusTown(MANCHESTER)).toBe('Manchester');
  });

  it('follows an office edit to the address', () => {
    expect(
      campusTown({ ...MANCHESTER, addressLine: '1 New Street, Salford M5 4WT', postcode: 'M5 4WT' }),
    ).toBe('Salford');
  });

  it('joins towns for headings', () => {
    expect(joinTowns([PETERBOROUGH, MANCHESTER])).toBe('Peterborough & Manchester');
    expect(joinTowns([PETERBOROUGH])).toBe('Peterborough');
    expect(joinTowns([])).toBe('');
  });

  it('drops the towns phrase until campuses load', () => {
    expect(fillTowns('Madrasas in {towns}, and more.', '')).toBe('Madrasas, and more.');
    expect(fillTowns('ہمارے مدارس ({towns}) میں', '')).toBe('ہمارے مدارس میں');
    expect(fillTowns('Madrasas in {towns}.', 'Peterborough & Manchester')).toBe(
      'Madrasas in Peterborough & Manchester.',
    );
  });

  it('routes WhatsApp to the madrasa number', () => {
    expect(campusWhatsappHref(MANCHESTER, 'Hi')).toBe('https://wa.me/447872340123?text=Hi');
  });

  it('ignores malformed API entries', () => {
    expect(parseCampusCatalog({ campuses: [MANCHESTER, { id: '' }, null] })).toEqual([MANCHESTER]);
    expect(parseCampusCatalog({})).toEqual([]);
    expect(parseCampusCatalog(null)).toEqual([]);
  });
});

describe('campus coordinates', () => {
  it('reads a postcodes.io lookup', () => {
    expect(
      parsePostcodeLookup({ status: 200, result: { latitude: 53.417784, longitude: -2.42617 } }),
    ).toEqual({ latitude: 53.417784, longitude: -2.42617 });
  });

  it('returns null for an unknown postcode', () => {
    expect(parsePostcodeLookup({ status: 404, error: 'Postcode not found' })).toBeNull();
    expect(parsePostcodeLookup({ result: { latitude: null, longitude: null } })).toBeNull();
  });

  it('uses snapshot coordinates only when both are numbers', () => {
    expect(campusStoredCoords({ ...MANCHESTER, latitude: 53.4, longitude: -2.4 })).toEqual({
      latitude: 53.4,
      longitude: -2.4,
    });
    expect(campusStoredCoords(MANCHESTER)).toBeNull();
    expect(campusStoredCoords({ latitude: 53.4, longitude: null })).toBeNull();
  });
});

describe('event WhatsApp', () => {
  it('uses the campus phone saved on a Manchester event', () => {
    expect(eventWhatsappDigits({ contactPhone: '+44 7872 340123' })).toBe('447872340123');
  });

  it('falls back to the organisation number for older events', () => {
    expect(eventWhatsappDigits({})).toBe('');
    expect(eventWhatsappDigits({ contactPhone: 'call the office' })).toBe('');
  });
});

describe('admission fee term', () => {
  it('publishes the campus monthly fee', () => {
    expect(campusFeeTerm(MANCHESTER)).toBe('Fees are £30 a month, paid monthly or in advance.');
    expect(campusFeeTerm({ ...MANCHESTER, monthlyFeeGbp: 32.5 })).toBe(
      'Fees are £32.50 a month, paid monthly or in advance.',
    );
  });

  it('keeps the published Peterborough term', () => {
    expect(campusFeeTerm(PETERBOROUGH)).toBe(FEE_TERM);
    expect(campusFeeTerm(null)).toBe(FEE_TERM);
  });
});

describe('event venue', () => {
  const item = { id: 'e1', title: 'Mehfil', date: '2026-11-01' };

  it('names the Manchester madrasa when the office left the venue blank', () => {
    const event = toUpcomingEvent({ ...item, campusId: 'manchester' }, MANCHESTER);
    expect(event.venue).toBe('Quran Academy, Manchester');
    expect(event.whatsappDigits).toBe('447872340123');
  });

  it('keeps a venue the office typed', () => {
    expect(toUpcomingEvent({ ...item, venue: 'Partington Park' }, MANCHESTER).venue).toBe('Partington Park');
  });
});

describe('admission poster caption', () => {
  it('names the madrasa the poster belongs to', () => {
    expect(posterCaption('{name} 2026 admission poster.', 'Markaz Deen-e-Islam')).toBe(
      'Markaz Deen-e-Islam 2026 admission poster.',
    );
    expect(posterCaption('{name} — داخلہ پوسٹر', '')).toBe('داخلہ پوسٹر');
    expect(posterCaption('{name} 2026 admission poster.', '')).toBe('2026 admission poster.');
  });
});

describe('madrasa search data', () => {
  it('lists Quran Academy at its own address', () => {
    const node = madrasaNode({ ...MANCHESTER, latitude: 53.417784, longitude: -2.42617 });
    expect(node['name']).toBe('Quran Academy');
    expect(node['address']).toEqual({
      '@type': 'PostalAddress',
      streetAddress: 'Partington Community Centre',
      addressLocality: 'Manchester',
      postalCode: 'M31 4FL',
      addressCountry: 'GB',
    });
    expect(node['geo']).toEqual({ '@type': 'GeoCoordinates', latitude: 53.4167984, longitude: -2.4251937 });
    expect(node['url']).toBe('https://www.naginasocialwelfare.co.uk/manchester/');
  });
});

describe('campus map pins', () => {
  it('uses the confirmed Manchester pin for the embedded map and directions', () => {
    expect(campusMapsEmbedUrl(MANCHESTER)).toBe(
      'https://maps.google.com/maps?q=53.4167984%2C-2.4251937&z=17&output=embed',
    );
    expect(campusDirectionsUrl(MANCHESTER)).toBe(
      'https://www.google.com/maps/search/?api=1&query=53.4167984%2C-2.4251937',
    );
  });

  it('falls back to the address for a campus without a confirmed pin', () => {
    const peterborough = { id: 'peterborough', addressLine: '103 Burmer Road, Peterborough PE1 3HT' };
    expect(campusMapsEmbedUrl(peterborough)).toContain(encodeURIComponent('103 Burmer Road'));
    expect(campusDirectionsUrl(peterborough)).toContain(encodeURIComponent('103 Burmer Road'));
  });
});
