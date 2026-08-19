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
  readonly label: string;
  readonly path: string;
  readonly hint?: string;
  readonly icon: NavIcon;
}

interface NavGroup {
  readonly id: string;
  readonly label: string;
  readonly icon: NavIcon;
  readonly items: readonly NavLink[];
}

@Component({
  selector: 'app-header',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  /** Shared portal where admins, teachers and parents sign in. */
  protected readonly loginUrl = 'https://admin.naginasocialwelfare.co.uk/';

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
      label: 'About',
      icon: 'about',
      items: [
        { label: 'About us', path: '/about', hint: 'Who we are', icon: 'about' },
        { label: 'Our Work', path: '/work', hint: 'Education & welfare', icon: 'work' },
        {
          label: 'Spiritual Guide',
          path: '/spiritual-guide',
          hint: 'Pir-o-Murshid',
          icon: 'guide',
        },
        {
          label: 'Khatme Nabuwwat',
          path: '/khatme-nabuwwat',
          hint: 'Finality of Prophethood',
          icon: 'seal',
        },
        { label: 'Ahle Bait', path: '/ahle-bait', hint: 'The blessed family', icon: 'family' },
        {
          label: 'Sahaba Ikram',
          path: '/sahaba-ikram',
          hint: 'The noble Companions',
          icon: 'companions',
        },
        {
          label: 'Aulia Karam',
          path: '/aulia-karam',
          hint: 'Friends of Allah',
          icon: 'guide',
        },
        { label: 'Guidance', path: '/guidance', hint: 'Teachings & counsel', icon: 'counsel' },
      ],
    },
    {
      id: 'worship',
      label: 'Worship',
      icon: 'worship',
      items: [
        { label: 'Namaz Times', path: '/namaz', hint: 'Peterborough, UK', icon: 'mosque' },
        {
          label: 'Quran Majeed',
          path: '/quran',
          hint: 'Kanzul Iman translation',
          icon: 'quran',
        },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: 'learn',
      items: [
        { label: 'Books', path: '/books', hint: 'Seedha Rasta library', icon: 'book' },
        {
          label: 'Sermons',
          path: '/sermons',
          hint: 'Baba Ji Sarkar bayanat',
          icon: 'sermon',
        },
        {
          label: 'Nagina Assistant',
          path: '/assistant',
          hint: 'Ask in English or Urdu',
          icon: 'assistant',
        },
        { label: 'Apps', path: '/apps', hint: 'Mobile learning', icon: 'apps' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      icon: 'connect',
      items: [
        { label: 'Events', path: '/events', hint: 'Gatherings & programmes', icon: 'events' },
        { label: 'Donate', path: '/donate', hint: 'Support our work', icon: 'donate' },
        { label: 'Contact', path: '/contact', hint: 'Get in touch', icon: 'contact' },
        { label: 'Privacy', path: '/privacy', hint: 'How we use data', icon: 'privacy' },
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
