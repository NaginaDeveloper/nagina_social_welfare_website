import { getApps, initializeApp } from 'firebase-admin/app';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { applyCors } from './cors';
import { answerNaginaQuestion } from './answerNaginaQuestion';
import type { AssistantHistoryTurn } from './assistantShared';
import { allowFirestoreRateLimit, allowMemoryRateLimit, clientIp } from './rateLimit';
import { clampString, setSecurityHeaders } from './security';

interface AskBody {
  readonly query?: string;
  readonly history?: readonly AssistantHistoryTurn[];
}

const RATE_MAX = 8;
const RATE_WINDOW_MS = 60_000;
const MAX_QUERY_CHARS = 1_200;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_CHARS = 1_200;

if (getApps().length === 0) {
  initializeApp();
}

function sanitizeHistory(
  history: readonly AssistantHistoryTurn[] | undefined,
): AssistantHistoryTurn[] {
  if (!Array.isArray(history)) {
    return [];
  }
  return history
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({
      role: turn?.role === 'assistant' ? ('assistant' as const) : ('user' as const),
      content: clampString(turn?.content, MAX_HISTORY_CHARS),
    }))
    .filter((turn) => turn.content.length > 0);
}

export const askNaginaAssistant = onRequest(
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
    if (!allowMemoryRateLimit(`assistant:${ip}`, RATE_MAX, RATE_WINDOW_MS)) {
      res.status(429).json({
        error: 'Too many requests. Please wait a minute and try again.',
      });
      return;
    }
    const allowed = await allowFirestoreRateLimit({
      scope: 'assistant_ask',
      ip,
      max: RATE_MAX,
      windowMs: RATE_WINDOW_MS,
    });
    if (!allowed) {
      res.status(429).json({
        error: 'Too many requests. Please wait a minute and try again.',
      });
      return;
    }

    const { query, history } = (req.body ?? {}) as AskBody;
    const cleanQuery = clampString(query, MAX_QUERY_CHARS);
    if (cleanQuery.length < 2) {
      res.status(400).json({ error: 'Please enter a fuller question.' });
      return;
    }

    try {
      const result = await answerNaginaQuestion(cleanQuery, sanitizeHistory(history));
      if (result.error === 'unavailable') {
        res.status(503).json({
          error: 'Assistant knowledge is still being prepared. Please try again shortly.',
        });
        return;
      }
      res.status(200).json({
        answer: result.answer,
        disclaimer: result.disclaimer,
        citations: result.citations,
        sourceMode: result.sourceMode,
        language: result.language,
      });
    } catch (err) {
      logger.error('askNaginaAssistant failed', err);
      res.status(502).json({
        error: 'Assistant could not answer right now. Please try again shortly.',
      });
    }
  },
);
