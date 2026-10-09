import assert from 'node:assert/strict';
import {
  fetchCampusReviews,
  normalizePlace,
  normalizeReview,
  pickPlaceByCid,
  type FetchLike,
} from './googleReviewsCore';

// Picks the Business Profile by its customer id, not by search rank.
assert.equal(
  pickPlaceByCid(
    [
      { id: 'other', googleMapsUri: 'https://maps.google.com/?cid=111' },
      { id: 'ours', googleMapsUri: 'https://maps.google.com/?cid=7180850669849561719' },
    ],
    '7180850669849561719',
  )?.id,
  'ours',
);
assert.equal(pickPlaceByCid([{ id: 'x', googleMapsUri: 'https://maps.google.com/?cid=1' }], '2'), null);

// A review keeps its text, attribution and rating; bad ratings and non-https links are dropped.
const review = normalizeReview({
  rating: 5,
  text: { text: '  Best islamic institute ' },
  relativePublishTimeDescription: '3 weeks ago',
  publishTime: '2026-09-18T10:00:00Z',
  authorAttribution: { displayName: 'Mohammed Ullah', uri: 'https://www.google.com/maps/contrib/1', photoUri: 'http://insecure/x.jpg' },
});
assert.equal(review?.text, 'Best islamic institute');
assert.equal(review?.author, 'Mohammed Ullah');
assert.equal(review?.authorUrl, 'https://www.google.com/maps/contrib/1');
assert.equal(review?.photoUrl, null);
assert.equal(normalizeReview({ rating: 0 }), null);
assert.equal(normalizeReview({ text: { text: 'no rating' } }), null);
// Rating-only reviews are valid (empty text).
assert.equal(normalizeReview({ rating: 4 })?.text, '');

// Place payload: rating, count, at most five reviews.
const place = normalizePlace(
  'peterborough',
  {
    rating: 5,
    userRatingCount: 23,
    googleMapsUri: 'https://maps.google.com/?cid=7180850669849561719',
    reviews: Array.from({ length: 8 }, (_, i) => ({ rating: 5, text: { text: `r${i}` } })),
  },
  new Date('2026-10-09T20:00:00Z'),
);
assert.equal(place.rating, 5);
assert.equal(place.count, 23);
assert.equal(place.reviews.length, 5);
assert.equal(place.fetchedAt, '2026-10-09T20:00:00.000Z');

async function endToEnd(): Promise<void> {
  // End to end with a fake Places API: search by text, then details; key never leaves the headers.
  const calls: string[] = [];
  const fake: FetchLike = async (url, init) => {
    calls.push(`${init?.method ?? 'GET'} ${url.replace('https://places.googleapis.com/v1', '')}`);
    assert.equal(init?.headers?.['X-Goog-Api-Key'], 'test-key');
    assert.ok(!url.includes('test-key'));
    if (url.endsWith('places:searchText')) {
      return { ok: true, status: 200, json: async () => ({ places: [{ id: 'PLACE_1', googleMapsUri: 'https://maps.google.com/?cid=7180850669849561719' }] }) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ rating: 5, userRatingCount: 23, googleMapsUri: 'https://maps.google.com/?cid=7180850669849561719', reviews: [{ rating: 5, text: { text: 'Great' } }] }),
    };
  };
  const first = await fetchCampusReviews('test-key', 'peterborough', fake);
  assert.equal(first.placeId, 'PLACE_1');
  assert.equal(first.payload.count, 23);
  assert.deepEqual(calls, ['POST /places:searchText', 'GET /places/PLACE_1?languageCode=en']);
  // A known place id skips the search.
  calls.length = 0;
  await fetchCampusReviews('test-key', 'peterborough', fake, 'PLACE_1');
  assert.deepEqual(calls, ['GET /places/PLACE_1?languageCode=en']);

  // Failures surface as errors; unknown centres are rejected.
  await assert.rejects(() => fetchCampusReviews('k', 'peterborough', async () => ({ ok: false, status: 403, json: async () => ({}) })), /HTTP 403/);
  await assert.rejects(() => fetchCampusReviews('k', 'nowhere', fake), /No Google profile/);
}

void endToEnd().then(() => console.log('googleReviews.selftest: ok'));
