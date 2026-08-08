import { createHmac, timingSafeEqual } from 'node:crypto';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';

const sumupWebhookSecret = defineSecret('SUMUP_WEBHOOK_SECRET');

function verifySignature(rawBody: Buffer, signatureHeader: string | undefined, secret: string): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.trim().toLowerCase();

  try {
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(provided, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const sumupWebhook = onRequest(
  {
    region: 'europe-west2',
    secrets: [sumupWebhookSecret],
    cors: false,
    invoker: 'public',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }

    const secret = sumupWebhookSecret.value() || process.env.SUMUP_WEBHOOK_SECRET || '';
    const rawBody: Buffer =
      typeof req.rawBody !== 'undefined'
        ? req.rawBody
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {}));

    const signature = req.get('x-payload-signature') ?? undefined;

    if (!verifySignature(rawBody, signature, secret)) {
      logger.warn('SumUp webhook signature verification failed');
      res.status(401).send('Invalid signature');
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      res.status(400).send('Invalid JSON');
      return;
    }

    logger.info('SumUp webhook received', { payload });

    // Acknowledge promptly; retries stop after HTTP 200.
    res.status(200).json({ received: true });
  },
);
