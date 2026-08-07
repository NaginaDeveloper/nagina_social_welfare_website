import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly path: string;
  readonly fragment?: string;
}

interface FooterGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly FooterLink[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
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

  /** Same groupings as the header — homepage sections + tool routes. */
  protected readonly linkGroups: readonly FooterGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', path: '/', fragment: 'about' },
        { label: 'Our Work', path: '/', fragment: 'work' },
        { label: 'Spiritual Guide', path: '/', fragment: 'spiritual-guide' },
        { label: 'Ahle Bait', path: '/', fragment: 'ahle-bait' },
        { label: 'Guidance', path: '/', fragment: 'guidance' },
      ],
    },
    {
      id: 'worship',
      label: 'Worship',
      items: [
        { label: 'Namaz Times', path: '/namaz' },
        { label: 'Quran Majeed', path: '/quran' },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      items: [
        { label: 'Books', path: '/books' },
        { label: 'Sermons', path: '/sermons' },
        { label: 'Apps', path: '/', fragment: 'apps' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      items: [
        { label: 'Events', path: '/', fragment: 'events' },
        { label: 'Donate', path: '/', fragment: 'donate' },
        { label: 'Contact', path: '/', fragment: 'contact' },
        { label: 'Privacy', path: '/', fragment: 'privacy' },
      ],
    },
  ];
}
