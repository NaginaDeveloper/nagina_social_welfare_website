import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';

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
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly whatsapp = whatsappHref();
  protected readonly year = new Date().getFullYear();

  protected readonly linkGroups: readonly FooterGroup[] = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About us', path: '/about' },
        { label: 'Our Work', path: '/work' },
        { label: 'Madrasa', path: '/madrasa' },
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
        { label: 'Safeguarding', path: '/safeguarding' },
      ],
    },
  ];
}
