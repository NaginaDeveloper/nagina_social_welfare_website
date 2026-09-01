import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import { PDFParse } from 'pdf-parse';

const ROOT = process.cwd();
const PROJECT_ID = 'nagina-social-welfare-uk';
const SYNC_URL = 'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/syncAssistantKnowledge';
const PREVIEW_PATH = path.join(ROOT, 'functions', 'src', 'generated', 'assistant-knowledge-preview.json');
const BOOKS_CATALOG_URL = 'https://firebasestorage.googleapis.com/v0/b/nagina-social-welfare-uk.firebasestorage.app/o/books%2Fcatalog.json?alt=media';

function hash(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function inferLanguage(value) {
  if (/[\u0600-\u06FF]/.test(value) && /[A-Za-z]/.test(value)) return 'mixed';
  return /[\u0600-\u06FF]/.test(value) ? 'ur' : 'en';
}

function chunkText(text, maxChars = 1800, overlap = 220) {
  const clean = normalizeText(text);
  if (!clean) return [];
  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(clean.length, start + maxChars);
    if (end < clean.length) {
      const boundary = clean.lastIndexOf('. ', end);
      if (boundary > start + 600) end = boundary + 1;
    }
    const piece = clean.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= clean.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}

function literalToValue(node) {
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalToValue);
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : null;
        if (key) out[key] = literalToValue(prop.initializer);
      }
    }
    return out;
  }
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    return node.operator === ts.SyntaxKind.MinusToken ? -Number(node.operand.text) : Number(node.operand.text);
  }
  return null;
}

async function extractClassProperty(filePath, propertyName) {
  const source = await readFile(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let result = null;
  function visit(node) {
    if (ts.isPropertyDeclaration(node) && node.name && ts.isIdentifier(node.name) && node.name.text === propertyName && node.initializer) {
      result = literalToValue(node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (result == null) {
    throw new Error(`Could not find ${propertyName} in ${filePath}`);
  }
  return result;
}

function makeChunk({
  title,
  sourceType,
  path: routePath,
  text,
  tags = [],
  maslak = sourceType === 'faq' ? 'site' : 'hanafi_barelvi',
  approved = true,
}) {
  const clean = normalizeText(text);
  return {
    id: hash(`${sourceType}:${routePath}:${title}:${clean.slice(0, 140)}`),
    title,
    sourceType,
    path: routePath,
    text: clean,
    language: inferLanguage(clean),
    tags,
    maslak,
    approved,
  };
}

async function buildCuratedChunks() {
  const chunks = [];

  const ahleBaitSections = await extractClassProperty(
    path.join(ROOT, 'src/app/components/ahle-bait/ahle-bait.ts'),
    'sections',
  );
  for (const section of ahleBaitSections) {
    const parts = [section.title, section.lead, section.note]
      .concat((section.details || []))
      .concat((section.definitions || []).flatMap((item) => [item.title, item.text]))
      .concat((section.quotes || []).flatMap((quote) => [quote.label, quote.text, quote.source]))
      .concat(
        (section.subsections || []).flatMap((sub) => [
          sub.title,
          sub.lead,
          sub.note,
          ...((sub.quotes || []).flatMap((quote) => [quote.label, quote.text, quote.source])),
        ]),
      )
      .filter(Boolean);
    chunks.push(
      makeChunk({
        title: `Ahle Bait: ${section.title}`,
        sourceType: 'creed',
        path: '/ahle-bait',
        text: parts.join(' '),
        tags: ['ahle-bait', 'creed'],
      }),
    );
  }

  const sahabaPoints = await extractClassProperty(
    path.join(ROOT, 'src/app/components/sahaba-ikram/sahaba-ikram.ts'),
    'sahabahPoints',
  );
  for (const point of sahabaPoints) {
    chunks.push(
      makeChunk({
        title: `Sahaba Ikram: ${point.title}`,
        sourceType: 'creed',
        path: '/sahaba-ikram',
        text: [point.title, point.lead, ...(point.details || [])].join(' '),
        tags: ['sahaba', 'creed'],
      }),
    );
  }

  const auliaPoints = await extractClassProperty(
    path.join(ROOT, 'src/app/components/aulia-karam/aulia-karam.ts'),
    'auliaPoints',
  );
  for (const point of auliaPoints) {
    chunks.push(
      makeChunk({
        title: `Aulia Karam: ${point.title}`,
        sourceType: 'creed',
        path: '/aulia-karam',
        text: [point.title, point.lead, ...(point.details || [])].join(' '),
        tags: ['aulia', 'awliya', 'creed'],
      }),
    );
  }

  const auliaQuotes = await extractClassProperty(
    path.join(ROOT, 'src/app/components/aulia-karam/aulia-karam.ts'),
    'quotes',
  );
  chunks.push(
    makeChunk({
      title: 'Aulia Karam: Quran and Hadith',
      sourceType: 'creed',
      path: '/aulia-karam',
      text: auliaQuotes.flatMap((quote) => [quote.label, quote.text, quote.source]).join(' '),
      tags: ['aulia', 'awliya', 'creed'],
    }),
  );

  const basicBeliefsIntro = await extractClassProperty(
    path.join(ROOT, 'src/app/components/basic-beliefs/basic-beliefs.ts'),
    'intro',
  );
  const basicBeliefsDisclaimer = await extractClassProperty(
    path.join(ROOT, 'src/app/components/basic-beliefs/basic-beliefs.ts'),
    'disclaimer',
  );
  const basicBeliefsClosing = await extractClassProperty(
    path.join(ROOT, 'src/app/components/basic-beliefs/basic-beliefs.ts'),
    'closing',
  );
  const beliefCategories = await extractClassProperty(
    path.join(ROOT, 'src/app/components/basic-beliefs/basic-beliefs.ts'),
    'beliefCategories',
  );
  chunks.push(
    makeChunk({
      title: 'Basic Beliefs: Hanafi Barelvi Ahl al-Sunnah overview',
      sourceType: 'creed',
      path: '/basic-beliefs',
      text: [basicBeliefsIntro, basicBeliefsDisclaimer, basicBeliefsClosing].join(' '),
      tags: ['aqeedah', 'beliefs', 'hanafi-barelvi', 'creed'],
      maslak: 'hanafi_barelvi',
    }),
  );
  for (const category of beliefCategories) {
    const faqText = (category.faqs || [])
      .flatMap((faq) => [faq.question, faq.answer, faq.relatedLabel].filter(Boolean))
      .join(' ');
    chunks.push(
      makeChunk({
        title: `Basic Beliefs: ${category.title}`,
        sourceType: 'creed',
        path: '/basic-beliefs',
        text: [category.title, category.lead, faqText].filter(Boolean).join(' '),
        tags: ['aqeedah', 'beliefs', 'hanafi-barelvi', 'creed'],
        maslak: 'hanafi_barelvi',
      }),
    );
  }

  const khatmeQuotes = await extractClassProperty(
    path.join(ROOT, 'src/app/components/khatme-nabuwwat/khatme-nabuwwat.ts'),
    'quotes',
  );
  const khatmeReasons = await extractClassProperty(
    path.join(ROOT, 'src/app/components/khatme-nabuwwat/khatme-nabuwwat.ts'),
    'reasons',
  );
  chunks.push(
    makeChunk({
      title: 'Khatme Nabuwwat: Quran and Hadith',
      sourceType: 'creed',
      path: '/khatme-nabuwwat',
      text: khatmeQuotes.flatMap((quote) => [quote.label, quote.text, quote.source]).join(' '),
      tags: ['khatme-nabuwwat', 'creed'],
    }),
  );
  chunks.push(
    makeChunk({
      title: 'Khatme Nabuwwat: Why finality matters',
      sourceType: 'creed',
      path: '/khatme-nabuwwat',
      text: khatmeReasons.flatMap((reason) => [reason.title, reason.text]).join(' '),
      tags: ['khatme-nabuwwat', 'creed'],
    }),
  );

  const guidancePosters = await extractClassProperty(
    path.join(ROOT, 'src/app/components/guidance/guidance.ts'),
    'posters',
  );
  for (const poster of guidancePosters) {
    chunks.push(
      makeChunk({
        title: `Guidance: ${poster.title}`,
        sourceType: 'guidance',
        path: '/guidance',
        text: [poster.title, poster.subtitle, poster.alt].join(' '),
        tags: ['guidance'],
      }),
    );
  }

  const faq = [
    {
      title: 'About Nagina Social Welfare',
      path: '/about',
      text:
        'Nagina Social Welfare UK Limited is a registered charity (1196514) and company (08342937) in England and Wales. We serve UK communities through knowledge and compassion, with two arms: Markaz Deen-e-Islam (Qur’an and Islamic education in Peterborough) and Nagina Social Welfare (community welfare). Our pillars are Faith (Ahl-e-Sunnat), Compassion, and Knowledge. Gift Aid is not currently claimed. More: https://www.naginasocialwelfare.co.uk/about/',
      tags: ['about', 'charity', 'organisation'],
    },
    {
      title: 'Donate methods',
      path: '/donate',
      text:
        'Donations fund Islamic education at Markaz Deen-e-Islam and community welfare. Choose a fund first: Zakat, Sadaqah, Lillah, or Fitrana. Then give by SumUp card checkout (£5 to £25,000), PayPal, NatWest PayIt, or UK bank transfer on https://www.naginasocialwelfare.co.uk/donate/. Bank: NatWest. Account name NAGINA SOCIAL WELFAR. Sort code 54-21-38. Account 29135877. BIC NWBKGB2L. IBAN GB09 NWBK 5421 3829 1358 77. Use the fund name as the payment reference (ZAKAT, SADAQAH, LILLAH, or FITRANA). Registered charity 1196514. Gift Aid is not currently claimed.',
      tags: ['donate', 'payments'],
    },
    {
      title: 'Madrasa admission form',
      path: '/apply',
      text:
        'New madrasa places are applied for only on the website form https://www.naginasocialwelfare.co.uk/apply/ — do not send children’s details by WhatsApp or email. The 2026 intake is Class 3, 18:30–19:30 daily, for ages 10–18. Class 1 (16:30–17:30) and Class 2 (17:30–18:30) are full. The form has four steps: student, parent, medical and emergency, then class preference and declaration. After submit we email from info@naginasocialwelfare.co.uk. Track status at https://www.naginasocialwelfare.co.uk/apply/track/ with the application ID. Fees are £5 every Monday or paid in advance. Uniform (white jooba for boys, black abaya for girls) is provided by the madrasa. WhatsApp is for questions only.',
      tags: ['apply', 'admission', 'madrasa', 'form'],
    },
    {
      title: 'Contact Nagina Social Welfare',
      path: '/contact',
      text: 'Contact Nagina Social Welfare UK by email at info@naginasocialwelfare.co.uk, by phone or WhatsApp on +44 7831 684738 (tel:+447831684738, https://wa.me/447831684738), or visit 103 Burmer Road, Peterborough PE1 3HT (Google Maps: https://www.google.com/maps/search/?api=1&query=103%20Burmer%20Road%2C%20Peterborough%20PE1%203HT). Keep phone digits and the English address in left-to-right order in every language.',
      tags: ['contact'],
    },
    {
      title: 'Prayer times and Qibla',
      path: '/namaz',
      text: 'The site provides daily namaz times for Peterborough, UK and a Qibla compass.',
      tags: ['namaz', 'qibla'],
    },
    {
      title: 'Books library',
      path: '/books',
      text: 'The books page lists Islamic PDFs that can be searched by title and opened for reading or download.',
      tags: ['books'],
    },
    {
      title: 'Sermons',
      path: '/sermons',
      text: 'The sermons page lists bayanat by Baba Ji Sarkar, mainly linking to YouTube videos from Nagina TV.',
      tags: ['sermons'],
    },
    {
      title: 'Assistant scope and disclaimer',
      path: '/assistant',
      text: 'Nagina Assistant gently helps with published Ahl al-Sunnah wa’l-Jama‘ah / Hanafi Barelvi creed pages, guidance, books, donations, and site information in English and Urdu. It is not a mufti and should not be used for binding rulings or personal legal, medical, or marital decisions.',
      tags: ['assistant', 'disclaimer', 'maslak'],
      maslak: 'site',
    },
  ];
  for (const item of faq) {
    chunks.push(
      makeChunk({
        title: item.title,
        sourceType: 'faq',
        path: item.path,
        text: item.text,
        tags: item.tags,
        maslak: item.maslak ?? 'site',
      }),
    );
  }

  return chunks;
}

async function buildBookChunks() {
  const res = await fetch(BOOKS_CATALOG_URL);
  if (!res.ok) throw new Error(`Could not load books catalog: ${res.status}`);
  const catalog = await res.json();
  const books = catalog.books || [];
  const chunks = [];

  for (const book of books) {
    const bookUrl = book.pdfUrl || `https://firebasestorage.googleapis.com/v0/b/nagina-social-welfare-uk.firebasestorage.app/o/books%2Fpdfs%2F${encodeURIComponent(book.slug + '.pdf')}?alt=media`;
    chunks.push(
      makeChunk({
        title: `${book.title} (catalog)` ,
        sourceType: 'book',
        path: '/books',
        text: `${book.title}. Language: ${book.language}. Available on the books page as a downloadable PDF.`,
        tags: ['book', book.slug, book.language.toLowerCase()],
      }),
    );

    try {
      const pdfRes = await fetch(bookUrl);
      if (!pdfRes.ok) {
        console.warn('Skipping PDF', book.slug, pdfRes.status);
        continue;
      }
      const buffer = Buffer.from(await pdfRes.arrayBuffer());
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      const text = normalizeText(parsed.text || '');
      if (!text) continue;
      const pieces = chunkText(text);
      pieces.forEach((piece, index) => {
        chunks.push(
          makeChunk({
            title: `${book.title} — extract ${index + 1}`,
            sourceType: 'book',
            path: '/books',
            text: piece,
            tags: ['book', book.slug, book.language.toLowerCase()],
          }),
        );
      });
      await parser.destroy();
    } catch (error) {
      console.warn('Skipping PDF after parse error', book.slug, error instanceof Error ? error.message : error);
    }
  }

  return chunks;
}

function readSecret(name) {
  const raw = execFileSync(
    'npx',
    ['-y', 'firebase-tools@latest', 'functions:secrets:access', name, '--project', PROJECT_ID],
    { cwd: ROOT, encoding: 'utf8' },
  );
  return raw.trim().split(/\r?\n/).filter(Boolean).at(-1)?.trim() || '';
}

async function main() {
  const curated = await buildCuratedChunks();
  const books = await buildBookChunks();
  const chunks = [...curated, ...books];
  const version = new Date().toISOString();

  await writeFile(
    PREVIEW_PATH,
    JSON.stringify({ version, count: chunks.length, chunks }, null, 2),
    'utf8',
  );

  const token = process.env.ASSISTANT_SYNC_TOKEN || readSecret('ASSISTANT_SYNC_TOKEN');
  if (!token) {
    throw new Error('ASSISTANT_SYNC_TOKEN is missing.');
  }

  const response = await fetch(SYNC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Assistant-Sync-Token': token,
    },
    body: JSON.stringify({ version, chunks }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Sync failed (${response.status}): ${body}`);
  }

  console.log(`Assistant sync complete. Version ${version}. ${chunks.length} chunks uploaded.`);
  console.log(body);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
