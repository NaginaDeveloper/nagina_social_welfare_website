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

const pages = [
  {
    dir: '',
    path: '/',
    title: 'Nagina Social Welfare UK | Islamic Education & Community Welfare',
    description:
      'Nagina Social Welfare UK unites faith and compassion — Markaz Deen-e-Islam education, community welfare, Namaz times, Quran Majeed with Kanzul Iman, and Islamic books in Peterborough. Registered charity 1196514.',
  },
  {
    dir: 'about',
    path: '/about/',
    title: 'About Us | Nagina Social Welfare UK',
    description:
      'Learn about Nagina Social Welfare UK — building a legacy of knowledge and compassion through Markaz Deen-e-Islam and community welfare.',
  },
  {
    dir: 'work',
    path: '/work/',
    title: 'Our Work | Markaz Deen-e-Islam & Welfare | Nagina Social Welfare',
    description:
      'One mission carried by two dedicated arms — Islamic education at Markaz Deen-e-Islam and community welfare across the UK.',
  },
  {
    dir: 'madrasa',
    path: '/madrasa/',
    title: 'Madrasa & Islamic Institute Peterborough | Markaz Deen-e-Islam',
    description:
      'Markaz Deen-e-Islam is a madrasa and Islamic institute in Peterborough offering Quran classes and Islamic education for children — apply online. 103 Burmer Road, PE1 3HT.',
  },
  {
    dir: 'apply',
    path: '/apply/',
    title: 'Online Admission | Markaz Deen-e-Islam | Nagina Social Welfare',
    description:
      'Apply online for Markaz Deen-e-Islam madrasa admission in Peterborough — student details, parent contacts, medical information, class preference and parent declaration.',
  },
  {
    dir: 'spiritual-guide',
    path: '/spiritual-guide/',
    title: 'Spiritual Guide | Munir-e-Islam | Nagina Social Welfare',
    description:
      'Honouring Allama Munir Ahmed Yusufi — Munir-e-Islam — spiritual guide of Markaz Deen-e-Islam and Nagina Social Welfare.',
  },
  {
    dir: 'khatme-nabuwwat',
    path: '/khatme-nabuwwat/',
    title: 'Khatme Nabuwwat | Finality of Prophethood | Nagina Social Welfare',
    description:
      'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — Khatam-un-Nabiyyin — the cornerstone of Islamic faith, with Quran and Hadith on the Seal of the Prophets.',
  },
  {
    dir: 'ahle-bait',
    path: '/ahle-bait/',
    title: 'Ahle Bait | Elevated Status of Ahl al-Bayt | Nagina Social Welfare',
    description:
      'The elevated status of Ahl al-Bayt in the Quran and Sunnah — a Sunni perspective on love, honour and reverence for the Blessed Household of the Prophet ﷺ.',
  },
  {
    dir: 'sahaba-ikram',
    path: '/sahaba-ikram/',
    title: 'Sahaba Ikram | Belief Regarding the Companions | Nagina Social Welfare',
    description:
      'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Sahabah — upright Companions of the Prophet ﷺ, loved and respected as an integral part of Islamic faith.',
  },
  {
    dir: 'aulia-karam',
    path: '/aulia-karam/',
    title: 'Aulia Karam | Belief Regarding the Awliya Allah | Nagina Social Welfare',
    description:
      'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Awliya Allah — friends of Allah honoured through faith and taqwa, with Surah Yunus 10:62 and authentic Hadith on Aulia Karam.',
  },
  {
    dir: 'basic-beliefs',
    path: '/basic-beliefs/',
    title: 'Basic Beliefs | Hanafi Barelvi Ahl al-Sunnah FAQ | Nagina Social Welfare',
    description:
      'Frequently asked questions on the basic aqeedah of Hanafi Barelvi Ahl al-Sunnah wa’l-Jama’ah — Tawhid, Khatme Nabuwwat, love for the Prophet ﷺ, Ahle Bait, Sahaba, and Awliya.',
  },
  {
    dir: 'guidance',
    path: '/guidance/',
    title: 'Guidance | Teachings & Counsel | Nagina Social Welfare',
    description:
      'Timeless teachings that guide character, knowledge and charity — counsel from Munir-e-Islam for preachers, students and supporters.',
  },
  {
    dir: 'namaz',
    path: '/namaz/',
    title: 'Namaz Times Peterborough | Nagina Social Welfare UK',
    description:
      'Daily Namaz (salah) times for Peterborough, UK with live now and next prayer windows and a Qibla compass. These are personal begin and end times, not Jamaat.',
  },
  {
    dir: 'quran',
    path: '/quran/',
    title: 'Blessed Quran Majeed with Kanzul Iman | Nagina Social Welfare',
    description:
      'Read the Blessed Quran Majeed in Arabic with Kanzul Iman Urdu translation by Aala Hazrat Imam Ahmed Raza Khan, English toggle, and Alafasy recitation.',
  },
  {
    dir: 'books',
    path: '/books/',
    title: 'Islamic Books Library | Seedha Rasta | Nagina Social Welfare',
    description:
      'Browse and download Islamic books from the Seedha Rasta library — free PDFs for learning and guidance from Nagina Social Welfare UK.',
  },
  {
    dir: 'sermons',
    path: '/sermons/',
    title: 'Sermons by Baba Ji Sarkar | Bayanat | Nagina Social Welfare',
    description:
      'Watch blessed bayanat and sermons by Baba Ji Sarkar from the Seedha Rasta collection — searchable video library via Nagina TV on YouTube.',
  },
  {
    dir: 'apps',
    path: '/apps/',
    title: 'Mobile Apps | Nagina Social Welfare',
    description:
      'Purpose-built mobile apps for parents, teachers, administrators and collectors — available on the Google Play Store.',
  },
  {
    dir: 'events',
    path: '/events/',
    title: 'Events | Gatherings & Announcements | Nagina Social Welfare',
    description:
      'Programmes at Markaz Deen-e-Islam plus event photos and posters — message us on WhatsApp for the next date.',
  },
  {
    dir: 'donate',
    path: '/donate/',
    title: 'Donate | Support Our Mission | Nagina Social Welfare UK',
    description:
      'Donate Zakat, Sadaqah, Lillah or Fitrana to Nagina Social Welfare UK (charity 1196514) by SumUp, PayPal, NatWest PayIt or bank transfer.',
  },
  {
    dir: 'assistant',
    path: '/assistant/',
    title: 'Nagina Assistant | Islamic Guidance & Site Help',
    description:
      'Ask Nagina Assistant in English or Urdu about creed pages, guidance, books, donations, and site information from Nagina Social Welfare UK.',
  },
  {
    dir: 'donate/thanks',
    path: '/donate/thanks/',
    title: 'Thank You for Your Donation | Nagina Social Welfare UK',
    description:
      'Thank you for supporting Nagina Social Welfare UK — your gift helps Islamic education and community welfare.',
    robots: 'noindex, follow',
  },
  {
    dir: 'contact',
    path: '/contact/',
    title: 'Contact | Nagina Social Welfare UK',
    description:
      'Contact Nagina Social Welfare UK in Peterborough on WhatsApp, phone or email — madrasa enrolment, donations and general enquiries.',
  },
  {
    dir: 'privacy',
    path: '/privacy/',
    title: 'Privacy Notice | Nagina Social Welfare UK',
    description:
      'How Nagina Social Welfare handles information when you use this website, including donations via SumUp.',
  },
  {
    dir: 'safeguarding',
    path: '/safeguarding/',
    title: 'Safeguarding | Nagina Social Welfare UK',
    description:
      'How Nagina Social Welfare and Markaz Deen-e-Islam keep children and adults at risk safe — contact us on WhatsApp or email, or request the full policy.',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function canonicalUrl(path) {
  if (!path || path === '/') {
    return `${ORIGIN}/`;
  }
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${ORIGIN}${withSlash.startsWith('/') ? withSlash : `/${withSlash}`}`;
}

function patchHtml(html, page) {
  const url = canonicalUrl(page.path);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const robots = page.robots || 'index, follow, max-image-preview:large';

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
if (GOOGLE_SITE_VERIFICATION) {
  console.log('SEO shells: Google Search Console verification meta injected');
} else {
  console.log(
    'SEO shells: add googleSiteVerification to search-console.config.json for Search Console',
  );
}
console.log('SEO shells: done (including 404.html fallback)');
