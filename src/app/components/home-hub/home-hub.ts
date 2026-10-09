import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
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
  imports: [FormsModule, NgTemplateOutlet, RouterLink, HeroTopActions, Icon, Reveal],
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

  /** What people come for most, as large cards first. */
  private static readonly TOP_IDS = ['salah', 'donate', 'apply', 'sermons'] as const;
  /** Next most used, as smaller cards; everything else is behind "Show all". */
  private static readonly POPULAR_IDS = ['quran', 'assistant', 'quiz', 'zakat', 'halal', 'events', 'membership', 'sign-in'] as const;

  private byIds(ids: readonly string[]): HubTile[] {
    return ids.map((id) => this.tiles.find((t) => t.id === id)).filter((t): t is HubTile => !!t);
  }

  protected readonly searching = computed(() => this.query().trim().length > 0);
  protected readonly topTiles = computed(() => this.byIds(HomeHub.TOP_IDS));
  protected readonly popularTiles = computed(() => this.byIds(HomeHub.POPULAR_IDS));
  protected readonly moreTiles = computed(() => {
    const shown = new Set<string>([...HomeHub.TOP_IDS, ...HomeHub.POPULAR_IDS]);
    return this.tiles.filter((t) => !shown.has(t.id));
  });

  /** While searching, every match as a small card. */
  protected readonly visibleTiles = computed(() => this.filteredTiles());

  protected readonly hiddenTileCount = computed(() => this.moreTiles().length);

  /**
   * Makkah, Madinah and Al-Aqsa for the hero; none needs a credit. Makkah:
   * supplied by the charity as free to use (8 Oct 2026). Madinah and
   * Al-Aqsa: Wikimedia Commons, CC0 and public domain.
   */
  protected readonly haramain = [
    {
      src: '/media/haramain-makkah-arch.webp',
      alt: 'The Holy Kaaba seen through an arch of Masjid al-Haram, Makkah',
      name: 'Holy Makkah',
      width: 498,
      height: 888,
      focus: '50% 55%',
    },
    {
      src: '/media/haramain-madinah-480.webp',
      alt: 'The Green Dome and a minaret of Masjid an-Nabawi, Madinah, against a blue sky',
      name: 'Blessed Madinah',
      width: 480,
      height: 720,
      focus: '40% 100%',
    },
    {
      src: '/media/haramain-aqsa-480.webp',
      alt: 'The golden Dome of the Rock in the Al-Aqsa compound, Jerusalem',
      name: 'Sacred Al-Aqsa',
      width: 480,
      height: 640,
      focus: '50% 45%',
    },
  ] as const;

  /** Soft gold lights that blink around the hero. */
  /** Light rays behind the illuminated Qur'an: long and short in turn, like a star. */
  protected readonly quranRays = Array.from({ length: 24 }, (_, i) => ({
    angle: i * 15,
    length: i % 2 === 0 ? 168 : 112,
    width: i % 2 === 0 ? 7 : 4.5,
  }));

  /** Small gold stars that twinkle around the Qur'an. */
  protected readonly quranStars = [
    { x: 92, y: 62, s: 0.9, delay: '0s' },
    { x: 318, y: 48, s: 0.7, delay: '1.2s' },
    { x: 340, y: 128, s: 0.55, delay: '2.1s' },
    { x: 66, y: 140, s: 0.6, delay: '0.7s' },
    { x: 262, y: 18, s: 0.5, delay: '1.7s' },
  ];

  /** Specks of light that rise from the Qur'an's pages. */
  protected readonly quranSparks = [
    { x: 168, r: 2.2, delay: '0s', duration: '4.2s' },
    { x: 186, r: 1.6, delay: '1.1s', duration: '3.6s' },
    { x: 200, r: 2.6, delay: '2.3s', duration: '4.8s' },
    { x: 214, r: 1.8, delay: '0.6s', duration: '3.9s' },
    { x: 232, r: 2.2, delay: '1.8s', duration: '4.4s' },
    { x: 192, r: 1.4, delay: '3s', duration: '3.4s' },
    { x: 222, r: 1.5, delay: '2.7s', duration: '3.8s' },
  ];

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
