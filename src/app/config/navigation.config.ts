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
  | 'assistant'
  | 'shield'
  | 'sparkle'
  | 'pin';

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

/** A sub-heading inside a menu with the links under it. */
export interface NavSection {
  readonly labelKey: string;
  readonly items: readonly NavLink[];
}

/** The highlighted card at the side of a desktop menu. */
export interface NavFeatured {
  readonly titleKey: string;
  readonly textKey: string;
  readonly ctaKey: string;
  readonly path: string;
  readonly icon: NavIcon;
}

export interface NavGroup {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: NavIcon;
  readonly sections: readonly NavSection[];
  readonly featured?: NavFeatured;
  /** Every link in the group, in order — what the footer, search and "active section" checks use. */
  readonly items: readonly NavLink[];
}

function group(def: Omit<NavGroup, 'items'>): NavGroup {
  return { ...def, items: def.sections.flatMap((section) => section.items) };
}

/**
 * The one list of site sections. The header menus, the mobile panel and the
 * footer columns all render from this, so a link can never exist in one place
 * and not the other. [centreLinks] are the per-Madrasa pages loaded at runtime.
 */
export function buildNavGroups(centreLinks: readonly NavLink[]): readonly NavGroup[] {
  return [
    group({
      id: 'about',
      labelKey: 'nav.about',
      icon: 'about',
      sections: [
        {
          labelKey: 'nav.section.organisation',
          items: [
            { labelKey: 'nav.aboutUs', path: '/about', hintKey: 'nav.aboutUsHint', icon: 'about' },
            { labelKey: 'nav.ourWork', path: '/work', hintKey: 'nav.ourWorkHint', icon: 'work' },
            { labelKey: 'nav.impact', path: '/impact', hintKey: 'nav.impactHint', icon: 'sparkle' },
          ],
        },
        {
          labelKey: 'nav.section.community',
          items: [
            { labelKey: 'nav.spiritualGuide', path: '/spiritual-guide', hintKey: 'nav.spiritualGuideHint', icon: 'guide' },
            { labelKey: 'nav.events', path: '/events', hintKey: 'nav.eventsHint', icon: 'events' },
            { labelKey: 'nav.safeguarding', path: '/safeguarding', hintKey: 'nav.safeguardingHint', icon: 'shield' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.centresTitle',
        textKey: 'nav.featured.centresText',
        ctaKey: 'nav.featured.centresCta',
        path: '/madrasa',
        icon: 'pin',
      },
    }),
    group({
      id: 'beliefs',
      labelKey: 'nav.beliefs',
      icon: 'seal',
      sections: [
        {
          labelKey: 'nav.section.creed',
          items: [
            { labelKey: 'nav.basicBeliefs', path: '/basic-beliefs', hintKey: 'nav.basicBeliefsHint', icon: 'counsel' },
            { labelKey: 'nav.khatmeNabuwwat', path: '/khatme-nabuwwat', hintKey: 'nav.khatmeNabuwwatHint', icon: 'seal' },
          ],
        },
        {
          labelKey: 'nav.section.loveHonour',
          items: [
            { labelKey: 'nav.ahleBait', path: '/ahle-bait', hintKey: 'nav.ahleBaitHint', icon: 'family' },
            { labelKey: 'nav.sahabaIkram', path: '/sahaba-ikram', hintKey: 'nav.sahabaIkramHint', icon: 'companions' },
            { labelKey: 'nav.auliaKaram', path: '/aulia-karam', hintKey: 'nav.auliaKaramHint', icon: 'guide' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.beliefsTitle',
        textKey: 'nav.featured.beliefsText',
        ctaKey: 'nav.featured.beliefsCta',
        path: '/basic-beliefs',
        icon: 'counsel',
      },
    }),
    group({
      id: 'worship',
      labelKey: 'nav.worship',
      icon: 'worship',
      sections: [
        {
          labelKey: 'nav.section.daily',
          items: [
            { labelKey: 'nav.namazTimes', path: '/namaz', hintKey: 'nav.namazTimesHint', icon: 'mosque' },
            { labelKey: 'nav.duas', path: '/duas', hintKey: 'nav.duasHint', icon: 'worship' },
            { labelKey: 'nav.calendar', path: '/calendar', hintKey: 'nav.calendarHint', icon: 'events' },
            { labelKey: 'nav.ramadan', path: '/ramadan', hintKey: 'nav.ramadanHint', icon: 'mosque' },
          ],
        },
        {
          labelKey: 'nav.section.scripture',
          items: [
            { labelKey: 'nav.quranMajeed', path: '/quran', hintKey: 'nav.quranMajeedHint', icon: 'quran' },
            { labelKey: 'nav.hadith', path: '/hadith', hintKey: 'nav.hadithHint', icon: 'hadith' },
          ],
        },
        {
          labelKey: 'nav.section.zakat',
          items: [
            { labelKey: 'nav.zakat', path: '/zakat', hintKey: 'nav.zakatHint', icon: 'zakat' },
            { labelKey: 'nav.whatIsZakat', path: '/zakat/what-is-zakat', hintKey: 'nav.whatIsZakatHint', icon: 'zakat' },
            { labelKey: 'nav.zakatRules', path: '/zakat/rules', hintKey: 'nav.zakatRulesHint', icon: 'zakat' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.namazTitle',
        textKey: 'nav.featured.namazText',
        ctaKey: 'nav.featured.namazCta',
        path: '/namaz',
        icon: 'mosque',
      },
    }),
    group({
      id: 'learn',
      labelKey: 'nav.learn',
      icon: 'learn',
      sections: [
        {
          labelKey: 'nav.section.library',
          items: [
            { labelKey: 'nav.seedhaRastah', path: '/seedha-rastah', hintKey: 'nav.seedhaRastahHint', icon: 'seedha' },
            { labelKey: 'nav.books', path: '/books', hintKey: 'nav.booksHint', icon: 'book' },
            { labelKey: 'nav.sermons', path: '/sermons', hintKey: 'nav.sermonsHint', icon: 'sermon' },
            { labelKey: 'nav.guidance', path: '/guidance', hintKey: 'nav.guidanceHint', icon: 'counsel' },
          ],
        },
        {
          labelKey: 'nav.section.tools',
          items: [
            { labelKey: 'nav.quiz', externalHref: ORGANIZATION.quizUrl, hintKey: 'nav.quizHint', icon: 'quiz' },
            {
              labelKey: 'nav.halalChecker',
              externalHref: ORGANIZATION.halalCheckerUrl,
              hintKey: 'nav.halalCheckerHint',
              icon: 'barcode',
            },
            { labelKey: 'nav.assistant', path: '/assistant', hintKey: 'nav.assistantHint', icon: 'assistant' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.assistantTitle',
        textKey: 'nav.featured.assistantText',
        ctaKey: 'nav.featured.assistantCta',
        path: '/assistant',
        icon: 'assistant',
      },
    }),
    group({
      id: 'admissions',
      labelKey: 'nav.admissions',
      icon: 'mosque',
      sections: [
        {
          labelKey: 'nav.section.apply',
          items: [
            { labelKey: 'nav.applyOnline', path: '/apply', hintKey: 'nav.applyOnlineHint', icon: 'contact' },
            { labelKey: 'nav.applyTrack', path: '/apply/track', hintKey: 'nav.applyTrackHint', icon: 'guides' },
          ],
        },
        {
          labelKey: 'nav.section.madrasas',
          items: [
            { labelKey: 'nav.madrasa', path: '/madrasa', hintKey: 'nav.madrasaHint', icon: 'mosque' },
            ...centreLinks,
          ],
        },
        {
          labelKey: 'nav.section.parents',
          items: [
            { labelKey: 'nav.safeDropOff', path: '/safe-drop-off', hintKey: 'nav.safeDropOffHint', icon: 'privacy' },
            { labelKey: 'nav.guides', path: '/guides', hintKey: 'nav.guidesHint', icon: 'guides' },
            { labelKey: 'nav.apps', path: '/apps', hintKey: 'nav.appsHint', icon: 'apps' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.applyTitle',
        textKey: 'nav.featured.applyText',
        ctaKey: 'nav.featured.applyCta',
        path: '/apply',
        icon: 'contact',
      },
    }),
    group({
      id: 'connect',
      labelKey: 'nav.connect',
      icon: 'connect',
      sections: [
        {
          labelKey: 'nav.section.give',
          items: [
            { labelKey: 'nav.donate', path: '/donate', hintKey: 'nav.donateHint', icon: 'donate' },
            { labelKey: 'nav.zakat', path: '/zakat', hintKey: 'nav.zakatHint', icon: 'zakat' },
          ],
        },
        {
          labelKey: 'nav.section.touch',
          items: [
            { labelKey: 'nav.contact', path: '/contact', hintKey: 'nav.contactHint', icon: 'contact' },
            { labelKey: 'nav.privacy', path: '/privacy', hintKey: 'nav.privacyHint', icon: 'privacy' },
          ],
        },
        {
          labelKey: 'nav.section.members',
          items: [
            { labelKey: 'nav.membership', path: '/membership', hintKey: 'nav.membershipHint', icon: 'about' },
            { labelKey: 'nav.membershipTrack', path: '/membership/track', hintKey: 'nav.membershipTrackHint', icon: 'guides' },
            { labelKey: 'header.signIn', path: '/portals', hintKey: 'nav.signInHint', icon: 'privacy' },
          ],
        },
      ],
      featured: {
        titleKey: 'nav.featured.donateTitle',
        textKey: 'nav.featured.donateText',
        ctaKey: 'nav.featured.donateCta',
        path: '/donate',
        icon: 'donate',
      },
    }),
  ];
}

export interface FooterColumn {
  readonly labelKey: string;
  readonly items: readonly NavLink[];
}

/**
 * Short footer: the pages people come back for, three columns of six.
 * The header menus hold the full map; this is deliberately not a sitemap.
 */
export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    labelKey: 'nav.admissions',
    items: [
      { labelKey: 'nav.applyOnline', path: '/apply', icon: 'contact' },
      { labelKey: 'nav.applyTrack', path: '/apply/track', icon: 'guides' },
      { labelKey: 'nav.madrasa', path: '/madrasa', icon: 'mosque' },
      { labelKey: 'nav.guides', path: '/guides', icon: 'guides' },
      { labelKey: 'nav.apps', path: '/apps', icon: 'apps' },
      { labelKey: 'header.signIn', path: '/portals', icon: 'privacy' },
    ],
  },
  {
    labelKey: 'footer.worshipLearn',
    items: [
      { labelKey: 'nav.namazTimes', path: '/namaz', icon: 'mosque' },
      { labelKey: 'nav.quranMajeed', path: '/quran', icon: 'quran' },
      { labelKey: 'nav.zakat', path: '/zakat', icon: 'zakat' },
      { labelKey: 'nav.seedhaRastah', path: '/seedha-rastah', icon: 'seedha' },
      { labelKey: 'nav.quiz', externalHref: ORGANIZATION.quizUrl, icon: 'quiz' },
      { labelKey: 'nav.assistant', path: '/assistant', icon: 'assistant' },
    ],
  },
  {
    labelKey: 'contact.eyebrow',
    items: [
      { labelKey: 'nav.donate', path: '/donate', icon: 'donate' },
      { labelKey: 'nav.membership', path: '/membership', icon: 'about' },
      { labelKey: 'nav.events', path: '/events', icon: 'events' },
      { labelKey: 'nav.ourWork', path: '/work', icon: 'work' },
      { labelKey: 'nav.aboutUs', path: '/about', icon: 'about' },
      { labelKey: 'nav.contact', path: '/contact', icon: 'contact' },
    ],
  },
];
