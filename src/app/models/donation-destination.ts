import type { Campus } from './campus';

/** Gift for the charity as a whole rather than one centre. */
export const GENERAL_DONATION = 'general';

/** UK Faster Payments references are capped at 18 characters. */
const BANK_REFERENCE_MAX = 18;

/** "SADAQAH" for a general gift, "SADAQAH-MANCHESTER" for a centre (trimmed to fit a bank reference). */
export function donationReference(fundReference: string, campus: Pick<Campus, 'id'> | null): string {
  if (!campus) return fundReference;
  const room = BANK_REFERENCE_MAX - fundReference.length - 1;
  const code = campus.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, Math.max(room, 0));
  return code ? `${fundReference}-${code}` : fundReference;
}

/** The checkout `campus` field: a campus id, or `general`. */
export function donationCampusField(campus: Pick<Campus, 'id'> | null): string {
  return campus?.id ?? GENERAL_DONATION;
}
