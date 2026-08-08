export const MIN_DONATION_GBP = 5;
export const MAX_DONATION_GBP = 25_000;

export type ParsedAmount =
  | { ok: true; amount: number }
  | { ok: false; error: string };

/** Validate and normalise a GBP donation amount to 2 decimal places. */
export function parseDonationAmount(raw: unknown): ParsedAmount {
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;

  if (!Number.isFinite(n)) {
    return { ok: false, error: 'Amount must be a valid number.' };
  }

  const amount = Math.round(n * 100) / 100;

  if (amount < MIN_DONATION_GBP) {
    return { ok: false, error: `Minimum donation is £${MIN_DONATION_GBP}.` };
  }
  if (amount > MAX_DONATION_GBP) {
    return { ok: false, error: `Maximum donation is £${MAX_DONATION_GBP.toLocaleString('en-GB')}.` };
  }

  return { ok: true, amount };
}
