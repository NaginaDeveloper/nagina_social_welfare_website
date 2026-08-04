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

  constructor() {
    // Initialise state so deep links (e.g. /#work) render the solid header
    // even before the first scroll event fires.
    afterNextRender(() => this.onScroll());
  }

  protected readonly links: readonly NavLink[] = [
    { label: 'Spiritual Guide', fragment: 'spiritual-guide' },
    { label: 'Ahle Bait', fragment: 'ahle-bait' },
    { label: 'About', fragment: 'about' },
    { label: 'Our Work', fragment: 'work' },
    { label: 'Guidance', fragment: 'guidance' },
    { label: 'Apps', fragment: 'apps' },
    { label: 'Contact', fragment: 'contact' },
  ];

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
