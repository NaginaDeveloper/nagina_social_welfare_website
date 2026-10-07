import { describe, expect, it } from 'vitest';
import {
  KAABA_LAT,
  KAABA_LNG,
  cardinalFromBearing,
  compassHeadingFromAngles,
  smoothHeading,
  haversineKm,
  normalizeQibla,
} from './qibla.service';

const PETERBOROUGH_LAT = 52.5695;
const PETERBOROUGH_LNG = -0.2405;

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
      'campus',
    );
    expect(result.direction).toBeCloseTo(119.84, 1);
    expect(result.source).toBe('campus');
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

describe('compass heading', () => {
  it('reads 0° (north) for a flat phone with alpha 0', () => {
    expect(compassHeadingFromAngles(0, 0, 0)).toBeCloseTo(0, 5);
  });

  it('reads 90° (east) for a flat phone turned a quarter turn clockwise', () => {
    expect(compassHeadingFromAngles(270, 0, 0)).toBeCloseTo(90, 5);
  });

  it('still reads north when the phone is tilted up to read the screen', () => {
    expect(compassHeadingFromAngles(0, 60, 0)).toBeCloseTo(0, 5);
  });

  it('smooths the short way round north', () => {
    const next = smoothHeading(350, 10, 0.5);
    expect(next).toBeCloseTo(0, 5);
    expect(smoothHeading(null, 123)).toBe(123);
  });
});
