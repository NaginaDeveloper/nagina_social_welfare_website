import { logger } from 'firebase-functions';
import { GENERAL_DONATION_CAMPUS } from './amount';

/** Same list the website reads; office edits in Control Center appear here. */
const CAMPUSES_URL =
  'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/submitAdmission';

const CACHE_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 3000;

interface CampusEntry {
  readonly id?: unknown;
  readonly addressLine?: unknown;
  readonly postcode?: unknown;
  readonly cityLabel?: unknown;
}

let cached: { at: number; towns: Map<string, string> } | null = null;

/** "Partington Community Centre, Manchester M31 4FL" → "Manchester". */
export function campusTownFromEntry(entry: CampusEntry): string {
  const address = typeof entry.addressLine === 'string' ? entry.addressLine : '';
  const postcode = typeof entry.postcode === 'string' ? entry.postcode.trim() : '';
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] ?? '';
  const town =
    postcode && last.toUpperCase().endsWith(postcode.toUpperCase())
      ? last.slice(0, last.length - postcode.length).trim()
      : last;
  return town || (typeof entry.cityLabel === 'string' ? entry.cityLabel.trim() : '');
}

export function parseCampusTowns(body: unknown): Map<string, string> {
  const towns = new Map<string, string>();
  const list = (body as { campuses?: unknown } | null)?.campuses;
  if (!Array.isArray(list)) return towns;
  for (const entry of list as CampusEntry[]) {
    const id = typeof entry?.id === 'string' ? entry.id.trim().toLowerCase() : '';
    const town = entry ? campusTownFromEntry(entry) : '';
    if (id && town) towns.set(id, town);
  }
  return towns;
}

async function loadTowns(urls: readonly string[]): Promise<Map<string, string>> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) continue;
      const towns = parseCampusTowns(await res.json());
      if (towns.size > 0) return towns;
    } catch (err) {
      logger.warn('Campus list unavailable for donation', { url, err: String(err) });
    }
  }
  return new Map();
}

/** Town for a published campus id; empty for a general gift or an id we do not know. */
export async function donationCentreTown(campusId: string, siteOrigin: string): Promise<string> {
  if (campusId === GENERAL_DONATION_CAMPUS) return '';
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    const towns = await loadTowns([CAMPUSES_URL, `${siteOrigin}/campuses.json`]);
    if (towns.size > 0) cached = { at: Date.now(), towns };
    else return '';
  }
  return cached.towns.get(campusId) ?? '';
}
