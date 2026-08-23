import { randomUUID } from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { applyCors } from './cors';
import { donationDescription, parseDonationAmount, parseDonationFund } from './amount';
import { allowFirestoreRateLimit, allowMemoryRateLimit, clientIp } from './rateLimit';
import { setSecurityHeaders } from './security';

const sumupApiKey = defineSecret('SUMUP_API_KEY');
const sumupMerchantCode = defineSecret('SUMUP_MERCHANT_CODE');

const SITE_ORIGIN =
  process.env.SITE_ORIGIN?.replace(/\/$/, '') || 'https://www.naginasocialwelfare.co.uk';

/** Per IP: 5 checkout starts / 15 minutes (memory + Firestore). */
const DONATION_RATE_MAX = 5;
const DONATION_RATE_WINDOW_MS = 15 * 60 * 1000;

interface SumUpCheckoutResponse {
  id?: string;
  hosted_checkout_url?: string;
  status?: string;
  message?: string;
  error_code?: string;
  error_message?: string;
}

function ensureAdmin(): void {
  if (getApps().length === 0) {
    initializeApp();
  }
}

export const createDonationCheckout = onRequest(
  {
    region: 'europe-west2',
    secrets: [sumupApiKey, sumupMerchantCode],
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
    if (!allowMemoryRateLimit(`donation:${ip}`, DONATION_RATE_MAX, DONATION_RATE_WINDOW_MS)) {
      res.status(429).json({
        error: 'Too many donation attempts from this network. Please wait and try again.',
      });
      return;
    }

    ensureAdmin();
    const allowed = await allowFirestoreRateLimit({
      scope: 'donation_checkout',
      ip,
      max: DONATION_RATE_MAX,
      windowMs: DONATION_RATE_WINDOW_MS,
    });
    if (!allowed) {
      res.status(429).json({
        error: 'Too many donation attempts from this network. Please wait and try again.',
      });
      return;
    }

    const parsed = parseDonationAmount(req.body?.amount);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const fund = parseDonationFund(req.body?.fund);

    const apiKey = sumupApiKey.value() || process.env.SUMUP_API_KEY || '';
    const merchantCode = sumupMerchantCode.value() || process.env.SUMUP_MERCHANT_CODE || '';

    if (!apiKey || !merchantCode) {
      logger.error('Missing SumUp secrets (SUMUP_API_KEY / SUMUP_MERCHANT_CODE)');
      res.status(500).json({ error: 'Payment service is not configured.' });
      return;
    }

    const checkoutReference = `donation-${randomUUID()}`;
    const redirectUrl = `${SITE_ORIGIN}/donate/thanks`;

    try {
      const sumupRes = await fetch('https://api.sumup.com/v0.1/checkouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parsed.amount,
          currency: 'GBP',
          checkout_reference: checkoutReference,
          description: donationDescription(fund),
          merchant_code: merchantCode,
          redirect_url: redirectUrl,
          hosted_checkout: { enabled: true },
        }),
      });

      const data = (await sumupRes.json()) as SumUpCheckoutResponse;

      if (!sumupRes.ok || !data.id || !data.hosted_checkout_url) {
        logger.error('SumUp checkout create failed', {
          status: sumupRes.status,
          body: data,
        });
        res.status(502).json({
          error:
            data.error_message ||
            data.message ||
            'Could not start payment. Please try again or use bank transfer.',
        });
        return;
      }

      res.status(200).json({
        checkoutId: data.id,
        checkoutReference,
        hostedCheckoutUrl: data.hosted_checkout_url,
      });
    } catch (err) {
      logger.error('SumUp checkout request error', err);
      res.status(502).json({
        error: 'Could not reach payment provider. Please try again later.',
      });
    }
  },
);
