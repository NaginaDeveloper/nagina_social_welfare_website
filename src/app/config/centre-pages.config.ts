/** Centres with their own top-level URL (and SEO shell). Others open at /centre/:id. */
export const CENTRE_PAGE_PATHS: Readonly<Record<string, string>> = {
  peterborough: '/peterborough',
  manchester: '/manchester',
};

export function centrePath(campusId: string): string {
  return CENTRE_PAGE_PATHS[campusId] ?? `/centre/${encodeURIComponent(campusId)}`;
}

/** Each centre's own seal: Markaz Deen-e-Islam (Peterborough) and Quran Academy (Manchester). */
export const CENTRE_LOGOS: Readonly<Record<string, string>> = {
  peterborough: '/brand/markaz.png',
  manchester: '/brand/quran-academy.webp',
};

/** The centre's seal, or the charity mark for a centre without one. */
export function centreLogo(campusId: string): string {
  return CENTRE_LOGOS[campusId] ?? '/brand/nagina.png';
}
