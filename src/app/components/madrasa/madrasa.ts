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
      title: 'Quran classes for children',
      titleUr: 'بچوں کے لیے قرآن کی کلاسیں',
      text: 'Structured Qur’an reading and understanding for young learners, with caring teachers and clear progress.',
      textUr: 'نوجوان طلبہ کے لیے منظم قرآن خوانی اور فہم، شفیق اساتذہ اور واضح پیش رفت کے ساتھ۔',
    },
    {
      title: 'Islamic studies & character',
      titleUr: 'اسلامی تعلیم اور کردار',
      text: 'Age-appropriate Islamic education — belief, manners, and love for the Prophet ﷺ in a Hanafi Barelvi / Ahl al-Sunnah setting.',
      textUr: 'عمر کے مطابق اسلامی تعلیم — عقیدہ، اخلاق، اور محبتِ رسول ﷺ، حنفی بریلوی / اہلِ سنت ماحول میں۔',
    },
    {
      title: 'Namaz & practical worship',
      titleUr: 'نماز اور عملی عبادت',
      text: 'Help children learn salah with confidence, alongside everyday guidance for a practising Muslim life.',
      textUr: 'بچوں کو اعتماد سے نماز سکھانا، ساتھ عملی مسلمان زندگی کی روزمرہ رہنمائی۔',
    },
    {
      title: 'Evening & weekend learning',
      titleUr: 'شام اور اختتامِ ہفتہ کی تعلیم',
      text: 'Classes arranged so families can balance school, work, and Islamic education in Peterborough.',
      textUr: 'کلاسز اس طرح کہ خاندان پیٹربورو میں اسکول، کام اور اسلامی تعلیم کا توازن رکھ سکیں۔',
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
