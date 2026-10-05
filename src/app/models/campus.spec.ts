import { describe, expect, it } from 'vitest';
import { FEE_TERM, campusFeeTerm } from '../components/apply/apply-form';
import { eventWhatsappDigits } from '../services/events.service';
import {
  campusTown,
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
