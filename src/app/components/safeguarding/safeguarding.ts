import { Component, inject } from '@angular/core';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';

interface SafeguardingBlock {
  readonly title: string;
  readonly titleUr: string;
  readonly body: string;
  readonly bodyUr: string;
}

@Component({
  selector: 'app-safeguarding',
  templateUrl: './safeguarding.html',
})
export class Safeguarding {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly policyWhatsApp = whatsappHref(
    'Assalamu alaikum, please send me the full safeguarding policy for Markaz Deen-e-Islam / Nagina Social Welfare.',
  );
  protected readonly concernWhatsApp = whatsappHref(
    'Assalamu alaikum, I need to raise a safeguarding concern.',
  );

  protected readonly blocks: readonly SafeguardingBlock[] = [
    {
      title: 'Our duty',
      titleUr: 'ہماری ذمہ داری',
      body:
        'Markaz Deen-e-Islam teaches children. Everyone who visits, teaches, or volunteers with us must help keep children and adults at risk safe from harm, abuse, and neglect.',
      bodyUr:
        'مرکز دینِ اسلام بچوں کو تعلیم دیتا ہے۔ جو بھی تشریف لائے، پڑھائے یا رضاکارانہ خدمت کرے، اسے بچوں اور خطرے میں بالغوں کو نقصان، زیادتی اور غفلت سے محفوظ رکھنے میں مدد کرنی چاہیے۔',
    },
    {
      title: 'How we work',
      titleUr: 'ہم کیسے کام کرتے ہیں',
      body:
        'Nagina Social Welfare UK is a registered charity. We keep a full safeguarding policy, which trustees review. This page is a public summary, not the complete policy.',
      bodyUr:
        'ناگینا سوشل ویلفیئر یو کے ایک رجسٹرڈ چیریٹی ہے۔ ہمارے پاس مکمل حفاظتی پالیسی ہے جس کا ٹرسٹیز جائزہ لیتے ہیں۔ یہ صفحہ عوامی خلاصہ ہے، مکمل پالیسی نہیں۔',
    },
    {
      title: 'If you are worried',
      titleUr: 'اگر آپ پریشان ہیں',
      body:
        'If a child or adult may be at risk, contact us immediately by WhatsApp or email. In an emergency, call 999. You can also contact the Peterborough City Council children’s services team or the NSPCC (0808 800 5000).',
      bodyUr:
        'اگر کوئی بچہ یا بالغ خطرے میں ہو تو فوراً واٹس ایپ یا ای میل سے رابطہ کریں۔ ہنگامی صورت میں 999 پر کال کریں۔ پیٹربورو سٹی کونسل کی چلڈرن سروسز یا NSPCC (0808 800 5000) سے بھی رابطہ کر سکتے ہیں۔',
    },
    {
      title: 'Full policy',
      titleUr: 'مکمل پالیسی',
      body:
        'Parents, staff, and volunteers may request the full safeguarding policy. We will share it on request by WhatsApp or email.',
      bodyUr:
        'والدین، عملہ اور رضاکار مکمل حفاظتی پالیسی طلب کر سکتے ہیں۔ ہم واٹس ایپ یا ای میل پر درخواست پر فراہم کریں گے۔',
    },
  ];
}
