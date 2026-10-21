# Website Blog and Terms & Conditions (NTM-0222)

Two additions for the Google AdSense application: a **Blog** at `/blog/` (articles written in the admin
panel) and a **Terms & Conditions** page at `/terms-and-conditions/` (linked in the footer).

## How the blog works

| Piece | Location |
|-------|----------|
| Admin UI | Admin app → **Website Blog** (all-madrasa admins only), Flutter `WebsiteBlogScreen` |
| Admin API | Cloud Function `websiteBlogApi` (`europe-west2`) in the Admin repo, `functions/src/websiteBlog/` |
| Storage | Firestore `website_blog_posts`; featured images under `website_blog/{id}/…` |
| Public catalog | Storage object `blog/catalog.json` (published articles only, newest first) |
| Public site | Angular `BlogService`, pages `/blog/` and `/blog/:slug/` |

Same pattern as Website Events ([website-events.md](website-events.md)).

### Writing and publishing

1. Admin → Website Blog → **Add article**: title, web address (slug, filled from the title), topic, author,
   publish date, a short summary, the article, one featured image and its description (alt text).
2. **Save draft** keeps it private. **Publish** needs a summary, an image with alt text and at least 250 words.
3. Publishing writes `blog/catalog.json`. The website reads it in the browser, so a new article appears on
   `/blog/` straight away and opens at `/blog/<slug>/` (its title, description and schema are set from the article).
4. For Google, each article is **prerendered at the next website release**: `npm run deploy` reads the live catalog
   at build time, renders one static page per article and adds it to `sitemap.xml`. Until that release the article
   still works for visitors; run a release soon after publishing.

### Build details

- `app.routes.server.ts` prerenders `blog/:slug` for every published slug (`getPrerenderParams`, read from the live
  catalog). If the catalog cannot be read at build time, articles are simply not prerendered (a warning is logged).
- `seo/blog-article-seo.resolver.ts` sets each article's own title, description, canonical, Open Graph article tags and
  `Article` schema in the route itself, so the head is right on first paint and after hydration.
- `scripts/generate-route-html.mjs` adds each published article to the sitemap.
- The catalog request opts out of Angular's HTTP transfer cache so the browser always refreshes the list.

## Terms & Conditions

`components/terms/terms.ts` holds the text (a draft written for review); `config/terms.config.ts` has the
"last updated" date shown at the top. Update the date whenever the wording changes.

## Things to know

- The privacy notice says the site uses no advertising cookies. If AdSense is approved and ads are shown, update
  `components/privacy/privacy.ts` (and `PRIVACY_NOTICE_VERSION` together with the Admin functions) and add a cookie notice.
- Draft articles for review are in `docs/blog-drafts/`.
