export const MIN_DONATION_GBP = 5;
export const MAX_DONATION_GBP = 25_000;

export const DONATION_FUNDS = ['zakat', 'sadaqah', 'lillah', 'fitrana'] as const;
export type DonationFund = (typeof DONATION_FUNDS)[number];

const FUND_LABELS: Record<DonationFund, string> = {
  zakat: 'Zakat',
  sadaqah: 'Sadaqah',
  lillah: 'Lillah',
  fitrana: 'Fitrana',
};

export const GENERAL_DONATION_CAMPUS = 'general';

const CAMPUS_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,39}$/;

/** A well-formed campus id, or `general` for anything else. */
export function parseDonationCampus(raw: unknown): string {
  const id = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return CAMPUS_ID_PATTERN.test(id) ? id : GENERAL_DONATION_CAMPUS;
}

export function parseDonationFund(raw: unknown): DonationFund {
  if (typeof raw === 'string' && (DONATION_FUNDS as readonly string[]).includes(raw)) {
    return raw as DonationFund;
  }
  return 'sadaqah';
}

/** "Sadaqah - Nagina Social Welfare UK", or "Sadaqah - Manchester - Nagina Social Welfare UK". */
export function donationDescription(fund: DonationFund, centre = ''): string {
  const place = centre.trim();
  return place
    ? `${FUND_LABELS[fund]} - ${place} - Nagina Social Welfare UK`
    : `${FUND_LABELS[fund]} - Nagina Social Welfare UK`;
}

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
