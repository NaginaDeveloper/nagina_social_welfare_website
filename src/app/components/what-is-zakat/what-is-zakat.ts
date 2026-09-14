import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-what-is-zakat',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './what-is-zakat.html',
})
export class WhatIsZakat {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/zakat/rules', label: 'Zakat rules', hint: 'Assets, nisab and common questions' },
    { path: '/zakat', label: 'Zakat calculator', hint: 'Estimate your Zakat amount' },
    { path: '/donate', label: 'Donate', hint: 'Give Zakat, Sadaqah or Lillah' },
    { path: '/work', label: 'Our work', hint: 'How donations support programmes' },
    { path: '/impact', label: 'Impact', hint: 'Approved programme evidence' },
  ];
}
