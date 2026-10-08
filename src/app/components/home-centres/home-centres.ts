import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { centreLogo, centrePath } from '../../config/centre-pages.config';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import {
  campusDirectionsUrl,
  campusTown,
  campusWhatsappHref,
  type Campus,
} from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { Reveal } from '../../directives/reveal';
import { Icon } from '../ui/icon';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

interface CentreVisual {
  /** Logo shown in the card's picture panel. */
  readonly logo: string;
  /** Tailwind gradient for the panel behind the logo. */
  readonly panel: string;
}

/** Picture panel per centre: its own seal on a coloured panel. */
const CENTRE_PANELS: Readonly<Record<string, string>> = {
  peterborough: 'from-emerald via-forest-800 to-forest',
  manchester: 'from-gold-600 via-emerald to-forest',
};

/** Home page cards for every centre, filled from the published campus list. */
@Component({
  selector: 'app-home-centres',
  imports: [RouterLink, Icon, WhatsappIcon, Reveal],
  templateUrl: './home-centres.html',
})
export class HomeCentres implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected path(campus: Campus): string {
    return centrePath(campus.id);
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected centreIn(campus: Campus): string {
    return this.i18n.t('home.centreIn').replace('{town}', this.town(campus));
  }

  protected isHeadOffice(campus: Campus): boolean {
    return campus.postcode === ORGANIZATION.postalCode;
  }

  protected email(campus: Campus): string {
    return campus.email || ORGANIZATION.email;
  }

  protected visual(campus: Campus): CentreVisual {
    return { logo: centreLogo(campus.id), panel: CENTRE_PANELS[campus.id] ?? 'from-emerald to-forest' };
  }

  protected whatsapp(campus: Campus): string {
    return campusWhatsappHref(
      campus,
      `Assalamu alaikum, I have a question about ${campus.displayName} in ${this.town(campus)}.`,
    );
  }

  protected directions(campus: Campus): string {
    return campusDirectionsUrl(campus);
  }
}
