import { Component, OnInit, computed, inject } from '@angular/core';
import { FOOTER_COLUMNS, type NavLink } from '../../config/navigation.config';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { centrePath } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref, fillTowns, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';
import { VisitorStats } from '../visitor-stats/visitor-stats';

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

  protected readonly columns = FOOTER_COLUMNS;

  protected linkLabel(item: NavLink): string {
    return item.label ?? this.i18n.t(item.labelKey);
  }

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected campusWhatsapp(campus: Campus): string {
    return campusWhatsappHref(campus, `Assalamu alaikum, I have a question for ${campus.displayName}.`);
  }

  protected centrePath(campusId: string): string {
    return centrePath(campusId);
  }
}
