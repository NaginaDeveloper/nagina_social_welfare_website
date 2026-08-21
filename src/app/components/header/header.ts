import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

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
  | 'sermon'
  | 'apps'
  | 'assistant'
  | 'events'
  | 'donate'
  | 'contact'
  | 'privacy'
  | 'worship'
  | 'learn'
  | 'connect';

interface NavLink {
  readonly labelKey: string;
  readonly hintKey?: string;
  readonly path: string;
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
  imports: [NgTemplateOutlet, RouterLink, WhatsappIcon],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly whatsapp = whatsappHref();
  protected readonly i18n = inject(LanguageService);

  protected readonly prayer = inject(PrayerTimesService);
  private readonly assistantLauncher = inject(AssistantLauncherService);
  private readonly router = inject(Router);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly openGroupId = signal<string | null>(null);
  protected readonly currentPath = signal('/');

  /**
   * Grouped navigation — every destination is a dedicated route (no hash links).
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
          labelKey: 'nav.spiritualGuide',
          path: '/spiritual-guide',
          hintKey: 'nav.spiritualGuideHint',
          icon: 'guide',
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
        {
          labelKey: 'nav.basicBeliefs',
          path: '/basic-beliefs',
          hintKey: 'nav.basicBeliefsHint',
          icon: 'counsel',
        },
        { labelKey: 'nav.guidance', path: '/guidance', hintKey: 'nav.guidanceHint', icon: 'counsel' },
      ],
    },
    {
      id: 'worship',
      labelKey: 'nav.worship',
      icon: 'worship',
      items: [
        { labelKey: 'nav.namazTimes', path: '/namaz', hintKey: 'nav.namazTimesHint', icon: 'mosque' },
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
        { labelKey: 'nav.books', path: '/books', hintKey: 'nav.booksHint', icon: 'book' },
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
        { labelKey: 'nav.donate', path: '/donate', hintKey: 'nav.donateHint', icon: 'donate' },
        { labelKey: 'nav.contact', path: '/contact', hintKey: 'nav.contactHint', icon: 'contact' },
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
    void this.prayer.load();
    this.syncPath(this.router.url);

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

  protected isLinkActive(item: NavLink): boolean {
    return this.currentPath() === item.path;
  }

  protected isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => this.isLinkActive(item));
  }

  protected isGroupOpen(id: string): boolean {
    return this.openGroupId() === id;
  }

  protected menuPanelWidth(group: NavGroup): string {
    return group.items.length > 4 ? 'min(36rem, calc(100vw - 2rem))' : '16rem';
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
    if (this.currentPath() === '/assistant') {
      return;
    }
    this.assistantLauncher.open();
    this.onNavClick();
  }

  private syncPath(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.currentPath.set(path === '' ? '/' : path);
  }
}
