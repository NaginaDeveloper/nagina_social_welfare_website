/** South Asian tola used by Hanafi Barelvi ulama (Bahar-e-Shariat). */
export const TOLA_GRAMS = 11.664;

/** Hanafi gold nisab: 7.5 tola. */
export const GOLD_NISAB_TOLA = 7.5;

/** Hanafi silver nisab: 52.5 tola. */
export const SILVER_NISAB_TOLA = 52.5;

export const GOLD_NISAB_GRAMS = GOLD_NISAB_TOLA * TOLA_GRAMS;
export const SILVER_NISAB_GRAMS = SILVER_NISAB_TOLA * TOLA_GRAMS;

/** One-fortieth. */
export const ZAKAT_RATE = 0.025;

export const TROY_OUNCE_GRAMS = 31.1034768;

export type WeightUnit = 'g' | 'tola';
export type GoldKarat = 24 | 22 | 21 | 18 | 14 | 9;
export type SilverPurity = 999 | 925;

export interface GoldHolding {
  readonly weight: number;
  readonly unit: WeightUnit;
  readonly karat: GoldKarat;
}

export interface SilverHolding {
  readonly weight: number;
  readonly unit: WeightUnit;
  readonly purity: SilverPurity;
}

export interface ZakatInput {
  readonly cashGbp: number;
  readonly gold: readonly GoldHolding[];
  readonly silver: readonly SilverHolding[];
  readonly businessGbp: number;
  readonly investmentsGbp: number;
  readonly receivablesGbp: number;
  readonly debtsGbp: number;
  readonly hawlComplete: boolean;
  readonly goldGbpPerGram: number;
  readonly silverGbpPerGram: number;
}

export interface ZakatBreakdown {
  readonly goldFineGrams: number;
  readonly silverFineGrams: number;
  readonly goldGbp: number;
  readonly silverGbp: number;
  readonly cashGbp: number;
  readonly businessGbp: number;
  readonly investmentsGbp: number;
  readonly receivablesGbp: number;
  readonly assetsGbp: number;
  readonly debtsGbp: number;
  readonly netGbp: number;
  readonly goldNisabGbp: number;
  readonly silverNisabGbp: number;
  readonly nisabKind: 'gold' | 'silver';
  readonly nisabGbp: number;
  readonly aboveNisab: boolean;
  readonly hawlComplete: boolean;
  readonly zakatDueGbp: number;
  readonly zakatIfHawlGbp: number;
}

export interface MetalPrices {
  readonly goldGbpPerGram: number;
  readonly silverGbpPerGram: number;
  readonly source: 'live' | 'fallback';
  readonly updatedAt: string;
}

/** Spot-style fallback (GBP / gram) if live prices cannot be fetched. */
export const FALLBACK_METAL_PRICES: MetalPrices = {
  goldGbpPerGram: 103.5,
  silverGbpPerGram: 1.57,
  source: 'fallback',
  updatedAt: '2026-09-08',
};

export const GOLD_KARATS: readonly GoldKarat[] = [24, 22, 21, 18, 14, 9];
