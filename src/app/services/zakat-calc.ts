import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  TOLA_GRAMS,
  ZAKAT_RATE,
  type GoldHolding,
  type SilverHolding,
  type WeightUnit,
  type ZakatBreakdown,
  type ZakatInput,
} from '../models/zakat';

export function gramsFromWeight(weight: number, unit: WeightUnit): number {
  if (!(weight > 0)) {
    return 0;
  }
  return unit === 'tola' ? weight * TOLA_GRAMS : weight;
}

export function goldFineGrams(items: readonly GoldHolding[]): number {
  return items.reduce((sum, item) => {
    const grams = gramsFromWeight(item.weight, item.unit);
    return sum + grams * (item.karat / 24);
  }, 0);
}

export function silverFineGrams(items: readonly SilverHolding[]): number {
  return items.reduce((sum, item) => {
    const grams = gramsFromWeight(item.weight, item.unit);
    return sum + grams * (item.purity / 1000);
  }, 0);
}

export function roundGbp(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundRate(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Hanafi Ahl-e-Sunnat (Barelvi) estimate:
 * - 2.5% of net zakatable wealth
 * - gold-only wealth uses gold nisab (7.5 tola)
 * - cash, silver, trade goods, investments, or mixed wealth uses silver nisab (52.5 tola)
 * - jewellery of gold and silver is included (karat / purity converted to fine metal)
 */
export function calculateZakat(input: ZakatInput): ZakatBreakdown {
  const goldFine = goldFineGrams(input.gold);
  const silverFine = silverFineGrams(input.silver);
  const goldGbp = goldFine * input.goldGbpPerGram;
  const silverGbp = silverFine * input.silverGbpPerGram;
  const cashGbp = positive(input.cashGbp);
  const businessGbp = positive(input.businessGbp);
  const investmentsGbp = positive(input.investmentsGbp);
  const receivablesGbp = positive(input.receivablesGbp);
  const debtsGbp = positive(input.debtsGbp);

  const assetsGbp = cashGbp + goldGbp + silverGbp + businessGbp + investmentsGbp + receivablesGbp;
  const netGbp = Math.max(0, assetsGbp - debtsGbp);

  const goldNisabGbp = GOLD_NISAB_GRAMS * input.goldGbpPerGram;
  const silverNisabGbp = SILVER_NISAB_GRAMS * input.silverGbpPerGram;
  const otherWealth = cashGbp + silverGbp + businessGbp + investmentsGbp + receivablesGbp;
  const nisabKind: 'gold' | 'silver' = goldGbp > 0 && otherWealth <= 0 ? 'gold' : 'silver';
  const nisabGbp = nisabKind === 'gold' ? goldNisabGbp : silverNisabGbp;
  const aboveNisab = netGbp + 1e-9 >= nisabGbp;
  const zakatIfHawlGbp = aboveNisab ? roundGbp(netGbp * ZAKAT_RATE) : 0;
  const zakatDueGbp = input.hawlComplete && aboveNisab ? zakatIfHawlGbp : 0;

  return {
    goldFineGrams: goldFine,
    silverFineGrams: silverFine,
    goldGbp: roundGbp(goldGbp),
    silverGbp: roundGbp(silverGbp),
    cashGbp: roundGbp(cashGbp),
    businessGbp: roundGbp(businessGbp),
    investmentsGbp: roundGbp(investmentsGbp),
    receivablesGbp: roundGbp(receivablesGbp),
    assetsGbp: roundGbp(assetsGbp),
    debtsGbp: roundGbp(debtsGbp),
    netGbp: roundGbp(netGbp),
    goldNisabGbp: roundGbp(goldNisabGbp),
    silverNisabGbp: roundGbp(silverNisabGbp),
    nisabKind,
    nisabGbp: roundGbp(nisabGbp),
    aboveNisab,
    hawlComplete: input.hawlComplete,
    zakatDueGbp,
    zakatIfHawlGbp,
  };
}

function positive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}
