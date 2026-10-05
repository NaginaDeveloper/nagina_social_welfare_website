import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { centrePath } from '../../config/centre-pages.config';
import { DEATH_COMMITTEE } from '../../config/death-committee.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';

@Component({
  selector: 'app-death-committee',
  imports: [RouterLink, RelatedPages],
  templateUrl: './death-committee.html',
})
export class DeathCommittee implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;
  protected readonly portalUrl = DEATH_COMMITTEE.portalUrl;
  protected readonly minGbp = DEATH_COMMITTEE.minContributionGbp;
  protected readonly centreLink = centrePath(DEATH_COMMITTEE.campusId);

  protected readonly campus = computed(() => this.campusService.byId(DEATH_COMMITTEE.campusId));
  protected readonly town = computed(() => {
    const campus = this.campus();
    return campus ? campusTown(campus) : 'Manchester';
  });
  protected readonly whatsapp = computed(() => {
    const campus = this.campus();
    return campus
      ? campusWhatsappHref(
          campus,
          `Assalamu alaikum, I would like to ask about the ${campus.displayName} Death Committee.`,
        )
      : '';
  });

  protected readonly steps = [1, 2, 3, 4] as const;
  protected readonly reasons = [1, 2, 3, 4, 5] as const;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: this.centreLink, label: 'Manchester centre', hint: 'Quran Academy, Partington' },
    { path: '/donate', label: 'Donate', hint: 'Zakat, Sadaqah and Lillah' },
    { path: '/duas', label: 'Duas', hint: 'Everyday duas with meanings' },
    { path: '/contact', label: 'Contact', hint: 'WhatsApp, phone and email' },
  ];

  ngOnInit(): void {
    void this.campusService.load();
  }

  /** Fills `{town}`, `{name}` and `{min}`. */
  protected text(key: string): string {
    return this.i18n
      .t(key)
      .replaceAll('{town}', this.town())
      .replaceAll('{name}', this.campus()?.displayName ?? 'Quran Academy')
      .replaceAll('{min}', String(this.minGbp));
  }
}
