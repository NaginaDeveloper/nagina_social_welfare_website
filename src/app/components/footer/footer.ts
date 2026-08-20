import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

interface FooterLink {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, WhatsappIcon],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly whatsapp = whatsappHref();
  protected readonly year = new Date().getFullYear();

  protected readonly exploreLinks: readonly FooterLink[] = [
    { label: 'Spiritual Guide', path: '/spiritual-guide' },
    { label: 'About us', path: '/about' },
    { label: 'Our Work', path: '/work' },
    { label: 'Madrasa', path: '/madrasa' },
    { label: 'Guidance', path: '/guidance' },
    { label: 'Namaz Times', path: '/namaz' },
    { label: 'Events', path: '/events' },
    { label: 'Apps', path: '/apps' },
    { label: 'Donate', path: '/donate' },
    { label: 'Contact', path: '/contact' },
  ];
}
