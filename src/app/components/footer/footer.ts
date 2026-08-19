import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly path: string;
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

  /** Same groupings as the header — dedicated routes only. */
  protected readonly linkGroups: readonly FooterGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', path: '/about' },
        { label: 'Our Work', path: '/work' },
        { label: 'Spiritual Guide', path: '/spiritual-guide' },
        { label: 'Khatme Nabuwwat', path: '/khatme-nabuwwat' },
        { label: 'Ahle Bait', path: '/ahle-bait' },
        { label: 'Sahaba Ikram', path: '/sahaba-ikram' },
        { label: 'Aulia Karam', path: '/aulia-karam' },
        { label: 'Basic Beliefs', path: '/basic-beliefs' },
        { label: 'Guidance', path: '/guidance' },
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
        { label: 'Nagina Assistant', path: '/assistant' },
        { label: 'Apps', path: '/apps' },
      ],
    },
    {
      id: 'connect',
      label: 'Connect',
      items: [
        { label: 'Events', path: '/events' },
        { label: 'Donate', path: '/donate' },
        { label: 'Contact', path: '/contact' },
        { label: 'Privacy', path: '/privacy' },
      ],
    },
  ];
}
