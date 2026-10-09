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

/**
 * Each centre's Google Business Profile: the "leave a review" short link and the place id (cid).
 * A centre with no entry shows no review button; add one here once its profile exists.
 */
export const GOOGLE_PROFILES: Readonly<Record<string, { readonly reviewUrl: string; readonly cid: string }>> = {
  peterborough: {
    reviewUrl: 'https://g.page/r/CXdKgnGjgadjEBM/review',
    cid: '7180850669849561719',
  },
};

/** The link that opens Google's review form for the centre, if it has a profile. */
export function centreReviewUrl(campusId: string): string | null {
  return GOOGLE_PROFILES[campusId]?.reviewUrl ?? null;
}

/** The centre's Google Maps listing, for structured data. */
export function centreMapsProfileUrl(campusId: string): string | null {
  const profile = GOOGLE_PROFILES[campusId];
  return profile ? `https://maps.google.com/?cid=${profile.cid}` : null;
}
