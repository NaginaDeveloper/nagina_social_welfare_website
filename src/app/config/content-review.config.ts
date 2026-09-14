/**
 * Content review metadata for religious and impact pages.
 * Leave reviewer fields empty until a named qualified reviewer is confirmed —
 * the UI hides the reviewer block when name is blank.
 */
export interface ContentReviewer {
  readonly name: string;
  readonly credentials?: string;
  readonly reviewedOn?: string;
}

export interface ContentReviewEntry {
  readonly pageId: string;
  readonly lastChecked?: string;
  readonly sources?: readonly string[];
  readonly reviewer?: ContentReviewer;
}

/** Approved impact facts only — leave empty until trustees approve numbers. */
export interface ImpactFact {
  readonly label: string;
  readonly labelUr: string;
  readonly value: string;
  readonly valueUr: string;
  readonly asOf: string;
}

export const CONTENT_REVIEW: Record<string, ContentReviewEntry> = {
  guidance: {
    pageId: 'guidance',
    lastChecked: '14 September 2026',
    sources: ['Teachings preserved via Seedha Rastah / Munir-e-Islam'],
  },
  'what-is-zakat': {
    pageId: 'what-is-zakat',
    lastChecked: '14 September 2026',
    sources: [
      'Quran 9:60 (categories of Zakat recipients — general reference)',
      'Nagina Social Welfare UK Zakat calculator disclaimer',
    ],
  },
  'zakat-rules': {
    pageId: 'zakat-rules',
    lastChecked: '14 September 2026',
    sources: [
      'Standard Hanafi references on nisab (87.48g gold / 612.36g silver)',
      'Live metal prices used by the on-site calculator when available',
    ],
  },
  duas: {
    pageId: 'duas',
    lastChecked: '15 September 2026',
    sources: [
      'Let’s Learn Islam (آئیں دین سیکھیں) — module child_duas: Daily Duʿās — Supplications for Children / بچوں کی پیاری روزمرہ دعائیں (17 items; Arabic + EN/UR meanings from curriculum)',
    ],
  },
  calendar: {
    pageId: 'calendar',
    lastChecked: '15 September 2026',
    sources: ['AlAdhan gToH / gToHCalendar — today’s Hijri day, month and year; Gregorian month grid'],
  },
  ramadan: {
    pageId: 'ramadan',
    lastChecked: '14 September 2026',
    sources: ['Local prayer times via AlAdhan; events listed on /events/'],
  },
  impact: {
    pageId: 'impact',
    lastChecked: '14 September 2026',
    sources: [],
  },
  namaz: {
    pageId: 'namaz',
    lastChecked: '14 September 2026',
    sources: ['AlAdhan.com — Muslim World League (method 3), Hanafi Asr'],
  },
  peterborough: {
    pageId: 'peterborough',
    lastChecked: '14 September 2026',
    sources: ['Organisation address and Markaz Deen-e-Islam timetable'],
  },
};

/** Populate only with trustee-approved figures. Empty = show “awaiting approval” state. */
export const APPROVED_IMPACT_FACTS: readonly ImpactFact[] = [];

/** Optional named trustees / leadership — empty until confirmed for public listing. */
export const PUBLIC_TRUSTEES: readonly {
  readonly name: string;
  readonly role: string;
  readonly roleUr: string;
}[] = [];

export const SAFEGUARDING_LAST_REVIEWED = '14 September 2026';
