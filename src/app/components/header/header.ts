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
import { PrayerTimesService } from '../../services/prayer-times.service';

interface NavLink {
  readonly label: string;
  readonly path: string;
  readonly fragment?: string;
  readonly hint?: string;
}

interface NavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavLink[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  /** Shared portal where admins, teachers and parents sign in. */
  protected readonly loginUrl = 'https://admin.naginasocialwelfare.co.uk/';

  protected readonly prayer = inject(PrayerTimesService);
  private readonly router = inject(Router);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly openGroupId = signal<string | null>(null);
  protected readonly activeFragment = signal('top');
  protected readonly currentPath = signal('/');

  /**
   * Concise grouped navigation — homepage sections + dedicated tool routes.
   */
  protected readonly groups: readonly NavGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', path: '/', fragment: 'about', hint: 'Who we are' },
        { label: 'Our Work', path: '/', fragment: 'work', hint: 'Education & welfare' },
        {
          label: 'Spiritual Guide',
          path: '/',
          fragment: 'spiritual-guide',
          hint: 'Pir-o-Murshid',
        },
        { label: 'Ahle Bait', path: '/', fragment: 'ahle-bait', hint: 'The blessed family' },
        { label: 'Guidance', path: '/', fragment: 'guidance', hint: 'Teachings & counsel' },
      ],
    },
    {
      id: 'worship',
      label: 'Worship',
      items: [
        { label: 'Namaz Times', path: '/namaz', hint: 'Peterborough, UK' },
        { label: 'Quran Majeed', path: '/quran', hint: 'Kanzul Iman translation' },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      items: [
        { label: 'Books', path: '/books', hint: 'Seedha Rasta library' },
        { label: 'Sermons', path: '/sermons', hint: 'Baba Ji Sarkar bayanat' },
        { label: 'Apps', path: '/', fragment: 'apps', hint: 'Mobile learning' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      items: [
        { label: 'Events', path: '/', fragment: 'events', hint: 'Gatherings & programmes' },
        { label: 'Donate', path: '/', fragment: 'donate', hint: 'Support our work' },
        { label: 'Contact', path: '/', fragment: 'contact', hint: 'Get in touch' },
        { label: 'Privacy', path: '/', fragment: 'privacy', hint: 'How we use data' },
      ],
    },
  ];

  private readonly homeSectionIds = [
    'top',
    'spiritual-guide',
    'ahle-bait',
    'about',
    'work',
    'guidance',
    'events',
    'donate',
    'apps',
    'contact',
    'privacy',
  ] as const;

  ngOnInit(): void {
    void this.prayer.load();
    this.syncPath(this.router.url);

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.syncPath(e.urlAfterRedirects);
        this.closeMenu();
        queueMicrotask(() => this.updateActiveSection());
      });
  }

  constructor() {
    afterNextRender(() => {
      this.onScroll();
      this.updateActiveSection();
    });
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 16);
    this.updateActiveSection();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.openGroupId.set(null);
    this.menuOpen.set(false);
  }

  protected isLinkActive(item: NavLink): boolean {
    const path = this.currentPath();
    if (item.path !== '/' && path === item.path) return true;
    if (item.path === '/' && path === '/' && item.fragment) {
      return this.activeFragment() === item.fragment;
    }
    return false;
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

  private syncPath(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.currentPath.set(path === '' ? '/' : path);
  }

  private updateActiveSection(): void {
    if (this.currentPath() !== '/') {
      this.activeFragment.set('');
      return;
    }

    const offset = 140;
    let current: string = 'top';

    for (const id of this.homeSectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top - offset <= 0) {
        current = id;
      }
    }

    this.activeFragment.set(current);
  }
}
