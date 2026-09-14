import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import {
  LETS_LEARN_ISLAM_DUAS,
  LETS_LEARN_ISLAM_DUAS_MODULE,
  type DailyDua,
} from './duas-data';

@Component({
  selector: 'app-duas',
  imports: [RelatedPages, ContentReviewNote],
  templateUrl: './duas.html',
})
export class Duas {
  protected readonly i18n = inject(LanguageService);
  protected readonly module = LETS_LEARN_ISLAM_DUAS_MODULE;
  protected readonly duas: readonly DailyDua[] = LETS_LEARN_ISLAM_DUAS;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Daily namaz schedule' },
    { path: '/quran', label: 'Qur’an', hint: 'Recitation and learning links' },
    { path: '/guidance', label: 'Guidance', hint: 'Posters and reminders' },
    { path: '/madrasa', label: 'Madrasa', hint: 'Children’s Islamic classes' },
  ];

  protected moduleTitle(): string {
    return this.i18n.isUr() ? this.module.titleUr : this.module.titleEn;
  }

  protected moduleDescription(): string {
    return this.i18n.isUr() ? this.module.descriptionUr : this.module.descriptionEn;
  }
}
