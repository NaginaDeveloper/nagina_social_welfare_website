import type { DonationFund } from '../../models/membership';
import type { UiIconName } from '../ui/icon';

export type MemberTab =
  | 'overview'
  | 'appeals'
  | 'donate'
  | 'donations'
  | 'events'
  | 'newsletters'
  | 'profile';

export interface MemberTabMeta {
  readonly id: MemberTab;
  readonly labelKey: string;
  readonly icon: UiIconName;
}

export const MEMBER_TABS: readonly MemberTabMeta[] = [
  { id: 'overview', labelKey: 'memberHome.tabOverview', icon: 'home' },
  { id: 'appeals', labelKey: 'memberHome.tabAppeals', icon: 'megaphone' },
  { id: 'donate', labelKey: 'memberHome.tabDonate', icon: 'heart' },
  { id: 'donations', labelKey: 'memberHome.tabDonations', icon: 'receipt' },
  { id: 'events', labelKey: 'memberHome.tabEvents', icon: 'calendar' },
  { id: 'newsletters', labelKey: 'memberHome.tabNewsletters', icon: 'newsletter' },
  { id: 'profile', labelKey: 'memberHome.tabProfile', icon: 'user' },
];

const TAB_SET = new Set<string>(MEMBER_TABS.map((t) => t.id));

export function parseMemberTab(value: string | null | undefined): MemberTab {
  if (value && TAB_SET.has(value)) return value as MemberTab;
  return 'overview';
}

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

export const DONATION_PRESETS = [5, 10, 25, 50, 100] as const;

export function formatMoney(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}

export function formatPortalDate(iso: string | null | undefined, lang: 'en' | 'ur' = 'en'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(lang === 'ur' ? 'ur-PK' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/London',
  });
}
