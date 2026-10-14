/**
 * Turns the standalone portal guide pages (the manual HTML that also prints to PDF,
 * and the video guide page) into Angular page templates under src/app/pages/guides/.
 *
 * Sources:
 *   parent, student, teacher and collector manuals -> the admin monorepo, docs/<name>/index.html
 *   parent and student videos           -> guide-sources/<name>.html in this repo
 *
 * Assets (screenshots, logos, PDFs, video, poster) live in public/guides/<name>/ and are
 * referenced with absolute URLs, so the pages work whatever the current route looks like.
 *
 *   node scripts/import-guide-pages.mjs [--admin ../Nagina_Social_Welfare_Admin]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const adminFlag = process.argv.indexOf('--admin');
const adminRepo = resolve(
  root,
  adminFlag > -1 ? process.argv[adminFlag + 1] : '../Nagina_Social_Welfare_Admin',
);

const GUIDES = [
  {
    id: 'parent-portal-manual',
    kind: 'manual',
    source: join(adminRepo, 'docs/parent-portal-manual/index.html'),
    title: 'Parent Portal User Manual',
  },
  {
    id: 'student-portal-manual',
    kind: 'manual',
    source: join(adminRepo, 'docs/student-portal-manual/index.html'),
    title: 'Student Portal User Manual',
  },
  {
    id: 'teacher-portal-manual',
    kind: 'manual',
    source: join(adminRepo, 'docs/teacher-portal-manual/index.html'),
    title: 'Teacher Portal User Manual',
  },
  {
    id: 'collector-portal-manual',
    kind: 'manual',
    source: join(adminRepo, 'docs/collector-portal-manual/index.html'),
    title: 'Collector Portal User Manual',
  },
  {
    id: 'parent-portal-video',
    kind: 'video',
    source: join(root, 'guide-sources/parent-portal-video.html'),
    title: 'Parent Portal Video Guide',
  },
  {
    id: 'student-portal-video',
    kind: 'video',
    source: join(root, 'guide-sources/student-portal-video.html'),
    title: 'Student Portal Video Guide',
  },
  {
    id: 'teacher-portal-video',
    kind: 'video',
    source: join(root, 'guide-sources/teacher-portal-video.html'),
    title: 'Teacher Portal Video Guide',
  },
];

/** Old standalone URLs → Angular routes, for links inside the pages. */
const LINK_REWRITES = [
  ['https://www.naginasocialwelfare.co.uk/parent-portal-manual/', '/guides/parent-portal-manual/'],
  ['https://www.naginasocialwelfare.co.uk/student-portal-manual/', '/guides/student-portal-manual/'],
  ['https://www.naginasocialwelfare.co.uk/teacher-portal-manual/', '/guides/teacher-portal-manual/'],
  ['https://www.naginasocialwelfare.co.uk/parent-portal-video/', '/guides/parent-portal-video/'],
  ['https://www.naginasocialwelfare.co.uk/guides/student-portal-video/', '/guides/student-portal-video/'],
  ['https://www.naginasocialwelfare.co.uk/guides/teacher-portal-video/', '/guides/teacher-portal-video/'],
  ['../teacher-portal-manual/Teacher-Portal-User-Manual.pdf', '/guides/teacher-portal-manual/Teacher-Portal-User-Manual.pdf'],
  ['../teacher-portal-manual/', '/guides/teacher-portal-manual/'],
  ['../student-portal-manual/Student-Portal-User-Manual.pdf', '/guides/student-portal-manual/Student-Portal-User-Manual.pdf'],
  ['../student-portal-manual/', '/guides/student-portal-manual/'],
  ['https://www.naginasocialwelfare.co.uk/guides/', '/guides/'],
  ['../parent-portal-manual/Parent-Portal-User-Manual.pdf', '/guides/parent-portal-manual/Parent-Portal-User-Manual.pdf'],
  ['../parent-portal-manual/logos/', '/guides/parent-portal-manual/logos/'],
  ['../parent-portal-manual/', '/guides/parent-portal-manual/'],
];

/** Angular treats @, { and } in template text as syntax, so escape them in text nodes only. */
function escapeTemplateText(html) {
  return html
    .split(/(<[^>]*>)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replaceAll('@', '&#64;').replaceAll('{', '&#123;').replaceAll('}', '&#125;'),
    )
    .join('');
}

function rewriteAssetUrls(html, id) {
  const base = `/guides/${id}/`;
  let out = html;
  for (const [from, to] of LINK_REWRITES) out = out.replaceAll(from, to);
  out = out
    // In-page anchors must go through the router: a bare href="#x" resolves against <base href="/">.
    .replace(/href="#([A-Za-z0-9-]+)"/g, `routerLink="${base}" fragment="$1"`)
    .replace(/(src|href|poster)="screenshots\//g, `$1="${base}screenshots/`)
    .replace(/(src|href)="logos\//g, `$1="${base}logos/`)
    .replace(/(src|href|poster)="([A-Za-z0-9-]+\.(?:pdf|mp4|jpg|png))"/g, `$1="${base}$2"`);
  return out;
}

/** PNG and JPEG pixel size, so every <img> reserves its space and anchors land where they should. */
function imageSize(file) {
  if (!existsSync(file)) return null;
  const buf = readFileSync(file);
  if (buf.length > 24 && buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

function addImageSizes(html) {
  return html.replace(/<img ([^>]*?)src="(\/guides\/[^"]+)"([^>]*?)\/?>/g, (tag, before, src, after) => {
    if (/\bwidth=/.test(tag)) return tag;
    const size = imageSize(join(root, 'public', src));
    if (!size) return tag;
    return `<img ${before}src="${src}" width="${size.width}" height="${size.height}"${after}/>`;
  });
}

function convertCss(css, id) {
  let out = css
    .replace(/:root\s*\{/g, ':host {')
    .replace(/\n\s*html\s*\{[^}]*\}/g, '')
    .replace(/\n(\s*)body\s*\{/g, '\n$1:host {')
    // the page's own <main> becomes a div: the app shell already renders <main>
    .replace(/(^|[\s,{}])main(\s*\{|\s*,)/g, '$1.guide-main$2')
    // the sticky contents panel sits below the site's fixed header
    .replace(/(nav\.toc\s*\{[^}]*?)top:\s*0;/g, '$1top: var(--header-clearance);')
    .replace(/(nav\.toc\s*\{[^}]*?)height:\s*100vh;/g, '$1height: calc(100vh - var(--header-clearance));')
    .replace(/scroll-margin-top:\s*72px;/g, 'scroll-margin-top: calc(var(--header-clearance) + 12px);');
  // :host needs display:block so its background and padding apply
  out = out.replace(':host {\n      margin: 0;', ':host {\n      display: block;\n      margin: 0;');
  return `/* Generated by scripts/import-guide-pages.mjs from the standalone ${id} page. Do not edit by hand. */\n${out.trim()}\n`;
}

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!m) throw new Error('no <style> block');
  return m[1];
}

function extractBody(html, kind) {
  if (kind === 'manual') {
    const m = html.match(/(<div class="layout">[\s\S]*<\/div>)\s*<\/body>/);
    if (!m) throw new Error('no .layout block');
    // The manuals are English-only: keep them left-to-right even when the site is in Urdu.
    return m[1].replace('<div class="layout">', '<div class="layout" dir="ltr" lang="en">');
  }
  const m = html.match(/(<main>[\s\S]*<\/main>)/);
  if (!m) throw new Error('no <main> block');
  return m[1];
}

function convertVideoTemplate(html) {
  return html
    .replace('<main>', '<div class="guide-main" dir="ltr" lang="en">')
    .replace(/<\/main>\s*$/, '</div>')
    .replace(
      /<video id="guide" ([^>]*)>/,
      '<video #guide $1 (timeupdate)="onTime(guide.currentTime)">',
    )
    .replace(
      /<button type="button" data-t="(\d+)">/g,
      '<button type="button" (click)="seek($1)" [class.active]="activeChapter() === $1">',
    );
}

function convertManualTemplate(html) {
  return html.replace('<main>', '<div class="guide-main">').replace(/<\/main>(\s*<\/div>)$/, '</div>$1');
}

for (const guide of GUIDES) {
  if (!existsSync(guide.source)) {
    console.error(`missing source for ${guide.id}: ${guide.source}`);
    process.exit(1);
  }
  const html = readFileSync(guide.source, 'utf8');
  const outDir = join(root, 'src/app/pages/guides', guide.id);
  mkdirSync(outDir, { recursive: true });

  const css = convertCss(extractStyle(html), guide.id);
  let body = extractBody(html, guide.kind);
  body = guide.kind === 'video' ? convertVideoTemplate(body) : convertManualTemplate(body);
  body = escapeTemplateText(addImageSizes(rewriteAssetUrls(body, guide.id)));
  const template = `<!-- Generated by scripts/import-guide-pages.mjs from the standalone ${guide.id} page. Do not edit by hand. -->\n<app-page-shell [title]="title" [parent]="crumb">\n${body}\n</app-page-shell>\n`;

  writeFileSync(join(outDir, `${guide.id}-page.html`), template);
  writeFileSync(join(outDir, `${guide.id}-page.css`), css);
  const chapters = [...body.matchAll(/\(click\)="seek\((\d+)\)"/g)].map((m) => Number(m[1]));
  console.log(`${guide.id}: template ${template.length} chars, css ${css.length} chars${chapters.length ? `, ${chapters.length} chapters` : ''}`);
}
