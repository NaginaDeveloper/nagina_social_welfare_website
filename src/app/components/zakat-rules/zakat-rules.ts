import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-zakat-rules',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './zakat-rules.html',
})
export class ZakatRules {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/zakat/what-is-zakat', label: 'What is Zakat?', hint: 'Short educational overview' },
    { path: '/zakat', label: 'Zakat calculator', hint: 'Estimate using live metal prices' },
    { path: '/donate', label: 'Donate', hint: 'Give Zakat through Nagina' },
  ];
}
