/**
 * Snapshots the madrasa campus list (office-editable in Control Center) into
 * public/campuses.json. The site reads the live API first and uses this file
 * only when the API is unreachable.
 *
 * Usage: node scripts/fetch-campuses.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(path.resolve(__dirname, '..'), 'public', 'campuses.json');
const URL =
  'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/submitAdmission';

try {
  const res = await fetch(URL, { headers: { Origin: 'https://www.naginasocialwelfare.co.uk' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (!Array.isArray(body?.campuses) || body.campuses.length === 0) {
    throw new Error('no campuses in response');
  }
  await writeFile(OUT, `${JSON.stringify({ campuses: body.campuses }, null, 2)}\n`);
  console.log(`campuses: wrote ${body.campuses.length} to public/campuses.json`);
} catch (err) {
  const existing = await readFile(OUT, 'utf8').catch(() => null);
  if (!existing) {
    console.error('campuses: fetch failed and no snapshot exists', err);
    process.exit(1);
  }
  console.warn('campuses: fetch failed, keeping existing snapshot', err?.message ?? err);
}
