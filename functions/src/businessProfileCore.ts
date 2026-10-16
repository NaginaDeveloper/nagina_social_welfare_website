/**
 * Google Business Profile API reviews for a centre we own. Unlike the Places API (five
 * "most relevant" reviews), this returns every review, newest first, with the owner's reply.
 *
 * It signs in as a manager of the profile with an OAuth refresh token (scope business.manage)
 * kept in the GOOGLE_BUSINESS_PROFILE_OAUTH secret; scripts/google-business-profile-token.mjs
 * creates it. `fetch` is a parameter so everything here is testable without the network.
 */

import { CAMPUS_PLACES, type FetchLike, type GoogleReview, type GoogleReviewsPayload } from './googleReviewsCore';

export type BusinessProfileOAuth = {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly refreshToken: string;
};

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS = 'https://mybusinessaccountmanagement.googleapis.com/v1';
const INFO = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const REVIEWS = 'https://mybusiness.googleapis.com/v4';
/** Two pages of 50; plenty for a centre, and bounded so one call stays quick. */
const MAX_REVIEWS = 100;

const STARS: Readonly<Record<string, number>> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

type RawLocation = { name?: string; title?: string; metadata?: { placeId?: string; mapsUri?: string } };

type RawReview = {
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
};

type RawReviewList = {
  reviews?: RawReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

/** Reads the secret's JSON; anything incomplete means "not configured". */
export function parseOAuthSecret(value: string | undefined): BusinessProfileOAuth | null {
  if (!value?.trim()) return null;
  try {
    const raw = JSON.parse(value) as Record<string, unknown>;
    const pick = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');
    const auth = { clientId: pick('clientId'), clientSecret: pick('clientSecret'), refreshToken: pick('refreshToken') };
    return auth.clientId && auth.clientSecret && auth.refreshToken ? auth : null;
  } catch {
    return null;
  }
}

function safeUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * The review as the reviewer wrote it. Google appends or prepends a machine translation
 * ("(Translated by Google) … (Original) …"); the page shows reviews as posted, so keep the original.
 */
export function originalComment(comment: string | undefined): string {
  const text = (comment ?? '').trim();
  const original = text.match(/\(Original\)\s*([\s\S]*)$/);
  if (original) return original[1].trim();
  const translated = text.indexOf('(Translated by Google)');
  return (translated >= 0 ? text.slice(0, translated) : text).trim();
}

/** "3 weeks ago" in English, the fallback when the page cannot format `publishTime` itself. */
export function relativeTime(iso: string | undefined, now: Date): string {
  const at = iso ? Date.parse(iso) : NaN;
  if (!Number.isFinite(at)) return '';
  const days = Math.max(0, Math.floor((now.getTime() - at) / 86_400_000));
  const unit = (n: number, word: string) => (n === 1 ? `a ${word} ago` : `${n} ${word}s ago`);
  if (days < 1) return 'today';
  if (days < 7) return unit(days, 'day');
  if (days < 30) return unit(Math.floor(days / 7), 'week');
  if (days < 365) return unit(Math.floor(days / 30), 'month');
  return unit(Math.floor(days / 365), 'year');
}

export function normalizeProfileReview(raw: RawReview, now: Date): GoogleReview | null {
  const rating = STARS[raw.starRating ?? ''];
  if (!rating) return null;
  const anonymous = raw.reviewer?.isAnonymous === true;
  const publishTime = raw.createTime ?? raw.updateTime ?? null;
  const replyText = originalComment(raw.reviewReply?.comment);
  return {
    author: (anonymous ? '' : (raw.reviewer?.displayName ?? '').trim()) || 'Google user',
    authorUrl: null,
    photoUrl: anonymous ? null : safeUrl(raw.reviewer?.profilePhotoUrl),
    rating,
    text: originalComment(raw.comment),
    when: relativeTime(publishTime ?? undefined, now),
    publishTime,
    reply: replyText ? { text: replyText, publishTime: raw.reviewReply?.updateTime ?? null } : null,
  };
}

/** The location whose Maps link carries the centre's customer id (or whose place id matches). */
export function pickLocation(locations: readonly RawLocation[], cid: string, placeId?: string): RawLocation | null {
  return (
    locations.find(
      (l) => (l.metadata?.mapsUri ?? '').includes(`cid=${cid}`) || (!!placeId && l.metadata?.placeId === placeId),
    ) ?? null
  );
}

async function getJson<T>(fetchImpl: FetchLike, url: string, token: string, what: string): Promise<T> {
  const res = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Business Profile ${what} HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function accessToken(auth: BusinessProfileOAuth, fetchImpl: FetchLike): Promise<string> {
  const res = await fetchImpl(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: auth.clientId,
      client_secret: auth.clientSecret,
      refresh_token: auth.refreshToken,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Business Profile token HTTP ${res.status}`);
  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token) throw new Error('Business Profile token missing');
  return body.access_token;
}

export type ProfileLocation = { readonly path: string; readonly mapsUri: string | null };

/** Finds "accounts/{a}/locations/{l}" for the centre among the profiles this login manages. */
export async function findLocation(token: string, campus: string, fetchImpl: FetchLike): Promise<ProfileLocation> {
  const place = CAMPUS_PLACES[campus];
  if (!place) throw new Error(`No Google profile for centre "${campus}"`);
  let accountsPage: string | undefined;
  do {
    const q = accountsPage ? `?pageToken=${encodeURIComponent(accountsPage)}` : '';
    const list = await getJson<{ accounts?: { name?: string }[]; nextPageToken?: string }>(
      fetchImpl, `${ACCOUNTS}/accounts${q}`, token, 'accounts');
    for (const account of list.accounts ?? []) {
      if (!account.name) continue;
      let locationsPage: string | undefined;
      do {
        const lq = new URLSearchParams({ readMask: 'name,title,metadata', pageSize: '100' });
        if (locationsPage) lq.set('pageToken', locationsPage);
        const locs = await getJson<{ locations?: RawLocation[]; nextPageToken?: string }>(
          fetchImpl, `${INFO}/${account.name}/locations?${lq}`, token, 'locations');
        const match = pickLocation(locs.locations ?? [], place.cid, place.placeId);
        if (match?.name) {
          return { path: `${account.name}/${match.name}`, mapsUri: safeUrl(match.metadata?.mapsUri) };
        }
        locationsPage = locs.nextPageToken;
      } while (locationsPage);
    }
    accountsPage = list.nextPageToken;
  } while (accountsPage);
  throw new Error(`This Google login does not manage the "${campus}" Business Profile`);
}

/** Every review (newest first, capped), the overall rating and the total count. */
export async function fetchProfileReviews(
  auth: BusinessProfileOAuth,
  campus: string,
  fetchImpl: FetchLike,
  known?: ProfileLocation,
  now = new Date(),
): Promise<{ payload: GoogleReviewsPayload; location: ProfileLocation }> {
  const token = await accessToken(auth, fetchImpl);
  const location = known ?? (await findLocation(token, campus, fetchImpl));
  const reviews: GoogleReview[] = [];
  let rating: number | null = null;
  let count = 0;
  let page: string | undefined;
  do {
    const q = new URLSearchParams({ pageSize: '50', orderBy: 'updateTime desc' });
    if (page) q.set('pageToken', page);
    const body = await getJson<RawReviewList>(fetchImpl, `${REVIEWS}/${location.path}/reviews?${q}`, token, 'reviews');
    if (typeof body.averageRating === 'number' && body.averageRating > 0) rating = body.averageRating;
    count = Number(body.totalReviewCount) || count;
    for (const raw of body.reviews ?? []) {
      const review = normalizeProfileReview(raw, now);
      if (review) reviews.push(review);
    }
    page = body.nextPageToken;
  } while (page && reviews.length < MAX_REVIEWS);
  // updateTime order puts an old review that was just edited first; show by when it was written.
  reviews.sort((a, b) => (b.publishTime ?? '').localeCompare(a.publishTime ?? ''));
  return {
    payload: {
      campus,
      rating: rating === null ? null : Math.round(rating * 10) / 10,
      count: count || reviews.length,
      mapsUri: location.mapsUri,
      reviews: reviews.slice(0, MAX_REVIEWS),
      fetchedAt: now.toISOString(),
      source: 'business-profile',
    },
    location,
  };
}
