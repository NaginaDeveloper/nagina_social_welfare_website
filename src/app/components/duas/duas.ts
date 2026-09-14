import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { LETS_LEARN_ISLAM_DUAS, type DailyDua } from './duas-data';

@Component({
  selector: 'app-duas',
  imports: [RelatedPages, ContentReviewNote],
  templateUrl: './duas.html',
})
export class Duas {
  protected readonly i18n = inject(LanguageService);
  protected readonly duas: readonly DailyDua[] = LETS_LEARN_ISLAM_DUAS;

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Daily namaz schedule' },
    { path: '/quran', label: 'Qur’an', hint: 'Recitation and learning links' },
    { path: '/guidance', label: 'Guidance', hint: 'Posters and reminders' },
    { path: '/madrasa', label: 'Madrasa', hint: 'Children’s Islamic classes' },
  ];

  protected title(dua: DailyDua): string {
    return this.i18n.isUr() ? dua.titleUr : dua.titleEn;
  }

  protected meaning(dua: DailyDua): string {
    if (this.i18n.isUr() && dua.meaningUr) return dua.meaningUr;
    return dua.meaningEn;
  }

  protected note(dua: DailyDua): string {
    if (this.i18n.isUr()) return dua.noteUr || dua.noteEn || '';
    return dua.noteEn || dua.noteUr || '';
  }
}
