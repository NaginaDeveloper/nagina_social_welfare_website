import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { CampusService } from '../../services/campus.service';
import { fillTowns } from '../../models/campus';

@Component({
  selector: 'app-ramadan',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './ramadan.html',
})
export class Ramadan implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly campuses = inject(CampusService);
  protected readonly title = computed(() => fillTowns(this.i18n.t('ramadan.title'), this.campuses.towns()));
  protected readonly org = ORGANIZATION;
  protected readonly contactWhatsApp = whatsappHref(
    'Assalamu alaikum, please share local Ramadan information for my Madrasa’s town (iftar / Taraweeh updates).',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Suhoor and Maghrib from today’s schedule' },
    { path: '/events', label: 'Events', hint: 'Ramadan gatherings when published' },
    { path: '/madrasa', label: 'Our Madrasas', hint: 'Addresses and contact for each Madrasa' },
    { path: '/donate', label: 'Donate', hint: 'Zakat and Sadaqah in Ramadan' },
    { path: '/contact', label: 'Contact', hint: 'Ask for local updates' },
  ];

  ngOnInit(): void {
    void this.campuses.load();
  }
}
