import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';

interface BeliefFaq {
  readonly question: string;
  readonly questionUr: string;
  readonly answer: string;
  readonly answerUr: string;
  readonly relatedPath?: string;
  readonly relatedLabel?: string;
  readonly relatedLabelUr?: string;
}

interface BeliefCategory {
  readonly title: string;
  readonly titleUr: string;
  readonly lead?: string;
  readonly leadUr?: string;
  readonly faqs: readonly BeliefFaq[];
}

@Component({
  selector: 'app-basic-beliefs',
  imports: [RouterLink],
  templateUrl: './basic-beliefs.html',
})
export class BasicBeliefs {
  protected readonly i18n = inject(LanguageService);

  protected readonly intro =
    'These questions summarise the basic creed (aqidah / beliefs) of Ahl al-Sunnah wa\'l-Jama\'ah as understood at Nagina Social Welfare and Markaz Deen-e-Islam — Hanafi Islamic jurisprudence (fiqh) with love for the Prophet ﷺ, the Ahl al-Bayt (the Prophet’s family), the Companions (Sahaba), and the Awliya Allah (friends of Allah), always upon the Quran and authentic Sunnah.';
  protected readonly introUr =
    'یہ سوالات اہلِ سنت والجماعت کے بنیادی عقائد کا خلاصہ ہیں جیسا کہ نگینہ سوشل ویلفیئر اور مرکز دینِ اسلام میں سمجھا جاتا ہے — حنفی فقہ، محبتِ رسول ﷺ، اہل بیت، صحابہ اور اولیاء، ہمیشہ قرآن و صحیح سنت پر۔';

  protected readonly disclaimer =
    'This page offers gentle general creed guidance, not personal fatwas. For individual religious rulings, please speak to Markaz Deen-e-Islam directly.';
  protected readonly disclaimerUr =
    'یہ صفحہ عمومی عقیدہ کی نرم رہنمائی دیتا ہے، ذاتی فتاویٰ نہیں۔ انفرادی شرعی احکام کے لیے براہِ کرم مرکز دینِ اسلام سے براہِ راست رابطہ کریں۔';

  protected readonly closing =
    'In summary, our beliefs unite sincere faith in Allah, love and obedience to the Prophet Muhammad ﷺ, honour for the Ahl al-Bayt and the Companions (Sahaba), respect for the Awliya Allah, and steadfastness upon Hanafi jurisprudence — without exaggeration, without shirk, and without departing from the balanced path of Ahl al-Sunnah wa\'l-Jama\'ah.';
  protected readonly closingUr =
    'خلاصہ یہ کہ ہمارے عقائد اللہ پر خلوصِ ایمان، حضور محمد ﷺ سے محبت و اطاعت، اہل بیت و صحابہ اکرام کی تعظیم، اولیاء اللہ کا احترام، اور حنفی فقہ پر استقامت کو جوڑتے ہیں — بغیر غلو، بغیر شرک، اور اہلِ سنت والجماعت کے متوازن راستے سے ہٹے بغیر۔';

  protected readonly beliefCategories: readonly BeliefCategory[] = [
    {
      title: 'Who we are — Ahl al-Sunnah / Hanafi Barelvi',
      titleUr: 'ہم کون ہیں — اہلِ سنت / حنفی بریلوی',
      lead: 'The starting point of our creed is belonging to the mainstream Sunni Ummah with the spiritual emphasis taught at Markaz.',
      leadUr: 'ہمارے عقیدے کا نقطۂ آغاز مرکزی سنی امت سے تعلق ہے، اس روحانی تاکید کے ساتھ جو مرکز میں سکھائی جاتی ہے۔',
      faqs: [
        {
          question: 'What is Ahl al-Sunnah wa\'l-Jama\'ah?',
          questionUr: 'اہلِ سنت والجماعت کیا ہے؟',
          answer:
            'Ahl al-Sunnah wa\'l-Jama\'ah are the Muslims who follow the Quran, the authentic Sunnah of the Prophet Muhammad ﷺ, and the understanding of the righteous early generations (Salaf al-Salihin). They hold balanced creed, love for the Prophet ﷺ, and unity upon the fundamentals of Islam.',
          answerUr:
            'اہلِ سنت والجماعت وہ مسلمان ہیں جو قرآن، حضور محمد ﷺ کی صحیح سنت، اور سلفِ صالحین کی فہم کی پیروی کرتے ہیں۔ ان کا عقیدہ متوازن ہے، رسول ﷺ سے محبت ہے، اور اسلام کی بنیادیات پر اتحاد ہے۔',
        },
        {
          question: 'What does Hanafi Barelvi mean at Nagina Social Welfare?',
          questionUr: 'نگینہ سوشل ویلفیئر میں حنفی بریلوی کا کیا مطلب ہے؟',
          answer:
            'Hanafi means we follow the Islamic jurisprudence (fiqh) of Imam Abu Hanifah (may Allah have mercy on him) in worship and daily Islamic practice. Barelvi refers to the spiritual emphasis of love for the Prophet ﷺ, Finality of Prophethood, respect for Ahl al-Bayt, Companions, and Awliya, and Markaz-style guidance rooted in Ahl al-Sunnah — not a separate religion, but a recognised Sunni spiritual tradition.',
          answerUr:
            'حنفی کا مطلب یہ ہے کہ عبادات اور روزمرہ عمل میں امام ابو حنیفہ رحمۃ اللہ علیہ کی فقہ کی پیروی کرتے ہیں۔ بریلوی سے مراد محبتِ رسول ﷺ، ختمِ نبوت، اہل بیت و صحابہ و اولیاء کا احترام، اور اہلِ سنت پر مبنی مرکز طرزِ ہدایت ہے — الگ دین نہیں، بلکہ تسلیم شدہ سنی روحانی روایت۔',
        },
        {
          question: 'What are the six pillars of iman (faith)?',
          questionUr: 'ایمان کے چھ ارکان کیا ہیں؟',
          answer:
            'The six pillars of iman are: belief in Allah; His angels; His revealed books; His messengers; the Last Day; and divine decree (qadar) — good and difficult — from Allah. These are the foundations every Muslim must hold with the heart.',
          answerUr:
            'ایمان کے چھ ارکان: اللہ پر ایمان؛ فرشتوں پر؛ نازل شدہ کتابوں پر؛ رسولوں پر؛ آخرت پر؛ اور تقدیر (خیر و شر) پر اللہ کی طرف سے۔ یہ وہ بنیادیں ہیں جو ہر مسلمان کے دل میں ہونی چاہییں۔',
        },
      ],
    },
    {
      title: 'Foundations of faith',
      titleUr: 'ایمان کی بنیادیں',
      lead: 'The pillars of belief rest upon Tawhid, the finality of prophethood, and following the Quran and Sunnah.',
      leadUr: 'عقیدے کے ارکان توحید، ختمِ نبوت، اور قرآن و سنت کی پیروی پر قائم ہیں۔',
      faqs: [
        {
          question: 'What is Tawhid?',
          questionUr: 'توحید کیا ہے؟',
          answer:
            'Tawhid is the oneness of Allah — that He alone is worthy of worship, Lordship, and ultimate reliance. We reject shirk (associating partners with Allah) in all its forms. All help, mercy, and wilayah belong to Allah alone.',
          answerUr:
            'توحید اللہ کی وحدانیت ہے — وہی عبادت، ربوبیت اور حقیقی بھروسے کا مستحق ہے۔ ہم ہر شکل میں شرک کو رد کرتے ہیں۔ تمام مدد، رحمت اور ولایت صرف اللہ کی ہے۔',
        },
        {
          question: 'What is our belief about the Holy Quran?',
          questionUr: 'قرآنِ پاک کے بارے میں ہمارا عقیدہ کیا ہے؟',
          answer:
            'The Quran is the final, preserved, and unaltered Word of Allah revealed to the Prophet Muhammad ﷺ. It is the primary source of guidance together with the authentic Sunnah. No new revelation comes after the Quran.',
          answerUr:
            'قرآن اللہ کا آخری، محفوظ اور غیر تبدیل شدہ کلام ہے جو حضور محمد ﷺ پر نازل ہوا۔ صحیح سنت کے ساتھ یہ ہدایت کا بنیادی ماخذ ہے۔ قرآن کے بعد کوئی نئی وحی نہیں آتی۔',
        },
        {
          question: 'What is the Finality of Prophethood?',
          questionUr: 'ختمِ نبوت کیا ہے؟',
          answer:
            'Khatme Nabuwwat is the belief that Prophet Muhammad ﷺ is Khatam-un-Nabiyyin — the Seal and last of all prophets. Allah perfected the religion through him ﷺ, and no prophet will come after him. This is a cornerstone of Islamic faith.',
          answerUr:
            'ختمِ نبوت یہ عقیدہ ہے کہ حضور محمد ﷺ خاتم النبیین ہیں — تمام انبیاء کی مہر اور آخری نبی۔ اللہ نے ان ﷺ کے ذریعے دین کامل کیا، اور ان کے بعد کوئی نبی نہیں آئے گا۔ یہ اسلامی ایمان کا سنگِ بنیاد ہے۔',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Read more: Finality of Prophethood',
          relatedLabelUr: 'مزید پڑھیں: ختمِ نبوت',
        },
        {
          question: 'Do Muslims accept any prophet after Muhammad ﷺ?',
          questionUr: 'کیا مسلمان حضور محمد ﷺ کے بعد کسی نبی کو مانتے ہیں؟',
          answer:
            'No. Ahl al-Sunnah firmly rejects any claim of prophethood, messengership, or divine revelation after the Prophet Muhammad ﷺ. Whoever claims otherwise has departed from the consensus of the Muslim community (Ummah) on the Finality of Prophethood.',
          answerUr:
            'نہیں۔ اہلِ سنت حضور محمد ﷺ کے بعد نبوت، رسالت یا وحی کے کسی دعوے کو سختی سے رد کرتے ہیں۔ جو اس کے خلاف دعویٰ کرے وہ ختمِ نبوت پر امت کے اجماع سے نکل جاتا ہے۔',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Read more: Finality of Prophethood',
          relatedLabelUr: 'مزید پڑھیں: ختمِ نبوت',
        },
        {
          question: 'What is the Sunnah and why must we follow it?',
          questionUr: 'سنت کیا ہے اور اس کی پیروی کیوں ضروری ہے؟',
          answer:
            'The Sunnah is the teaching, example, and approved way of the Prophet Muhammad ﷺ preserved in authentic hadith. The Quran commands obedience to the Messenger ﷺ. A Muslim cannot understand or practise Islam correctly without the Sunnah alongside the Quran.',
          answerUr:
            'سنت حضور محمد ﷺ کی تعلیم، اسوہ اور پسندیدہ طریقہ ہے جو صحیح احادیث میں محفوظ ہے۔ قرآن رسول ﷺ کی اطاعت کا حکم دیتا ہے۔ قرآن کے ساتھ سنت کے بغیر مسلمان اسلام کو درست طور پر سمجھ یا عمل نہیں کر سکتا۔',
        },
      ],
    },
    {
      title: 'Love, reverence, and balanced creed',
      titleUr: 'محبت، تعظیم اور متوازن عقیدہ',
      lead: 'Sunni spirituality includes deep love for the Prophet ﷺ and those Allah and His Messenger ﷺ honoured — always within the bounds of Tawhid.',
      leadUr: 'سنی روحانیت میں رسول ﷺ اور جنہیں اللہ اور اس کے رسول ﷺ نے معزز کیا ان سے گہری محبت شامل ہے — ہمیشہ توحید کی حدود میں۔',
      faqs: [
        {
          question: 'Why is love for the Prophet Muhammad ﷺ essential?',
          questionUr: 'حضور محمد ﷺ سے محبت کیوں ضروری ہے؟',
          answer:
            'Love for the Prophet ﷺ is part of iman (faith). The Quran and Sunnah teach that faith is incomplete without honouring him ﷺ. Muslims express this love through obedience, sending blessings on the Prophet ﷺ (salawat / durood), and following his noble character.',
          answerUr:
            'رسول ﷺ سے محبت ایمان کا حصہ ہے۔ قرآن و سنت سکھاتے ہیں کہ ان ﷺ کی تعظیم کے بغیر ایمان مکمل نہیں۔ مسلمان یہ محبت اطاعت، درود و سلام، اور اخلاقِ نبوی کی پیروی سے ظاہر کرتے ہیں۔',
        },
        {
          question: 'What is our belief regarding the Ahl al-Bayt (the Prophet’s family)?',
          questionUr: 'اہل بیت کے بارے میں ہمارا عقیدہ کیا ہے؟',
          answer:
            'We love, honour, and respect the Ahl al-Bayt — the blessed family of the Prophet ﷺ — as taught in the Quran and authentic Sunnah. This love is a religious duty, held in balance with love for the Sahaba and without theological exaggeration (ghuluw).',
          answerUr:
            'ہم اہل بیت — آلِ رسول ﷺ — سے محبت، تعظیم اور احترام رکھتے ہیں جیسا قرآن و صحیح سنت میں ہے۔ یہ دینی فریضہ ہے، صحابہ سے محبت کے ساتھ متوازن، بغیر غلو۔',
          relatedPath: '/ahle-bait',
          relatedLabel: 'Read more: Ahl al-Bayt',
          relatedLabelUr: 'مزید پڑھیں: اہل بیت',
        },
        {
          question: 'What is our belief regarding the Companions (Sahaba) of the Prophet ﷺ?',
          questionUr: 'صحابہ اکرام کے بارے میں ہمارا عقیدہ کیا ہے؟',
          answer:
            'All the Companions (Sahaba) of the Prophet Muhammad ﷺ are honoured as the best generation of the Ummah. Loving and respecting them is part of faith. Insulting or reviling any Companion is forbidden in Sunni orthodoxy.',
          answerUr:
            'حضور محمد ﷺ کے تمام صحابہ امت کی بہترین نسل کے طور پر معزز ہیں۔ ان سے محبت و احترام ایمان کا حصہ ہے۔ کسی صحابی کی توہین سنی عقیدے میں حرام ہے۔',
          relatedPath: '/sahaba-ikram',
          relatedLabel: 'Read more: Companions of the Prophet ﷺ',
          relatedLabelUr: 'مزید پڑھیں: صحابہ اکرام',
        },
        {
          question: 'What is our belief regarding the Awliya Allah (friends of Allah)?',
          questionUr: 'اولیاء اللہ کے بارے میں ہمارا عقیدہ کیا ہے؟',
          answer:
            'The Awliya are the righteous friends of Allah — believers honoured through faith, taqwa, and sincere obedience. Allah declares in Surah Yunus (10:62) that His Awliya shall know no fear nor grief. We love and respect them without treating them as partners with Allah.',
          answerUr:
            'اولیاء اللہ کے نیک دوست ہیں — ایمان، تقویٰ اور خلوصِ اطاعت سے معزز۔ سورۃ یونس (۱۰:۶۲) میں اللہ فرماتا ہے کہ اس کے اولیاء پر نہ خوف ہے نہ غم۔ ہم ان سے محبت رکھتے ہیں بغیر انہیں اللہ کا شریک بنائے۔',
          relatedPath: '/aulia-karam',
          relatedLabel: 'Read more: Awliya Allah',
          relatedLabelUr: 'مزید پڑھیں: اولیاء کرام',
        },
        {
          question: 'What is ghuluw and why do we avoid it?',
          questionUr: 'غلو کیا ہے اور ہم اس سے کیوں بچتے ہیں؟',
          answer:
            'Ghuluw means exaggeration in reverence — giving a created being rights that belong to Allah alone. Ahl al-Sunnah honours the Prophet ﷺ, Ahl al-Bayt, Companions, and Awliya deeply, but never ascribes divine powers to them. All worship and ultimate reliance belong to Allah alone.',
          answerUr:
            'غلو تعظیم میں زیادتی ہے — مخلوق کو وہ حقوق دینا جو صرف اللہ کے ہیں۔ اہلِ سنت رسول ﷺ، اہل بیت، صحابہ اور اولیاء کی گہری تعظیم کرتے ہیں مگر انہیں الوہی طاقتیں منسوب نہیں کرتے۔ تمام عبادت اور حقیقی بھروسہ صرف اللہ کا ہے۔',
        },
      ],
    },
    {
      title: 'Hanafi Barelvi worship and spirituality',
      titleUr: 'حنفی بریلوی عبادت اور روحانیت',
      lead: 'Daily practice and spiritual life follow Hanafi fiqh and the gentle Sunni tradition taught at Markaz.',
      leadUr: 'روزمرہ عمل اور روحانی زندگی حنفی فقہ اور مرکز کی نرم سنی روایت پر قائم ہے۔',
      faqs: [
        {
          question: 'Why do we follow Hanafi fiqh in worship?',
          questionUr: 'عبادت میں حنفی فقہ کی پیروی کیوں؟',
          answer:
            'Imam Abu Hanifah\'s school is followed by the majority of Muslims in South Asia and many parts of the world. At Nagina, Salah (prayer), fasting, and related rulings are understood according to Hanafi jurisprudence — for example, Hanafi Asr time on our Prayer Times page.',
          answerUr:
            'امام ابو حنیفہ رحمۃ اللہ علیہ کا مکتب جنوبی ایشیا اور دنیا کے بہت سے علاقوں میں اکثریت کی پیروی ہے۔ نگینہ پر نماز، روزہ اور متعلقہ احکام حنفی فقہ کے مطابق سمجھے جاتے ہیں — مثلاً نماز کے صفحے پر حنفی عصر۔',
          relatedPath: '/namaz',
          relatedLabel: 'Prayer times (Hanafi Asr)',
          relatedLabelUr: 'نماز کے اوقات (حنفی عصر)',
        },
        {
          question: 'Is visiting the graves of the righteous permitted?',
          questionUr: 'نیکوں کی قبروں کی زیارت جائز ہے؟',
          answer:
            'Yes, when done within Shari\'ah bounds. The Prophet ﷺ permitted visiting graves so they remind us of the Hereafter. We may remember the virtues of the pious and seek inspiration from their lives — not worship graves or treat the deceased as independent sources of help.',
          answerUr:
            'ہاں، شریعت کی حدود میں۔ حضور ﷺ نے قبروں کی زیارت کی اجازت دی تاکہ آخرت کی یاد رہے۔ ہم نیکوں کے فضائل یاد رکھ سکتے اور سبق لے سکتے ہیں — قبروں کی عبادت نہیں اور نہ مرنے والوں کو آزاد مددگار بنانا۔',
          relatedPath: '/aulia-karam',
          relatedLabel: 'Read more: Awliya Allah',
          relatedLabelUr: 'مزید پڑھیں: اولیاء کرام',
        },
        {
          question: 'What is our belief about shafa\'at (intercession)?',
          questionUr: 'شفاعت کے بارے میں ہمارا عقیدہ کیا ہے؟',
          answer:
            'Shafa\'at is intercession on the Day of Judgment by Allah\'s permission. The Prophet Muhammad ﷺ and the righteous may intercede only as Allah allows. This is authentic Sunni belief. Intercession is not independent power — it belongs entirely to Allah\'s mercy and decree.',
          answerUr:
            'شفاعت قیامت کے دن اللہ کے اذن سے سفارش ہے۔ حضور محمد ﷺ اور نیک بندے صرف اللہ کی اجازت سے شفاعت کر سکتے ہیں۔ یہ مستند سنی عقیدہ ہے۔ شفاعت آزاد طاقت نہیں — پوری رحمت و تقدیرِ الٰہی کی ہے۔',
        },
        {
          question: 'What is tawassul and how is it understood?',
          questionUr: 'توسل کیا ہے اور اسے کیسے سمجھا جاتا ہے؟',
          answer:
            'Tawassul means seeking nearness to Allah through permissible means — such as His beautiful names, good deeds, or by the rank of the Prophet ﷺ or the pious. Ahl al-Sunnah permits tawassul when it does not involve shirk. We never call upon anyone as if they share in Allah\'s divinity.',
          answerUr:
            'توسل اللہ کے قریب جائز وسائل سے طلب کرنا ہے — جیسے اس کے حسین نام، نیک اعمال، یا رسول ﷺ یا نیکوں کا رتبہ۔ اہلِ سنت توسل اس وقت جائز رکھتے ہیں جب شرک نہ ہو۔ ہم کسی کو اس طرح نہیں پکارتے گویا وہ اللہ کی الوہیت میں شریک ہو۔',
        },
        {
          question: 'What is our view on Milad and expressing joy at the birth of the Prophet ﷺ?',
          questionUr: 'میلاد اور ولادتِ نبوی ﷺ پر خوشی کے اظہار پر ہمارا نظریہ؟',
          answer:
            'Many scholars of Ahl al-Sunnah, including the Barelvi tradition, permit expressing joy and gratitude for the birth of the Prophet Muhammad ﷺ when the gathering remains within Shari\'ah — with blessings upon the Prophet ﷺ (salawat / durood), praise of the Prophet ﷺ, and without forbidden mixing or innovations that contradict clear Islamic law. Markaz encourages love and remembrance rooted in authentic teaching.',
          answerUr:
            'اہلِ سنت کے بہت سے علماء، بشمول بریلوی روایت، ولادتِ نبوی ﷺ پر خوشی اور شکر کا اظہار جائز رکھتے ہیں جب محفل شریعت میں رہے — درود، نعت، بغیر حرام اختلاط یا ایسی بدعات کے جو صریح شریعت کے خلاف ہوں۔ مرکز مستند تعلیم پر مبنی محبت و یاد کی ترغیب دیتا ہے۔',
        },
      ],
    },
    {
      title: 'What this page does not replace',
      titleUr: 'یہ صفحہ کیا بدل نہیں سکتا',
      lead: 'Firm creed, gentle tone — and knowing the limits of general guidance.',
      leadUr: 'مضبوط عقیدہ، نرم لہجہ — اور عمومی رہنمائی کی حدود جاننا۔',
      faqs: [
        {
          question: 'Is this website or assistant a mufti?',
          questionUr: 'کیا یہ ویب سائٹ یا اسسٹنٹ مفتی ہے؟',
          answer:
            'No. This page, and the Nagina Assistant, offer general creed and site information — not binding personal fatwas. For marriage, divorce, inheritance, or any individual ruling, please contact Markaz Deen-e-Islam directly.',
          answerUr:
            'نہیں۔ یہ صفحہ اور نگینہ اسسٹنٹ عمومی عقیدہ اور سائٹ کی معلومات دیتے ہیں — ذاتی پابند فتاویٰ نہیں۔ نکاح، طلاق، وراثت یا کسی انفرادی حکم کے لیے براہِ راست مرکز دینِ اسلام سے رابطہ کریں۔',
          relatedPath: '/contact',
          relatedLabel: 'Contact Markaz',
          relatedLabelUr: 'مرکز سے رابطہ',
        },
        {
          question: 'Does Nagina present all Islamic groups as equally valid?',
          questionUr: 'کیا نگینہ تمام اسلامی گروہوں کو یکساں درست پیش کرتی ہے؟',
          answer:
            'Nagina Social Welfare teaches and publishes from the Hanafi Barelvi / Ahl al-Sunnah wa\'l-Jama\'ah perspective. We explain our beliefs with respect and without harsh sectarian language, but we do not treat every maslak or modern claim as equally valid for our community.',
          answerUr:
            'نگینہ سوشل ویلفیئر حنفی بریلوی / اہلِ سنت والجماعت کے نقطۂ نظر سے تعلیم دیتی اور شائع کرتی ہے۔ ہم اپنے عقائد احترام سے بیان کرتے ہیں بغیر تلخ فرقہ وارانہ زبان کے، مگر ہر مسلک یا جدید دعوے کو اپنی کمیونٹی کے لیے یکساں درست نہیں سمجھتے۔',
        },
        {
          question: 'Where can I read the detailed creed pages?',
          questionUr: 'تفصیلی عقیدہ صفحات کہاں پڑھوں؟',
          answer:
            'This FAQ is an overview. For fuller treatment, visit our dedicated creed pages on Finality of Prophethood, Ahl al-Bayt, Companions of the Prophet ﷺ, and Awliya Allah — each with Quran, Hadith, and detailed points of belief.',
          answerUr:
            'یہ سوال و جواب کا خلاصہ ہے۔ مکمل مطالعے کے لیے ختمِ نبوت، اہل بیت، صحابہ اکرام اور اولیاء کرام کے مخصوص صفحات دیکھیں — ہر ایک میں قرآن، حدیث اور عقیدے کی تفصیل۔',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Start with Finality of Prophethood',
          relatedLabelUr: 'ختمِ نبوت سے شروع کریں',
        },
      ],
    },
  ];
}
