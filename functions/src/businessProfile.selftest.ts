import assert from 'node:assert/strict';
import {
  fetchProfileReviews,
  normalizeProfileReview,
  originalComment,
  parseOAuthSecret,
  pickLocation,
  relativeTime,
} from './businessProfileCore';
import type { FetchLike } from './googleReviewsCore';

const now = new Date('2026-10-16T12:00:00Z');

// The secret is JSON with all three fields, or it counts as not configured.
assert.deepEqual(parseOAuthSecret('{"clientId":"c","clientSecret":"s","refreshToken":"r"}'), {
  clientId: 'c',
  clientSecret: 's',
  refreshToken: 'r',
});
assert.equal(parseOAuthSecret('{"clientId":"c"}'), null);
assert.equal(parseOAuthSecret('not json'), null);
assert.equal(parseOAuthSecret(''), null);

// Reviews are shown as the reviewer wrote them, without Google's machine translation.
assert.equal(originalComment('Great madrasa\n\n(Translated by Google)\nGreat madrasa'), 'Great madrasa');
assert.equal(originalComment('(Translated by Google) Very good\n\n(Original)\nبہت اچھا'), 'بہت اچھا');
assert.equal(originalComment('  Plain  '), 'Plain');
assert.equal(originalComment(undefined), '');

assert.equal(relativeTime('2026-10-16T08:00:00Z', now), 'today');
assert.equal(relativeTime('2026-10-15T08:00:00Z', now), 'a day ago');
assert.equal(relativeTime('2026-09-25T12:00:00Z', now), '3 weeks ago');
assert.equal(relativeTime('2025-01-01T00:00:00Z', now), 'a year ago');
assert.equal(relativeTime(undefined, now), '');

// Star enums map to numbers; anonymous reviewers lose their name and photo; replies carry over.
const review = normalizeProfileReview(
  {
    reviewer: { displayName: 'Noreen Akhtar', profilePhotoUrl: 'https://lh3.googleusercontent.com/a/x' },
    starRating: 'FOUR',
    comment: 'Very happy',
    createTime: '2026-10-02T12:00:00Z',
    reviewReply: { comment: 'JazakAllah khair', updateTime: '2026-10-03T12:00:00Z' },
  },
  now,
);
assert.equal(review?.rating, 4);
assert.equal(review?.author, 'Noreen Akhtar');
assert.equal(review?.photoUrl, 'https://lh3.googleusercontent.com/a/x');
assert.equal(review?.when, '2 weeks ago');
assert.deepEqual(review?.reply, { text: 'JazakAllah khair', publishTime: '2026-10-03T12:00:00Z' });
const anon = normalizeProfileReview({ reviewer: { displayName: 'x', isAnonymous: true, profilePhotoUrl: 'https://p' }, starRating: 'FIVE' }, now);
assert.equal(anon?.author, 'Google user');
assert.equal(anon?.photoUrl, null);
assert.equal(anon?.reply, null);
assert.equal(normalizeProfileReview({ starRating: 'STAR_RATING_UNSPECIFIED' }, now), null);

// The location is chosen by the centre's customer id, not by list order.
assert.equal(
  pickLocation(
    [
      { name: 'locations/1', metadata: { mapsUri: 'https://maps.google.com/maps?cid=111' } },
      { name: 'locations/2', metadata: { mapsUri: 'https://maps.google.com/maps?cid=7180850669849561719' } },
    ],
    '7180850669849561719',
  )?.name,
  'locations/2',
);
assert.equal(pickLocation([{ name: 'locations/1', metadata: { placeId: 'P' } }], '9', 'P')?.name, 'locations/1');
assert.equal(pickLocation([{ name: 'locations/1' }], '9'), null);

async function endToEnd(): Promise<void> {
  const calls: string[] = [];
  const fake: FetchLike = async (url, init) => {
    calls.push(`${init?.method ?? 'GET'} ${new URL(url).host}${new URL(url).pathname}`);
    if (url.startsWith('https://oauth2.googleapis.com/token')) {
      assert.match(init?.body ?? '', /grant_type=refresh_token/);
      assert.match(init?.body ?? '', /refresh_token=r/);
      return { ok: true, status: 200, json: async () => ({ access_token: 'AT' }) };
    }
    assert.equal(init?.headers?.['Authorization'], 'Bearer AT');
    if (url.includes('/v1/accounts?') || url.endsWith('/v1/accounts')) {
      return { ok: true, status: 200, json: async () => ({ accounts: [{ name: 'accounts/9' }] }) };
    }
    if (url.includes('/v1/accounts/9/locations')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          locations: [{ name: 'locations/42', metadata: { mapsUri: 'https://maps.google.com/maps?cid=7180850669849561719' } }],
        }),
      };
    }
    if (url.includes('/reviews')) {
      const second = url.includes('pageToken=P2');
      return {
        ok: true,
        status: 200,
        json: async () =>
          second
            ? { averageRating: 4.96, totalReviewCount: 3, reviews: [{ starRating: 'FIVE', comment: 'oldest', createTime: '2025-01-01T00:00:00Z' }] }
            : {
                averageRating: 4.96,
                totalReviewCount: 3,
                nextPageToken: 'P2',
                reviews: [
                  // Edited recently, written long ago: sorted by when it was written.
                  { starRating: 'FIVE', comment: 'edited', createTime: '2025-06-01T00:00:00Z', updateTime: '2026-10-15T00:00:00Z' },
                  { starRating: 'FOUR', comment: 'newest', createTime: '2026-10-10T00:00:00Z' },
                ],
              },
      };
    }
    throw new Error(`unexpected ${url}`);
  };
  const auth = { clientId: 'c', clientSecret: 's', refreshToken: 'r' };
  const first = await fetchProfileReviews(auth, 'peterborough', fake, undefined, now);
  assert.equal(first.location.path, 'accounts/9/locations/42');
  assert.equal(first.payload.rating, 5);
  assert.equal(first.payload.count, 3);
  assert.equal(first.payload.source, 'business-profile');
  assert.deepEqual(first.payload.reviews.map((r) => r.text), ['newest', 'edited', 'oldest']);
  assert.deepEqual(calls, [
    'POST oauth2.googleapis.com/token',
    'GET mybusinessaccountmanagement.googleapis.com/v1/accounts',
    'GET mybusinessbusinessinformation.googleapis.com/v1/accounts/9/locations',
    'GET mybusiness.googleapis.com/v4/accounts/9/locations/42/reviews',
    'GET mybusiness.googleapis.com/v4/accounts/9/locations/42/reviews',
  ]);

  // A known location skips the lookup.
  calls.length = 0;
  await fetchProfileReviews(auth, 'peterborough', fake, first.location, now);
  assert.equal(calls.filter((c) => c.includes('/v1/')).length, 0);

  // Failures surface as errors so the function can fall back to the Places API.
  const denied: FetchLike = async () => ({ ok: false, status: 401, json: async () => ({}) });
  await assert.rejects(() => fetchProfileReviews(auth, 'peterborough', denied), /token HTTP 401/);
  await assert.rejects(() => fetchProfileReviews(auth, 'nowhere', fake), /No Google profile/);
  const none: FetchLike = async (url) =>
    url.includes('token')
      ? { ok: true, status: 200, json: async () => ({ access_token: 'AT' }) }
      : { ok: true, status: 200, json: async () => ({}) };
  await assert.rejects(() => fetchProfileReviews(auth, 'peterborough', none), /does not manage/);
}

void endToEnd().then(() => console.log('businessProfile.selftest: ok'));
