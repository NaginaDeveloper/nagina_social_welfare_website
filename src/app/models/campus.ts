/** A madrasa campus as published by the admissions API (office-editable in Control Center). */
export interface Campus {
  readonly id: string;
  readonly displayName: string;
  readonly cityLabel: string;
  readonly addressLine: string;
  readonly postcode: string;
  readonly phoneDisplay: string;
  readonly phoneE164: string;
  readonly whatsappDigits: string;
  readonly email?: string;
  /** Null when the campus uses the organisation fee (published in the admission terms). */
  readonly monthlyFeeGbp?: number | null;
  readonly addressConfirmed: boolean;
}

export interface CampusCatalog {
  readonly campuses?: readonly Campus[];
}

/** "Partington Community Centre, Manchester M31 4FL" → "Manchester". */
export function campusTown(campus: Pick<Campus, 'addressLine' | 'postcode' | 'cityLabel'>): string {
  const parts = campus.addressLine.split(',').map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] ?? '';
  const postcode = campus.postcode.trim();
  const town = postcode && last.toUpperCase().endsWith(postcode.toUpperCase())
    ? last.slice(0, last.length - postcode.length).trim()
    : last;
  return town || campus.cityLabel;
}

/** "Peterborough & Manchester", "A, B & C". */
export function joinTowns(campuses: readonly Campus[]): string {
  const towns = campuses.map(campusTown);
  if (towns.length <= 1) return towns[0] ?? '';
  return `${towns.slice(0, -1).join(', ')} & ${towns[towns.length - 1]}`;
}

/** Fills `{towns}`; drops the placeholder phrase when no campus list is available yet. */
export function fillTowns(text: string, towns: string): string {
  if (towns) return text.replace('{towns}', towns);
  return text.replace(/ \(\{towns\}\)| in \{towns\}|\{towns\}/, '');
}

export function campusWhatsappHref(campus: Pick<Campus, 'whatsappDigits'>, prefill = ''): string {
  const base = `https://wa.me/${campus.whatsappDigits}`;
  const text = prefill.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function campusMapsEmbedUrl(campus: Pick<Campus, 'addressLine'>): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(campus.addressLine)}&output=embed`;
}

export function campusDirectionsUrl(campus: Pick<Campus, 'addressLine'>): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campus.addressLine)}`;
}

/** Keeps only well-formed entries so a bad API response cannot blank the page. */
export function parseCampusCatalog(body: unknown): Campus[] {
  const list = (body as CampusCatalog | null)?.campuses;
  if (!Array.isArray(list)) return [];
  return list.filter(
    (c): c is Campus =>
      !!c &&
      typeof c.id === 'string' &&
      typeof c.displayName === 'string' &&
      typeof c.addressLine === 'string' &&
      typeof c.whatsappDigits === 'string' &&
      c.id.trim().length > 0,
  );
}
