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
  /** Present in the build snapshot; the live API leaves these out and the postcode is looked up. */
  readonly latitude?: number | null;
  readonly longitude?: number | null;
}

export interface CampusCoords {
  readonly latitude: number;
  readonly longitude: number;
}

export function campusStoredCoords(campus: Pick<Campus, 'latitude' | 'longitude'>): CampusCoords | null {
  const { latitude, longitude } = campus;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

/** postcodes.io `/postcodes/{postcode}` body → coordinates. */
export function parsePostcodeLookup(body: unknown): CampusCoords | null {
  const result = (body as { result?: { latitude?: unknown; longitude?: unknown } } | null)?.result;
  if (!result) return null;
  return campusStoredCoords({
    latitude: result.latitude as number,
    longitude: result.longitude as number,
  });
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

/** The poster belongs to one madrasa; name it, or drop the name until campuses load. */
export function posterCaption(template: string, name: string): string {
  if (name) return template.replace('{name}', name);
  return template.replace(/\{name\}( — |\s)?/, '');
}
