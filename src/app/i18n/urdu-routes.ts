/**
 * Urdu twins of the public pages live under `/ur/…`. The same components render in
 * Urdu there, so Google can index real Urdu pages (the in-page Urdu toggle on its own
 * is client-side and invisible to crawlers). Only pages whose Urdu coverage is good
 * (about 55% or more of the visible letters) are listed; everything else stays
 * English-only. /peterborough/ and /manchester/ are left out until their long English
 * centre text is translated.
 *
 * Plain TypeScript with no Angular imports: the build script reads it too.
 */
export const URDU_PREFIX = '/ur';

/** English canonical paths (with trailing slash) that have an Urdu twin. */
export const URDU_PAGE_PATHS: readonly string[] = [
  '/',
  '/about/',
  '/work/',
  '/madrasa/',
  '/donate/',
  '/zakat/',
  '/zakat/what-is-zakat/',
  '/zakat/rules/',
  '/spiritual-guide/',
  '/sermons/',
  '/seedha-rastah/',
  '/guidance/',
  '/basic-beliefs/',
  '/khatme-nabuwwat/',
  '/ahle-bait/',
  '/sahaba-ikram/',
  '/aulia-karam/',
  '/namaz/',
  '/duas/',
  '/calendar/',
  '/contact/',
];

/** "/about", "/about/", "about/" → "/about/"; "/" stays "/". */
export function normalisePath(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function isUrduPage(path: string): boolean {
  return URDU_PAGE_PATHS.includes(normalisePath(path));
}

/** "/ur/about/" → { ur: true, path: "/about/" }; anything else → { ur: false, path }. */
export function splitUrduPrefix(path: string): { ur: boolean; path: string } {
  const normal = normalisePath(path);
  if (normal === `${URDU_PREFIX}/`) return { ur: true, path: '/' };
  if (normal.startsWith(`${URDU_PREFIX}/`)) {
    return { ur: true, path: normalisePath(normal.slice(URDU_PREFIX.length)) };
  }
  return { ur: false, path: normal };
}

/** English path → its Urdu twin ("/about/" → "/ur/about/", "/" → "/ur/"). */
export function toUrduPath(path: string): string {
  const normal = normalisePath(path);
  return normal === '/' ? `${URDU_PREFIX}/` : `${URDU_PREFIX}${normal}`;
}

/** "/ur/about/?x=1#y" → "/about/?x=1#y" (query and hash kept); other URLs pass through. */
export function withoutUrduPrefix(url: string): string {
  const end = url.search(/[?#]/);
  const path = end === -1 ? url : url.slice(0, end);
  const rest = end === -1 ? '' : url.slice(end);
  const split = splitUrduPrefix(path);
  return split.ur && isUrduPage(split.path) ? split.path + rest : url;
}
