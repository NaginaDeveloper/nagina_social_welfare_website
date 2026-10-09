export interface GoogleReview {
  readonly author: string;
  readonly authorUrl: string | null;
  readonly rating: number;
  readonly text: string;
  readonly when: string;
}

export interface GoogleReviewsData {
  readonly rating: number | null;
  readonly count: number;
  readonly mapsUri: string | null;
  readonly reviews: readonly GoogleReview[];
}

function httpsUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    return new URL(value).protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}

/** Accepts only what the page can show; anything else (an error body, an old shape) is null. */
export function parseGoogleReviews(raw: unknown): GoogleReviewsData | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  if (!Array.isArray(body['reviews'])) return null;
  const reviews: GoogleReview[] = [];
  for (const item of body['reviews']) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    const rating = Number(r['rating']);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) continue;
    reviews.push({
      author: typeof r['author'] === 'string' && r['author'].trim() ? r['author'].trim() : 'Google user',
      authorUrl: httpsUrl(r['authorUrl']),
      rating: Math.round(rating),
      text: typeof r['text'] === 'string' ? r['text'].trim() : '',
      when: typeof r['when'] === 'string' ? r['when'].trim() : '',
    });
  }
  const rating = typeof body['rating'] === 'number' ? body['rating'] : null;
  return {
    rating,
    count: Number(body['count']) || 0,
    mapsUri: httpsUrl(body['mapsUri']),
    reviews,
  };
}

/** "★★★★☆" for a whole-number rating between 1 and 5. */
export function starString(rating: number): string {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

/** First letter for the avatar circle. */
export function authorInitial(author: string): string {
  return (author.trim().charAt(0) || '?').toUpperCase();
}
