import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface DefinitionItem {
  readonly title: string;
  readonly titleUr: string;
  readonly text: string;
  readonly textUr: string;
}

interface SacredQuote {
  readonly label: string;
  readonly labelUr: string;
  readonly text: string;
  readonly textUr: string;
  readonly source: string;
  readonly sourceUr: string;
}

interface CreedSubsection {
  readonly title: string;
  readonly titleUr: string;
  readonly lead?: string;
  readonly leadUr?: string;
  readonly quotes?: readonly SacredQuote[];
  readonly note?: string;
  readonly noteUr?: string;
}

interface CreedSection {
  readonly number: string;
  readonly title: string;
  readonly titleUr: string;
  readonly lead?: string;
  readonly leadUr?: string;
  readonly details?: readonly string[];
  readonly detailsUr?: readonly string[];
  readonly definitions?: readonly DefinitionItem[];
  readonly quotes?: readonly SacredQuote[];
  readonly note?: string;
  readonly noteUr?: string;
  readonly subsections?: readonly CreedSubsection[];
}

@Component({
  selector: 'app-ahle-bait',
  templateUrl: './ahle-bait.html',
})
export class AhleBait {
  protected readonly i18n = inject(LanguageService);

  protected readonly sections: readonly CreedSection[] = [
    {
      number: '01',
      title: 'Defining the Ahl al-Bayt in Sunni Creed',
      titleUr: 'سنی عقیدے میں اہل بیت کی تعریف',
      lead: 'According to the consensus of the scholars of Ahl al-Sunnah wa’l-Jamā‘ah, the term Ahl al-Bayt encompasses:',
      leadUr: 'اہلِ سنت والجماعت کے علماء کے اجماع کے مطابق اہل بیت میں شامل ہیں:',
      definitions: [
        {
          title: 'The Noble Wives (Ummahāt al-Mu’minīn)',
          titleUr: 'ازواجِ مطہرات (امہات المؤمنین)',
          text: 'Led by Sayyidah Khadījah al-Kubrā and Sayyidah ‘Ā’ishah al-Siddīqah (may Allah be pleased with them all).',
          textUr: 'سیدہ خدیجہ الکبریٰ اور سیدہ عائشہ صدیقہ رضی اللہ تعالیٰ عنہما کی سربراہی میں۔',
        },
        {
          title: 'The Blessed Cloak (Ahl al-Kisā’)',
          titleUr: 'اہل کساء',
          text: 'Sayyidatunā Fāṭimah al-Zahrā’, Sayyidunā ‘Alī al-Murtaḍā, Sayyidunā al-Ḥasan, and Sayyidunā al-Ḥusayn (may Allah be pleased with them all).',
          textUr: 'سیدتنا فاطمہ الزہرا، سیدنا علی المرتضیٰ، سیدنا حسن اور سیدنا حسین رضی اللہ تعالیٰ عنہم۔',
        },
        {
          title: 'The Pious Lineage (Banū Hāshim)',
          titleUr: 'بنی ہاشم کی نیک نسل',
          text: 'The believers among the progeny of Sayyidunā ‘Abbās, Sayyidunā Ja‘far, Sayyidunā ‘Aqīl, and their descendants.',
          textUr: 'سیدنا عباس، سیدنا جعفر، سیدنا عقیل اور ان کی اولاد میں سے مومنین۔',
        },
      ],
      note: 'Sunni doctrine beautifully harmonizes deep love for the Prophet’s Household with immense respect for all his illustrious Companions (Ṣaḥābah), viewing no contradiction between the two.',
      noteUr: 'سنی عقیدہ آلِ رسول ﷺ سے گہری محبت کو تمام صحابہ اکرام کے احترام کے ساتھ خوبصورتی سے جوڑتا ہے، اور دونوں میں کوئی تضاد نہیں دیکھتا۔',
    },
    {
      number: '02',
      title: 'Status of Ahl al-Bayt in the Holy Quran',
      titleUr: 'قرآنِ پاک میں اہل بیت کا مقام',
      lead: 'The Holy Quran explicitly mentions the elevated standing and spiritual purity of the Prophet’s Household across several verses.',
      leadUr: 'قرآنِ پاک کئی آیات میں آلِ رسول ﷺ کا بلند مقام اور روحانی طہارت صراحت سے بیان فرماتا ہے۔',
      subsections: [
        {
          title: 'A. The Verse of Purification (Āyat al-Taṭhīr)',
          titleUr: 'الف۔ آیتِ تطہیر',
          quotes: [
            {
              label: 'Quran 33:33',
              labelUr: 'قرآن ۳۳:۳۳',
              text: 'Allah only intends to remove all uncleanliness from you, O members of the Household [of the Prophet], and to purify you thoroughly.',
              textUr: 'اللہ تو یہی چاہتا ہے کہ اے اہلِ بیت! تم سے ناپاکی دور کرے اور تمہیں خوب پاک کر دے۔',
              source: 'Surah Al-Ahzāb 33:33',
              sourceUr: 'سورۃ الاحزاب ۳۳:۳۳',
            },
          ],
          note: 'Scholars emphasize that this verse establishes both the divine purification granted to the wives of the Prophet (as mentioned in the preceding and succeeding verses) and to the Ahl al-Kisā’ whom the Prophet ﷺ wrapped under his cloak.',
          noteUr: 'علماء فرماتے ہیں کہ یہ آیت ازواجِ مطہرات کی طہارت (پچھلی اور اگلی آیات کے ساتھ) اور اہل کساء کی طہارت ثابت کرتی ہے جنہیں حضور ﷺ نے اپنے کملے میں لے لیا۔',
        },
        {
          title: 'B. The Verse of Affection (Āyat al-Mawaddah)',
          titleUr: 'ب۔ آیتِ مودت',
          lead: 'Allah commands His Messenger ﷺ to state:',
          leadUr: 'اللہ اپنے رسول ﷺ کو یہ کہنے کا حکم دیتا ہے:',
          quotes: [
            {
              label: 'Quran 42:23',
              labelUr: 'قرآن ۴۲:۲۳',
              text: 'Say [O Prophet], “I do not ask you for any reward for this [message] except affection for [my] close relatives.”',
              textUr: 'کہہ دیجئے: میں اس پیغام پر تم سے کوئی اجر نہیں مانگتا سوائے قرابت داروں سے مودت کے۔',
              source: 'Surah Ash-Shūrā 42:23',
              sourceUr: 'سورۃ الشوریٰ ۴۲:۲۳',
            },
          ],
          note: 'Commentators of the Quran note that loving the noble family of the Holy Prophet ﷺ is a religious duty bound upon every believer as a gesture of gratitude for the guidance brought by the Prophet ﷺ.',
          noteUr: 'مفسرین لکھتے ہیں کہ آلِ نبی ﷺ سے محبت ہر مومن پر دینی فریضہ ہے — حضور ﷺ کی لائی ہوئی ہدایت کے شکرانے کے طور پر۔',
        },
      ],
    },
    {
      number: '03',
      title: 'Virtues of Ahl al-Bayt in Hadith Literature',
      titleUr: 'احادیث میں اہل بیت کے فضائل',
      lead: 'The authentic traditions (Aḥādīth) recorded in primary Sunni canonical texts detail the immense rank of the Household of the Prophet ﷺ.',
      leadUr: 'سنی مصادر کی صحیح احادیث آلِ رسول ﷺ کے عظیم مقام کی تفصیل بیان کرتی ہیں۔',
      subsections: [
        {
          title: 'A. Hadith al-Thaqalayn (The Instruction of Revering Ahl al-Bayt)',
          titleUr: 'الف۔ حدیثِ ثقلین',
          lead: 'In Ṣaḥīḥ Muslim, Sayyidunā Zayd ibn Arqam (may Allah be pleased with him) reported that the Messenger of Allah ﷺ delivered a sermon at the pool of Khumm, stating:',
          leadUr: 'صحیح مسلم میں سیدنا زید بن ارقم رضی اللہ تعالیٰ عنہ روایت کرتے ہیں کہ رسول اللہ ﷺ نے غدیرِ خم پر خطبہ دیا اور فرمایا:',
          quotes: [
            {
              label: 'Hadith Sharif',
              labelUr: 'حدیث شریف',
              text: 'O people! I am only a human being. Soon a messenger (of death) from my Lord will come, and I will respond. I am leaving among you two weighty things: the first is the Book of Allah, containing guidance and light… and the members of my Household. I remind you, in the name of Allah, regarding my Household! I remind you, in the name of Allah, regarding my Household!',
              textUr: 'اے لوگو! میں صرف ایک بشر ہوں۔ عنقریب میرے رب کی طرف سے موت کا قاصد آئے گا اور میں جواب دوں گا۔ میں تم میں دو بھاری چیزیں چھوڑے جا رہا ہوں: پہلی اللہ کی کتاب جس میں ہدایت اور نور ہے… اور میرے اہل بیت۔ میں تمہیں اللہ کے نام پر اپنے اہل بیت کی یاد دلاتا ہوں! میں تمہیں اللہ کے نام پر اپنے اہل بیت کی یاد دلاتا ہوں!',
              source: 'Ṣaḥīḥ Muslim, Hadith 2408',
              sourceUr: 'صحیح مسلم، حدیث ۲۴۰۸',
            },
          ],
        },
        {
          title: 'B. Hadith al-Kisā’ (The Event of the Cloak)',
          titleUr: 'ب۔ حدیثِ کساء',
          lead: 'Sayyidah ‘Ā’ishah (may Allah be pleased with her) narrated:',
          leadUr: 'سیدہ عائشہ رضی اللہ تعالیٰ عنہا روایت کرتی ہیں:',
          quotes: [
            {
              label: 'Hadith Sharif',
              labelUr: 'حدیث شریف',
              text: 'The Prophet ﷺ went out one morning wearing a striped cloak of black camel hair. Then al-Ḥasan ibn ‘Alī came and he covered him under it; then al-Ḥusayn came and entered with him; then Fāṭimah came and he took her in; then ‘Alī came and he took him in. He then recited: “Allah only intends to remove all uncleanliness from you, O members of the Household, and to purify you thoroughly.”',
              textUr: 'حضور ﷺ ایک صبح سیاہ اونٹ کے بالوں کا دھاری دار کملہ اوڑھ کر نکلے۔ پھر حسن بن علی آئے تو آپ نے انہیں اس میں لے لیا؛ پھر حسین آئے اور داخل ہوئے؛ پھر فاطمہ آئیں تو انہیں بھی لے لیا؛ پھر علی آئے تو انہیں بھی۔ پھر آپ نے پڑھا: «اللہ چاہتا ہے کہ اے اہلِ بیت تم سے ناپاکی دور کرے اور تمہیں خوب پاک کر دے۔»',
              source: 'Ṣaḥīḥ Muslim, Hadith 2424',
              sourceUr: 'صحیح مسلم، حدیث ۲۴۲۴',
            },
          ],
        },
        {
          title: 'C. The Supreme Rank of Sayyidah Fāṭimah',
          titleUr: 'ج۔ سیدہ فاطمہ کا بلند مقام',
          lead: 'The Prophet ﷺ explicitly highlighted the lofty status of his beloved daughter:',
          leadUr: 'حضور ﷺ نے اپنی محبوب بیٹی کا بلند مقام صراحت سے بیان فرمایا:',
          quotes: [
            {
              label: 'Hadith Sharif',
              labelUr: 'حدیث شریف',
              text: 'Fāṭimah is a part of me; whoever angers her angers me.',
              textUr: 'فاطمہ میرا ٹکڑا ہے؛ جو اسے ناراض کرے وہ مجھے ناراض کرتا ہے۔',
              source: 'Ṣaḥīḥ al-Bukhārī, Hadith 3714',
              sourceUr: 'صحیح البخاری، حدیث ۳۷۱۴',
            },
            {
              label: 'Hadith Sharif',
              labelUr: 'حدیث شریف',
              text: 'Fāṭimah is the leader of the women of Paradise.',
              textUr: 'فاطمہ جنت کی عورتوں کی سردار ہیں۔',
              source: 'Ṣaḥīḥ al-Bukhārī, Hadith 3624',
              sourceUr: 'صحیح البخاری، حدیث ۳۶۲۴',
            },
          ],
        },
        {
          title: 'D. The Masters of the Youths of Paradise',
          titleUr: 'د۔ جنت کے جوانوں کے سردار',
          lead: 'Regarding his blessed grandsons, Sayyidunā al-Ḥasan and Sayyidunā al-Ḥusayn, the Holy Prophet ﷺ declared:',
          leadUr: 'اپنے مبارک نواسوں سیدنا حسن اور سیدنا حسین کے بارے میں حضور ﷺ نے فرمایا:',
          quotes: [
            {
              label: 'Hadith Sharif',
              labelUr: 'حدیث شریف',
              text: 'Al-Ḥasan and al-Ḥusayn are the leaders of the youth of Paradise.',
              textUr: 'حسن اور حسین جنت کے جوانوں کے سردار ہیں۔',
              source: 'Jāmi‘ at-Tirmidhī, Hadith 3768',
              sourceUr: 'جامع الترمذی، حدیث ۳۷۶۸',
            },
          ],
        },
      ],
    },
    {
      number: '04',
      title: 'Love for Ahl al-Bayt in Daily Worship',
      titleUr: 'روزمرہ عبادت میں اہل بیت سے محبت',
      lead: 'The love for the Prophet’s family is intertwined with daily Islamic practice. In every formal prayer (Salah), Muslims recite the Abrahamic salutation (Durood Ibrahim / Salawat Ibrahimiyyah):',
      leadUr: 'آلِ رسول ﷺ سے محبت روزمرہ عبادت سے جڑی ہے۔ ہر نماز میں مسلمان درودِ ابراہیمی پڑھتے ہیں:',
      quotes: [
        {
          label: 'Abrahamic salutation (Durood Ibrahim)',
          labelUr: 'درودِ ابراہیمی',
          text: 'O Allah, send peace upon Muhammad and upon the Family of Muhammad, as You sent peace upon Abraham and upon the family of Abraham…',
          textUr: 'اے اللہ! محمد اور آلِ محمد پر رحمت نازل فرما، جیسا کہ تو نے ابراہیم اور آلِ ابراہیم پر نازل فرمائی…',
          source: 'Recited in every Ṣalāt',
          sourceUr: 'ہر نماز میں پڑھا جاتا ہے',
        },
      ],
      note: 'Without invoking blessings upon the Āl (Family) of the Prophet ﷺ, the daily supplications remain incomplete, emphasizing their enduring spiritual importance.',
      noteUr: 'آلِ نبی ﷺ پر درود کے بغیر یومیہ دعائیں مکمل نہیں رہتیں — یہ ان کی دائمی روحانی اہمیت کی دلیل ہے۔',
    },
    {
      number: '05',
      title: 'Summary of the Sunni Creed (Ahl al-Sunnah)',
      titleUr: 'سنی عقیدے کا خلاصہ (اہلِ سنت)',
      lead: 'The stance of Ahl al-Sunnah wa’l-Jamā‘ah regarding the Ahl al-Bayt is balanced, authentic, and rooted in the Sunnah:',
      leadUr: 'اہلِ سنت والجماعت کا اہل بیت کے بارے میں موقف متوازن، مستند اور سنت پر مبنی ہے:',
      details: [
        'Affection and Loyalty (Mawaddah & Wilāyah): Loving the family of the Prophet ﷺ is an obligation (Farḍ) upon every Muslim.',
        'Balanced Reverence: Sunni Islam maintains deep veneration for the Ahl al-Bayt while avoiding any theological exaggeration (Ghuluw) that contradicts basic Islamic monotheism (Tawḥīd).',
        'Unity of Love: Sunni doctrine holds that genuine love for the Prophet ﷺ necessitates loving both his holy family (Ahl al-Bayt) and his noble companions (Ṣaḥābah), viewing them as complementary pillars of the Islamic legacy.',
      ],
      detailsUr: [
        'مودت و ولایت: آلِ رسول ﷺ سے محبت ہر مسلمان پر فرض ہے۔',
        'متوازن تعظیم: سنی اسلام اہل بیت کی گہری تعظیم رکھتا ہے اور توحید کے خلاف غلو سے بچتا ہے۔',
        'محبت کا اتحاد: سچی محبتِ رسول ﷺ آلِ بیت اور صحابہ دونوں سے محبت کا تقاضا کرتی ہے — یہ اسلامی میراث کے تکمیلی ستون ہیں۔',
      ],
    },
  ];
}
