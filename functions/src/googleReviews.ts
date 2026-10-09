import { logger } from 'firebase-functions';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { applyGetCors } from './cors';
import {
  CAMPUS_PLACES,
  fetchCampusReviews,
  type FetchLike,
  type GoogleReviewsPayload,
} from './googleReviewsCore';
import { allowMemoryRateLimit, clientIp } from './rateLimit';
import { setSecurityHeaders } from './security';

/** Set with: firebase functions:secrets:set GOOGLE_PLACES_API_KEY (restrict the key to Places API (New)). */
const GOOGLE_PLACES_API_KEY = defineSecret('GOOGLE_PLACES_API_KEY');

/** Short in-memory cache only: Google's terms do not allow storing Places content. */
const CACHE_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; placeId: string; payload: GoogleReviewsPayload }>();

export const googleReviews = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
    timeoutSeconds: 20,
    memory: '256MiB',
    secrets: [GOOGLE_PLACES_API_KEY],
  },
  async (req, res) => {
    setSecurityHeaders(res);
    if (!applyGetCors(req, res)) return;
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    if (!allowMemoryRateLimit(`google-reviews:${clientIp(req)}`, 60, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      return;
    }

    const campus = String(req.query['campus'] ?? 'peterborough').toLowerCase();
    if (!CAMPUS_PLACES[campus]) {
      res.status(404).json({ error: 'No Google reviews for that centre.' });
      return;
    }

    const hit = cache.get(campus);
    if (hit && Date.now() - hit.at < CACHE_MS) {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
      res.status(200).json(hit.payload);
      return;
    }

    try {
      const { payload, placeId } = await fetchCampusReviews(
        GOOGLE_PLACES_API_KEY.value(),
        campus,
        fetch as unknown as FetchLike,
        hit?.placeId,
      );
      cache.set(campus, { at: Date.now(), placeId, payload });
      res.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
      res.status(200).json(payload);
    } catch (err) {
      logger.error('googleReviews failed', err);
      if (hit) {
        res.set('Cache-Control', 'public, max-age=60');
        res.status(200).json(hit.payload);
        return;
      }
      res.status(502).json({ error: 'Unable to load Google reviews right now.' });
    }
  },
);
