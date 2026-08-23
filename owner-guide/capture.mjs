import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'screenshots');
const BASE = 'https://www.naginasocialwelfare.co.uk';

const pages = [
  { id: '01-home', label: 'Home', url: `${BASE}/`, fullPage: false },
  { id: '02-about', label: 'About us', url: `${BASE}/#about`, scrollTo: '#about' },
  { id: '03-work', label: 'Our Work', url: `${BASE}/#work`, scrollTo: '#work' },
  {
    id: '04-spiritual-guide',
    label: 'Spiritual Guide',
    url: `${BASE}/#spiritual-guide`,
    scrollTo: '#spiritual-guide',
  },
  { id: '05-ahle-bait', label: 'Ahle Bait', url: `${BASE}/#ahle-bait`, scrollTo: '#ahle-bait' },
  { id: '06-guidance', label: 'Guidance', url: `${BASE}/#guidance`, scrollTo: '#guidance' },
  { id: '07-namaz', label: 'Namaz Times', url: `${BASE}/namaz` },
  { id: '08-quran', label: 'Quran Majeed', url: `${BASE}/quran` },
  { id: '09-books', label: 'Books', url: `${BASE}/books` },
  { id: '10-sermons', label: 'Sermons', url: `${BASE}/sermons` },
  { id: '11-apps', label: 'Apps', url: `${BASE}/#apps`, scrollTo: '#apps' },
  { id: '12-events', label: 'Events', url: `${BASE}/#events`, scrollTo: '#events' },
  { id: '13-donate', label: 'Donate', url: `${BASE}/#donate`, scrollTo: '#donate' },
  { id: '14-contact', label: 'Contact', url: `${BASE}/#contact`, scrollTo: '#contact' },
  { id: '15-privacy', label: 'Privacy', url: `${BASE}/#privacy`, scrollTo: '#privacy' },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

for (const entry of pages) {
  process.stdout.write(`Capturing ${entry.label}… `);
  await page.goto(entry.url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1200);

  if (entry.scrollTo) {
    const el = page.locator(entry.scrollTo).first();
    if ((await el.count()) > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
    }
  }

  const file = path.join(outDir, `${entry.id}.png`);
  await page.screenshot({
    path: file,
    fullPage: Boolean(entry.fullPage),
  });
  console.log('ok');
}

await browser.close();
console.log(`Done. Saved ${pages.length} screenshots to ${outDir}`);
