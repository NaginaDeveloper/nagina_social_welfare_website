/**
 * Renders a branded 1200x630 social card for every indexed page that has no
 * image of its own, into public/og/<slug>.png, and refreshes OG_CARD_SLUGS in
 * src/app/seo/seo.config.ts. Needs Google Chrome (headless screenshot).
 *
 * Run with: node --experimental-strip-types scripts/generate-og-images.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PUBLIC_SEO_PAGES, ogSlug } from '../src/app/seo/seo.config.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');
const configPath = join(root, 'src', 'app', 'seo', 'seo.config.ts');
const CHROME = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(CHROME)) {
  console.error('Chrome not found. Set CHROME_BIN to a Chrome/Chromium executable.');
  process.exit(1);
}

const fontUrl = (file) => pathToFileURL(join(root, 'public', 'fonts', file)).href;
const LOGOS = { '/peterborough/': 'markaz.png', '/manchester/': 'quran-academy.png' };
const logoFor = (page) => pathToFileURL(join(root, 'public', 'brand', LOGOS[page.path] ?? 'nagina.png')).href;
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function headline(page) {
  if (page.path === '/') return 'Islamic Education & Community Welfare';
  return page.title.split('|')[0].trim();
}

function eyebrow(page) {
  const place = /peterborough/i.test(page.path) ? 'Peterborough' : /manchester/i.test(page.path) ? 'Manchester' : 'United Kingdom';
  return page.path === '/' ? 'Nagina Social Welfare UK' : `Nagina Social Welfare · ${place}`;
}

const html = (page) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Cormorant Garamond';font-weight:700;src:url('${fontUrl('cormorant-garamond-latin-700-normal.woff2')}')}
@font-face{font-family:'DM Sans';font-weight:500;src:url('${fontUrl('dm-sans-latin-500-normal.woff2')}')}
@font-face{font-family:'DM Sans';font-weight:700;src:url('${fontUrl('dm-sans-latin-700-normal.woff2')}')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#022c22;font-family:'DM Sans',sans-serif;color:#fafaf9;position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(900px 600px at 88% 20%,rgba(217,119,6,.28),transparent 60%),radial-gradient(700px 500px at 0% 110%,rgba(16,120,90,.45),transparent 60%)}
.frame{position:absolute;inset:28px;border:2px solid rgba(217,119,6,.55);border-radius:28px}
.wrap{position:absolute;inset:0;padding:84px 96px;display:flex;flex-direction:column;justify-content:space-between}
.eyebrow{font-weight:700;font-size:26px;letter-spacing:.22em;text-transform:uppercase;color:#f59e0b}
h1{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:${headline(page).length > 34 ? 76 : 100}px;line-height:1.02;max-width:680px}
.foot{font-size:26px;font-weight:500;color:rgba(250,250,249,.78)}
.foot b{color:#f59e0b;font-weight:700}
.logo{position:absolute;right:96px;top:50%;transform:translateY(-50%);width:270px;height:270px;border-radius:50%;background:#fff;padding:14px;box-shadow:0 0 0 8px rgba(217,119,6,.5)}
.logo img{width:100%;height:100%;object-fit:contain;border-radius:50%}
</style></head><body><div class="glow"></div><div class="frame"></div>
<div class="wrap"><div class="eyebrow">${esc(eyebrow(page))}</div><h1>${esc(headline(page))}</h1>
<div class="foot">Registered charity <b>1196514</b> &nbsp;·&nbsp; naginasocialwelfare.co.uk</div></div>
<div class="logo"><img src="${logoFor(page)}" alt=""></div></body></html>`;

const pages = PUBLIC_SEO_PAGES.filter(
  (p) => !p.image && !(p.robots ?? '').toLowerCase().includes('noindex'),
);
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const slugs = [];
try {
  for (const page of pages) {
    const slug = ogSlug(page.path);
    const file = join(tmp, `${slug}.html`);
    writeFileSync(file, html(page));
    execFileSync(
      CHROME,
      [
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
        '--window-size=1200,630', '--virtual-time-budget=3000', '--allow-file-access-from-files',
        `--screenshot=${join(outDir, `${slug}.png`)}`, pathToFileURL(file).href,
      ],
      { stdio: 'ignore' },
    );
    slugs.push(slug);
    console.log(`og: ${slug}.png  "${headline(page)}"`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const src = readFileSync(configPath, 'utf8');
const list = `[\n${slugs.map((s) => `  '${s}',`).join('\n')}\n]`;
const next = src.replace(
  /(\/\/ OG_CARD_SLUGS:start\n[^\n]*\n)[\s\S]*?(\/\/ OG_CARD_SLUGS:end)/,
  `$1export const OG_CARD_SLUGS: readonly string[] = ${list};\n$2`,
);
if (next === src && !src.includes(list)) console.warn('OG_CARD_SLUGS markers not found');
writeFileSync(configPath, next);
console.log(`og: ${slugs.length} cards written, OG_CARD_SLUGS updated`);
