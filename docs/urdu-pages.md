# Urdu pages (`/ur/…`)

Why: the Urdu toggle on its own is client-side and invisible to Google, so nobody
searching in Urdu script could find the site. Pages with a good Urdu translation now
also exist at their own address, `/ur/<page>/`, prerendered in Urdu.

## How it works

- `src/app/i18n/urdu-routes.ts` lists the English paths that have an Urdu twin
  (`URDU_PAGE_PATHS`) and the helpers that map `/about/` to `/ur/about/` and back.
- `app.routes.ts` generates the `/ur/…` route entries from the same list. They exist
  so the build discovers and prerenders them; at run time `TrailingSlashUrlSerializer`
  maps `/ur/about/` onto the normal `about` route, and the language follows the address
  (`LanguageService.followNavigation`). While Urdu is active, links to pages with a twin
  are written as `/ur/…`, so Urdu pages link to Urdu pages.
- The toggle in the header moves the address bar between `/x/` and `/ur/x/`.
  A returning visitor who chose Urdu is moved to the twin of any English page that has one.
- `src/app/seo/seo-ur.ts` has the Urdu title and description of each twin.
  `SeoService` uses them, sets the canonical to `/ur/…`, adds the hreflang pair
  (`en-GB`, `ur`, `x-default`) and `og:locale ur_PK`. English pages carry the same pair.
- `scripts/generate-route-html.mjs` fails the build if an Urdu twin is missing, is not
  `<html lang="ur" dir="rtl">`, or lacks its canonical or hreflang, and writes both
  versions into `sitemap.xml` with `xhtml:link` alternates.

## Adding a page

1. Make sure the page's text is translated in `translations.ur.ts` (and any
   `i18n.pick(en, ur)` strings in its templates).
2. Add its English path to `URDU_PAGE_PATHS` and an entry to `URDU_SEO`
   (title up to 60 characters, description 70 to 160, both in Urdu).
3. `npm run build`, then check `dist/.../ur/<page>/index.html`: roughly 55% or more of the
   visible letters should be Urdu. Do not list a page that is mostly English.

`/peterborough/` and `/manchester/` are not listed yet: their long centre text is English
only (about 20% Urdu). Translate that text, then add them.

## Review

The Urdu titles and descriptions were drafted by Claude and should be read by a fluent
Urdu speaker before relying on them for search snippets.
