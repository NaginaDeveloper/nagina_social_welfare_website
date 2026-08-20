import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { MADRASA_SESSIONS } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { VenueMap } from '../venue-map/venue-map';

interface Offering {
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-madrasa',
  imports: [RouterLink, VenueMap],
  templateUrl: './madrasa.html',
})
export class Madrasa {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly sessions = MADRASA_SESSIONS;
  protected readonly enrolWhatsApp = whatsappHref(
    'Assalamu alaikum, I would like to enrol a child at Markaz Deen-e-Islam. Age: __  Preferred days: __',
  );

  protected readonly offerings: readonly Offering[] = [
    {
      title: 'Quran classes for children',
      text: 'Structured Qur’an reading and understanding for young learners, with caring teachers and clear progress.',
    },
    {
      title: 'Islamic studies & character',
      text: 'Age-appropriate Islamic education — belief, manners, and love for the Prophet ﷺ in a Hanafi Barelvi / Ahl al-Sunnah setting.',
    },
    {
      title: 'Namaz & practical worship',
      text: 'Help children learn salah with confidence, alongside everyday guidance for a practising Muslim life.',
    },
    {
      title: 'Evening & weekend learning',
      text: 'Classes arranged so families can balance school, work, and Islamic education in Peterborough.',
    },
  ];

  protected sessionTitle(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.titleUr : session.title;
  }

  protected sessionDays(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.daysUr : session.days;
  }

  protected sessionTime(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.timeUr : session.time;
  }

  protected sessionAges(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.agesUr : session.ages;
  }
}
