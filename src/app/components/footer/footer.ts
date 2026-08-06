import { Component } from '@angular/core';

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

  protected readonly quickLinks = [
    { label: 'Spiritual Guide', href: '#spiritual-guide' },
    { label: 'Ahle Bait', href: '#ahle-bait' },
    { label: 'About', href: '#about' },
    { label: 'Our Work', href: '#work' },
    { label: 'Guidance', href: '#guidance' },
    { label: 'Books', href: '#books' },
    { label: 'Events', href: '#events' },
    { label: 'Donate', href: '#donate' },
    { label: 'Apps', href: '#apps' },
    { label: 'Contact', href: '#contact' },
  ] as const;
}
