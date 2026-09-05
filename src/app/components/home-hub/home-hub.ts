import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { PrayerTimesService } from '../../services/prayer-times.service';

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
  /** Extra English search terms (not shown). */
  readonly keywords: readonly string[];
}

@Component({
  selector: 'app-home-hub',
  imports: [FormsModule, RouterLink],
  templateUrl: './home-hub.html',
})
export class HomeHub implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly prayer = inject(PrayerTimesService);

  protected readonly query = signal('');

  protected readonly tiles: readonly HubTile[] = [
    {
      id: 'quiz',
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
      labelKey: 'nav.halalChecker',
      hintKey: 'nav.halalCheckerHint',
      externalHref: ORGANIZATION.halalCheckerUrl,
      ariaKey: 'spotlight.halalCheckerAria',
      tone: 'featured',
      groupKey: 'hub.group.learn',
      keywords: ['halal', 'barcode', 'pack', 'shelf', 'supermarket'],
    },
    {
      id: 'salah',
      labelKey: 'nav.namazTimes',
      hintKey: 'nav.namazTimesHint',
      path: '/namaz',
      tone: 'featured',
      groupKey: 'hub.group.worship',
      keywords: ['salah', 'prayer', 'namaz', 'fajr', 'isha', 'times'],
    },
    {
      id: 'donate',
      labelKey: 'nav.donate',
      hintKey: 'nav.donateHint',
      path: '/donate',
      tone: 'donate',
      groupKey: 'hub.group.connect',
      keywords: ['donate', 'zakat', 'sadaqah', 'charity', 'gift'],
    },
    {
      id: 'apply',
      labelKey: 'nav.madrasa',
      hintKey: 'nav.madrasaHint',
      path: '/apply',
      tone: 'featured',
      groupKey: 'hub.group.about',
      keywords: ['madrasa', 'apply', 'admission', 'enrol', 'class'],
    },
    {
      id: 'quran',
      labelKey: 'nav.quranMajeed',
      hintKey: 'nav.quranMajeedHint',
      path: '/quran',
      tone: 'default',
      groupKey: 'hub.group.worship',
      keywords: ['quran', 'kanzul', 'surah'],
    },
    {
      id: 'hadith',
      labelKey: 'nav.hadith',
      hintKey: 'nav.hadithHint',
      path: '/hadith',
      tone: 'default',
      groupKey: 'hub.group.worship',
      keywords: ['hadith', 'bukhari', 'muslim'],
    },
    {
      id: 'beliefs',
      labelKey: 'nav.basicBeliefs',
      hintKey: 'nav.basicBeliefsHint',
      path: '/basic-beliefs',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['creed', 'aqidah', 'beliefs', 'faq'],
    },
    {
      id: 'khatme',
      labelKey: 'nav.khatmeNabuwwat',
      hintKey: 'nav.khatmeNabuwwatHint',
      path: '/khatme-nabuwwat',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['finality', 'prophethood', 'seal'],
    },
    {
      id: 'ahle',
      labelKey: 'nav.ahleBait',
      hintKey: 'nav.ahleBaitHint',
      path: '/ahle-bait',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['ahl', 'bayt', 'family', 'household'],
    },
    {
      id: 'sahaba',
      labelKey: 'nav.sahabaIkram',
      hintKey: 'nav.sahabaIkramHint',
      path: '/sahaba-ikram',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['companions', 'sahaba', 'sahabah'],
    },
    {
      id: 'awliya',
      labelKey: 'nav.auliaKaram',
      hintKey: 'nav.auliaKaramHint',
      path: '/aulia-karam',
      tone: 'default',
      groupKey: 'hub.group.beliefs',
      keywords: ['awliya', 'friends', 'saints'],
    },
    {
      id: 'seedha',
      labelKey: 'nav.seedhaRastah',
      hintKey: 'nav.seedhaRastahHint',
      path: '/seedha-rastah',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['seedha', 'archive', 'yusufi'],
    },
    {
      id: 'books',
      labelKey: 'nav.books',
      hintKey: 'nav.booksHint',
      path: '/books',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['books', 'pdf', 'library'],
    },
    {
      id: 'sermons',
      labelKey: 'nav.sermons',
      hintKey: 'nav.sermonsHint',
      path: '/sermons',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['sermons', 'bayan', 'youtube', 'lecture'],
    },
    {
      id: 'guidance',
      labelKey: 'nav.guidance',
      hintKey: 'nav.guidanceHint',
      path: '/guidance',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['guidance', 'teachings', 'counsel'],
    },
    {
      id: 'guide',
      labelKey: 'nav.spiritualGuide',
      hintKey: 'nav.spiritualGuideHint',
      path: '/spiritual-guide',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['guide', 'shajra', 'lineage', 'yusufi'],
    },
    {
      id: 'events',
      labelKey: 'nav.events',
      hintKey: 'nav.eventsHint',
      path: '/events',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['events', 'gathering', 'programme'],
    },
    {
      id: 'apps',
      labelKey: 'nav.apps',
      hintKey: 'nav.appsHint',
      path: '/apps',
      tone: 'default',
      groupKey: 'hub.group.learn',
      keywords: ['apps', 'mobile', 'android'],
    },
    {
      id: 'membership',
      labelKey: 'nav.membership',
      hintKey: 'nav.membershipHint',
      path: '/membership',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['membership', 'member', 'join'],
    },
    {
      id: 'work',
      labelKey: 'nav.ourWork',
      hintKey: 'nav.ourWorkHint',
      path: '/work',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['work', 'education', 'welfare', 'charity'],
    },
    {
      id: 'about',
      labelKey: 'nav.aboutUs',
      hintKey: 'nav.aboutUsHint',
      path: '/about',
      tone: 'default',
      groupKey: 'hub.group.about',
      keywords: ['about', 'vision', 'charity'],
    },
    {
      id: 'contact',
      labelKey: 'nav.contact',
      hintKey: 'nav.contactHint',
      path: '/contact',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['contact', 'whatsapp', 'email', 'phone'],
    },
    {
      id: 'assistant',
      labelKey: 'nav.assistant',
      hintKey: 'nav.assistantHint',
      path: '/assistant',
      tone: 'default',
      groupKey: 'hub.group.connect',
      keywords: ['assistant', 'ask', 'help', 'ai'],
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

  ngOnInit(): void {
    void this.prayer.load();
  }

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected tileClass(tone: HubTileTone): string {
    const base =
      'group flex min-h-[7.5rem] flex-col rounded-2xl border p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] sm:min-h-[8.25rem] sm:p-5';
    if (tone === 'featured') {
      return `${base} border-gold/40 bg-gradient-to-br from-gold/15 to-white hover:border-gold/60`;
    }
    if (tone === 'donate') {
      return `${base} border-gold/30 bg-gold/10 hover:border-gold/50`;
    }
    return `${base} border-mist bg-white hover:border-gold/40`;
  }

  protected salahSubtitle(): string {
    const status = this.prayer.headerStatus();
    if (!status) {
      return this.i18n.t('nav.namazTimesHint');
    }
    const prefix =
      status.kind === 'current' ? this.i18n.t('spotlight.namazNow') : this.i18n.t('spotlight.namazNext');
    return `${prefix}: ${status.name} · ${status.remaining}`;
  }
}
