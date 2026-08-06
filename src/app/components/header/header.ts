import { Component, HostListener, afterNextRender, signal } from '@angular/core';

interface NavLink {
  readonly label: string;
  readonly fragment: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  /** Shared portal where admins, teachers and parents sign in. */
  protected readonly loginUrl = 'https://admin.naginasocialwelfare.co.uk/';

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly activeFragment = signal('top');

  /**
   * Desktop primary nav — short list for a calm, professional bar.
   * Spiritual Guide & Ahle Bait remain in the page and footer.
   */
  protected readonly links: readonly NavLink[] = [
    { label: 'About', fragment: 'about' },
    { label: 'Our Work', fragment: 'work' },
    { label: 'Namaz', fragment: 'prayer-times' },
    { label: 'Books', fragment: 'books' },
    { label: 'Events', fragment: 'events' },
    { label: 'Donate', fragment: 'donate' },
    { label: 'Apps', fragment: 'apps' },
    { label: 'Contact', fragment: 'contact' },
  ];

  /** Full mobile menu, including faith sections. */
  protected readonly mobileLinks: readonly NavLink[] = [
    { label: 'Spiritual Guide', fragment: 'spiritual-guide' },
    { label: 'Ahle Bait', fragment: 'ahle-bait' },
    { label: 'About', fragment: 'about' },
    { label: 'Our Work', fragment: 'work' },
    { label: 'Guidance', fragment: 'guidance' },
    { label: 'Namaz', fragment: 'prayer-times' },
    { label: 'Books', fragment: 'books' },
    { label: 'Events', fragment: 'events' },
    { label: 'Donate', fragment: 'donate' },
    { label: 'Apps', fragment: 'apps' },
    { label: 'Contact', fragment: 'contact' },
  ];

  private readonly sectionIds = [
    'top',
    'spiritual-guide',
    'ahle-bait',
    'about',
    'work',
    'guidance',
    'prayer-times',
    'books',
    'events',
    'donate',
    'apps',
    'contact',
  ] as const;

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

  protected isActive(fragment: string): boolean {
    return this.activeFragment() === fragment;
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
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
