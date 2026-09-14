import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-duas',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './duas.html',
})
export class Duas {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly reviewWhatsApp = whatsappHref(
    'Assalamu alaikum, I can help review duas (Arabic, transliteration and English) for the website.',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Daily namaz schedule' },
    { path: '/quran', label: 'Qur’an', hint: 'Recitation and learning links' },
    { path: '/guidance', label: 'Guidance', hint: 'Posters and reminders' },
    { path: '/contact', label: 'Contact', hint: 'Offer help with review' },
  ];
}
