import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { MADRASA_SESSIONS } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';

@Component({
  selector: 'app-peterborough',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './peterborough.html',
})
export class Peterborough {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly sessions = MADRASA_SESSIONS;
  protected readonly contactWhatsApp = whatsappHref(
    'Assalamu alaikum, I would like to ask about Nagina Social Welfare services in Peterborough.',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Today’s namaz and Hijri date' },
    { path: '/madrasa', label: 'Madrasa', hint: 'Markaz Deen-e-Islam classes' },
    { path: '/events', label: 'Events', hint: 'Gatherings and announcements' },
    { path: '/work', label: 'Our work', hint: 'Education and welfare programmes' },
    { path: '/contact', label: 'Contact', hint: 'WhatsApp, phone and email' },
    { path: '/ramadan', label: 'Ramadan', hint: 'Local Ramadan information' },
  ];

  protected sessionTitle(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.title, session.titleUr);
  }

  protected sessionDays(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.days, session.daysUr);
  }

  protected sessionTime(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.time, session.timeUr);
  }

  protected sessionAges(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.ages, session.agesUr);
  }
}
