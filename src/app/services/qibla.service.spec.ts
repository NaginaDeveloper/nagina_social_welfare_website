import { describe, expect, it } from 'vitest';
import {
  KAABA_LAT,
  KAABA_LNG,
  cardinalFromBearing,
  haversineKm,
  normalizeQibla,
} from './qibla.service';
import { PETERBOROUGH_LAT, PETERBOROUGH_LNG } from './prayer-times.service';

describe('qibla helpers', () => {
  it('computes Peterborough → Kaaba distance around 4,700–4,900 km', () => {
    const km = haversineKm(PETERBOROUGH_LAT, PETERBOROUGH_LNG, KAABA_LAT, KAABA_LNG);
    expect(km).toBeGreaterThan(4700);
    expect(km).toBeLessThan(4900);
  });

  it('returns ~0 km for identical coordinates', () => {
    expect(haversineKm(KAABA_LAT, KAABA_LNG, KAABA_LAT, KAABA_LNG)).toBeCloseTo(0, 5);
  });

  it('normalises AlAdhan qibla response', () => {
    const result = normalizeQibla(
      {
        code: 200,
        status: 'OK',
        data: {
          latitude: PETERBOROUGH_LAT,
          longitude: PETERBOROUGH_LNG,
          direction: 119.84069616227221,
        },
      },
      'peterborough',
    );
    expect(result.direction).toBeCloseTo(119.84, 1);
    expect(result.source).toBe('peterborough');
    expect(result.distanceKm).toBeGreaterThan(4700);
    expect(result.distanceKm).toBeLessThan(4900);
  });

  it('maps bearings to cardinal bands', () => {
    expect(cardinalFromBearing(0)).toBe('North');
    expect(cardinalFromBearing(90)).toBe('East');
    expect(cardinalFromBearing(119.8)).toBe('East–southeast');
    expect(cardinalFromBearing(180)).toBe('South');
  });
});
