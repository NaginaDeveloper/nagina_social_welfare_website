/**
 * After `ng build`, write static HTML shells for each public route so crawlers
 * and social previews see unique titles/descriptions (GitHub Pages / SPA-friendly).
 * Also regenerates `public/sitemap.xml` (and the built copy) from seo.config.ts.
 *
 * Run with: node --experimental-strip-types scripts/generate-route-html.mjs
 */
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_OG_IMAGE,
  PUBLIC_SEO_PAGES,
  SITE_ORIGIN,
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
  const image = page.image || DEFAULT_OG_IMAGE;
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

function writeSitemap() {
  const indexed = PUBLIC_SEO_PAGES.filter(isIndexed);
  const urls = indexed
    .map((page) => {
      const loc = escapeXml(canonicalUrl(page.path));
      const changefreq = page.changefreq ?? 'monthly';
      const priority = page.priority ?? 0.5;
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  writeFileSync(join(publicDir, 'sitemap.xml'), xml);
  if (existsSync(outDir)) {
    writeFileSync(join(outDir, 'sitemap.xml'), xml);
  }
  console.log(`SEO sitemap: ${indexed.length} indexed URLs`);
}

if (!existsSync(join(outDir, 'index.html'))) {
  console.error('SEO shells: build output not found at', outDir);
  process.exit(1);
}

const baseHtml = readFileSync(join(outDir, 'index.html'), 'utf8');

for (const page of PUBLIC_SEO_PAGES) {
  const html = patchHtml(baseHtml, page);
  const dirName = pathToDir(page.path);
  if (!dirName) {
    writeFileSync(join(outDir, 'index.html'), html);
    continue;
  }
  const dir = join(outDir, dirName);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`SEO shell: /${dirName}/`);
}

writeSitemap();

// SPA fallback for client-side routes / deep links
copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
if (GOOGLE_SITE_VERIFICATION) {
  console.log('SEO shells: Google Search Console verification meta injected');
} else {
  console.log(
    'SEO shells: add googleSiteVerification to search-console.config.json for Search Console',
  );
}
console.log('SEO shells: done (including 404.html fallback)');
