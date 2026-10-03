import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';

/** Manual and video pages are static HTML in public/, so they use plain hrefs. */
interface PortalGuide {
  readonly id: string;
  readonly icon: 'parent' | 'teacher' | 'student';
  readonly role: string;
  readonly roleUr: string;
  readonly name: string;
  readonly description: string;
  readonly descriptionUr: string;
  readonly videoUrl?: string;
  readonly videoPoster?: string;
  readonly videoLength?: string;
  readonly manualUrl?: string;
  readonly pdfUrl?: string;
  readonly signInUrl?: string;
  readonly appUrl?: string;
}

@Component({
  selector: 'app-guides',
  imports: [RouterLink],
  templateUrl: './guides.html',
})
export class Guides {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  protected readonly guides: readonly PortalGuide[] = [
    {
      id: 'parent',
      icon: 'parent',
      role: 'For Parents',
      roleUr: 'والدین کے لیے',
      name: 'Parent Portal',
      description:
        "Sign in, read madrasa messages, check and pay fees, follow your child's attendance, checklist and learning, and request leave.",
      descriptionUr:
        'سائن ان کریں، مدرسہ کے پیغامات پڑھیں، فیس دیکھیں اور ادا کریں، اپنے بچے کی حاضری، چیک لسٹ اور تعلیم دیکھیں، اور چھٹی کی درخواست دیں۔',
      videoUrl: '/parent-portal-video/',
      videoPoster: '/parent-portal-video/poster.jpg',
      videoLength: '4:39',
      manualUrl: '/parent-portal-manual/',
      pdfUrl: '/parent-portal-manual/Parent-Portal-User-Manual.pdf',
      signInUrl: 'https://admin.naginasocialwelfare.co.uk/login/parent',
      appUrl: 'https://play.google.com/store/apps/details?id=com.learning.mdi_parent_app',
    },
    {
      id: 'teacher',
      icon: 'teacher',
      role: 'For Teachers',
      roleUr: 'اساتذہ کے لیے',
      name: 'Teacher Portal',
      description:
        'Mark attendance, receive fees, handle leave requests, record incidents and behaviour, and run activities, participation and Star of the Week.',
      descriptionUr:
        'حاضری لگائیں، فیس وصول کریں، چھٹی کی درخواستیں سنبھالیں، واقعات اور رویہ درج کریں، اور سرگرمیاں، شرکت اور ہفتے کا ستارہ چلائیں۔',
      manualUrl: '/teacher-portal-manual/',
      pdfUrl: '/teacher-portal-manual/Teacher-Portal-User-Manual.pdf',
      signInUrl: 'https://admin.naginasocialwelfare.co.uk/login/teacher',
      appUrl: 'https://play.google.com/store/apps/details?id=com.education.markaz_e_deen_islam',
    },
    {
      id: 'student',
      icon: 'student',
      role: 'For Students',
      roleUr: 'طلبہ کے لیے',
      name: 'Student Portal',
      description:
        "Sign in to Let's Learn Islam, work through lessons and cards, tick the daily checklist, and earn certificates.",
      descriptionUr:
        'لیٹس لرن اسلام میں سائن ان کریں، اسباق اور کارڈز مکمل کریں، روزانہ چیک لسٹ پر نشان لگائیں، اور سرٹیفکیٹ حاصل کریں۔',
      signInUrl: 'https://admin.naginasocialwelfare.co.uk/login/student',
    },
  ];

  protected hasGuide(guide: PortalGuide): boolean {
    return Boolean(guide.videoUrl || guide.manualUrl);
  }
}
