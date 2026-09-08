import { describe, expect, it } from 'vitest';
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  TOLA_GRAMS,
  ZAKAT_RATE,
} from '../models/zakat';
import {
  calculateZakat,
  goldFineGrams,
  gramsFromWeight,
  silverFineGrams,
} from './zakat-calc';

const GOLD = 100;
const SILVER = 1.5;

describe('zakat Hanafi helpers', () => {
  it('converts tola with the 11.664 g measure', () => {
    expect(gramsFromWeight(1, 'tola')).toBeCloseTo(TOLA_GRAMS, 6);
    expect(gramsFromWeight(7.5, 'tola')).toBeCloseTo(GOLD_NISAB_GRAMS, 6);
    expect(gramsFromWeight(52.5, 'tola')).toBeCloseTo(SILVER_NISAB_GRAMS, 6);
    expect(gramsFromWeight(10, 'g')).toBe(10);
    expect(gramsFromWeight(0, 'g')).toBe(0);
  });

  it('reduces gold jewellery to fine gold by karat', () => {
    expect(goldFineGrams([{ weight: 24, unit: 'g', karat: 22 }])).toBeCloseTo(22, 6);
    expect(silverFineGrams([{ weight: 100, unit: 'g', purity: 925 }])).toBeCloseTo(92.5, 6);
  });

  it('uses gold nisab when wealth is gold only', () => {
    const result = calculateZakat({
      cashGbp: 0,
      gold: [{ weight: GOLD_NISAB_GRAMS, unit: 'g', karat: 24 }],
      silver: [],
      businessGbp: 0,
      investmentsGbp: 0,
      receivablesGbp: 0,
      debtsGbp: 0,
      hawlComplete: true,
      goldGbpPerGram: GOLD,
      silverGbpPerGram: SILVER,
    });
    expect(result.nisabKind).toBe('gold');
    expect(result.aboveNisab).toBe(true);
    expect(result.zakatDueGbp).toBeCloseTo(round2(GOLD_NISAB_GRAMS * GOLD * ZAKAT_RATE), 2);
  });

  it('is not due when gold-only wealth is below 7.5 tola', () => {
    const result = calculateZakat({
      cashGbp: 0,
      gold: [{ weight: 80, unit: 'g', karat: 24 }],
      silver: [],
      businessGbp: 0,
      investmentsGbp: 0,
      receivablesGbp: 0,
      debtsGbp: 0,
      hawlComplete: true,
      goldGbpPerGram: GOLD,
      silverGbpPerGram: SILVER,
    });
    expect(result.nisabKind).toBe('gold');
    expect(result.aboveNisab).toBe(false);
    expect(result.zakatDueGbp).toBe(0);
  });

  it('uses silver nisab for cash and mixed wealth', () => {
    const cash = SILVER_NISAB_GRAMS * SILVER + 40;
    const result = calculateZakat({
      cashGbp: cash,
      gold: [{ weight: 10, unit: 'g', karat: 22 }],
      silver: [],
      businessGbp: 0,
      investmentsGbp: 0,
      receivablesGbp: 0,
      debtsGbp: 0,
      hawlComplete: true,
      goldGbpPerGram: GOLD,
      silverGbpPerGram: SILVER,
    });
    expect(result.nisabKind).toBe('silver');
    expect(result.aboveNisab).toBe(true);
    expect(result.zakatDueGbp).toBeGreaterThan(0);
  });

  it('deducts debts due now before testing nisab', () => {
    const result = calculateZakat({
      cashGbp: 2000,
      gold: [],
      silver: [],
      businessGbp: 0,
      investmentsGbp: 0,
      receivablesGbp: 0,
      debtsGbp: 1800,
      hawlComplete: true,
      goldGbpPerGram: GOLD,
      silverGbpPerGram: SILVER,
    });
    expect(result.netGbp).toBe(200);
    expect(result.aboveNisab).toBe(false);
    expect(result.zakatDueGbp).toBe(0);
  });

  it('includes gold jewellery even at wearing karat, and waits for hawl', () => {
    const withHawl = calculateZakat({
      cashGbp: 20_000,
      gold: [{ weight: 50, unit: 'g', karat: 22 }],
      silver: [],
      businessGbp: 0,
      investmentsGbp: 0,
      receivablesGbp: 0,
      debtsGbp: 0,
      hawlComplete: true,
      goldGbpPerGram: GOLD,
      silverGbpPerGram: SILVER,
    });
    const withoutHawl = calculateZakat({
      ...{
        cashGbp: 20_000,
        gold: [{ weight: 50, unit: 'g', karat: 22 }],
        silver: [],
        businessGbp: 0,
        investmentsGbp: 0,
        receivablesGbp: 0,
        debtsGbp: 0,
        goldGbpPerGram: GOLD,
        silverGbpPerGram: SILVER,
      },
      hawlComplete: false,
    });
    expect(withHawl.goldGbp).toBeGreaterThan(0);
    expect(withHawl.zakatDueGbp).toBeGreaterThan(0);
    expect(withoutHawl.zakatIfHawlGbp).toBe(withHawl.zakatDueGbp);
    expect(withoutHawl.zakatDueGbp).toBe(0);
  });
});

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
