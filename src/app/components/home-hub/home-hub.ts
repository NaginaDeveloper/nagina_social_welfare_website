import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CENTRE_PAGE_PATHS, centrePath } from '../../config/centre-pages.config';
import type { NavIcon } from '../../config/navigation.config';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { HeroTopActions } from '../hero-top-actions/hero-top-actions';
import { Icon } from '../ui/icon';
import { Reveal } from '../../directives/reveal';

export type HubTileTone = 'featured' | 'donate' | 'default';

export interface HubTile {
  readonly id: string;
  readonly labelKey: string;
  readonly hintKey: string;
  readonly path?: string;
  readonly externalHref?: string;
  readonly ariaKey?: string;
  readonly tone: HubTileTone;
  readonly groupKey: string;
  readonly icon: NavIcon;
  /** Extra English search terms (not shown). */
  readonly keywords: readonly string[];
}

/** A centre link in the hero: live from the campus list, or the static route while it loads. */
export interface HeroCentreChip {
  readonly id: string;
  readonly town: string;
  readonly name: string | null;
  readonly path: string;
}

@Component({
  selector: 'app-home-hub',
  imports: [FormsModule, RouterLink, HeroTopActions, Icon, Reveal],
  templateUrl: './home-hub.html',
})
export class HomeHub implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly prayer = inject(PrayerTimesService);
  private readonly campusService = inject(CampusService);

  /** Peterborough and Manchester chips; falls back to the fixed centre routes before the API answers. */
  protected readonly centreChips = computed<readonly HeroCentreChip[]>(() => {
    const campuses = this.campusService.campuses();
    if (campuses.length > 0) {
      return campuses.map((campus) => ({
        id: campus.id,
        town: campusTown(campus),
        name: campus.displayName,
        path: centrePath(campus.id),
      }));
    }
    return Object.entries(CENTRE_PAGE_PATHS).map(([id, path]) => ({
      id,
      town: id.charAt(0).toUpperCase() + id.slice(1),
      name: null,
      path,
    }));
  });


  protected readonly query = signal('');
  protected readonly showAll = signal(false);

  protected readonly tiles: readonly HubTile[] = [
    {
      id: 'quiz',
      icon: 'quiz',
      labelKey: 'nav.quiz',
      hintKey: 'nav.quizHint',
      externalHref: ORGANIZATION.quizUrl,
      ariaKey: 'spotlight.quizAria',
      tone: 'featured',
      groupKey: 'hub.group.learn',
      keywords: ['quiz', 'halal', 'haram', 'supermarket', 'timed'],
    },
    {
      id: 'halal',
      icon: 'barcode',
      labelKey: 'nav.halalChecker',
      hintKey: 'nav.halalCheckerHint',
      externalHref: ORGANIZATION.halalCheckerUrl,
      ariaKey: 'spotlight.halalCheckerAria',
      tone: 'featured',
      groupKey: 'hub.group.learn',
      keywords: ['halal', 'barcode', 'pack', 'shelf', 'supermarket'],
    },
    {
      id: 'assistant',
      icon: 'assistant',
      labelKey: 'nav.assistant',
      hintKey: 'nav.assistantHint',
      path: '/assistant',
      tone: 'featured',
      groupKey: 'hub.group.connect',
      keywords: ['assistant', 'ask', 'help', 'ai'],
    },
    {
      id: 'salah',
      icon: 'mosque',
      labelKey: 'nav.namazTimes',
      hintKey: 'nav.namazTimesHint',
      path: '/namaz',
      tone: 'featured',
      groupKey: 'hub.group.worship',
      keywords: ['salah', 'prayer', 'namaz', 'fajr', 'isha', 'times'],
    },
    {
      id: 'zakat',
      icon: 'zakat',
      labelKey: 'nav.zakat',
      hintKey: 'nav.zakatHint',
      path: '/zakat',
      tone: 'featured',
      groupKey: 'hub.group.worship',
      keywords: ['zakat', 'nisab', 'calculator', 'jewellery', 'gold', 'silver'],
    },
    {
      id: 'donate',
      icon: 'donate',
      labelKey: 'nav.donate',
      hintKey: 'nav.donateHint',
      path: '/donate',
      tone: 'donate',
      groupKey: 'hub.group.connect',
      keywords: ['donate', 'zakat', 'sadaqah', 'charity', 'gift'],
    },
    {
      id: 'apply',
      icon: 'contact',
      labelKey: 'nav.applyOnline',
      hintKey: 'nav.applyOnlineHint',
      path: '/apply',
      tone: 'featured',
      groupKey: 'hub.group.about',
      keywords: ['madrasa', 'apply', 'admission', 'admissions', 'enrol', 'class'],
    },
    {
      id: 'quran',
      icon: 'quran',
      labelKey: 'nav.quranMajeed',
      hintKey: 'nav.quranMajeedHint',
      path: '/quran',
      tone: 'default',
      groupKey: 'hub.group.worship',
      keywords: ['quran', 'kanzul', 'surah'],
    },
    {
      id: 'hadith',
      icon: 'hadith',
      labelKey: 'nav.hadith',
      hintKey: 'nav.hadithHint',
      path: '/hadith',
      tone: 'default',
      groupKey: 'hub.group.worship',
      keywords: ['hadith', 'bukhari', 'muslim'],
    },
    {
      id: 'beliefs',
      icon: 'counsel',
      labelKey: 'nav.basicBeliefs',
      hintKey: 'nav.basicBeliefsHint',
      path: '/basic-beliefs',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['creed', 'aqidah', 'beliefs', 'faq'],
    },
    {
      id: 'khatme',
      icon: 'seal',
      labelKey: 'nav.khatmeNabuwwat',
      hintKey: 'nav.khatmeNabuwwatHint',
      path: '/khatme-nabuwwat',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['finality', 'prophethood', 'seal'],
    },
    {
      id: 'ahle',
      icon: 'family',
      labelKey: 'nav.ahleBait',
      hintKey: 'nav.ahleBaitHint',
      path: '/ahle-bait',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['ahl', 'bayt', 'family', 'household'],
    },
    {
      id: 'sahaba',
      icon: 'companions',
      labelKey: 'nav.sahabaIkram',
      hintKey: 'nav.sahabaIkramHint',
      path: '/sahaba-ikram',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['companions', 'sahaba', 'sahabah'],
    },
    {
      id: 'awliya',
      icon: 'guide',
      labelKey: 'nav.auliaKaram',
      hintKey: 'nav.auliaKaramHint',
      path: '/aulia-karam',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['awliya', 'friends', 'saints'],
    },
    {
      id: 'seedha',
      icon: 'seedha',
      labelKey: 'nav.seedhaRastah',
      hintKey: 'nav.seedhaRastahHint',
      path: '/seedha-rastah',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['seedha', 'archive', 'yusufi'],
    },
    {
      id: 'books',
      icon: 'book',
      labelKey: 'nav.books',
      hintKey: 'nav.booksHint',
      path: '/books',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['books', 'pdf', 'library'],
    },
    {
      id: 'sermons',
      icon: 'sermon',
      labelKey: 'nav.sermons',
      hintKey: 'nav.sermonsHint',
      path: '/sermons',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['sermons', 'bayan', 'youtube', 'lecture'],
    },
    {
      id: 'guidance',
      icon: 'counsel',
      labelKey: 'nav.guidance',
      hintKey: 'nav.guidanceHint',
      path: '/guidance',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['guidance', 'teachings', 'counsel'],
    },
    {
      id: 'guide',
      icon: 'guide',
      labelKey: 'nav.spiritualGuide',
      hintKey: 'nav.spiritualGuideHint',
      path: '/spiritual-guide',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['guide', 'shajra', 'lineage', 'yusufi'],
    },
    {
      id: 'events',
      icon: 'events',
      labelKey: 'nav.events',
      hintKey: 'nav.eventsHint',
      path: '/events',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['events', 'gathering', 'programme'],
    },
    {
      id: 'apps',
      icon: 'apps',
      labelKey: 'nav.apps',
      hintKey: 'nav.appsHint',
      path: '/apps',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['apps', 'mobile', 'android'],
    },
    {
      id: 'guides',
      icon: 'guides',
      labelKey: 'nav.guides',
      hintKey: 'nav.guidesHint',
      path: '/guides',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['guide', 'manual', 'video', 'help', 'portal', 'parent', 'teacher', 'student', 'how to'],
    },
    {
      id: 'membership',
      icon: 'about',
      labelKey: 'nav.membership',
      hintKey: 'nav.membershipHint',
      path: '/membership',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['membership', 'member', 'join', 'apply'],
    },
    {
      id: 'sign-in',
      icon: 'privacy',
      labelKey: 'header.signIn',
      hintKey: 'nav.signInHint',
      path: '/portals',
      tone: 'featured',
      groupKey: 'hub.group.connect',
      keywords: ['login', 'sign in', 'signin', 'member', 'account', 'portal', 'parent', 'student', 'teacher', 'collector', 'admin'],
    },
    {
      id: 'work',
      icon: 'work',
      labelKey: 'nav.ourWork',
      hintKey: 'nav.ourWorkHint',
      path: '/work',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['work', 'education', 'welfare', 'charity'],
    },
    {
      id: 'about',
      icon: 'about',
      labelKey: 'nav.aboutUs',
      hintKey: 'nav.aboutUsHint',
      path: '/about',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['about', 'vision', 'charity'],
    },
    {
      id: 'contact',
      icon: 'contact',
      labelKey: 'nav.contact',
      hintKey: 'nav.contactHint',
      path: '/contact',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['contact', 'whatsapp', 'email', 'phone'],
    },
  ];

  protected readonly filteredTiles = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.tiles;
    }
    return this.tiles.filter((tile) => {
      const label = this.i18n.t(tile.labelKey).toLowerCase();
      const hint = this.i18n.t(tile.hintKey).toLowerCase();
      const group = this.i18n.t(tile.groupKey).toLowerCase();
      return (
        label.includes(q) ||
        hint.includes(q) ||
        group.includes(q) ||
        tile.keywords.some((k) => k.includes(q) || q.includes(k))
      );
    });
  });

  /** Eight headline tiles by default; the full list behind "Show all" or any search. */
  protected readonly visibleTiles = computed(() => {
    if (this.query().trim() || this.showAll()) {
      return this.filteredTiles();
    }
    return this.tiles.filter((tile) => tile.tone !== 'default');
  });

  protected readonly hiddenTileCount = computed(() => this.tiles.length - this.visibleTiles().length);

  /** Rose petals that drift down the hero (hidden under reduced motion). */
  protected readonly petals = [
    { src: '/decor/petal-pink.webp', left: '4%', delay: '0s', duration: '13s', size: '2.2rem', drift: '-24px' },
    { src: '/decor/petal-red.webp', left: '13%', delay: '2.2s', duration: '15s', size: '1.9rem', drift: '26px' },
    { src: '/decor/petal-gold.webp', left: '22%', delay: '0.9s', duration: '14s', size: '2rem', drift: '-30px' },
    { src: '/decor/petal-pink.webp', left: '34%', delay: '3.1s', duration: '16s', size: '2.4rem', drift: '18px' },
    { src: '/decor/petal-red.webp', left: '45%', delay: '0.5s', duration: '12.5s', size: '1.8rem', drift: '-14px' },
    { src: '/decor/petal-gold.webp', left: '56%', delay: '2.6s', duration: '14.5s', size: '2.1rem', drift: '28px' },
    { src: '/decor/petal-pink.webp', left: '66%', delay: '1.4s', duration: '13.5s', size: '2rem', drift: '-24px' },
    { src: '/decor/petal-red.webp', left: '75%', delay: '3.8s', duration: '15.5s', size: '2.3rem', drift: '16px' },
    { src: '/decor/petal-gold.webp', left: '84%', delay: '1.8s', duration: '14s', size: '1.8rem', drift: '-28px' },
    { src: '/decor/petal-pink.webp', left: '92%', delay: '2.9s', duration: '16.5s', size: '2.2rem', drift: '20px' },
    { src: '/decor/petal-red.webp', left: '28%', delay: '5.2s', duration: '13s', size: '1.7rem', drift: '12px' },
    { src: '/decor/petal-gold.webp', left: '61%', delay: '4.4s', duration: '15s', size: '2rem', drift: '-18px' },
  ] as const;

  /** Soft gold lights that blink around the hero. */
  protected readonly sparkles = [
    { left: '6%', top: '14%', delay: '0s', duration: '2.4s', size: '0.6rem' },
    { left: '16%', top: '62%', delay: '0.7s', duration: '3s', size: '0.45rem' },
    { left: '30%', top: '22%', delay: '1.3s', duration: '2.6s', size: '0.5rem' },
    { left: '44%', top: '78%', delay: '0.4s', duration: '2.8s', size: '0.4rem' },
    { left: '58%', top: '12%', delay: '1.9s', duration: '2.2s', size: '0.55rem' },
    { left: '72%', top: '70%', delay: '0.9s', duration: '3.2s', size: '0.5rem' },
    { left: '86%', top: '30%', delay: '1.6s', duration: '2.5s', size: '0.6rem' },
    { left: '94%', top: '58%', delay: '0.2s', duration: '2.9s', size: '0.45rem' },
  ] as const;

  ngOnInit(): void {
    void this.prayer.load();
    void this.campusService.load();
  }

  protected showAllLabel(): string {
    if (this.showAll()) {
      return this.i18n.t('hub.showFewer');
    }
    return this.i18n.t('hub.showAll').replace('{n}', String(this.hiddenTileCount()));
  }

  protected toggleShowAll(): void {
    this.showAll.update((v) => !v);
  }

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected tileClass(tone: HubTileTone): string {
    const base =
      'group flex w-full min-h-[8.5rem] flex-col rounded-2xl border p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-portal active:scale-[0.99] sm:p-5';
    if (tone === 'featured') {
      return `${base} border-gold/40 bg-gradient-to-br from-gold/15 to-white hover:border-gold/60`;
    }
    if (tone === 'donate') {
      return `${base} border-gold/30 bg-gold/10 hover:border-gold/50`;
    }
    return `${base} border-mist bg-white hover:border-gold/40`;
  }

  /** Icon badge colours per tile tone. */
  protected iconClass(tone: HubTileTone): string {
    const base =
      'mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11';
    if (tone === 'default') {
      return `${base} bg-gradient-to-br from-emerald to-forest text-gold-300`;
    }
    return `${base} bg-gradient-to-br from-gold-300 to-gold text-forest shadow-soft`;
  }

  protected salahSubtitle(): string {
    const status = this.prayer.headerStatus();
    if (!status) {
      return this.i18n.t('nav.namazTimesHint');
    }
    const prefix =
      status.kind === 'current' ? this.i18n.t('spotlight.namazNow') : this.i18n.t('spotlight.namazNext');
    const town = this.prayer.placeTown();
    return `${prefix}: ${status.name} · ${status.remaining}${town ? ` · ${town}` : ''}`;
  }
}
