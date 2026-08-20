import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface SacredQuote {
  readonly kind: 'quran' | 'hadith';
  readonly label: string;
  readonly labelUr: string;
  readonly text: string;
  readonly textUr: string;
  readonly source: string;
  readonly sourceUr: string;
}

interface Reason {
  readonly title: string;
  readonly titleUr: string;
  readonly text: string;
  readonly textUr: string;
}

@Component({
  selector: 'app-khatme-nabuwwat',
  templateUrl: './khatme-nabuwwat.html',
})
export class KhatmeNabuwwat {
  protected readonly i18n = inject(LanguageService);

  protected readonly quotes: readonly SacredQuote[] = [
    {
      kind: 'quran',
      label: 'Quran 33:40',
      labelUr: 'قرآن ۳۳:۴۰',
      text: 'Muhammad is not the father of any of your men, but he is the Messenger of Allah and the last of the Prophets. And Allah has full knowledge of all things.',
      textUr: 'محمد تمہارے مردوں میں سے کسی کے باپ نہیں، بلکہ وہ اللہ کے رسول اور خاتم النبیین ہیں۔ اور اللہ ہر چیز کا خوب جاننے والا ہے۔',
      source: 'Surah Al-Ahzab, Ayat 40',
      sourceUr: 'سورۃ الاحزاب، آیت ۴۰',
    },
    {
      kind: 'quran',
      label: 'Quran 5:3',
      labelUr: 'قرآن ۵:۳',
      text: 'This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as your religion.',
      textUr: 'آج میں نے تمہارے لیے تمہارا دین کامل کر دیا اور تم پر اپنی نعمت پوری کر دی اور تمہارے لیے اسلام کو دین کے طور پر پسند فرمایا۔',
      source: "Surah Al-Ma'idah, Ayat 3",
      sourceUr: 'سورۃ المائدہ، آیت ۳',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      labelUr: 'حدیث شریف',
      text: 'The parable of me and the prophets before me is that of a man who built a house, made it complete and beautiful, except for the place of one brick… I am that brick, and I am the Seal of the Prophets.',
      textUr: 'میری اور مجھ سے پہلے انبیاء کی مثال اس شخص کی سی ہے جس نے گھر بنایا، اسے مکمل اور خوبصورت کیا، مگر ایک اینٹ کی جگہ خالی چھوڑی… میں وہ اینٹ ہوں، اور میں خاتم النبیین ہوں۔',
      source: 'Sahih al-Bukhari & Sahih Muslim',
      sourceUr: 'صحیح البخاری و صحیح مسلم',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      labelUr: 'حدیث شریف',
      text: 'There will be no Prophet after me.',
      textUr: 'میرے بعد کوئی نبی نہیں۔',
      source: 'Sahih Muslim',
      sourceUr: 'صحیح مسلم',
    },
  ];

  protected readonly reasons: readonly Reason[] = [
    {
      title: 'Complete Guidance',
      titleUr: 'کامل ہدایت',
      text: 'Allah’s final testament is fully preserved in the Holy Quran and the authentic Sunnah, requiring no further prophets or new revelations.',
      textUr: 'اللہ کی آخری وصیت قرآنِ پاک اور صحیح سنت میں مکمل محفوظ ہے — مزید انبیاء یا نئی وحی کی حاجت نہیں۔',
    },
    {
      title: 'Universal Unity',
      titleUr: 'عالمی اتحاد',
      text: 'The finality of prophethood protects the Ummah from division, anchoring us all to one divine standard and one final exemplar.',
      textUr: 'ختمِ نبوت امت کو تفرقے سے بچاتی ہے، اور سب کو ایک الٰہی معیار اور ایک آخری اسوۂ حسنہ پر جوڑتی ہے۔',
    },
    {
      title: 'Sacred Responsibility',
      titleUr: 'مقدس ذمہ داری',
      text: 'As followers of the Seal of the Prophets, the duty rests upon us to embody, preserve, and convey his timeless message of mercy, justice, and truth to the world.',
      textUr: 'خاتم النبیین ﷺ کے پیروکار ہونے کے ناتے ہم پر یہ فرض ہے کہ ان کے لازوال پیغامِ رحمت، عدل اور حق کو اپنائیں، محفوظ رکھیں اور دنیا تک پہنچائیں۔',
    },
  ];
}
