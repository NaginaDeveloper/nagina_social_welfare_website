import { createHash } from 'node:crypto';
import type { Request } from 'express';
import { getFirestore } from 'firebase-admin/firestore';

type Bucket = { timestamps: number[] };

const memory = new Map<string, Bucket>();

/** Client IP from Cloud Functions / Cloud Run proxies. */
export function clientIp(req: Request): string {
  const fwd = req.get('x-forwarded-for');
  if (fwd) {
    return fwd.split(',')[0]?.trim() || 'unknown';
  }
  return req.ip || 'unknown';
}

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t < windowMs);
}

/** Fast per-instance limit (best-effort across many Cloud Run instances). */
export function allowMemoryRateLimit(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = memory.get(key) ?? { timestamps: [] };
  bucket.timestamps = prune(bucket.timestamps, windowMs, now);
  if (bucket.timestamps.length >= max) {
    memory.set(key, bucket);
    return false;
  }
  bucket.timestamps.push(now);
  memory.set(key, bucket);
  return true;
}

function rateDocId(scope: string, ip: string): string {
  const hash = createHash('sha256').update(`${scope}:${ip}`).digest('hex').slice(0, 40);
  return `${scope}_${hash}`;
}

/**
 * Shared Firestore rate limit (works across instances).
 * Docs live under `_api_rate_limits` (Admin SDK only; client rules deny-all).
 */
export async function allowFirestoreRateLimit(params: {
  scope: string;
  ip: string;
  max: number;
  windowMs: number;
}): Promise<boolean> {
  const { scope, ip, max, windowMs } = params;
  const db = getFirestore();
  const ref = db.collection('_api_rate_limits').doc(rateDocId(scope, ip));
  const now = Date.now();

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.data() as
        | { windowStart?: number; count?: number }
        | undefined;
      let windowStart = typeof data?.windowStart === 'number' ? data.windowStart : now;
      let count = typeof data?.count === 'number' ? data.count : 0;

      if (now - windowStart >= windowMs) {
        windowStart = now;
        count = 0;
      }
      if (count >= max) {
        return false;
      }
      tx.set(
        ref,
        {
          windowStart,
          count: count + 1,
          updatedAt: now,
          scope,
        },
        { merge: true },
      );
      return true;
    });
  } catch {
    // If Firestore is briefly unavailable, fall back to memory so legit users are not blocked.
    return allowMemoryRateLimit(`${scope}:${ip}`, max, windowMs);
  }
}
