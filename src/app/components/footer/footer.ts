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

  protected readonly year = new Date().getFullYear();

  protected readonly quickLinks = [
    { label: 'Spiritual Guide', href: '#spiritual-guide' },
    { label: 'Ahle Bait', href: '#ahle-bait' },
    { label: 'About', href: '#about' },
    { label: 'Our Work', href: '#work' },
    { label: 'Guidance', href: '#guidance' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Apps', href: '#apps' },
    { label: 'Contact', href: '#contact' },
  ] as const;
}
