import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface CreedPoint {
  readonly number: string;
  readonly title: string;
  readonly titleUr: string;
  readonly lead: string;
  readonly leadUr: string;
  readonly details: readonly string[];
  readonly detailsUr: readonly string[];
}

@Component({
  selector: 'app-sahaba-ikram',
  templateUrl: './sahaba-ikram.html',
})
export class SahabaIkram {
  protected readonly i18n = inject(LanguageService);

  protected readonly sahabahPoints: readonly CreedPoint[] = [
    {
      number: '01',
      title: 'Universal Uprightness and Promise of Paradise',
      titleUr: 'عمومی عدالت اور جنت کا وعدہ',
      lead: 'Ahl al-Sunnah holds that God expressed His pleasure with the Sahabah and promised them Paradise.',
      leadUr: 'اہلِ سنت کا عقیدہ ہے کہ اللہ تعالیٰ نے صحابہ سے اپنی رضا کا اظہار فرمایا اور انہیں جنت کا وعدہ دیا۔',
      details: [
        'Quranic foundation: The Quran praises the early migrants (Muhajirun), the helpers of Madinah (Ansar), and those who followed them in righteousness, declaring that God is pleased with them and they are pleased with Him (e.g., Surah At-Tawbah 9:100, Surah Al-Hadid 57:10).',
      ],
      detailsUr: [
        'قرآنی بنیاد: قرآن مہاجرین، انصار، اور جو نیکی میں ان کی پیروی کریں ان کی تعریف کرتا ہے، اور فرماتا ہے کہ اللہ ان سے راضی ہے اور وہ اللہ سے راضی ہیں (مثلاً سورۃ التوبہ ۹:۱۰۰، سورۃ الحدید ۵۷:۱۰)۔',
      ],
    },
    {
      number: '02',
      title: 'Restraint Regarding Historical Disputes',
      titleUr: 'تاریخی اختلافات میں توقف',
      lead: 'Sunni doctrine dictates maintaining silence and avoiding judgment concerning the internal conflicts or disagreements that arose among the Sahabah (such as the Battles of Jamal or Siffin).',
      leadUr: 'سنی عقیدہ صحابہ کے درمیان جو داخلی اختلاف یا جھگڑے ہوئے (جیسے جنگِ جمل یا صفین) ان پر خاموشی اور فیصلے سے اجتناب کا حکم دیتا ہے۔',
      details: [
        'Theological principle: Ahl al-Sunnah views their differences through the lens of sincere legal reasoning (ijtihad). They hold that those whose judgment was correct receive a double reward, while those who erred in judgment still receive a reward for their sincere intention.',
        'Hadith foundation: Prophetic traditions strictly warn against harboring malice toward the Companions or making them targets of criticism.',
      ],
      detailsUr: [
        'عقیدتی اصول: اہلِ سنت ان کے اختلافات کو خلوصِ اجتہاد کی نظر سے دیکھتے ہیں۔ جن کا اجتہاد درست تھا انہیں دوہرا اجر، اور جن سے خطاء ہوئی انہیں بھی خلوصِ نیت کا اجر ملتا ہے۔',
        'حدیثی بنیاد: نبوی روایات صحابہ سے بغض رکھنے یا انہیں تنقید کا نشانہ بنانے سے سختی سے روکتی ہیں۔',
      ],
    },
    {
      number: '03',
      title: 'Preeminence as the Best Generation',
      titleUr: 'بہترین نسل کی فضیلت',
      lead: 'The generation of the Sahabah holds the highest spiritual status among all generations of the Ummah.',
      leadUr: 'صحابہ کی نسل امت کی تمام نسلوں میں بلند ترین روحانی مقام رکھتی ہے۔',
      details: [
        'Hadith foundation: The Prophet Muhammad ﷺ explicitly stated in authentic narrations (recorded in Sahih al-Bukhari and Sahih Muslim) that the best generation is his generation, followed by the generation that succeeds them.',
      ],
      detailsUr: [
        'حدیثی بنیاد: حضور محمد ﷺ نے صحیح روایات (صحیح البخاری و صحیح مسلم) میں صاف فرمایا کہ بہترین نسل میری نسل ہے، پھر وہ جو ان کے بعد آئے۔',
      ],
    },
    {
      number: '04',
      title: 'Prohibition of Reviling or Disparaging',
      titleUr: 'گالی اور تنقیص کی حرمت',
      lead: 'Insulting, cursing, or impugning the motives of any Companion is strictly forbidden in Sunni orthodoxy.',
      leadUr: 'کسی بھی صحابی کی توہین، لعنت یا نیت پر طعن سنی عقیدے میں سختی سے حرام ہے۔',
      details: [
        'Hadith foundation: Narrations caution believers against speaking ill of the Sahabah, emphasizing that even vast amounts of charity given by later generations cannot equal the spiritual weight of the Companions’ smallest deeds.',
      ],
      detailsUr: [
        'حدیثی بنیاد: روایات مومنین کو صحابہ کی برائی سے روکتی ہیں، اور بتاتی ہیں کہ بعد کی نسلوں کی بہت سی خیرات بھی صحابہ کے چھوٹے عمل کے وزن کو نہیں پہنچ سکتی۔',
      ],
    },
    {
      number: '05',
      title: 'Hierarchy of Virtue Among the Companions',
      titleUr: 'صحابہ میں فضیلت کا مراتب',
      lead: 'Ahl al-Sunnah recognizes degrees of merit among the Sahabah based on their early devotion and sacrifices:',
      leadUr: 'اہلِ سنت صحابہ میں فضیلت کے درجات تسلیم کرتے ہیں، ان کی ابتدائی عقیدت اور قربانیوں کی بنیاد پر:',
      details: [
        'The Four Rightly Guided Caliphs (Khulafa ar-Rashidun): Abu Bakr, ‘Umar, ‘Uthman, and ‘Ali (may Allah be pleased with them all), ranked in this order of merit.',
        'The Ten Promised Paradise (Al-‘Asharah al-Mubashsharun).',
        'The Veterans of the Battle of Badr (Ashab Badr).',
        'The Participants of the Pledge of the Tree (Ashab Bay‘at al-Ridwan).',
        'Early Believers who accepted Islam and fought before the Conquest of Makkah.',
      ],
      detailsUr: [
        'خلفاے راشدین: ابو بکر، عمر، عثمان اور علی رضی اللہ تعالیٰ عنہم — اسی ترتیبِ فضیلت میں۔',
        'عشرہ مبشرہ (دس صحابہ جنہیں جنت کی بشارت دی گئی)۔',
        'اصحابِ بدر۔',
        'اصحابِ بیعتِ رضوان۔',
        'وہ پہلے مومنین جنہوں نے فتحِ مکہ سے پہلے اسلام قبول کیا اور جہاد کیا۔',
      ],
    },
  ];
}
