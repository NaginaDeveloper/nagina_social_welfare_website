import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface AppLink {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly roleUr: string;
  readonly description: string;
  readonly descriptionUr: string;
  readonly url: string;
  readonly icon: 'parent' | 'teacher' | 'charity';
}

@Component({
  selector: 'app-apps',
  templateUrl: './apps.html',
})
export class Apps {
  protected readonly i18n = inject(LanguageService);

  protected readonly apps: readonly AppLink[] = [
    {
      id: 'mdi-parent',
      name: 'MDI Parent Portal',
      role: 'For Parents',
      roleUr: 'والدین کے لیے',
      description:
        "Stay informed in real time — view your child's daily attendance and fee records. Login credentials are issued by the institution.",
      descriptionUr:
        'براہِ راست باخبر رہیں — اپنے بچے کی یومیہ حاضری اور فیس کے ریکارڈ دیکھیں۔ لاگ ان تفصیلات ادارہ جاری کرتا ہے۔',
      url: 'https://play.google.com/store/apps/details?id=com.learning.mdi_parent_app',
      icon: 'parent',
    },
    {
      id: 'mdi',
      name: 'Markaz-e Deen-e Islam',
      role: 'For Admins & Teachers',
      roleUr: 'منتظمین اور اساتذہ کے لیے',
      description:
        'Digitally manage classes, students, teachers, attendance and fees with secure, role-based access for the educational institution.',
      descriptionUr:
        'تعلیمی ادارے کے لیے محفوظ، کردار پر مبنی رسائی کے ساتھ کلاسز، طلبہ، اساتذہ، حاضری اور فیس کو ڈیجیٹل طور پر سنبھالیں۔',
      url: 'https://play.google.com/store/apps/details?id=com.education.markaz_e_deen_islam',
      icon: 'teacher',
    },
    {
      id: 'charity',
      name: 'Nagina Social Welfare UK',
      role: 'For Admins & Collectors',
      roleUr: 'منتظمین اور کلیکٹرز کے لیے',
      description:
        'Submit and monitor daily charity collection reports with transparent, secure record-keeping between admins and collectors.',
      descriptionUr:
        'منتظمین اور کلیکٹرز کے درمیان شفاف، محفوظ ریکارڈ کے ساتھ یومیہ خیراتی وصولی کی رپورٹیں جمع اور نگرانی کریں۔',
      url: 'https://play.google.com/store/apps/details?id=com.naginaorganization.charity_collection_app',
      icon: 'charity',
    },
  ];
}
