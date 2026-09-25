import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { EventsService } from '../../services/events.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { isEventToday } from '../../config/upcoming-events.config';

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

interface NavLink {
  readonly labelKey: string;
  readonly hintKey?: string;
  /** Internal Angular route. Omit when [externalHref] is set. */
  readonly path?: string;
  /** Absolute URL opened in a new tab (e.g. admin quiz player). */
  readonly externalHref?: string;
  readonly icon: NavIcon;
}

interface NavGroup {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: NavIcon;
  readonly items: readonly NavLink[];
}

@Component({
  selector: 'app-header',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly memberAuth = inject(MemberAuthService);

  protected readonly prayer = inject(PrayerTimesService);
  private readonly events = inject(EventsService);
  private readonly assistantLauncher = inject(AssistantLauncherService);
  private readonly router = inject(Router);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly openGroupId = signal<string | null>(null);
  protected readonly currentPath = signal('/');
  protected readonly latestEvent = this.events.latestDatedEvent;

  /**
   * Grouped navigation — every destination is a dedicated route (no hash links).
   * About = organisation; Beliefs = creed pages; kept separate so menus stay scannable.
   */
  protected readonly groups: readonly NavGroup[] = [
    {
      id: 'about',
      labelKey: 'nav.about',
      icon: 'about',
      items: [
        { labelKey: 'nav.aboutUs', path: '/about', hintKey: 'nav.aboutUsHint', icon: 'about' },
        { labelKey: 'nav.ourWork', path: '/work', hintKey: 'nav.ourWorkHint', icon: 'work' },
        {
          labelKey: 'nav.madrasa',
          path: '/madrasa',
          hintKey: 'nav.madrasaHint',
          icon: 'mosque',
        },
        {
          labelKey: 'nav.peterborough',
          path: '/peterborough',
          hintKey: 'nav.peterboroughHint',
          icon: 'mosque',
        },
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
        {
          labelKey: 'nav.basicBeliefs',
          path: '/basic-beliefs',
          hintKey: 'nav.basicBeliefsHint',
          icon: 'counsel',
        },
        {
          labelKey: 'nav.khatmeNabuwwat',
          path: '/khatme-nabuwwat',
          hintKey: 'nav.khatmeNabuwwatHint',
          icon: 'seal',
        },
        { labelKey: 'nav.ahleBait', path: '/ahle-bait', hintKey: 'nav.ahleBaitHint', icon: 'family' },
        {
          labelKey: 'nav.sahabaIkram',
          path: '/sahaba-ikram',
          hintKey: 'nav.sahabaIkramHint',
          icon: 'companions',
        },
        {
          labelKey: 'nav.auliaKaram',
          path: '/aulia-karam',
          hintKey: 'nav.auliaKaramHint',
          icon: 'guide',
        },
      ],
    },
    {
      id: 'worship',
      labelKey: 'nav.worship',
      icon: 'worship',
      items: [
        { labelKey: 'nav.namazTimes', path: '/namaz', hintKey: 'nav.namazTimesHint', icon: 'mosque' },
        {
          labelKey: 'nav.zakat',
          path: '/zakat',
          hintKey: 'nav.zakatHint',
          icon: 'zakat',
        },
        {
          labelKey: 'nav.whatIsZakat',
          path: '/zakat/what-is-zakat',
          hintKey: 'nav.whatIsZakatHint',
          icon: 'zakat',
        },
        {
          labelKey: 'nav.zakatRules',
          path: '/zakat/rules',
          hintKey: 'nav.zakatRulesHint',
          icon: 'zakat',
        },
        {
          labelKey: 'nav.duas',
          path: '/duas',
          hintKey: 'nav.duasHint',
          icon: 'worship',
        },
        {
          labelKey: 'nav.calendar',
          path: '/calendar',
          hintKey: 'nav.calendarHint',
          icon: 'worship',
        },
        {
          labelKey: 'nav.ramadan',
          path: '/ramadan',
          hintKey: 'nav.ramadanHint',
          icon: 'mosque',
        },
        {
          labelKey: 'nav.quranMajeed',
          path: '/quran',
          hintKey: 'nav.quranMajeedHint',
          icon: 'quran',
        },
        {
          labelKey: 'nav.hadith',
          path: '/hadith',
          hintKey: 'nav.hadithHint',
          icon: 'hadith',
        },
      ],
    },
    {
      id: 'learn',
      labelKey: 'nav.learn',
      icon: 'learn',
      items: [
        {
          labelKey: 'nav.seedhaRastah',
          path: '/seedha-rastah',
          hintKey: 'nav.seedhaRastahHint',
          icon: 'seedha',
        },
        {
          labelKey: 'nav.guidance',
          path: '/guidance',
          hintKey: 'nav.guidanceHint',
          icon: 'counsel',
        },
        {
          labelKey: 'nav.impact',
          path: '/impact',
          hintKey: 'nav.impactHint',
          icon: 'work',
        },
        { labelKey: 'nav.books', path: '/books', hintKey: 'nav.booksHint', icon: 'book' },
        {
          labelKey: 'nav.quiz',
          externalHref: ORGANIZATION.quizUrl,
          hintKey: 'nav.quizHint',
          icon: 'quiz',
        },
        {
          labelKey: 'nav.halalChecker',
          externalHref: ORGANIZATION.halalCheckerUrl,
          hintKey: 'nav.halalCheckerHint',
          icon: 'barcode',
        },
        {
          labelKey: 'nav.sermons',
          path: '/sermons',
          hintKey: 'nav.sermonsHint',
          icon: 'sermon',
        },
        {
          labelKey: 'nav.assistant',
          path: '/assistant',
          hintKey: 'nav.assistantHint',
          icon: 'assistant',
        },
        { labelKey: 'nav.apps', path: '/apps', hintKey: 'nav.appsHint', icon: 'apps' },
      ],
    },
    {
      id: 'connect',
      labelKey: 'nav.connect',
      icon: 'connect',
      items: [
        { labelKey: 'nav.events', path: '/events', hintKey: 'nav.eventsHint', icon: 'events' },
        {
          labelKey: 'nav.membership',
          path: '/membership',
          hintKey: 'nav.membershipHint',
          icon: 'about',
        },
        {
          labelKey: 'nav.memberLogin',
          path: '/membership/login',
          hintKey: 'nav.memberLoginHint',
          icon: 'contact',
        },
        {
          labelKey: 'nav.membershipTrack',
          path: '/membership/track',
          hintKey: 'nav.membershipTrackHint',
          icon: 'contact',
        },
        { labelKey: 'nav.donate', path: '/donate', hintKey: 'nav.donateHint', icon: 'donate' },
        { labelKey: 'nav.contact', path: '/contact', hintKey: 'nav.contactHint', icon: 'contact' },
        {
          labelKey: 'header.login',
          externalHref: ORGANIZATION.loginUrl,
          hintKey: 'nav.staffPortalHint',
          icon: 'contact',
        },
        {
          labelKey: 'nav.safeguarding',
          path: '/safeguarding',
          hintKey: 'nav.safeguardingHint',
          icon: 'privacy',
        },
        { labelKey: 'nav.privacy', path: '/privacy', hintKey: 'nav.privacyHint', icon: 'privacy' },
      ],
    },
  ];

  ngOnInit(): void {
    void this.memberAuth.restoreSession();
    void this.events.load();
    this.syncPath(this.router.url);
    this.schedulePrayerLoad();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.syncPath(e.urlAfterRedirects);
        this.closeMenu();
      });
  }

  constructor() {
    afterNextRender(() => {
      this.onScroll();
    });
    effect(() => {
      const hasTicker = !!this.latestEvent();
      if (typeof document === 'undefined') {
        return;
      }
      document.documentElement.classList.toggle('has-event-ticker', hasTicker);
    });
  }

  /** Defer AlAdhan fetch so it does not compete with first paint on every page. */
  private schedulePrayerLoad(): void {
    const run = () => void this.prayer.load();
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => run(), { timeout: 2500 });
    } else {
      setTimeout(run, 1200);
    }
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.openGroupId.set(null);
    this.menuOpen.set(false);
  }

  protected tickerTitle(): string {
    const event = this.latestEvent();
    if (!event) {
      return '';
    }
    return this.i18n.lang() === 'ur' ? event.titleUr : event.title;
  }

  protected tickerMeta(): string {
    const event = this.latestEvent();
    if (!event) {
      return '';
    }
    if (this.i18n.lang() === 'ur') {
      return event.whenLabelUr ?? event.recurringUr ?? event.audienceUr;
    }
    return event.whenLabel ?? event.recurring ?? event.audience;
  }

  protected tickerIsToday(): boolean {
    const event = this.latestEvent();
    return !!event && isEventToday(event);
  }

  protected tickerFragment(): string {
    const event = this.latestEvent();
    return event ? `event-${event.id}` : 'events';
  }

  protected openLatestEvent(domEvent: Event): void {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    this.onNavClick();
    void this.router.navigate(['/events'], { fragment: this.tickerFragment() });
  }

  protected isLinkActive(item: NavLink): boolean {
    if (item.externalHref || !item.path) return false;
    return this.currentPath() === item.path;
  }

  protected isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => this.isLinkActive(item));
  }

  protected isGroupOpen(id: string): boolean {
    return this.openGroupId() === id;
  }

  protected menuPanelWidth(group: NavGroup): string {
    return group.items.length > 5 ? 'min(36rem, calc(100vw - 2rem))' : '17rem';
  }

  protected toggleGroup(id: string, event?: Event): void {
    event?.stopPropagation();
    this.openGroupId.update((current) => (current === id ? null : id));
  }

  protected closeGroups(): void {
    this.openGroupId.set(null);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.openGroupId.set(null);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    this.openGroupId.set(null);
  }

  protected onNavClick(): void {
    this.closeMenu();
  }

  protected openAssistant(): void {
    this.closeMenu();
    if (this.currentPath() === '/assistant') {
      return;
    }
    this.assistantLauncher.open();
  }

  private syncPath(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.currentPath.set(path === '' ? '/' : path);
  }
}
