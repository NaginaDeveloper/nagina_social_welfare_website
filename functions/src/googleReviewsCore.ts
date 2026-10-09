/**
 * Google Places API (New) reviews for a centre's Business Profile. Pure helpers plus one
 * fetch routine that takes `fetch` as a parameter so it can be tested without the network.
 *
 * Google's terms do not allow storing Places content, so callers keep results only in a
 * short in-memory cache and let the CDN cache the HTTP response; nothing is persisted.
 */

export type CampusPlace = {
  /** Customer id inside the profile's Maps URL, used to pick the right place from a search. */
  readonly cid: string;
  /** Text search that finds the profile when no place id is configured. */
  readonly textQuery: string;
  /** Optional fixed Places id; skips the search when present. */
  readonly placeId?: string;
};

/** Centres that have a Google Business Profile. Add Manchester here once it has one. */
export const CAMPUS_PLACES: Readonly<Record<string, CampusPlace>> = {
  peterborough: {
    cid: '7180850669849561719',
    textQuery: 'Markaz e Deen e Islam Nagina Social Welfare UK, 103 Burmer Rd, Peterborough PE1 3HT',
  },
};

export type GoogleReview = {
  readonly author: string;
  readonly authorUrl: string | null;
  readonly photoUrl: string | null;
  readonly rating: number;
  readonly text: string;
  readonly when: string;
  readonly publishTime: string | null;
};

export type GoogleReviewsPayload = {
  readonly campus: string;
  readonly rating: number | null;
  readonly count: number;
  readonly mapsUri: string | null;
  readonly reviews: readonly GoogleReview[];
  readonly fetchedAt: string;
};

type RawReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

type RawPlace = {
  id?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: RawReview[];
};

export type FetchLike = (
  url: string,
  init?: { method?: string; headers?: Record<string, string>; body?: string },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

const PLACES = 'https://places.googleapis.com/v1';
const MAX_REVIEWS = 5;

/** Only http(s) links from Google are passed on to the page. */
function safeUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** The search result whose Maps link carries this customer id. */
export function pickPlaceByCid(places: readonly RawPlace[], cid: string): RawPlace | null {
  return places.find((p) => (p.googleMapsUri ?? '').includes(`cid=${cid}`)) ?? null;
}

export function normalizeReview(raw: RawReview): GoogleReview | null {
  const text = (raw.text?.text ?? raw.originalText?.text ?? '').trim();
  const rating = Number(raw.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  return {
    author: (raw.authorAttribution?.displayName ?? 'Google user').trim() || 'Google user',
    authorUrl: safeUrl(raw.authorAttribution?.uri),
    photoUrl: safeUrl(raw.authorAttribution?.photoUri),
    rating: Math.round(rating),
    text,
    when: (raw.relativePublishTimeDescription ?? '').trim(),
    publishTime: raw.publishTime ?? null,
  };
}

export function normalizePlace(campus: string, raw: RawPlace, now = new Date()): GoogleReviewsPayload {
  const reviews = (raw.reviews ?? [])
    .map(normalizeReview)
    .filter((r): r is GoogleReview => r !== null)
    .slice(0, MAX_REVIEWS);
  return {
    campus,
    rating: typeof raw.rating === 'number' ? raw.rating : null,
    count: Number(raw.userRatingCount) || 0,
    mapsUri: safeUrl(raw.googleMapsUri),
    reviews,
    fetchedAt: now.toISOString(),
  };
}

async function resolvePlaceId(
  apiKey: string,
  place: CampusPlace,
  fetchImpl: FetchLike,
): Promise<string> {
  if (place.placeId) return place.placeId;
  const res = await fetchImpl(`${PLACES}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.googleMapsUri',
    },
    body: JSON.stringify({ textQuery: place.textQuery, languageCode: 'en', regionCode: 'GB' }),
  });
  if (!res.ok) throw new Error(`Places search HTTP ${res.status}`);
  const body = (await res.json()) as { places?: RawPlace[] };
  const match = pickPlaceByCid(body.places ?? [], place.cid);
  if (!match?.id) throw new Error('Places search did not return the Business Profile');
  return match.id;
}

/** Looks up the centre's rating, review count and Google's most relevant reviews. */
export async function fetchCampusReviews(
  apiKey: string,
  campus: string,
  fetchImpl: FetchLike,
  resolvedPlaceId?: string,
): Promise<{ payload: GoogleReviewsPayload; placeId: string }> {
  const place = CAMPUS_PLACES[campus];
  if (!place) throw new Error(`No Google profile for centre "${campus}"`);
  const placeId = resolvedPlaceId ?? (await resolvePlaceId(apiKey, place, fetchImpl));
  const res = await fetchImpl(`${PLACES}/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,rating,userRatingCount,googleMapsUri,reviews',
    },
  });
  if (!res.ok) throw new Error(`Places details HTTP ${res.status}`);
  const payload = normalizePlace(campus, (await res.json()) as RawPlace);
  return { payload, placeId };
}
