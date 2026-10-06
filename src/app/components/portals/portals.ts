import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION, portalLoginUrl, whatsappHref, type PortalRole } from '../../config/organization.config';

interface PortalCard {
  readonly role: PortalRole | 'member';
  readonly title: string;
  readonly titleUr: string;
  readonly who: string;
  readonly whoUr: string;
  readonly description: string;
  readonly descriptionUr: string;
  readonly cta: string;
  readonly ctaUr: string;
  /** Admin-portal login page (full URL). */
  readonly url?: string;
  /** Route on this site, for sign-ins that live here. */
  readonly path?: string;
}

/** Where each kind of user signs in. One card per login page of the admin portal. */
@Component({
  selector: 'app-portals',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './portals.html',
})
export class Portals {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly helpWhatsApp = whatsappHref(
    'Assalamu alaikum, I need help signing in to the Nagina Social Welfare portal.',
  );

  protected readonly cards: readonly PortalCard[] = [
    {
      role: 'parent',
      title: 'Parent',
      titleUr: 'والدین',
      who: 'For parents and guardians',
      whoUr: 'والدین اور سرپرستوں کے لیے',
      description:
        "Follow your child's attendance, see fees and pay them online, and read messages from the madrasa.",
      descriptionUr:
        'اپنے بچے کی حاضری دیکھیں، فیس دیکھیں اور آن لائن ادا کریں، اور مدرسے کے پیغامات پڑھیں۔',
      cta: 'Parent sign in',
      ctaUr: 'والدین سائن اِن',
      url: portalLoginUrl('parent'),
    },
    {
      role: 'student',
      title: 'Student',
      titleUr: 'طالب علم',
      who: 'For madrasa students',
      whoUr: 'مدرسے کے طلبہ کے لیے',
      description:
        "Learn with Let's Learn Islam: read lessons, take part in activities and keep track of your progress.",
      descriptionUr:
        'Let’s Learn Islam کے ساتھ سیکھیں: اسباق پڑھیں، سرگرمیوں میں حصہ لیں اور اپنی پیش رفت دیکھیں۔',
      cta: 'Student sign in',
      ctaUr: 'طالب علم سائن اِن',
      url: portalLoginUrl('student'),
    },
    {
      role: 'teacher',
      title: 'Teacher',
      titleUr: 'استاد',
      who: 'For madrasa teachers',
      whoUr: 'مدرسے کے اساتذہ کے لیے',
      description:
        'Mark attendance, record behaviour and progress, set activities and take fee payments for your classes.',
      descriptionUr:
        'حاضری لگائیں، رویے اور پیش رفت کا اندراج کریں، سرگرمیاں دیں اور اپنی کلاسوں کی فیس وصول کریں۔',
      cta: 'Teacher sign in',
      ctaUr: 'استاد سائن اِن',
      url: portalLoginUrl('teacher'),
    },
    {
      role: 'collector',
      title: 'Collector',
      titleUr: 'کلیکٹر',
      who: 'For charity box collectors',
      whoUr: 'خیراتی بکس کلیکٹرز کے لیے',
      description:
        'Record the donation boxes you collect and keep a clear account of every collection.',
      descriptionUr:
        'جمع کیے گئے ڈونیشن بکس کا اندراج کریں اور ہر کلیکشن کا واضح حساب رکھیں۔',
      cta: 'Collector sign in',
      ctaUr: 'کلیکٹر سائن اِن',
      url: portalLoginUrl('collector'),
    },
    {
      role: 'admin',
      title: 'Nagina Admin',
      titleUr: 'نگینہ ایڈمن',
      who: 'For office and administration',
      whoUr: 'دفتر اور انتظامیہ کے لیے',
      description:
        'Manage the madrasas, students, fees, expenses and reports, the charity and community members, and the team.',
      descriptionUr:
        'مدارس، طلبہ، فیس، اخراجات اور رپورٹس، فلاحی کام، کمیونٹی ممبران اور ٹیم کا انتظام کریں۔',
      cta: 'Admin sign in',
      ctaUr: 'ایڈمن سائن اِن',
      url: portalLoginUrl('admin'),
    },
    {
      role: 'member',
      title: 'Community member',
      titleUr: 'کمیونٹی ممبر',
      who: 'For charity members',
      whoUr: 'فلاحی ممبران کے لیے',
      description:
        'See your donations and Gift Aid record, book events, update your details and manage newsletters.',
      descriptionUr:
        'اپنے عطیات اور گفٹ ایڈ ریکارڈ دیکھیں، تقریبات بک کریں، تفصیلات اپ ڈیٹ کریں اور نیوز لیٹر کا انتظام کریں۔',
      cta: 'Member sign in',
      ctaUr: 'ممبر سائن اِن',
      path: '/membership/login',
    },
  ];
}
