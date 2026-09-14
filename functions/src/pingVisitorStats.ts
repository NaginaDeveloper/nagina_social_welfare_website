import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp, type Firestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { applyCors } from './cors';
import { allowFirestoreRateLimit, allowMemoryRateLimit, clientIp } from './rateLimit';
import { clampString, setSecurityHeaders } from './security';

const RATE_MAX = 30;
const RATE_WINDOW_MS = 60_000;
const LIVE_WINDOW_MS = 2 * 60 * 1000;
const MAX_ID_CHARS = 64;
const ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

interface PingBody {
  readonly visitorId?: string;
  readonly sessionId?: string;
}

if (getApps().length === 0) {
  initializeApp();
}

/** Calendar date in Europe/London as YYYY-MM-DD. */
export function londonDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function parseId(value: unknown): string | null {
  const id = clampString(value, MAX_ID_CHARS);
  if (!ID_PATTERN.test(id)) {
    return null;
  }
  return id;
}

async function countLiveSessions(db: Firestore, cutoffMs: number): Promise<number> {
  const snap = await db
    .collection('visitor_presence')
    .where('lastSeenMs', '>=', cutoffMs)
    .limit(500)
    .get();
  return snap.size;
}

export const pingVisitorStats = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
  },
  async (req, res) => {
    setSecurityHeaders(res);

    if (!applyCors(req, res, { requireOrigin: true })) {
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const ip = clientIp(req);
    if (!allowMemoryRateLimit(`visitor:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
      res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      return;
    }

    const allowed = await allowFirestoreRateLimit({
      scope: 'visitor_ping',
      ip,
      max: RATE_MAX,
      windowMs: RATE_WINDOW_MS,
    });
    if (!allowed) {
      res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      return;
    }

    const body = (req.body ?? {}) as PingBody;
    const visitorId = parseId(body.visitorId);
    const sessionId = parseId(body.sessionId);
    if (!visitorId || !sessionId) {
      res.status(400).json({ error: 'Valid visitorId and sessionId are required.' });
      return;
    }

    const db = getFirestore();
    const now = Date.now();
    const todayKey = londonDateKey(new Date(now));
    const countersRef = db.collection('visitor_stats').doc('counters');
    const visitorRef = db.collection('visitor_ids').doc(visitorId);
    const presenceRef = db.collection('visitor_presence').doc(sessionId);

    try {
      const counts = await db.runTransaction(async (tx) => {
        const [countersSnap, visitorSnap] = await Promise.all([
          tx.get(countersRef),
          tx.get(visitorRef),
        ]);

        const counters = countersSnap.data() as
          | { totalVisitors?: number; todayVisitors?: number; todayDate?: string }
          | undefined;

        let totalVisitors = typeof counters?.totalVisitors === 'number' ? counters.totalVisitors : 0;
        let todayVisitors = typeof counters?.todayVisitors === 'number' ? counters.todayVisitors : 0;
        let todayDate = typeof counters?.todayDate === 'string' ? counters.todayDate : '';

        if (todayDate !== todayKey) {
          todayDate = todayKey;
          todayVisitors = 0;
        }

        const visitor = visitorSnap.data() as
          | { firstSeenMs?: number; lastDay?: string }
          | undefined;
        const isNewVisitor = !visitorSnap.exists;
        const needsTodayCredit = isNewVisitor || visitor?.lastDay !== todayKey;

        if (isNewVisitor) {
          totalVisitors += 1;
          tx.set(visitorRef, {
            firstSeenMs: now,
            lastSeenMs: now,
            lastDay: todayKey,
          });
        } else {
          tx.set(
            visitorRef,
            {
              lastSeenMs: now,
              ...(needsTodayCredit ? { lastDay: todayKey } : {}),
            },
            { merge: true },
          );
        }

        if (needsTodayCredit) {
          todayVisitors += 1;
        }

        tx.set(
          countersRef,
          {
            totalVisitors,
            todayVisitors,
            todayDate,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        tx.set(presenceRef, {
          visitorId,
          lastSeenMs: now,
          updatedAt: Timestamp.fromMillis(now),
        });

        return { totalVisitors, todayVisitors };
      });

      const liveVisitors = await countLiveSessions(db, now - LIVE_WINDOW_MS);

      res.status(200).json({
        liveVisitors,
        todayVisitors: counts.todayVisitors,
        totalVisitors: counts.totalVisitors,
      });
    } catch (err) {
      logger.error('pingVisitorStats failed', err);
      res.status(500).json({ error: 'Visitor stats unavailable right now.' });
    }
  },
);

/** Remove stale presence docs so live counts stay cheap. */
export const cleanupVisitorPresence = onSchedule(
  {
    schedule: 'every 5 minutes',
    region: 'europe-west2',
    timeZone: 'Europe/London',
  },
  async () => {
    const db = getFirestore();
    const cutoff = Date.now() - LIVE_WINDOW_MS * 2;
    const snap = await db
      .collection('visitor_presence')
      .where('lastSeenMs', '<', cutoff)
      .limit(400)
      .get();

    if (snap.empty) {
      return;
    }

    const batch = db.batch();
    for (const doc of snap.docs) {
      batch.delete(doc.ref);
    }
    await batch.commit();
    logger.info(`cleanupVisitorPresence deleted ${snap.size} stale sessions`);
  },
);
