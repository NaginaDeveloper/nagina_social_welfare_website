import type { DonationFund } from '../../models/membership';

export const portalEyebrowClass =
  'text-xs font-semibold uppercase tracking-[0.28em] text-gold-600';

export const portalCardClass =
  'rounded-[1.5rem] border border-mist bg-white px-5 py-6 shadow-soft sm:rounded-[1.75rem] sm:px-8 sm:py-8';

export const portalInputClass =
  'mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4 text-forest outline-none transition-colors focus:border-gold/50 focus:bg-white';

export const portalPrimaryBtnClass =
  'inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-cream transition-colors hover:bg-emerald disabled:opacity-60';

export const portalOutlineBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full border border-mist bg-white px-5 text-sm font-semibold text-forest transition-colors hover:border-gold/40 hover:text-gold-600';

export const portalGoldBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold-600 px-5 text-sm font-semibold text-forest transition-colors hover:brightness-105 disabled:opacity-60';

export const portalSuccessBannerClass =
  'rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-forest';

export const portalErrorBannerClass =
  'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900';

export interface MemberDonationFundOption {
  readonly id: DonationFund;
  readonly titleKey: string;
  readonly hintKey: string;
}

export const MEMBER_DONATION_FUNDS: readonly MemberDonationFundOption[] = [
  { id: 'zakat', titleKey: 'donate.zakat', hintKey: 'donate.zakatHint' },
  { id: 'sadaqah', titleKey: 'donate.sadaqah', hintKey: 'donate.sadaqahHint' },
  { id: 'lillah', titleKey: 'donate.lillah', hintKey: 'donate.lillahHint' },
  { id: 'fitrana', titleKey: 'donate.fitrana', hintKey: 'donate.fitranaHint' },
];
