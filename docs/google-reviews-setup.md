# Google reviews on the centre pages

The Peterborough page shows its Google rating and Google's most relevant written reviews. The
site calls a Firebase function, `googleReviews`, which asks the Google Places API (New) and
returns a small JSON payload. New reviews appear without a website release.

Until the function is deployed with a key, the site shows nothing in that section (only the
"Leave a Google review" button), so the page is never broken.

## One-time setup (owner)

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

## How it behaves

- Shows the live rating and review count (all reviews count towards these) and up to five
  written reviews. **Google's API returns at most five reviews, chosen by Google as "most
  relevant"; it cannot return all of them or sort by newest.** "Read all reviews on Google"
  opens the full list.
- Google's terms do not allow storing Places content, so nothing is saved: the function keeps
  a 30-minute in-memory copy and the CDN caches the response for an hour.
- Reviews are shown as posted, with the author linked to their Google profile and a
  "shown as posted on Google" note. Reviews with a rating but no text are not listed.
- No review or rating structured data is added to the page (Google disallows self-published
  review markup).

## Adding Manchester later

When Quran Academy Manchester has a Business Profile: add its review link and place id to
`GOOGLE_PROFILES` in `src/app/config/centre-pages.config.ts`, and its `cid` and search text to
`CAMPUS_PLACES` in `functions/src/googleReviewsCore.ts`, then redeploy the function.
