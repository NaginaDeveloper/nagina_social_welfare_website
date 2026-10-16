# Google reviews on the centre pages

The Peterborough page shows its Google rating and written reviews. The site calls a Firebase
function, `googleReviews`, which returns a small JSON payload, so new reviews appear without a
website release. The function uses two Google APIs:

- **Business Profile API** (preferred): every review, newest first, with the centre's replies.
  Project `nagina-social-welfare-uk` (number 1049510950065) was approved for it on
  16 Oct 2026 (case 6-1895000042089, 300 queries a minute). It signs in as a manager of the
  profile, so it needs the one-time OAuth setup below.
- **Places API (New)** (fallback): Google's five "most relevant" reviews. Used when the OAuth
  secret is missing or the Business Profile call fails, so the section never goes blank.

Until the function is deployed with a key, the site shows nothing in that section (only the
"Leave a Google review" button), so the page is never broken.

## Places API setup (owner, done)

1. **Billing + API key.** In Google Cloud console, project `nagina-social-welfare-uk`:
   enable **Places API (New)**, then APIs & Services > Credentials > Create credentials >
   API key. Under *API restrictions* choose **Places API (New)** only. Billing must be on
   (the project already runs Cloud Functions). Cost at this traffic is inside Google's free
   monthly allowance; the response is cached for about an hour.
2. **Store the key as a secret** (paste it when prompted; never commit it):

   ```bash
   firebase functions:secrets:set GOOGLE_PLACES_API_KEY
   ```

3. **Deploy** the function and the hosting rewrite:

   ```bash
   firebase deploy --only functions:donations:googleReviews,hosting
   ```

4. Check `https://nagina-donations.web.app/googleReviews?campus=peterborough` returns
   `rating`, `count` and `reviews`, then reload `/peterborough/`.

## Business Profile API setup (owner, one time)

Do these in order: the function deploy fails until the secret in step 4 exists.

1. **Enable the APIs.** Google Cloud console, project `nagina-social-welfare-uk`, APIs & Services
   > Library. Enable all three (they appear only for approved projects):
   - My Business Account Management API
   - My Business Business Information API
   - Google My Business API (the v4 API that serves reviews)
2. **OAuth consent screen.** APIs & Services > OAuth consent screen (Google Auth Platform):
   User type *External*, app name "Nagina Social Welfare website", support email
   info@naginasocialwelfare.co.uk. Add the scope `https://www.googleapis.com/auth/business.manage`.
   Then **Publish app** (set it to *In production*). While it is in *Testing*, Google expires the
   refresh token after 7 days and the reviews quietly fall back to the Places API. An unverified
   app is fine here: only we sign in, and Google shows a "not verified" warning you can continue past.
3. **OAuth client.** APIs & Services > Credentials > Create credentials > OAuth client ID >
   *Desktop app*, name "googleReviews function". Download the JSON. Keep it private; never commit it.
4. **Sign in and save the secret.** Sign in to the Firebase CLI first (`firebase login --reauth`),
   then run this and sign in with a Google account that is an **owner or manager of the
   Peterborough Business Profile**. It lists the profiles that account manages, then saves
   `GOOGLE_BUSINESS_PROFILE_OAUTH` (client id, client secret, refresh token) as a Firebase secret:

   ```bash
   node scripts/google-business-profile-token.mjs --client ~/Downloads/client_secret_XXX.json
   ```

   Delete the downloaded client JSON afterwards.
5. **Deploy** the function:

   ```bash
   firebase deploy --only functions:donations:googleReviews
   ```

6. Check `https://nagina-donations.web.app/googleReviews?campus=peterborough` returns
   `"source":"business-profile"` and all the reviews, then reload `/peterborough/`.

If the response says `"source":"places"`, the function fell back: check the function log
(`firebase functions:log --only googleReviews`) for the Business Profile error. If the profile
manager leaves or the password changes, run step 4 again and redeploy.

## How it behaves

- Shows the live rating and review count. With the Business Profile API it lists every written
  review (up to 100), newest first, six at a time behind "Show all N reviews", with the
  centre's reply under a review. With the Places fallback it shows Google's five "most
  relevant". "Read all reviews on Google" opens the full list on Maps.
- Dates are formatted in the page language from each review's publish time.
- Nothing is saved: the function keeps a 30-minute in-memory copy and the CDN caches the
  response for an hour (Google's Places terms do not allow storing its content).
- Google's API policies: do not announce or imply a partnership with, or endorsement by,
  Google because we use the Business Profile API.
- Reviews are shown as posted (Google's machine translation is removed), with a "shown as
  posted on Google" note. The author links to their Google profile only on the Places fallback;
  the Business Profile API does not give that link. Anonymous reviewers show as "Google user". Reviews with a rating but no text are not listed.
- No review or rating structured data is added to the page (Google disallows self-published
  review markup).

## Adding Manchester later

When Quran Academy Manchester has a Business Profile: add its review link and place id to
`GOOGLE_PROFILES` in `src/app/config/centre-pages.config.ts`, and its `cid` and search text to
`CAMPUS_PLACES` in `functions/src/googleReviewsCore.ts`, then redeploy the function. The
Business Profile path finds the location by that `cid`, so if the same Google account manages
both profiles nothing else is needed.
