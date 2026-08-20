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
  selector: 'app-aulia-karam',
  templateUrl: './aulia-karam.html',
})
export class AuliaKaram {
  protected readonly i18n = inject(LanguageService);

  protected readonly quotes: readonly SacredQuote[] = [
    {
      kind: 'quran',
      label: 'Quran 10:62',
      labelUr: 'قرآن ۱۰:۶۲',
      text: 'Unquestionably, for the allies of Allah there will be no fear concerning them, nor will they grieve.',
      textUr: 'سنو! بیشک اللہ کے دوستوں پر نہ کوئی خوف ہے اور نہ وہ غمگین ہوں گے۔',
      source: 'Surah Yunus, Ayat 62 — Ala inna awliya Allahi la khawfun ‘alayhim wa la hum yahzanun',
      sourceUr: 'سورۃ یونس، آیت ۶۲',
    },
    {
      kind: 'quran',
      label: 'Quran 10:63–64',
      labelUr: 'قرآن ۱۰:۶۳–۶۴',
      text: 'Those who believed and were fearing Allah. For them are good tidings in the worldly life and in the Hereafter. No change is there in the words of Allah. That is what is the great attainment.',
      textUr: 'جو ایمان لائے اور تقویٰ اختیار کیا۔ ان کے لیے دنیا اور آخرت میں خوشخبری ہے۔ اللہ کے کلمات میں کوئی تبدیلی نہیں۔ یہی بڑی کامیابی ہے۔',
      source: 'Surah Yunus, Ayat 63–64',
      sourceUr: 'سورۃ یونس، آیت ۶۳–۶۴',
    },
    {
      kind: 'hadith',
      label: 'Hadith Qudsi',
      labelUr: 'حدیث قدسی',
      text: 'My servant does not draw near to Me with anything more loved to Me than the religious duties I have enjoined upon him. My servant continues to draw near to Me with supererogatory works until I love him. When I love him, I am his hearing with which he hears, his sight with which he sees, his hand with which he strikes, and his foot with which he walks.',
      textUr: 'میرا بندہ میرے قریب ان فرائض سے زیادہ کسی چیز سے نہیں آتا جو میں نے اس پر فرض کیے۔ پھر وہ نوافل سے قریب آتا رہتا ہے یہاں تک کہ میں اسے محبوب بنا لوں۔ جب میں اسے محبوب بنا لوں تو میں اس کا کان بن جاتا ہوں جس سے وہ سنتا ہے، اس کی آنکھ جس سے وہ دیکھتا ہے، اس کا ہاتھ جس سے وہ پکڑتا ہے، اور اس کا پاؤں جس سے وہ چلتا ہے۔',
      source: 'Sahih al-Bukhari, Hadith 6502',
      sourceUr: 'صحیح البخاری، حدیث ۶۵۰۲',
    },
    {
      kind: 'hadith',
      label: 'Hadith Qudsi',
      labelUr: 'حدیث قدسی',
      text: 'Whoever shows enmity to a wali (friend) of Mine, I have declared war against him.',
      textUr: 'جو میرے کسی ولی سے دشمنی کرے، میں نے اس کے خلاف جنگ کا اعلان کر دیا۔',
      source: 'Sahih al-Bukhari, Hadith 6505',
      sourceUr: 'صحیح البخاری، حدیث ۶۵۰۵',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      labelUr: 'حدیث شریف',
      text: 'The scholars are the heirs of the Prophets. The Prophets did not leave behind dinars or dirhams; they left behind knowledge. Whoever takes it has taken an abundant good fortune.',
      textUr: 'علماء انبیاء کے وارث ہیں۔ انبیاء نے دینار و درہم نہیں چھوڑے؛ انہوں نے علم چھوڑا۔ جس نے اسے لیا اس نے بڑا حصہ پایا۔',
      source: 'Sunan Abu Dawud, Hadith 3641; Jami‘ at-Tirmidhi, Hadith 2682',
      sourceUr: 'سنن ابو داؤد، حدیث ۳۶۴۱؛ جامع الترمذی، حدیث ۲۶۸۲',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      labelUr: 'حدیث شریف',
      text: 'I had forbidden you from visiting graves, but visit them, for they remind you of the Hereafter.',
      textUr: 'میں نے تمہیں قبروں کی زیارت سے روکا تھا، اب زیارت کرو کہ وہ آخرت کی یاد دلاتی ہیں۔',
      source: 'Sahih Muslim, Hadith 977',
      sourceUr: 'صحیح مسلم، حدیث ۹۷۷',
    },
  ];

  protected readonly auliaPoints: readonly CreedPoint[] = [
    {
      number: '01',
      title: 'Who Are the Awliya (Aulia Karam)',
      titleUr: 'اولیاء کرام کون ہیں',
      lead: 'In the creed of Ahl al-Sunnah wal-Jama‘ah, the Awliya Allah (friends of Allah) are the righteous believers whom Allah has honoured through faith, taqwa, and sincere obedience — not those who merely claim titles for themselves.',
      leadUr: 'اہلِ سنت والجماعت کے عقیدے میں اولیاء اللہ وہ نیک مومنین ہیں جنہیں اللہ نے ایمان، تقویٰ اور خلوصِ اطاعت سے معزز فرمایا — نہ کہ وہ جو صرف القابات کا دعویٰ کریں۔',
      details: [
        'Allah alone grants wilayah (friendship and nearness to Him). No saint, scholar, or spiritual guide shares in divine authority.',
        'The Awliya are known by their adherence to the Quran, the authentic Sunnah, and the balanced path of the Ummah.',
      ],
      detailsUr: [
        'ولایت صرف اللہ عطا فرماتا ہے۔ کوئی ولی، عالم یا مرشد الوہیت میں شریک نہیں۔',
        'اولیاء قرآن، صحیح سنت اور امت کے متوازن راستے کی پابندی سے پہچانے جاتے ہیں۔',
      ],
    },
    {
      number: '02',
      title: 'Quranic Foundation',
      titleUr: 'قرآنی بنیاد',
      lead: 'The Holy Quran declares the elevated rank and security of the Awliya in Surah Yunus.',
      leadUr: 'قرآنِ پاک سورۃ یونس میں اولیاء کا بلند مقام اور امن بیان فرماتا ہے۔',
      details: [
        'Ayat 10:62 — “Ala inna awliya Allahi la khawfun ‘alayhim wa la hum yahzanun” — there is no fear upon them and they shall not grieve.',
        'Ayat 10:63–64 — they are the believers who possess taqwa, and for them are glad tidings in this world and the Hereafter.',
      ],
      detailsUr: [
        'آیت ۱۰:۶۲ — «اَلَاۤ اِنَّ اَوْلِیَآءَ اللّٰهِ لَا خَوْفٌ عَلَیْهِمْ وَلَا هُمْ یَحْزَنُوْنَ» — ان پر نہ خوف ہے نہ وہ غمگین ہوں گے۔',
        'آیت ۱۰:۶۳–۶۴ — وہ مومنین ہیں جو تقویٰ رکھتے ہیں، اور ان کے لیے دنیا و آخرت میں خوشخبری ہے۔',
      ],
    },
    {
      number: '03',
      title: 'Marks of the Awliya',
      titleUr: 'اولیاء کی علامات',
      lead: 'The signs of the friends of Allah are spiritual excellence rooted in lawful worship and noble character.',
      leadUr: 'اللہ کے دوستوں کی علامات جائز عبادت اور حسنِ اخلاق پر مبنی روحانی فضیلت ہیں۔',
      details: [
        'Sincere iman (faith) and constant taqwa (God-consciousness).',
        'Obedience to Allah and following the Sunnah of the Prophet Muhammad ﷺ.',
        'Humility, truthfulness, patience, and compassion toward creation.',
        'Strict adherence to Shari‘ah — the Awliya never contradict divine law.',
      ],
      detailsUr: [
        'خلوصِ ایمان اور دائمی تقویٰ۔',
        'اللہ کی اطاعت اور حضور محمد ﷺ کی سنت کی پیروی۔',
        'عاجزی، سچائی، صبر اور مخلوق پر رحم۔',
        'شریعت کی پابندی — اولیاء کبھی الٰہی قانون کے خلاف نہیں جاتے۔',
      ],
    },
    {
      number: '04',
      title: 'Love and Honour for the Awliya',
      titleUr: 'اولیاء سے محبت و تعظیم',
      lead: 'Respecting the pious ‘ulama, righteous scholars, and Awliya is an integral part of Sunni spirituality and Markaz-style guidance.',
      leadUr: 'نیک علماء اور اولیاء کا احترام سنی روحانیت اور مرکز طرزِ ہدایت کا لازمی حصہ ہے۔',
      details: [
        'Hadith foundation: Whoever shows enmity to a wali of Allah draws divine displeasure upon himself.',
        'The scholars are the heirs of the Prophets — loving and honouring them preserves the light of knowledge in the Ummah.',
        'Visiting the graves of the righteous, remembering their virtues, and seeking inspiration from their lives are permitted when done within Shari‘ah bounds.',
      ],
      detailsUr: [
        'حدیثی بنیاد: جو اللہ کے ولی سے دشمنی کرے وہ الٰہی ناراضگی مول لیتا ہے۔',
        'علماء انبیاء کے وارث ہیں — ان سے محبت و تعظیم امت میں علم کی روشنی محفوظ رکھتی ہے۔',
        'نیکوں کی قبروں کی زیارت، ان کی فضائل کی یاد، اور ان کی زندگیوں سے سبق لینا شریعت کی حدود میں جائز ہے۔',
      ],
    },
    {
      number: '05',
      title: 'Balanced Creed — Without Exaggeration',
      titleUr: 'متوازن عقیدہ — بغیر غلو',
      lead: 'Ahl al-Sunnah maintains deep reverence for the Awliya while firmly rejecting ghuluw (exaggeration) that contradicts Tawhid.',
      leadUr: 'اہلِ سنت اولیاء کی گہری تعظیم رکھتے ہیں اور توحید کے خلاف غلو کو سختی سے رد کرتے ہیں۔',
      details: [
        'All help, mercy, and wilayah belong to Allah alone. The Awliya are beloved servants, not partners in divinity.',
        'We do not attribute independent powers to saints that belong only to Allah.',
        'Love for the Awliya harmonizes with love for the Prophet ﷺ, the Ahle Bait, and the Sahaba — all pillars of the Sunni legacy.',
      ],
      detailsUr: [
        'تمام مدد، رحمت اور ولایت صرف اللہ کی ہے۔ اولیاء محبوب بندے ہیں، الوہیت میں شریک نہیں۔',
        'ہم اولیاء کو وہ آزاد طاقتیں منسوب نہیں کرتے جو صرف اللہ کی ہیں۔',
        'اولیاء سے محبت، رسول ﷺ، اہل بیت اور صحابہ سے محبت کے ساتھ ہم آہنگ ہے — یہ سب سنی میراث کے ستون ہیں۔',
      ],
    },
    {
      number: '06',
      title: 'Role Models of Piety',
      titleUr: 'تقویٰ کے نمونے',
      lead: 'The Awliya throughout Islamic history stand as luminous examples of devotion, sacrifice, and service to the Ummah.',
      leadUr: 'اسلامی تاریخ میں اولیاء عقیدت، قربانی اور امت کی خدمت کے روشن نمونے ہیں۔',
      details: [
        'They remind believers that nearness to Allah is achieved through worship, good deeds, and purification of the heart.',
        'Their lives inspire us toward dhikr, fikr, charity, and steadfastness upon the Hanafi Barelvi / Ahl al-Sunnah path.',
        'When in doubt about any matter of creed or personal ruling, consult Markaz Deen-e-Islam for guidance rooted in authentic scholarship.',
      ],
      detailsUr: [
        'وہ یاد دلاتے ہیں کہ قربِ الٰہی عبادت، نیک اعمال اور تزکیۂ قلب سے حاصل ہوتا ہے۔',
        'ان کی زندگیاں ذکر، فکر، خیرات اور حنفی بریلوی / اہلِ سنت کے راستے پر استقامت کی طرف بلاتی ہیں۔',
        'عقیدہ یا ذاتی حکم میں شک ہو تو مرکز دینِ اسلام سے مستند رہنمائی لیں۔',
      ],
    },
  ];
}
