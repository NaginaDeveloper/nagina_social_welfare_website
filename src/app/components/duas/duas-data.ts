/** Daily duas from Let’s Learn Islam (آئیں دین سیکھیں) — module child_duas. */
export interface LetsLearnIslamModuleMeta {
  readonly titleEn: string;
  readonly titleUr: string;
  readonly descriptionEn: string;
  readonly descriptionUr: string;
}

export interface DailyDua {
  readonly id: string;
  readonly order: number;
  readonly titleEn: string;
  readonly titleUr: string;
  readonly arabic: string;
  readonly meaningEn: string;
  readonly meaningUr: string;
  readonly noteEn?: string;
  readonly noteUr?: string;
}

export const LETS_LEARN_ISLAM_DUAS_MODULE: LetsLearnIslamModuleMeta = {
  titleEn: "Daily Duʿās — Supplications for Children",
  titleUr: "بچوں کی پیاری روزمرہ دعائیں",
  descriptionEn: "Beautiful everyday duʿās for eating, sleeping, travelling and more.",
  descriptionUr: "کھانے، سونے، سفر اور روزمرہ کاموں کی پیاری پیاری دعائیں۔",
};

export const LETS_LEARN_ISLAM_DUAS: readonly DailyDua[] = [
  {
    id: "item_001",
    order: 1,
    titleEn: "Duʿā before sleeping",
    titleUr: "سونے سے پہلے کی دعا",
    arabic: "اَللّٰهُمَّ بِاسْمِكَ اَمُوْتُ وَاَحْيٰى",
    meaningEn: "O Allah, with Your Name I die and with Your Name I live.",
    meaningUr: "اے (اللہ تبارک وتعالیٰ) میں تیرے نام کے ساتھ مروں گا اور تیرے نام کے ساتھ جیتا ہوں۔",
  },
  {
    id: "item_002",
    order: 2,
    titleEn: "Duʿā after waking from sleep",
    titleUr: "نیند سے بیدار ہونے کے بعد کی دعا",
    arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِىْ اَحْيَانَا بَعْدَ مَآ اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ",
    meaningEn: "All praise is for Allah, Who gave us life after He caused us to die, and to Him is the rising after death.",
    meaningUr: "سب خوبیاں اللہ (عزوجل) کے واسطے ہیں وہ ذات کہ جس نے ہمیں مارنے کے بعد زندہ فرمایا اور اُس کی طرف مرنے کے بعد جی اٹھنا ہے۔",
  },
  {
    id: "item_003",
    order: 3,
    titleEn: "Duʿā before entering the washroom",
    titleUr: "بیت الخلاء میں داخل ہونے سے پہلے کی دعا",
    arabic: "اَللّٰهُمَّ اِنِّىْ اَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    meaningEn: "O Allah, I seek refuge with You from the male and female shayatin (devils) and jinn that cause harm.",
    meaningUr: "اے اللہ (تبارک وتعالیٰ) بلاشبہ (بے شک) میں تیرے ساتھ پناہ لیتا ہوں، ایذا پہنچانے والے نر شیطانوں اور جنوں سے اور ایذا پہنچانے والی مادہ شیطانوں اور جنوں سے۔",
  },
  {
    id: "item_004",
    order: 4,
    titleEn: "Duʿā after leaving the washroom",
    titleUr: "بیت الخلاء سے باہر نکلنے کے بعد کی دعا",
    arabic: "غُفْرَانَكَ",
    meaningEn: "O Allah, I ask You for forgiveness.",
    meaningUr: "اے اللہ تبارک وتعالیٰ! میں تجھ سے بخشش ومغفرت طلب کرتا ہوں۔",
  },
  {
    id: "item_005",
    order: 5,
    titleEn: "Duʿā when entering the masjid",
    titleUr: "مسجد میں داخل ہوتے وقت کی دعا",
    arabic: "اَللّٰهُمَّ افْتَحْ لِيْ اَبْوَابَ رَحْمَتِكَ",
    meaningEn: "O Allah, open for me the doors of Your mercy.",
    meaningUr: "اے اللہ (ﷻ)! میرے واسطے اپنی رحمت کے دروازے کھول دے۔",
  },
  {
    id: "item_006",
    order: 6,
    titleEn: "Duʿā when leaving the masjid",
    titleUr: "مسجد سے نکلتے وقت کی دعا",
    arabic: "اَللّٰهُمَّ اِنِّيْ اَسْئَلُكَ مِنْ فَضْلِكَ",
    meaningEn: "O Allah, I ask You for Your bounty.",
    meaningUr: "اے اللہ (ﷻ)! بلاشبہ میں تجھ سے تیرا فضل ہی مانگتا ہوں۔",
  },
  {
    id: "item_007",
    order: 7,
    titleEn: "Duʿā when starting to eat",
    titleUr: "کھانا کھانے کے وقت کی دعا",
    arabic: "بِسْمِ اللهِ وَعَلٰى بَرْكَةِ اللهِ",
    meaningEn: "In the name of Allah, and with the blessing of Allah.",
    meaningUr: "اللہ (ﷻ) کے نام سے اور اللہ (تبارک وتعالیٰ) کی برکت سے۔",
  },
  {
    id: "item_008",
    order: 8,
    titleEn: "Duʿā after eating",
    titleUr: "کھانا کھانے کے بعد کی دعا",
    arabic: "اَلْحَمْدُ لِلّٰهِ الَّذِيْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِيْنَ",
    meaningEn: "All praise is for Allah, Who fed us, gave us drink, and made us among the Muslims.",
    meaningUr: "سب تعریفیں اللہ (تبارک وتعالیٰ) کے لئے ہیں جس ذات نے ہمیں کھلایا اور ہمیں پلایا اور ہمیں مسلمانوں میں بنایا۔",
  },
  {
    id: "item_009",
    order: 9,
    titleEn: "Duʿā after drinking milk",
    titleUr: "دودھ پینے کے بعد کی دعا",
    arabic: "اَللّٰهُمَّ بَارِكْ لَنَا فِيْهِ وَزِدْنَا مِنْهُ",
    meaningEn: "O Allah, bless this (milk) for us and give us more of it.",
    meaningUr: "اے اللہ (تبارک وتعالیٰ)! تو ہمارے واسطے اس (دودھ) میں برکت عطا فرما اور ہمیں اس (دودھ) سے زیادہ عطا فرما۔",
    noteEn: "Say Bismillah before you drink, then this duʿā after you finish.",
    noteUr: "دودھ پینے سے پہلے بسم اللہ شریف پڑھیں اور جب پی لیں تو یہ دعا کریں۔",
  },
  {
    id: "item_010",
    order: 10,
    titleEn: "Duʿā when you hear a rooster",
    titleUr: "مرغ کی آواز سنیں تو یہ پڑھیں",
    arabic: "اَللّٰهُمَّ اِنِّيْ اَسْئَلُكَ مِنْ فَضْلِكَ",
    meaningEn: "O Allah, I ask You for Your bounty.",
    meaningUr: "اے اللہ (ﷻ)! میں تجھ سے تیرا فضل ہی سوال کرتا ہوں۔",
  },
  {
    id: "item_011",
    order: 11,
    titleEn: "Duʿā when you hear a dog bark or a donkey",
    titleUr: "کتے کے بھونکنے اور گدھے کی آواز سنیں تو یہ پڑھیں",
    arabic: "اَعُوْذُ بِاللهِ مِنَ الشَّيْطٰنِ الرَّجِيْمِ",
    meaningEn: "I seek refuge with Allah from the rejected shaytan.",
    meaningUr: "",
  },
  {
    id: "item_012",
    order: 12,
    titleEn: "The greeting of peace (salam) when you meet",
    titleUr: "آپس میں ملیں تو اس طرح سلام کریں",
    arabic: "اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهٗ",
    meaningEn: "Peace be upon you, and the mercy of Allah, and His blessings.",
    meaningUr: "",
  },
  {
    id: "item_013",
    order: 13,
    titleEn: "How to reply to the greeting of peace (salam)",
    titleUr: "سلام کا جواب اس طرح دیں",
    arabic: "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهٗ",
    meaningEn: "And upon you be peace, and the mercy of Allah, and His blessings.",
    meaningUr: "",
  },
  {
    id: "item_014",
    order: 14,
    titleEn: "What to say when you sneeze",
    titleUr: "چھینک آنے پر پڑھیں",
    arabic: "اَلْحَمْدُ لِلّٰهِ",
    meaningEn: "All praise is for Allah.",
    meaningUr: "سب ثنائیں اللہ (تبارک وتعالیٰ) کے لئے ہیں۔",
    noteEn: "The one who hears the sneezer say this should reply:\n\nيَرْحَمُكَ اللهُ\n\nMay Allah have mercy on you.",
    noteUr: "چھینکنے والے کو جس نے اَلْحَمْدُ لِلّٰهِ کہا ہو، سننے والا یہ دعا دے: يَرْحَمُكَ اللهُ — اللہ (تبارک وتعالیٰ) تجھ پر رحم فرمائے۔",
  },
  {
    id: "item_015",
    order: 15,
    titleEn: "Duʿā to take anger away",
    titleUr: "غصہ دور کرنے کے لئے پڑھیں",
    arabic: "اَعُوْذُ بِاللهِ مِنَ الشَّيْطٰنِ الرَّجِيْمِ",
    meaningEn: "I seek refuge with Allah from the rejected shaytan.",
    meaningUr: "",
  },
  {
    id: "item_016",
    order: 16,
    titleEn: "What to say when going up the stairs",
    titleUr: "سیڑھیاں چڑھتے وقت یہ پڑھیں",
    arabic: "اَللهُ اَكْبَرُ",
    meaningEn: "Allah is the Greatest.",
    meaningUr: "اللہ (تبارک وتعالیٰ) سب سے بڑا ہے۔",
  },
  {
    id: "item_017",
    order: 17,
    titleEn: "What to say when going down the stairs",
    titleUr: "سیڑھیاں اترتے وقت یہ پڑھیں",
    arabic: "سُبْحَانَ اللهِ",
    meaningEn: "Glory be to Allah (Allah is free from every fault).",
    meaningUr: "اللہ (تبارک وتعالیٰ) پاک ہے۔",
  },
];
