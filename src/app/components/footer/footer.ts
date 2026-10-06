import { Component, OnInit, computed, inject } from '@angular/core';
import { buildNavGroups, type NavGroup, type NavLink } from '../../config/navigation.config';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { centrePath } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, fillTowns, type Campus } from '../../models/campus';
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

  /** Same sections and links as the header menus. */
  protected readonly groups = computed<readonly NavGroup[]>(() =>
    buildNavGroups(
      this.campusService.campuses().map(
        (campus): NavLink => ({
          labelKey: 'nav.centre',
          label: campusTown(campus),
          hint: campus.displayName,
          path: centrePath(campus.id),
          icon: 'mosque',
        }),
      ),
    ),
  );

  protected linkLabel(item: NavLink): string {
    return item.label ?? this.i18n.t(item.labelKey);
  }

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
