import { ORGANIZATION } from './organization.config';

/** Simple stroke icons used in the nav. */
export type NavIcon =
  | 'about'
  | 'work'
  | 'guide'
  | 'seal'
  | 'family'
  | 'companions'
  | 'counsel'
  | 'mosque'
  | 'quran'
  | 'hadith'
  | 'book'
  | 'seedha'
  | 'sermon'
  | 'apps'
  | 'guides'
  | 'events'
  | 'donate'
  | 'contact'
  | 'privacy'
  | 'worship'
  | 'learn'
  | 'zakat'
  | 'connect'
  | 'quiz'
  | 'barcode'
  | 'assistant';

export interface NavLink {
  readonly labelKey: string;
  readonly hintKey?: string;
  /** Untranslated label from data (e.g. a centre's town); wins over [labelKey]. */
  readonly label?: string;
  readonly hint?: string;
  /** Internal Angular route. Omit when [externalHref] is set. */
  readonly path?: string;
  /** Absolute URL opened in a new tab (e.g. admin quiz player). */
  readonly externalHref?: string;
  readonly icon: NavIcon;
}

export interface NavGroup {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: NavIcon;
  readonly items: readonly NavLink[];
}

/**
 * The one list of site sections. The header menus, the mobile panel and the
 * footer columns all render from this, so a link can never exist in one place
 * and not the other. [centreLinks] are the per-Madrasa pages loaded at runtime.
 */
export function buildNavGroups(centreLinks: readonly NavLink[]): readonly NavGroup[] {
  return [
    {
      id: 'about',
      labelKey: 'nav.about',
      icon: 'about',
      items: [
        { labelKey: 'nav.aboutUs', path: '/about', hintKey: 'nav.aboutUsHint', icon: 'about' },
        { labelKey: 'nav.ourWork', path: '/work', hintKey: 'nav.ourWorkHint', icon: 'work' },
        { labelKey: 'nav.impact', path: '/impact', hintKey: 'nav.impactHint', icon: 'work' },
        { labelKey: 'nav.madrasa', path: '/madrasa', hintKey: 'nav.madrasaHint', icon: 'mosque' },
        ...centreLinks,
        {
          labelKey: 'nav.spiritualGuide',
          path: '/spiritual-guide',
          hintKey: 'nav.spiritualGuideHint',
          icon: 'guide',
        },
      ],
    },
    {
      id: 'beliefs',
      labelKey: 'nav.beliefs',
      icon: 'seal',
      items: [
        { labelKey: 'nav.basicBeliefs', path: '/basic-beliefs', hintKey: 'nav.basicBeliefsHint', icon: 'counsel' },
        { labelKey: 'nav.khatmeNabuwwat', path: '/khatme-nabuwwat', hintKey: 'nav.khatmeNabuwwatHint', icon: 'seal' },
        { labelKey: 'nav.ahleBait', path: '/ahle-bait', hintKey: 'nav.ahleBaitHint', icon: 'family' },
        { labelKey: 'nav.sahabaIkram', path: '/sahaba-ikram', hintKey: 'nav.sahabaIkramHint', icon: 'companions' },
        { labelKey: 'nav.auliaKaram', path: '/aulia-karam', hintKey: 'nav.auliaKaramHint', icon: 'guide' },
      ],
    },
    {
      id: 'worship',
      labelKey: 'nav.worship',
      icon: 'worship',
      items: [
        { labelKey: 'nav.namazTimes', path: '/namaz', hintKey: 'nav.namazTimesHint', icon: 'mosque' },
        { labelKey: 'nav.quranMajeed', path: '/quran', hintKey: 'nav.quranMajeedHint', icon: 'quran' },
        { labelKey: 'nav.hadith', path: '/hadith', hintKey: 'nav.hadithHint', icon: 'hadith' },
        { labelKey: 'nav.duas', path: '/duas', hintKey: 'nav.duasHint', icon: 'worship' },
        { labelKey: 'nav.calendar', path: '/calendar', hintKey: 'nav.calendarHint', icon: 'worship' },
        { labelKey: 'nav.ramadan', path: '/ramadan', hintKey: 'nav.ramadanHint', icon: 'mosque' },
        { labelKey: 'nav.zakat', path: '/zakat', hintKey: 'nav.zakatHint', icon: 'zakat' },
        { labelKey: 'nav.whatIsZakat', path: '/zakat/what-is-zakat', hintKey: 'nav.whatIsZakatHint', icon: 'zakat' },
        { labelKey: 'nav.zakatRules', path: '/zakat/rules', hintKey: 'nav.zakatRulesHint', icon: 'zakat' },
      ],
    },
    {
      id: 'learn',
      labelKey: 'nav.learn',
      icon: 'learn',
      items: [
        { labelKey: 'nav.seedhaRastah', path: '/seedha-rastah', hintKey: 'nav.seedhaRastahHint', icon: 'seedha' },
        { labelKey: 'nav.books', path: '/books', hintKey: 'nav.booksHint', icon: 'book' },
        { labelKey: 'nav.sermons', path: '/sermons', hintKey: 'nav.sermonsHint', icon: 'sermon' },
        { labelKey: 'nav.guidance', path: '/guidance', hintKey: 'nav.guidanceHint', icon: 'counsel' },
        { labelKey: 'nav.quiz', externalHref: ORGANIZATION.quizUrl, hintKey: 'nav.quizHint', icon: 'quiz' },
        {
          labelKey: 'nav.halalChecker',
          externalHref: ORGANIZATION.halalCheckerUrl,
          hintKey: 'nav.halalCheckerHint',
          icon: 'barcode',
        },
        { labelKey: 'nav.assistant', path: '/assistant', hintKey: 'nav.assistantHint', icon: 'assistant' },
        { labelKey: 'nav.apps', path: '/apps', hintKey: 'nav.appsHint', icon: 'apps' },
        { labelKey: 'nav.guides', path: '/guides', hintKey: 'nav.guidesHint', icon: 'guides' },
      ],
    },
    {
      id: 'connect',
      labelKey: 'nav.connect',
      icon: 'connect',
      items: [
        { labelKey: 'nav.events', path: '/events', hintKey: 'nav.eventsHint', icon: 'events' },
        { labelKey: 'nav.donate', path: '/donate', hintKey: 'nav.donateHint', icon: 'donate' },
        { labelKey: 'nav.contact', path: '/contact', hintKey: 'nav.contactHint', icon: 'contact' },
        { labelKey: 'nav.membership', path: '/membership', hintKey: 'nav.membershipHint', icon: 'about' },
        { labelKey: 'nav.membershipTrack', path: '/membership/track', hintKey: 'nav.membershipTrackHint', icon: 'contact' },
        { labelKey: 'header.login', path: '/portals', hintKey: 'nav.staffPortalHint', icon: 'contact' },
      ],
    },
  ];
}
