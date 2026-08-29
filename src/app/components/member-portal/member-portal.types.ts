export type MemberTab = 'overview' | 'profile' | 'donate' | 'events' | 'newsletters';

export const MEMBER_TABS: readonly { id: MemberTab; labelKey: string }[] = [
  { id: 'overview', labelKey: 'memberHome.tabOverview' },
  { id: 'profile', labelKey: 'memberHome.tabProfile' },
  { id: 'donate', labelKey: 'memberHome.tabDonate' },
  { id: 'events', labelKey: 'memberHome.tabEvents' },
  { id: 'newsletters', labelKey: 'memberHome.tabNewsletters' },
];

const TAB_SET = new Set<string>(MEMBER_TABS.map((t) => t.id));

export function parseMemberTab(value: string | null | undefined): MemberTab {
  if (value && TAB_SET.has(value)) return value as MemberTab;
  return 'overview';
}
