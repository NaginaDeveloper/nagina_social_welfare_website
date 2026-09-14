import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-islamic-calendar',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './islamic-calendar.html',
})
export class IslamicCalendar {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Today’s Hijri date with namaz' },
    { path: '/ramadan', label: 'Ramadan', hint: 'How to find local Ramadan info' },
    { path: '/events', label: 'Events', hint: 'Gatherings tied to the Islamic year' },
    { path: '/peterborough', label: 'Peterborough', hint: 'Local centre and services' },
  ];
}
