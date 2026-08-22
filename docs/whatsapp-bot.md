# WhatsApp chatbot (Cloud API)

The website WhatsApp buttons already open **07831 684738**. This function adds automated replies on that same WhatsApp Business number (coexistence: staff keep the phone app).

Public webhook URL after deploy:

`https://nagina-donations.web.app/whatsappWebhook`

## 1. What you need from the client (Meta)

Log in as someone who is **admin** of the charity Meta Business Portfolio (often the same Facebook login that manages the Facebook Page). Personal WhatsApp on a staff phone is not enough.

You will collect four values:

| Firebase secret | What it is | Where it comes from |
|-----------------|------------|---------------------|
| `WHATSAPP_VERIFY_TOKEN` | A password **you invent** | Not in Meta. You type the same string into Meta’s webhook form and into Firebase. |
| `WHATSAPP_APP_SECRET` | App secret | Meta App Dashboard → **App settings → Basic → App secret → Show** |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta’s ID for the sending number (not `07831 684738` itself) | WhatsApp → **API Setup**, next to the phone number |
| `WHATSAPP_ACCESS_TOKEN` | Bearer token for sending messages | **System user** token (permanent). The “Generate access token” button on API Setup expires in about 24 hours — do not use that in production. |

### A. Create the Meta app (once)

1. Open [Meta App Dashboard](https://developers.facebook.com/apps/) and sign in.
2. **Create App** → name it e.g. `Nagina WhatsApp` → use case **Connect with customers through WhatsApp**.
3. Attach the charity **business portfolio** (create one if Meta asks: Nagina Social Welfare UK).
4. After create, open **Start using the API** / **API Setup**.

### B. Phone number ID (test first, live number later)

On **API Setup** Meta gives you a **test** WhatsApp number. Copy **Phone number ID** from that panel (a long number, e.g. `7794189252778687`). You can finish code/deploy with this test ID.

To use the live charity number **07831 684738** without losing the WhatsApp Business phone app:

1. Phone app must be **WhatsApp Business** (not personal WhatsApp), version **2.24.17+**.
2. In API Setup / Embedded Signup choose **connect an existing WhatsApp Business app account** (coexistence). Do **not** “migrate” the number off the phone.
3. Complete the SMS/QR checks Meta shows on that phone.
4. Copy the **Phone number ID** for `+44 7831 684738` (it will differ from the test ID). Use this as `WHATSAPP_PHONE_NUMBER_ID`.

If Meta says the number is already registered, you are in the right place — use coexistence, do not add it as a brand-new Cloud API number.

### C. App secret

1. Left sidebar → **App settings** → **Basic**.
2. **App secret** → **Show** (Facebook password).
3. Copy into `WHATSAPP_APP_SECRET`. Never commit it.

### D. Permanent access token (system user)

The green **Generate access token** on API Setup is only for a quick test.

1. Open [Business settings → System users](https://business.facebook.com/settings/system-users).
2. **Add** a system user (name e.g. `Nagina WhatsApp Bot`, role **Admin**).
3. **Assign assets**: this Meta app (**Manage app**) and the WhatsApp Business account (**Manage WhatsApp Business accounts**).
4. **Generate token** with:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - `business_management`
5. Copy once into `WHATSAPP_ACCESS_TOKEN`. If you lose it, generate a new one.

### E. Verify token (you invent this)

Pick a long random string, e.g. from a password manager. Same value goes into:

1. Meta: WhatsApp → **Configuration** (or API Setup) → **Webhook** → Verify token  
2. Firebase: `WHATSAPP_VERIFY_TOKEN`

Callback URL (after deploy): `https://nagina-donations.web.app/whatsappWebhook`  
Subscribe to the **messages** field.

Display name and business verification, if Meta still asks, are done in Meta Business Suite. You can develop against the test number until the live number is connected.

## 2. Store secrets (do not commit)

```bash
npx -y firebase-tools@latest use nagina-social-welfare-uk
npx -y firebase-tools@latest functions:secrets:set WHATSAPP_VERIFY_TOKEN
npx -y firebase-tools@latest functions:secrets:set WHATSAPP_APP_SECRET
npx -y firebase-tools@latest functions:secrets:set WHATSAPP_ACCESS_TOKEN
npx -y firebase-tools@latest functions:secrets:set WHATSAPP_PHONE_NUMBER_ID
```

`GEMINI_API_KEY` must already be available to functions in this codebase (same as Nagina Assistant).

Local emulator: put the same names in gitignored `functions/.secret.local`.

## 3. Deploy

```bash
npx -y firebase-tools@latest deploy --only functions:whatsappWebhook,hosting:nagina-donations --project nagina-social-welfare-uk
```

If Cloud Run returns 403 (domain restricted sharing), allow public invokers on `whatsappwebhook` the same way as `sumupwebhook` — see [sumup-sandbox.md](sumup-sandbox.md).

## 4. Point Meta at the webhook

In the WhatsApp product → Configuration → Webhook:

- Callback URL: `https://nagina-donations.web.app/whatsappWebhook`
- Verify token: same as `WHATSAPP_VERIFY_TOKEN`
- Subscribe to **messages**

## 5. Refresh assistant knowledge (About + apply + donate)

```bash
node scripts/ingest-assistant-knowledge.mjs
```

Needs `ASSISTANT_SYNC_TOKEN`. Do this after deploy so free-text questions match the new FAQs.

## 6. Live test

From a personal phone, message 07831 684738:

1. `hello` — topic list (About, Apply, Donations, Ask)
2. Each list item — approved script
3. A free-text question — Nagina Assistant
4. `STAFF` — bot pauses; reply from the WhatsApp Business app
5. Website **Open in WhatsApp** contact form — should map enrolment/donation reasons

## Behaviour

| User says | Bot |
|-----------|-----|
| Hi / salam / empty | Topic menu |
| About / contact | Charity 1196514, email, phone, address |
| Apply / admission | Link to `/apply/` only — no child data in chat |
| Donate | `/donate/` plus bank / SumUp / PayPal / PayIt |
| STAFF / speak to a person | Pauses 8 hours (staff app continues) |
| Safeguarding language | Emergency contacts; pauses 24 hours |

Staff messages from the Business app also pause the bot for that chat so visitors are not double-replied.
