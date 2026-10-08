import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { madrasaSessions, type MadrasaSession } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { fillTowns, posterCaption, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { CampusCards } from '../campus-cards/campus-cards';
import { CampusMap } from '../campus-map/campus-map';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { CentreContacts } from '../centre-contacts/centre-contacts';

interface Offering {
  readonly title: string;
  readonly titleUr: string;
  readonly text: string;
  readonly textUr: string;
}

@Component({
  selector: 'app-madrasa',
  imports: [CentreContacts, RouterLink, CampusCards, CampusMap, RelatedPages],
  templateUrl: './madrasa.html',
})
export class Madrasa implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;
  protected readonly posterHref = '/posters/madrasa-admission-2026.webp';
  protected readonly enrolWhatsApp = whatsappHref(
    'Assalamu alaikum, I would like to enrol a child at one of your Madrasas. Madrasa: __  Age: __',
  );

  protected readonly towns = computed(
    () => this.campusService.towns() || this.i18n.t('madrasa.titleAccent'),
  );
  protected readonly lead = computed(() =>
    fillTowns(this.i18n.t('madrasa.lead'), this.campusService.towns()),
  );
  /** The admission poster belongs to Markaz Deen-e-Islam. */
  protected readonly posterCampus = computed(() => this.campusService.byId('peterborough'));
  protected readonly posterHint = computed(() =>
    posterCaption(this.i18n.t('apply.intake.posterHint'), this.posterCampus()?.displayName ?? ''),
  );

  protected sessionsFor(campus: Campus): readonly MadrasaSession[] {
    return madrasaSessions(campus.id);
  }

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected timetableOther(name: string): string {
    return this.i18n.t('madrasa.timetableOther').replace('{name}', name);
  }

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/apply', label: 'Apply Online', hint: '2026 admission form' },
    { path: '/peterborough', label: 'Peterborough', hint: 'Markaz Deen-e-Islam centre' },
    { path: '/manchester', label: 'Manchester', hint: 'Quran Academy centre' },
    { path: '/safeguarding', label: 'Safeguarding', hint: 'How we keep children safe' },
    { path: '/namaz', label: 'Prayer Times', hint: 'Salah times for each centre' },
    { path: '/work', label: 'Our Work', hint: 'Education and welfare' },
    { path: '/contact', label: 'Contact', hint: 'WhatsApp, phone and email' },
  ];

  protected readonly offerings: readonly Offering[] = [
    {
      title: 'Quran & Tajweed',
      titleUr: 'قرآن اور تجوید',
      text: 'Structured Qur’an reading and recitation, with caring teachers and clear progress.',
      textUr: 'منظم قرآن خوانی اور تجوید، شفیق اساتذہ اور واضح پیش رفت کے ساتھ۔',
    },
    {
      title: 'Islamic Teachings',
      titleUr: 'اسلامی تعلیمات',
      text: 'Prayer, manners and belief — age-appropriate Islamic education in a Hanafi Barelvi / Ahl al-Sunnah setting.',
      textUr: 'نماز، اخلاق اور عقیدہ — حنفی بریلوی / اہلِ سنت ماحول میں عمر کے مطابق اسلامی تعلیم۔',
    },
    {
      title: 'Hadith Studies',
      titleUr: 'حدیث کی تعلیم',
      text: 'Sayings of Prophet Muhammad ﷺ, taught with care so children grow in love for the Messenger.',
      textUr: 'اقوالِ رسول محمد ﷺ، شفقت سے پڑھائے جاتے ہیں تاکہ بچے محبتِ رسول میں بڑھیں۔',
    },
    {
      title: 'Islamic Academics',
      titleUr: 'اسلامی علوم',
      text: 'Arabic, duas and structured Islamic study alongside the evening timetable.',
      textUr: 'عربی، دعائیں اور منظم اسلامی مطالعہ، شام کی کلاسوں کے ساتھ۔',
    },
  ];

  protected sessionTitle(session: MadrasaSession): string {
    return this.i18n.pick(session.title, session.titleUr);
  }

  protected sessionDays(session: MadrasaSession): string {
    return this.i18n.pick(session.days, session.daysUr);
  }

  protected sessionTime(session: MadrasaSession): string {
    return this.i18n.pick(session.time, session.timeUr);
  }

  protected sessionAges(session: MadrasaSession): string {
    return this.i18n.pick(session.ages, session.agesUr);
  }
}
