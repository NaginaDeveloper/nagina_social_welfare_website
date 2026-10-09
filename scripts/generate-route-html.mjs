/**
 * After `ng build` (which prerenders content routes), finalise each public route's
 * head (canonical, Open Graph, Search Console token) and write shells for client-only routes.
 * Also regenerates `public/sitemap.xml` (and the built copy) from seo.config.ts.
 *
 * Run with: node --experimental-strip-types scripts/generate-route-html.mjs
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_OG_IMAGE,
  PUBLIC_SEO_PAGES,
  SITE_ORIGIN,
  pageOgImage,
} from '../src/app/seo/seo.config.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'dist', 'nagina-social-welfare-website', 'browser');
const publicDir = join(root, 'public');

function loadSearchConsoleToken() {
  const configPath = join(root, 'search-console.config.json');
  if (!existsSync(configPath)) {
    return '';
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return String(config.googleSiteVerification ?? '').trim();
  } catch {
    console.warn('SEO shells: could not read search-console.config.json');
    return '';
  }
}

const GOOGLE_SITE_VERIFICATION = loadSearchConsoleToken();

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function canonicalUrl(path) {
  if (!path || path === '/') {
    return `${SITE_ORIGIN}/`;
  }
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${SITE_ORIGIN}${withSlash.startsWith('/') ? withSlash : `/${withSlash}`}`;
}

/** Convert "/about/" → "about", "/" → "" */
function pathToDir(path) {
  if (!path || path === '/') return '';
  return path.replace(/^\/+|\/+$/g, '');
}

function isIndexed(page) {
  const robots = (page.robots ?? '').toLowerCase();
  return !robots.includes('noindex');
}

function patchHtml(html, page) {
  const url = canonicalUrl(page.path);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const robots = page.robots || 'index, follow, max-image-preview:large';
  const image = pageOgImage(page);
  const ogType = page.type === 'article' ? 'article' : 'website';

  let next = html;
  next = injectSearchConsoleMeta(next);
  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}">`,
  );
  next = next.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(robots)}">`,
  );
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${url}">`,
  );
  next = next.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${ogType}">`,
  );
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}">`,
  );
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}">`,
  );
  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${url}">`,
  );
  next = next.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
  );
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}">`,
  );
  next = next.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${description}">`,
  );
  next = next.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
  );
  return next;
}

function injectSearchConsoleMeta(html) {
  if (!GOOGLE_SITE_VERIFICATION) {
    return html;
  }
  if (/name="google-site-verification"/i.test(html)) {
    return html.replace(
      /<meta\s+name="google-site-verification"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="google-site-verification" content="${escapeHtml(GOOGLE_SITE_VERIFICATION)}">`,
    );
  }
  return html.replace(
    '</head>',
    `  <meta name="google-site-verification" content="${escapeHtml(GOOGLE_SITE_VERIFICATION)}">\n</head>`,
  );
}

const STATIC_SITEMAP_PAGES = [
  { path: '/parent-portal-manual/', changefreq: 'monthly', priority: 0.6 },
  { path: '/parent-portal-video/', changefreq: 'monthly', priority: 0.6 },
  { path: '/teacher-portal-manual/', changefreq: 'monthly', priority: 0.6 },
];

function writeSitemap(lastmods = {}) {
  const indexed = PUBLIC_SEO_PAGES.filter(isIndexed);
  const urls = [...indexed, ...STATIC_SITEMAP_PAGES]
    .map((page) => {
      const loc = escapeXml(canonicalUrl(page.path));
      const changefreq = page.changefreq ?? 'monthly';
      const priority = page.priority ?? 0.5;
      const lastmod = lastmods[page.path] ? `\n    <lastmod>${lastmods[page.path]}</lastmod>` : '';
      return `  <url>
    <loc>${loc}</loc>${lastmod}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  const wrap = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  const xml = wrap(urls);

  // The committed copy stays free of dates so builds do not churn it; the deployed copy has them.
  writeFileSync(join(publicDir, 'sitemap.xml'), wrap(urls.replace(/\n    <lastmod>[^<]*<\/lastmod>/g, '')));
  if (existsSync(outDir)) {
    writeFileSync(join(outDir, 'sitemap.xml'), xml);
  }
  console.log(`SEO sitemap: ${indexed.length} indexed URLs`);
}

if (!existsSync(join(outDir, 'index.html'))) {
  console.error('SEO shells: build output not found at', outDir);
  process.exit(1);
}

// Content routes are prerendered by `ng build`; patch their head in place. Client-only
// routes (member/applicant flows) get a shell cloned from the client-side-render page.
const csrPath = join(outDir, 'index.csr.html');
const csrHtml = readFileSync(existsSync(csrPath) ? csrPath : join(outDir, 'index.html'), 'utf8');

const MANIFEST_URL = `${SITE_ORIGIN}/lastmod-manifest.json`;

/** Previously published content hashes, so <lastmod> only moves when a page's text does. */
async function loadPreviousManifest() {
  try {
    const res = await fetch(MANIFEST_URL, { signal: AbortSignal.timeout(8000) });
    if (res.ok) return await res.json();
    console.log(`SEO lastmod: no published manifest yet (HTTP ${res.status}); dating every page today`);
  } catch (err) {
    console.warn(`SEO lastmod: could not fetch ${MANIFEST_URL} (${err.message}); dating every page today`);
  }
  return {};
}

/** Visible text only: bundle names, preload links and hydration markers change every build. */
function contentHash(html) {
  const body = html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html;
  const text = body
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('sha1').update(text).digest('hex').slice(0, 16);
}

function londonToday() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

const previousManifest = await loadPreviousManifest();
const today = londonToday();
const manifest = {};
const lastmods = {};
const missingCards = [];

for (const page of PUBLIC_SEO_PAGES) {
  const dirName = pathToDir(page.path);
  const target = join(outDir, dirName, 'index.html');
  const prerendered = existsSync(target);
  const html = patchHtml(prerendered ? readFileSync(target, 'utf8') : csrHtml, page);
  if (dirName) mkdirSync(join(outDir, dirName), { recursive: true });
  writeFileSync(target, html);
  console.log(`SEO ${prerendered ? 'prerendered' : 'shell'}: /${dirName}`);

  const card = pageOgImage(page);
  if (card.includes('/og/') && !existsSync(join(outDir, 'og', basename(card)))) missingCards.push(card);

  const hash = contentHash(html);
  const before = previousManifest[page.path];
  const lastmod = before && before.hash === hash ? before.lastmod : today;
  manifest[page.path] = { hash, lastmod };
  lastmods[page.path] = lastmod;
}
if (missingCards.length) {
  console.error('SEO: social card image missing from the build:', missingCards.join(', '));
  console.error('Run: node --experimental-strip-types scripts/generate-og-images.mjs');
  process.exit(1);
}
writeFileSync(join(outDir, 'lastmod-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// Old WordPress-era URLs that Google still lists as 404. GitHub Pages cannot send a
// server redirect, so each gets a page that points at the new URL for crawlers and visitors.
const LEGACY_REDIRECTS = {
  '/contact-us/': '/contact/',
  '/privacy-policy/': '/privacy/',
  '/about-us/': '/about/',
};

for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
  const dest = canonicalUrl(to);
  const dir = join(outDir, pathToDir(from));
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'index.html'),
    `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <title>Page moved | Nagina Social Welfare UK</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${dest}">
  <meta http-equiv="refresh" content="0; url=${dest}">
  <script>location.replace(${JSON.stringify(dest)});</script>
</head>
<body><p>This page has moved to <a href="${dest}">${dest}</a>.</p></body>
</html>
`,
  );
  console.log(`SEO redirect: ${from} -> ${to}`);
}

writeSitemap(lastmods);

// SPA fallback for client-side routes / deep links
copyFileSync(existsSync(csrPath) ? csrPath : join(outDir, 'index.html'), join(outDir, '404.html'));
if (GOOGLE_SITE_VERIFICATION) {
  console.log('SEO shells: Google Search Console verification meta injected');
} else {
  console.log(
    'SEO shells: add googleSiteVerification to search-console.config.json for Search Console',
  );
}
console.log('SEO shells: done (including 404.html fallback)');
