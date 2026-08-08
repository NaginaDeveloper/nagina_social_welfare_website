/**
 * After `ng build`, write static HTML shells for each public route so crawlers
 * and social previews see unique titles/descriptions (GitHub Pages / SPA-friendly).
 */
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'dist', 'nagina-social-welfare-website', 'browser');

const ORIGIN = 'https://www.naginasocialwelfare.co.uk';
const IMAGE = `${ORIGIN}/brand/nagina.png`;

const pages = [
  {
    dir: '',
    path: '/',
    title: 'Nagina Social Welfare UK | Islamic Education & Community Welfare',
    description:
      'Nagina Social Welfare UK unites faith and compassion — Markaz Deen-e-Islam education, community welfare, Namaz times, Quran Majeed with Kanzul Iman, and Islamic books in Peterborough.',
  },
  {
    dir: 'namaz',
    path: '/namaz',
    title: 'Namaz Times Peterborough | Nagina Social Welfare UK',
    description:
      'Daily Namaz (salah) times for Peterborough, UK with live now and next prayer, plus a Qibla compass — from Nagina Social Welfare.',
  },
  {
    dir: 'quran',
    path: '/quran',
    title: 'Blessed Quran Majeed with Kanzul Iman | Nagina Social Welfare',
    description:
      'Read the Blessed Quran Majeed in Arabic with Kanzul Iman Urdu translation by Aala Hazrat Imam Ahmed Raza Khan, English toggle, and Alafasy recitation.',
  },
  {
    dir: 'books',
    path: '/books',
    title: 'Islamic Books Library | Seedha Rasta | Nagina Social Welfare',
    description:
      'Browse and download Islamic books from the Seedha Rasta library — free PDFs for learning and guidance from Nagina Social Welfare UK.',
  },
  {
    dir: 'sermons',
    path: '/sermons',
    title: 'Sermons by Baba Ji Sarkar | Bayanat | Nagina Social Welfare',
    description:
      'Watch blessed bayanat and sermons by Baba Ji Sarkar from the Seedha Rasta collection — searchable video library via Nagina TV on YouTube.',
  },
  {
    dir: 'khatme-nabuwwat',
    path: '/khatme-nabuwwat',
    title: 'Khatme Nabuwwat | Finality of Prophethood | Nagina Social Welfare',
    description:
      'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — Khatam-un-Nabiyyin — the cornerstone of Islamic faith, with Quran and Hadith on the Seal of the Prophets.',
  },
  {
    dir: 'donate/thanks',
    path: '/donate/thanks',
    title: 'Thank You for Your Donation | Nagina Social Welfare UK',
    description:
      'Thank you for supporting Nagina Social Welfare UK — your gift helps Islamic education and community welfare.',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function patchHtml(html, page) {
  const url = page.path === '/' ? `${ORIGIN}/` : `${ORIGIN}${page.path}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);

  let next = html;
  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}">`,
  );
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${url}">`,
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
    `<meta property="og:image" content="${IMAGE}">`,
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
    `<meta name="twitter:image" content="${IMAGE}">`,
  );
  return next;
}

if (!existsSync(join(outDir, 'index.html'))) {
  console.error('SEO shells: build output not found at', outDir);
  process.exit(1);
}

const baseHtml = readFileSync(join(outDir, 'index.html'), 'utf8');

for (const page of pages) {
  const html = patchHtml(baseHtml, page);
  if (!page.dir) {
    writeFileSync(join(outDir, 'index.html'), html);
    continue;
  }
  const dir = join(outDir, page.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`SEO shell: /${page.dir}/`);
}

// SPA fallback for client-side routes / deep links
copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
console.log('SEO shells: done (including 404.html fallback)');
