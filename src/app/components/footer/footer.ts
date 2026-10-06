import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { centrePath } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, fillTowns, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';
import { VisitorStats } from '../visitor-stats/visitor-stats';

interface FooterLink {
  readonly labelKey: string;
  readonly path?: string;
  readonly externalHref?: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, WhatsappIcon, VisitorStats],
  templateUrl: './footer.html',
})
export class Footer implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly tagline = computed(() =>
    fillTowns(this.i18n.t('footer.tagline'), this.campusService.towns()),
  );
  protected readonly whatsapp = whatsappHref();
  protected readonly year = new Date().getFullYear();

  protected readonly exploreLinks: readonly FooterLink[] = [
    { labelKey: 'nav.spiritualGuide', path: '/spiritual-guide' },
    { labelKey: 'nav.seedhaRastah', path: '/seedha-rastah' },
    { labelKey: 'nav.quiz', externalHref: ORGANIZATION.quizUrl },
    { labelKey: 'nav.halalChecker', externalHref: ORGANIZATION.halalCheckerUrl },
    { labelKey: 'nav.aboutUs', path: '/about' },
    { labelKey: 'nav.ourWork', path: '/work' },
    { labelKey: 'nav.madrasa', path: '/madrasa' },
    { labelKey: 'nav.guidance', path: '/guidance' },
    { labelKey: 'nav.namazTimes', path: '/namaz' },
    { labelKey: 'nav.zakat', path: '/zakat' },
    { labelKey: 'nav.whatIsZakat', path: '/zakat/what-is-zakat' },
    { labelKey: 'nav.duas', path: '/duas' },
    { labelKey: 'nav.calendar', path: '/calendar' },
    { labelKey: 'nav.ramadan', path: '/ramadan' },
    { labelKey: 'nav.impact', path: '/impact' },
    { labelKey: 'nav.events', path: '/events' },
    { labelKey: 'nav.assistant', path: '/assistant' },
    { labelKey: 'nav.membership', path: '/membership' },
    { labelKey: 'nav.memberLogin', path: '/membership/login' },
    { labelKey: 'nav.membershipTrack', path: '/membership/track' },
    { labelKey: 'nav.apps', path: '/apps' },
    { labelKey: 'nav.guides', path: '/guides' },
    { labelKey: 'nav.donate', path: '/donate' },
    { labelKey: 'nav.contact', path: '/contact' },
    { labelKey: 'header.login', externalHref: ORGANIZATION.loginUrl },
  ];

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected centrePath(campusId: string): string {
    return centrePath(campusId);
  }
}
