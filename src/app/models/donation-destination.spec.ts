import { describe, expect, it } from 'vitest';
import { GENERAL_DONATION, donationCampusField, donationReference } from './donation-destination';

describe('donation destination', () => {
  it('keeps the plain fund reference for a general gift', () => {
    expect(donationReference('SADAQAH', null)).toBe('SADAQAH');
    expect(donationCampusField(null)).toBe(GENERAL_DONATION);
  });

  it('adds the centre to the reference', () => {
    expect(donationReference('ZAKAT', { id: 'manchester' })).toBe('ZAKAT-MANCHESTER');
    expect(donationCampusField({ id: 'manchester' })).toBe('manchester');
  });

  it('trims the centre so the reference fits a UK bank transfer', () => {
    const ref = donationReference('FITRANA', { id: 'peterborough' });
    expect(ref).toBe('FITRANA-PETERBOROU');
    expect(ref.length).toBeLessThanOrEqual(18);
  });
});
