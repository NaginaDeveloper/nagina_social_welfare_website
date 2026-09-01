import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { MADRASA_SESSIONS } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { VenueMap } from '../venue-map/venue-map';

interface Offering {
  readonly title: string;
  readonly titleUr: string;
  readonly text: string;
  readonly textUr: string;
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
      title: 'Quran & Tajweed',
      titleUr: 'قرآن اور تجوید',
      text: 'Structured Qur’an reading and recitation for students aged 10 and above, with caring teachers and clear progress.',
      textUr: '۱۰ سال اور اس سے اوپر کے طلبہ کے لیے منظم قرآن خوانی اور تجوید، شفیق اساتذہ اور واضح پیش رفت کے ساتھ۔',
    },
    {
      title: 'Islamic teachings',
      titleUr: 'اسلامی تعلیمات',
      text: 'Prayer, manners and belief — age-appropriate Islamic education in a Hanafi Barelvi / Ahl al-Sunnah setting.',
      textUr: 'نماز، اخلاق اور عقیدہ — حنفی بریلوی / اہلِ سنت ماحول میں عمر کے مطابق اسلامی تعلیم۔',
    },
    {
      title: 'Hadith studies',
      titleUr: 'حدیث کی تعلیم',
      text: 'Sayings of Prophet Muhammad ﷺ, taught with care so children grow in love for the Messenger.',
      textUr: 'اقوالِ رسول محمد ﷺ، شفقت سے پڑھائے جاتے ہیں تاکہ بچے محبتِ رسول میں بڑھیں۔',
    },
    {
      title: 'Islamic academics',
      titleUr: 'اسلامی علوم',
      text: 'Arabic, duas and structured Islamic study alongside the evening Class 3 timetable.',
      textUr: 'عربی، دعائیں اور منظم اسلامی مطالعہ، شام کی کلاس ۳ کے ساتھ۔',
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
