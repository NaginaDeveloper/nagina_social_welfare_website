import { Component } from '@angular/core';

interface FooterLink {
  readonly label: string;
  readonly href: string;
}

interface FooterGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly FooterLink[];
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
  /** Shared portal where admins, teachers and parents sign in. */
  protected readonly loginUrl = 'https://admin.naginasocialwelfare.co.uk/';

  /** Official Facebook page. */
  protected readonly facebookUrl = 'https://www.facebook.com/naginasocial.welfare.5';

  /** Official Instagram profile. */
  protected readonly instagramUrl = 'https://www.instagram.com/naginasocialwelfare/';

  /** Official YouTube channel. */
  protected readonly youtubeUrl = 'https://www.youtube.com/@naginasocialwelfareuk7419';

  protected readonly year = new Date().getFullYear();

  /** Same groupings as the header — calm, scannable sections. */
  protected readonly linkGroups: readonly FooterGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', href: '#about' },
        { label: 'Our Work', href: '#work' },
        { label: 'Spiritual Guide', href: '#spiritual-guide' },
        { label: 'Ahle Bait', href: '#ahle-bait' },
        { label: 'Guidance', href: '#guidance' },
      ],
    },
    {
      id: 'worship',
      label: 'Worship',
      items: [
        { label: 'Namaz Times', href: '#prayer-times' },
        { label: 'Blessed Quran Majeed', href: '#quran' },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      items: [
        { label: 'Books', href: '#books' },
        { label: 'Apps', href: '#apps' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      items: [
        { label: 'Events', href: '#events' },
        { label: 'Donate', href: '#donate' },
        { label: 'Contact', href: '#contact' },
        { label: 'Privacy', href: '#privacy' },
      ],
    },
  ];
}
