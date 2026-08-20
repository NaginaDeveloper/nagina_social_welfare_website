# Google Search Console setup

Use this to see how **www.naginasocialwelfare.co.uk** appears in Google Search (queries, impressions, clicks, indexed pages). This is **not** full on-site visitor analytics — it only covers Google search traffic.

## 1. Create the property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Sign in with the Google account that should manage the site (e.g. **info@naginasocialwelfare.co.uk**).
3. Click **Add property**.
4. Choose **URL prefix** and enter:
   ```
   https://www.naginasocialwelfare.co.uk
   ```
   (Use `www` — that matches the live site and `CNAME`.)

## 2. Verify ownership (HTML meta tag)

1. On the verification screen, choose **HTML tag**.
2. Google shows something like:
   ```html
   <meta name="google-site-verification" content="AbCdEf1234567890" />
   ```
3. Copy **only the `content` value** (the long code inside the quotes).
4. Paste it into [`search-console.config.json`](../search-console.config.json):
   ```json
   {
     "googleSiteVerification": "AbCdEf1234567890"
   }
   ```
5. Build and deploy the site:
   ```bash
   npm run build
   ```
   Then deploy to `gh-pages` as usual.
6. In Search Console, click **Verify**.

The build script injects the meta tag into the live `index.html` and all SEO route shells.

## 3. Submit the sitemap

After verification:

1. In Search Console, open **Sitemaps** (left menu).
2. Enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.

Full URL: `https://www.naginasocialwelfare.co.uk/sitemap.xml`

`robots.txt` already points Google to this sitemap.

## 4. Why pages aren't indexed (and what we can fix)

Search Console’s “Why pages aren’t indexed” report is **not always an error**. Typical rows for this site:

| Reason | Meaning | Action |
|--------|---------|--------|
| **Page with redirect** | GitHub Pages redirects `/about` to `/about/`, and `naginasocialwelfare.co.uk` to `www`. Google indexes the final URL only. | Sitemap and canonical tags now use trailing slashes. Old redirect URLs should drop from this list over time. |
| **Not found (404)** | Old or mistyped URLs Google still remembers. | Leave them. They should not be indexed. |
| **Alternative page with proper canonical** | Duplicate URL that already points to the canonical page. | Working as intended. |
| **Discovered / Crawled – currently not indexed** | Google found the page but chose not to index it yet (new or low-priority). | Use **URL Inspection → Request indexing** on important pages such as `/basic-beliefs/`. This can take days or weeks. |
| **Duplicate without user-selected canonical** | Duplicate with no canonical. | Should stay at 0 with canonical tags in place. |

Do **not** click “Validate fix” on 404s or redirects unless you have removed those URLs from the sitemap. Redirects and 404s are often correct.

Thank-you page `/donate/thanks/` is marked `noindex` so Google should not treat it as a public content page.

## 5. What you can see

After a few days, Search Console shows:

- Which search terms show your site
- How many impressions and clicks you get
- Which pages are indexed
- Crawl or indexing issues

It does **not** show every visitor (direct visits, Facebook links, etc.) — only Google search performance.

## Alternative verification methods

If the HTML tag fails:

- **HTML file upload**: download Google’s file (e.g. `google123.html`) and place it in [`public/`](../public/), then redeploy.
- **DNS TXT record**: add the TXT record at your domain registrar (works for root domain verification).

## Local config file

| File | Purpose |
|------|---------|
| `search-console.config.json` | Your verification code (can stay empty until step 2) |
| `search-console.config.example.json` | Example format |

Do not commit a fake verification code — use the real value from your Search Console property only.
