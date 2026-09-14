import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';

interface Programme {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly tagUr: string;
  readonly summary: string;
  readonly summaryUr: string;
  readonly description: string;
  readonly descriptionUr: string;
  readonly highlights: readonly string[];
  readonly highlightsUr: readonly string[];
  readonly logo: string;
}

@Component({
  selector: 'app-our-work',
  imports: [RouterLink, RelatedPages],
  templateUrl: './our-work.html',
})
export class OurWork {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly helpWhatsApp = whatsappHref(
    'Assalamu alaikum, I would like to ask about community welfare support from Nagina Social Welfare.',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/madrasa', label: 'Madrasa', hint: 'Islamic education in Peterborough' },
    { path: '/peterborough', label: 'Peterborough hub', hint: 'Address, services and schedules' },
    { path: '/donate', label: 'Donate', hint: 'Zakat, Sadaqah and Lillah' },
    { path: '/impact', label: 'Impact update', hint: 'Approved programme evidence' },
    { path: '/contact', label: 'Contact', hint: 'Ask for help or volunteer' },
    { path: '/safeguarding', label: 'Safeguarding', hint: 'How we keep people safe' },
  ];

  protected readonly programmes: readonly Programme[] = [
    {
      id: 'mdi',
      name: 'Markaz Deen-e-Islam',
      tag: 'Islamic Education',
      tagUr: 'اسلامی تعلیم',
      summary: 'Our educational programme',
      summaryUr: 'ہمارا تعلیمی پروگرام',
      description:
        'Nurturing the next generation in the knowledge and love of Islam. Through structured classes, dedicated teachers and a caring environment, we guide students of every age in the Qur\u2019an and the Islamic sciences.',
      descriptionUr:
        'اگلی نسل کو علمِ اسلام اور محبتِ دین کی پرورش۔ منظم کلاسز، محنتی اساتذہ اور شفیق ماحول کے ساتھ ہر عمر کے طلبہ کو قرآن اور اسلامی علوم کی راہ دکھاتے ہیں۔',
      highlights: [
        "Qur'an & Islamic Studies",
        'Structured Classes',
        'Dedicated Teachers',
        'Progress & Attendance',
      ],
      highlightsUr: ['قرآن و اسلامی تعلیم', 'منظم کلاسز', 'محنتی اساتذہ', 'پیش رفت و حاضری'],
      logo: '/brand/markaz.png',
    },
    {
      id: 'nsw',
      name: 'Nagina Social Welfare',
      tag: 'Registered Charity & Welfare',
      tagUr: 'رجسٹرڈ چیریٹی و فلاح',
      summary: 'Our registered UK charity',
      summaryUr: 'ہماری رجسٹرڈ برطانوی چیریٹی',
      description:
        'Serving the community through organised charity across the UK. From donation drives to transparent collections and receipts, we channel your generosity to reach those who need it most.',
      descriptionUr:
        'برطانیہ بھر میں منظم خیرات کے ذریعے کمیونٹی کی خدمت۔ عطیہ مہم سے لے کر شفاف وصولی اور رسیدوں تک، آپ کی سخاوت کو مستحقین تک پہنچاتے ہیں۔',
      highlights: [
        'Donation Drives',
        'Community Support',
        'Transparent Receipts',
        'Monthly Summaries',
      ],
      highlightsUr: ['عطیہ مہمات', 'کمیونٹی کی مدد', 'شفاف رسیدیں', 'ماہانہ خلاصے'],
      logo: '/brand/nagina.png',
    },
  ];
}
