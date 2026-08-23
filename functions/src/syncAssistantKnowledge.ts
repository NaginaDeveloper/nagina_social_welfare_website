import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, WriteBatch } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import {
  ASSISTANT_COLLECTION,
  ASSISTANT_META_COLLECTION,
  assistantSyncToken,
  embedText,
  normalizeText,
  stableHash,
  type RawAssistantChunk,
} from './assistantShared';
import { allowMemoryRateLimit, clientIp } from './rateLimit';
import { setSecurityHeaders, tokensEqual } from './security';

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface SyncBody {
  readonly version?: string;
  readonly chunks?: readonly RawAssistantChunk[];
}

async function commitChunks(chunks: readonly RawAssistantChunk[], apiKey: string): Promise<number> {
  const existing = await db.collection(ASSISTANT_COLLECTION).get();
  let deleteBatch: WriteBatch = db.batch();
  let deleteCount = 0;
  for (const doc of existing.docs) {
    deleteBatch.delete(doc.ref);
    deleteCount += 1;
    if (deleteCount % 400 === 0) {
      await deleteBatch.commit();
      deleteBatch = db.batch();
    }
  }
  if (deleteCount % 400 !== 0) {
    await deleteBatch.commit();
  }

  let writeBatch: WriteBatch = db.batch();
  let processed = 0;
  for (const chunk of chunks) {
    const text = normalizeText(chunk.text);
    if (!text) {
      continue;
    }
    const embedding = await embedText(apiKey, text, 'RETRIEVAL_DOCUMENT');
    const docId = chunk.id || stableHash(`${chunk.title}:${chunk.path}:${text.slice(0, 120)}`);
    writeBatch.set(db.collection(ASSISTANT_COLLECTION).doc(docId), {
      ...chunk,
      id: docId,
      text,
      embedding,
      hash: stableHash(text),
      updatedAt: FieldValue.serverTimestamp(),
    });
    processed += 1;
    if (processed % 100 === 0) {
      await writeBatch.commit();
      writeBatch = db.batch();
    }
  }
  if (processed % 100 !== 0) {
    await writeBatch.commit();
  }
  return processed;
}

export const syncAssistantKnowledge = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
    timeoutSeconds: 540,
    memory: '1GiB',
    secrets: [assistantSyncToken],
  },
  async (req, res) => {
    setSecurityHeaders(res);

    // Server-to-server only — do not advertise CORS for this privileged endpoint.
    if (req.method === 'OPTIONS') {
      res.status(404).send('');
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const ip = clientIp(req);
    if (!allowMemoryRateLimit(`assistant_sync:${ip}`, 10, 60 * 60 * 1000)) {
      res.status(429).json({ error: 'Too many sync attempts' });
      return;
    }

    const expectedToken = assistantSyncToken.value() || process.env.ASSISTANT_SYNC_TOKEN || '';
    const suppliedToken = req.get('x-assistant-sync-token') || '';
    if (!tokensEqual(expectedToken, suppliedToken)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    const body = (req.body ?? {}) as SyncBody;
    const version = body.version?.trim() || new Date().toISOString();
    const chunks = (body.chunks ?? []).filter(
      (chunk): chunk is RawAssistantChunk =>
        Boolean(chunk && chunk.title && chunk.path && chunk.text && chunk.sourceType),
    );

    if (!chunks.length) {
      res.status(400).json({ error: 'No assistant chunks supplied.' });
      return;
    }

    try {
      const count = await commitChunks(chunks, apiKey);
      await db.collection(ASSISTANT_META_COLLECTION).doc('current').set({
        version,
        count,
        syncedAt: FieldValue.serverTimestamp(),
      });
      res.status(200).json({ ok: true, count, version });
    } catch (err) {
      logger.error('syncAssistantKnowledge failed', err);
      res.status(502).json({ error: 'Could not sync assistant knowledge.' });
    }
  },
);
