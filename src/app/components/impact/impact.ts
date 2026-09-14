import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { APPROVED_IMPACT_FACTS } from '../../config/content-review.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-impact',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './impact.html',
})
export class Impact {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly facts = APPROVED_IMPACT_FACTS;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/work', label: 'Our work', hint: 'Education and welfare programmes' },
    { path: '/donate', label: 'Donate', hint: 'Support verified programmes' },
    { path: '/peterborough', label: 'Peterborough', hint: 'Local community hub' },
    { path: '/contact', label: 'Contact', hint: 'Ask about evidence and reports' },
  ];
}
