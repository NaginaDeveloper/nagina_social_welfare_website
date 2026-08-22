import { getApps, initializeApp } from 'firebase-admin/app';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { applyCors } from './cors';
import { answerNaginaQuestion } from './answerNaginaQuestion';
import type { AssistantHistoryTurn } from './assistantShared';

interface AskBody {
  readonly query?: string;
  readonly history?: readonly AssistantHistoryTurn[];
}

const rateWindow = 60_000;
const rateLimit = 12;
const requests = new Map<string, { count: number; resetAt: number }>();

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

if (getApps().length === 0) {
  initializeApp();
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

    try {
      const result = await answerNaginaQuestion(cleanQuery, history);
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
