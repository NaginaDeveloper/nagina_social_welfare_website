import type { DonationFund } from './membership';

export type AppealStatus = 'draft' | 'live' | 'closed';

/** A fundraising appeal as served by `GET /api/membership/appeals`. */
export interface PublicAppeal {
  id: string;
  title: string;
  titleUr: string;
  summary: string;
  summaryUr: string;
  storyHtml: string;
  coverImageUrl: string | null;
  targetAmount: number;
  raisedTotal: number;
  donationCount: number;
  donorCount: number;
  progressPct: number;
  currency: 'GBP';
  deadline: string | null;
  /** Campus profile id, or `general`. */
  campusId: string;
  campusName: string;
  fund: DonationFund;
  status: AppealStatus;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export const GENERAL_APPEAL_CAMPUS = 'general';

/** Whole days until the deadline (0 when it is today), or null when open-ended. */
export function appealDaysLeft(appeal: Pick<PublicAppeal, 'deadline'>, now = new Date()): number | null {
  if (!appeal.deadline) return null;
  const end = new Date(appeal.deadline).getTime();
  if (Number.isNaN(end)) return null;
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000));
}

export function appealIsOpen(appeal: Pick<PublicAppeal, 'status' | 'deadline'>, now = new Date()): boolean {
  if (appeal.status !== 'live') return false;
  const days = appealDaysLeft(appeal, now);
  return days === null || days >= 0;
}

export function appealIsGeneral(appeal: Pick<PublicAppeal, 'campusId'>): boolean {
  return !appeal.campusId || appeal.campusId === GENERAL_APPEAL_CAMPUS;
}

/** Query params for the member donate tab, as used in campaign emails. */
export function appealDonateQuery(appeal: Pick<PublicAppeal, 'id'>, amount?: number | null) {
  return {
    tab: 'donate',
    appeal: appeal.id,
    ...(amount && amount > 0 ? { amount: String(amount) } : {}),
  } as const;
}

/** Query params for the public donate page (guest gift to the same fund and centre). */
export function appealGuestDonateQuery(appeal: Pick<PublicAppeal, 'fund' | 'campusId'>) {
  return {
    fund: appeal.fund,
    ...(appealIsGeneral(appeal) ? {} : { campus: appeal.campusId }),
  } as const;
}

export function formatGbp(amount: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits,
  }).format(amount);
}
