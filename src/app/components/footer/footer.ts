import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

interface FooterLink {
  readonly labelKey: string;
  readonly path?: string;
  readonly externalHref?: string;
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
    { labelKey: 'nav.spiritualGuide', path: '/spiritual-guide' },
    { labelKey: 'nav.seedhaRastah', path: '/seedha-rastah' },
    { labelKey: 'nav.quiz', externalHref: ORGANIZATION.quizUrl },
    { labelKey: 'nav.aboutUs', path: '/about' },
    { labelKey: 'nav.ourWork', path: '/work' },
    { labelKey: 'nav.madrasa', path: '/madrasa' },
    { labelKey: 'nav.guidance', path: '/guidance' },
    { labelKey: 'nav.namazTimes', path: '/namaz' },
    { labelKey: 'nav.events', path: '/events' },
    { labelKey: 'nav.membership', path: '/membership' },
    { labelKey: 'nav.memberLogin', path: '/membership/login' },
    { labelKey: 'nav.membershipTrack', path: '/membership/track' },
    { labelKey: 'nav.apps', path: '/apps' },
    { labelKey: 'nav.donate', path: '/donate' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];
}
