import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';

interface AppLink {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly roleUr: string;
  readonly description: string;
  readonly descriptionUr: string;
  readonly url: string;
  readonly icon: 'parent' | 'student' | 'teacher' | 'charity';
}

@Component({
  selector: 'app-apps',
  imports: [RouterLink],
  templateUrl: './apps.html',
})
export class Apps {
  protected readonly i18n = inject(LanguageService);

  protected readonly apps: readonly AppLink[] = [
    {
      id: 'mdi-parent',
      name: 'NSW Parent Portal',
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
      id: 'mdi-student',
      name: 'NSW Student Portal',
      role: 'For Students',
      roleUr: 'طلبہ کے لیے',
      description:
        "Tick your daily checklist, learn with Let's Learn Islam, collect stars and badges, and read messages from your madrasa. Login details are issued by the madrasa office.",
      descriptionUr:
        'روزانہ چیک لسٹ پر نشان لگائیں، لیٹس لرن اسلام سے سیکھیں، ستارے اور بیجز جمع کریں، اور مدرسہ کے پیغامات پڑھیں۔ لاگ ان تفصیلات مدرسہ کا دفتر جاری کرتا ہے۔',
      url: 'https://play.google.com/store/apps/details?id=com.learning.mdi_student_app',
      icon: 'student',
    },
    {
      id: 'mdi',
      name: 'NSW Admin Portal',
      role: 'For Admins',
      roleUr: 'منتظمین کے لیے',
      description:
        'Digitally manage classes, students, teachers, attendance and fees with secure, role-based access for the educational institution.',
      descriptionUr:
        'تعلیمی ادارے کے لیے محفوظ، کردار پر مبنی رسائی کے ساتھ کلاسز، طلبہ، اساتذہ، حاضری اور فیس کو ڈیجیٹل طور پر سنبھالیں۔',
      url: 'https://play.google.com/store/apps/details?id=com.education.markaz_e_deen_islam',
      icon: 'teacher',
    },
    {
      id: 'charity',
      name: 'NSW Collector Portal',
      role: 'For Collectors',
      roleUr: 'کلیکٹرز کے لیے',
      description:
        'Scan a charity box’s QR code, record the collection, text the receipt, and see your collection history. Login details are issued by the office.',
      descriptionUr:
        'خیراتی ڈبے کا کیو آر کوڈ اسکین کریں، وصولی درج کریں، رسید ٹیکسٹ کریں، اور اپنی وصولیوں کی تاریخ دیکھیں۔ لاگ ان تفصیلات دفتر جاری کرتا ہے۔',
      url: 'https://play.google.com/store/apps/details?id=com.naginaorganization.charity_collection_app',
      icon: 'charity',
    },
  ];
}
