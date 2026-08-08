# SumUp sandbox keys (donations)

Use a **sandbox merchant account** so you can test Hosted Checkout without real money. Never put API keys in the Angular app or commit them to git.

## 1. Create a sandbox merchant

1. Sign in at [SumUp Dashboard](https://me.sumup.com/), or [sign up as a developer](https://me.sumup.com/signup?signup_intent=developer).
2. Open [Developer Settings → Sandboxes](https://me.sumup.com/settings/developer?tab=sandboxes).
3. Create a sandbox merchant account if you do not have one.
4. Switch into that sandbox account (different merchant ID; sandbox warning shown).

## 2. API key and merchant code

1. Create an API key: [API keys](https://me.sumup.com/settings/api-keys) → Create → copy once (e.g. `sup_sk_...`).
2. Copy **merchant code** from [Account settings](https://me.sumup.com/settings).

## 3. Configure Firebase secrets (deployed)

Firebase CLI must be logged in (`npx -y firebase-tools@latest login --reauth`).

```bash
npx -y firebase-tools@latest use nagina-social-welfare-uk
npx -y firebase-tools@latest functions:secrets:set SUMUP_API_KEY
npx -y firebase-tools@latest functions:secrets:set SUMUP_MERCHANT_CODE
npx -y firebase-tools@latest functions:secrets:set SUMUP_WEBHOOK_SECRET
npx -y firebase-tools@latest deploy --only functions,hosting
```

Local emulator / local Node: use gitignored `functions/.secret.local` (never commit). Keep non-secret config in `functions/.env` (see `.env.example`).

### Public access (required)

This Google Cloud org enforces **Domain restricted sharing**, which blocks `allUsers` as Cloud Run Invoker. Until that is relaxed, browsers get **403 Forbidden** on:

- `https://nagina-social-welfare-uk.web.app/createDonationCheckout`
- `https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/createDonationCheckout`

An Organisation Policy Admin should temporarily allow public invokers:

1. Open [Org policies](https://console.cloud.google.com/iam-admin/orgpolicies/iam-allowedPolicyMemberDomains?project=nagina-social-welfare-uk) for project `nagina-social-welfare-uk` (or the parent org).
2. Edit **Domain restricted sharing** → **Allow all** (project override), Save.
3. In [Cloud Run](https://console.cloud.google.com/run?project=nagina-social-welfare-uk), open `createdonationcheckout` and `sumupwebhook` → **Permissions** → add principal `allUsers` with role **Cloud Run Invoker**.
4. Optionally restore Domain restricted sharing afterward (existing `allUsers` bindings usually remain).
5. Smoke-test: `curl -X POST https://nagina-social-welfare-uk.web.app/createDonationCheckout -H 'Content-Type: application/json' -d '{"amount":10}'` should return JSON with `hostedCheckoutUrl`.

## 4. Sandbox testing tips

- Amount **11** (any currency) is designed to fail.
- Use SumUp [test cards](https://developer.sumup.com/online-payments/testing) with any future expiry (e.g. `12/30`) and any 3-digit CVV (e.g. `123`).
- After payment, SumUp may redirect to `/donate/thanks` (UX only). Confirm status via API retrieve or the `sumupWebhook` function.

## 5. Go live

1. Switch to your real UK merchant account in the SumUp Dashboard.
2. Create a **live** API key and note the live merchant code.
3. Update the same Firebase secrets and redeploy Functions.
4. Confirm merchant currency is **GBP**.
