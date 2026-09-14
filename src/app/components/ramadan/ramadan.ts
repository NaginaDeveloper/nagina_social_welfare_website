import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-ramadan',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './ramadan.html',
})
export class Ramadan {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly contactWhatsApp = whatsappHref(
    'Assalamu alaikum, please share local Ramadan information for Peterborough (iftar / Taraweeh updates).',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Suhoor and Maghrib from today’s schedule' },
    { path: '/events', label: 'Events', hint: 'Ramadan gatherings when published' },
    { path: '/peterborough', label: 'Peterborough', hint: 'Centre address and services' },
    { path: '/donate', label: 'Donate', hint: 'Zakat and Sadaqah in Ramadan' },
    { path: '/contact', label: 'Contact', hint: 'Ask for local updates' },
  ];
}
