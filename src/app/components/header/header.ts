import {
  Component,
  HostListener,
  OnInit,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { PrayerTimesService } from '../../services/prayer-times.service';

interface NavLink {
  readonly label: string;
  readonly fragment: string;
  readonly hint?: string;
}

interface NavGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly NavLink[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  /** Shared portal where admins, teachers and parents sign in. */
  protected readonly loginUrl = 'https://admin.naginasocialwelfare.co.uk/';

  protected readonly prayer = inject(PrayerTimesService);

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly openGroupId = signal<string | null>(null);
  protected readonly activeFragment = signal('top');

  /**
   * Concise grouped navigation — keeps the bar calm on desktop
   * and reads as clear sections on mobile.
   */
  protected readonly groups: readonly NavGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', fragment: 'about', hint: 'Who we are' },
        { label: 'Our Work', fragment: 'work', hint: 'Education & welfare' },
        { label: 'Spiritual Guide', fragment: 'spiritual-guide', hint: 'Pir-o-Murshid' },
        { label: 'Ahle Bait', fragment: 'ahle-bait', hint: 'The blessed family' },
        { label: 'Guidance', fragment: 'guidance', hint: 'Teachings & counsel' },
      ],
    },
    {
      id: 'worship',
      label: 'Worship',
      items: [
        { label: 'Namaz Times', fragment: 'prayer-times', hint: 'Peterborough, UK' },
        {
          label: 'Blessed Quran Majeed',
          fragment: 'quran',
          hint: 'Kanzul Iman translation',
        },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      items: [
        { label: 'Books', fragment: 'books', hint: 'Seedha Rasta library' },
        { label: 'Apps', fragment: 'apps', hint: 'Mobile learning' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      items: [
        { label: 'Events', fragment: 'events', hint: 'Gatherings & programmes' },
        { label: 'Donate', fragment: 'donate', hint: 'Support our work' },
        { label: 'Contact', fragment: 'contact', hint: 'Get in touch' },
        { label: 'Privacy', fragment: 'privacy', hint: 'How we use data' },
      ],
    },
  ];

  private readonly sectionIds = [
    'top',
    'spiritual-guide',
    'ahle-bait',
    'about',
    'work',
    'guidance',
    'prayer-times',
    'quran',
    'books',
    'events',
    'donate',
    'apps',
    'contact',
    'privacy',
  ] as const;

  ngOnInit(): void {
    void this.prayer.load();
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

  protected isActive(fragment: string): boolean {
    return this.activeFragment() === fragment;
  }

  protected isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => item.fragment === this.activeFragment());
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

  protected navigate(fragment: string): void {
    this.closeMenu();
    this.activeFragment.set(fragment);
  }

  private updateActiveSection(): void {
    const offset = 140;
    let current: string = 'top';

    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top - offset <= 0) {
        current = id;
      }
    }

    this.activeFragment.set(current);
  }
}
