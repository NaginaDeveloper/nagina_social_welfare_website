import { createHmac, timingSafeEqual } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { answerNaginaQuestion } from './answerNaginaQuestion';
import type { AssistantHistoryTurn } from './assistantShared';
import {
  markWhatsappRead,
  sendWhatsappMenu,
  sendWhatsappText,
  type WhatsappSecrets,
} from './whatsappClient';
import {
  cannedReply,
  classifyWhatsappTurn,
  detectFaqLanguage,
  formatWhatsappText,
  menuFallbackText,
  type FaqLang,
  type WhatsappIntent,
} from './whatsappFaq';

const whatsappVerifyToken = defineSecret('WHATSAPP_VERIFY_TOKEN');
const whatsappAppSecret = defineSecret('WHATSAPP_APP_SECRET');
const whatsappAccessToken = defineSecret('WHATSAPP_ACCESS_TOKEN');
const whatsappPhoneNumberId = defineSecret('WHATSAPP_PHONE_NUMBER_ID');

const SESSIONS = 'whatsapp_sessions';
const STAFF_PAUSE_MS = 8 * 60 * 60 * 1000;
const SAFEGUARDING_PAUSE_MS = 24 * 60 * 60 * 1000;
const HISTORY_LIMIT = 6;

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

interface WhatsappEcho {
  readonly id?: string;
  readonly to?: string;
}

interface WhatsappInbound {
  readonly from?: string;
  readonly id?: string;
  readonly type?: string;
  readonly text?: { readonly body?: string };
  readonly interactive?: {
    readonly list_reply?: { readonly id?: string };
    readonly button_reply?: { readonly id?: string };
  };
}

interface WhatsappValue {
  readonly metadata?: { readonly phone_number_id?: string };
  readonly messages?: readonly WhatsappInbound[];
  readonly smb_message_echoes?: readonly WhatsappEcho[];
  readonly message_echoes?: readonly WhatsappEcho[];
}

interface SessionRecord {
  readonly lang?: FaqLang;
  readonly pausedUntil?: Timestamp;
  readonly lastInboundId?: string;
  readonly outboundIds?: readonly string[];
  readonly history?: readonly AssistantHistoryTurn[];
}

function verifySignature(rawBody: Buffer, header: string | undefined, secret: string): boolean {
  if (!header || !secret) {
    return false;
  }
  const match = /^sha256=(.+)$/i.exec(header.trim());
  if (!match?.[1]) {
    return false;
  }
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(match[1], 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function secrets(): WhatsappSecrets {
  return {
    accessToken: whatsappAccessToken.value() || process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: whatsappPhoneNumberId.value() || process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  };
}

function sessionRef(waId: string) {
  return db.collection(SESSIONS).doc(waId);
}

function isPaused(session: SessionRecord | undefined): boolean {
  const until = session?.pausedUntil;
  if (!until) {
    return false;
  }
  return until.toMillis() > Date.now();
}

async function pauseSession(waId: string, ms: number, reason: string): Promise<void> {
  await sessionRef(waId).set(
    {
      pausedUntil: Timestamp.fromMillis(Date.now() + ms),
      pausedReason: reason,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

async function rememberOutbound(waId: string, messageId: string | null): Promise<void> {
  if (!messageId) {
    return;
  }
  const snap = await sessionRef(waId).get();
  const existing = (snap.data() as SessionRecord | undefined)?.outboundIds ?? [];
  const outboundIds = [...existing, messageId].slice(-8);
  await sessionRef(waId).set(
    { outboundIds, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
}

async function appendHistory(
  waId: string,
  lang: FaqLang,
  userText: string,
  assistantText: string,
): Promise<void> {
  const snap = await sessionRef(waId).get();
  const previous = (snap.data() as SessionRecord | undefined)?.history ?? [];
  const nextTurn: readonly AssistantHistoryTurn[] = [
    { role: 'user', content: userText.slice(0, 800) },
    { role: 'assistant', content: assistantText.slice(0, 800) },
  ];
  const history = [...previous, ...nextTurn].slice(-HISTORY_LIMIT);
  await sessionRef(waId).set(
    { lang, history, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
}

async function handleEchoes(value: WhatsappValue): Promise<void> {
  const echoes = [...(value.smb_message_echoes ?? []), ...(value.message_echoes ?? [])];
  for (const echo of echoes) {
    const userId = echo.to?.replace(/\D/g, '');
    const echoId = echo.id;
    if (!userId || !echoId) {
      continue;
    }
    const snap = await sessionRef(userId).get();
    const outbound = (snap.data() as SessionRecord | undefined)?.outboundIds ?? [];
    if (outbound.includes(echoId)) {
      continue;
    }
    logger.info('WhatsApp staff echo — pausing bot', { userId });
    await pauseSession(userId, STAFF_PAUSE_MS, 'staff');
  }
}

async function reply(
  creds: WhatsappSecrets,
  waId: string,
  lang: FaqLang,
  intent: WhatsappIntent,
  userText: string,
  history: readonly AssistantHistoryTurn[],
): Promise<{ id: string | null; text: string }> {
  if (intent === 'greeting') {
    const menuText = menuFallbackText(lang);
    const sent = await sendWhatsappMenu(creds, waId, lang);
    if (sent) {
      return { id: sent, text: menuText };
    }
    return { id: await sendWhatsappText(creds, waId, menuText), text: menuText };
  }

  if (intent === 'question') {
    const result = await answerNaginaQuestion(userText, history);
    if (result.error === 'unavailable') {
      const fallback =
        lang === 'ur'
          ? 'معاون ابھی دستیاب نہیں۔ کچھ دیر بعد کوشش کریں، یا سٹاف لکھیں۔'
          : 'The assistant is not available just now. Please try again shortly, or reply STAFF.';
      return { id: await sendWhatsappText(creds, waId, fallback), text: fallback };
    }
    const body = formatWhatsappText(
      [result.answer, result.disclaimer].filter(Boolean).join('\n\n'),
    );
    return { id: await sendWhatsappText(creds, waId, body), text: body };
  }

  const text = formatWhatsappText(cannedReply(intent, lang));
  return { id: await sendWhatsappText(creds, waId, text), text };
}

async function handleInbound(value: WhatsappValue, creds: WhatsappSecrets): Promise<void> {
  const expectedPhone = creds.phoneNumberId;
  if (expectedPhone && value.metadata?.phone_number_id && value.metadata.phone_number_id !== expectedPhone) {
    return;
  }

  for (const message of value.messages ?? []) {
    const waId = message.from?.replace(/\D/g, '');
    const messageId = message.id;
    if (!waId || !messageId) {
      continue;
    }

    const snap = await sessionRef(waId).get();
    const session = snap.data() as SessionRecord | undefined;
    if (session?.lastInboundId === messageId) {
      continue;
    }
    await sessionRef(waId).set(
      { lastInboundId: messageId, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );

    const interactiveId =
      message.interactive?.list_reply?.id || message.interactive?.button_reply?.id;
    const userText = message.text?.body?.trim() || interactiveId || '';
    if (!userText && message.type !== 'interactive') {
      continue;
    }

    const lang: FaqLang =
      detectFaqLanguage(userText) === 'ur' ? 'ur' : (session?.lang ?? 'en');
    const intent = classifyWhatsappTurn(userText, interactiveId);

    if (isPaused(session) && intent !== 'safeguarding') {
      logger.info('WhatsApp bot paused; leaving for staff', { waId, intent });
      continue;
    }

    await markWhatsappRead(creds, messageId);

    if (intent === 'handoff' || intent === 'safeguarding') {
      await pauseSession(
        waId,
        intent === 'safeguarding' ? SAFEGUARDING_PAUSE_MS : STAFF_PAUSE_MS,
        intent,
      );
    }

    const outbound = await reply(
      creds,
      waId,
      lang,
      intent,
      userText,
      session?.history ?? [],
    );
    await rememberOutbound(waId, outbound.id);
    if (outbound.id) {
      await appendHistory(waId, lang, userText, outbound.text);
    }
  }
}

export const whatsappWebhook = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
    timeoutSeconds: 60,
    secrets: [
      whatsappVerifyToken,
      whatsappAppSecret,
      whatsappAccessToken,
      whatsappPhoneNumberId,
    ],
  },
  async (req, res) => {
    if (req.method === 'GET') {
      const mode = String(req.query['hub.mode'] || '');
      const token = String(req.query['hub.verify_token'] || '');
      const challenge = String(req.query['hub.challenge'] || '');
      const expected = whatsappVerifyToken.value() || process.env.WHATSAPP_VERIFY_TOKEN || '';
      if (mode === 'subscribe' && expected && token === expected && challenge) {
        res.status(200).send(challenge);
        return;
      }
      res.status(403).send('Forbidden');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const appSecret = whatsappAppSecret.value() || process.env.WHATSAPP_APP_SECRET || '';
    const rawBody: Buffer =
      typeof req.rawBody !== 'undefined'
        ? req.rawBody
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {}));

    if (!verifySignature(rawBody, req.get('x-hub-signature-256') ?? undefined, appSecret)) {
      logger.warn('WhatsApp webhook signature verification failed');
      res.status(401).send('Invalid signature');
      return;
    }

    let payload: { object?: string; entry?: readonly { changes?: readonly { value?: WhatsappValue }[] }[] };
    try {
      payload = JSON.parse(rawBody.toString('utf8')) as typeof payload;
    } catch {
      res.status(400).send('Invalid JSON');
      return;
    }

    res.status(200).send('EVENT_RECEIVED');

    if (payload.object && payload.object !== 'whatsapp_business_account') {
      return;
    }

    const creds = secrets();
    if (!creds.accessToken || !creds.phoneNumberId) {
      logger.error('WhatsApp secrets are not configured');
      return;
    }

    try {
      for (const entry of payload.entry ?? []) {
        for (const change of entry.changes ?? []) {
          const value = change.value;
          if (!value) {
            continue;
          }
          await handleEchoes(value);
          await handleInbound(value, creds);
        }
      }
    } catch (err) {
      logger.error('WhatsApp webhook processing failed', err);
    }
  },
);
