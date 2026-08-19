import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { applyCors } from './cors';
import {
  ASSISTANT_COLLECTION,
  ASSISTANT_META_COLLECTION,
  detectQuestionLanguage,
  embedText,
  generateAnswer,
  type AssistantCitation,
  type AssistantHistoryTurn,
  type RawAssistantChunk,
  type StoredAssistantChunk,
  cosineSimilarity,
} from './assistantShared';

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const rateWindow = 60_000;
const rateLimit = 12;
const requests = new Map<string, { count: number; resetAt: number }>();

let cacheUntil = 0;
let cachedChunks: StoredAssistantChunk[] = [];

interface AskBody {
  readonly query?: string;
  readonly history?: readonly AssistantHistoryTurn[];
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u0600-\u06FF]+/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const current = requests.get(ip);
  if (!current || current.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + rateWindow });
    return true;
  }
  if (current.count >= rateLimit) {
    return false;
  }
  current.count += 1;
  return true;
}

async function loadChunks(): Promise<StoredAssistantChunk[]> {
  if (cacheUntil > Date.now() && cachedChunks.length) {
    return cachedChunks;
  }
  const snapshot = await db.collection(ASSISTANT_COLLECTION).get();
  cachedChunks = snapshot.docs.map((doc) => doc.data() as StoredAssistantChunk);
  cacheUntil = Date.now() + 5 * 60_000;
  return cachedChunks;
}

function toCitation(chunk: RawAssistantChunk): AssistantCitation {
  return {
    title: chunk.title,
    path: chunk.path,
    sourceType: chunk.sourceType,
  };
}

function selectCitations(chunks: readonly StoredAssistantChunk[], query: string): AssistantCitation[] {
  const queryLower = query.toLowerCase();
  const navigational =
    /donate|contact|namaz|prayer|books|assistant|portal|pay|email|phone|sumup|paypal|natwest/i.test(
      queryLower,
    ) || /رابط|عط|نماز|کتاب|مدد|رابطہ/.test(query);

  if (navigational) {
    const faqMatches = chunks.filter((chunk) => chunk.sourceType === 'faq');
    if (faqMatches.length) {
      return faqMatches.slice(0, 2).map(toCitation);
    }
  }

  const prioritized = [
    ...chunks.filter((chunk) => chunk.sourceType !== 'book'),
    ...chunks.filter((chunk) => chunk.sourceType === 'book'),
  ];

  const unique: AssistantCitation[] = [];
  const seen = new Set<string>();
  for (const chunk of prioritized) {
    const key = `${chunk.path}:${chunk.title}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(toCitation(chunk));
    if (unique.length === 3) {
      break;
    }
  }

  return unique;
}

export const askNaginaAssistant = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
  },
  async (req, res) => {
    if (!applyCors(req, res)) {
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const ip = req.ip || req.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(String(ip))) {
      res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
      return;
    }

    const { query, history = [] } = (req.body ?? {}) as AskBody;
    const cleanQuery = query?.trim();
    if (!cleanQuery || cleanQuery.length < 2) {
      res.status(400).json({ error: 'Please enter a fuller question.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || '';

    try {
      const meta = await db.collection(ASSISTANT_META_COLLECTION).doc('current').get();
      if (!meta.exists) {
        res.status(503).json({
          error: 'Assistant knowledge is still being prepared. Please try again shortly.',
        });
        return;
      }

      const chunks = await loadChunks();
      if (!chunks.length) {
        res.status(503).json({
          error: 'Assistant knowledge is still being prepared. Please try again shortly.',
        });
        return;
      }

      const queryEmbedding = await embedText(apiKey, cleanQuery, 'RETRIEVAL_QUERY');
      const queryTokens = tokenize(cleanQuery);
      const ranked = chunks
        .map((chunk) => {
          const semantic = cosineSimilarity(queryEmbedding, chunk.embedding);
          const haystack = `${chunk.title} ${chunk.path} ${(chunk.tags ?? []).join(' ')}`.toLowerCase();
          const lexicalHits = queryTokens.filter((token) => haystack.includes(token)).length;
          const lexicalBoost = lexicalHits * 0.08;
          const faqBoost = chunk.sourceType === 'faq' && lexicalHits > 0 ? 0.18 : 0;
          return { chunk, score: semantic + lexicalBoost + faqBoost };
        })
        .sort((a, b) => b.score - a.score)
        .filter((item) => item.score > 0.2);

      const selected: StoredAssistantChunk[] = [];
      const seenPaths = new Set<string>();
      for (const item of ranked) {
        const key = `${item.chunk.path}:${item.chunk.title}`;
        if (seenPaths.has(key)) {
          continue;
        }
        selected.push(item.chunk);
        seenPaths.add(key);
        if (selected.length === 6) {
          break;
        }
      }

      const fallback = chunks
        .filter((chunk) => chunk.sourceType === 'faq')
        .slice(0, 4);
      const contextChunks = selected.length ? selected : fallback;
      const answer = await generateAnswer(apiKey, cleanQuery, history, contextChunks);

      res.status(200).json({
        answer,
        disclaimer:
          detectQuestionLanguage(cleanQuery) === 'ur'
            ? 'یہ معاون مفتی نہیں ہے۔ ذاتی یا شرعی فیصلوں کے لیے براہِ راست مرکز سے رابطہ کریں۔'
            : 'This assistant is not a mufti. For binding rulings or personal religious matters, please contact Markaz directly.',
        citations: selectCitations(contextChunks, cleanQuery),
        language: detectQuestionLanguage(cleanQuery),
      });
    } catch (err) {
      logger.error('askNaginaAssistant failed', err);
      res.status(502).json({
        error: 'Assistant could not answer right now. Please try again shortly.',
      });
    }
  },
);
