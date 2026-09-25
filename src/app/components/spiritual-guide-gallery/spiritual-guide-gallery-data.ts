export interface SpiritualGuidePhoto {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly captionUr: string;
}

/**
 * Gathering photographs first, then Nagina TV stills of Allama Munir Ahmed Yusufi.
 * Wikipedia has no portrait on file.
 */
export const SPIRITUAL_GUIDE_PHOTOS: readonly SpiritualGuidePhoto[] = [
  {
    id: 'mashayikh-gathering',
    src: '/gallery/mashayikh-gathering.jpg',
    alt: 'Two mashayikh standing together at a gathering, wearing white turbans and shawls',
    caption: 'Mashayikh at a gathering',
    captionUr: 'مشائخ کی محفل',
  },
  {
    id: 'mashayikh-gathering-2',
    src: '/gallery/mashayikh-gathering-2.jpg',
    alt: 'Two mashayikh standing together in navy robes with gold embroidery, at a floral gathering',
    caption: 'Mashayikh in honour',
    captionUr: 'مشائخ کی تکریم',
  },
  {
    id: 'faiz-e-nagina',
    src: '/gallery/shajra/00-hero.jpg',
    alt: 'Faiz-e-Nagina and Munir-e-Islam with the mashayikh, Nagina TV banner',
    caption: 'Faiz-e-Nagina · Munir-e-Islam',
    captionUr: 'فیضِ نگینہ · منیرِ اسلام',
  },
  {
    id: 'portrait',
    src: '/gallery/munir/01-portrait.jpg',
    alt: 'Portrait of Allama Munir Ahmed Yusufi wearing a light turban and glasses',
    caption: 'Allama Munir Ahmed Yusufi',
    captionUr: 'علامہ منیر احمد یوسفی',
  },
  {
    id: 'with-students',
    src: '/gallery/munir/02-with-students.jpg',
    alt: 'Allama Munir Ahmed Yusufi sharing a playful moment with young students',
    caption: 'With students',
    captionUr: 'طلبہ کے ساتھ',
  },
  {
    id: 'formal-portrait',
    src: '/gallery/munir/03-formal-portrait.jpg',
    alt: 'Formal portrait of Allama Munir Ahmed Yusufi in white turban and waistcoat',
    caption: 'Formal portrait',
    captionUr: 'رسمی تصویر',
  },
  {
    id: 'munir-e-islam',
    src: '/gallery/munir/04-munir-e-islam.jpg',
    alt: 'Commemorative portrait of Munir-e-Islam, Allama Munir Ahmed Yusufi',
    caption: 'Munir-e-Islam',
    captionUr: 'منیرِ اسلام',
  },
  {
    id: 'smiling',
    src: '/gallery/munir/05-smiling.jpg',
    alt: 'Allama Munir Ahmed Yusufi smiling during a Nagina TV gathering',
    caption: 'A gentle smile',
    captionUr: 'مسکراہٹ',
  },
  {
    id: 'teaching',
    src: '/gallery/munir/06-teaching.jpg',
    alt: 'Allama Munir Ahmed Yusufi teaching, pointing one finger upward',
    caption: 'Teaching',
    captionUr: 'تدریس',
  },
  {
    id: 'minbar',
    src: '/gallery/munir/07-minbar.jpg',
    alt: 'Allama Munir Ahmed Yusufi seated at the minbar with open books',
    caption: 'At the minbar',
    captionUr: 'منبر پر',
  },
  {
    id: 'lecture-2016',
    src: '/gallery/munir/08-lecture-2016.jpg',
    alt: 'Allama Munir Ahmed Yusufi delivering a lecture in 2016',
    caption: 'Lecture, 2016',
    captionUr: 'بیان، ۲۰۱۶',
  },
  {
    id: 'dars',
    src: '/gallery/munir/09-dars.jpg',
    alt: 'Allama Munir Ahmed Yusufi giving dars with an open book',
    caption: 'Dars',
    captionUr: 'درس',
  },
  {
    id: 'books',
    src: '/gallery/munir/10-books.jpg',
    alt: 'Allama Munir Ahmed Yusufi speaking with books open before him',
    caption: 'With the books',
    captionUr: 'کتابوں کے ساتھ',
  },
  {
    id: 'carved-hall',
    src: '/gallery/munir/11-carved-hall.jpg',
    alt: 'Allama Munir Ahmed Yusufi speaking in an ornately carved hall',
    caption: 'In the carved hall',
    captionUr: 'نقش و نگار والے ہال میں',
  },
  {
    id: 'studio-gold',
    src: '/gallery/munir/12-studio-gold.jpg',
    alt: 'Allama Munir Ahmed Yusufi teaching in the Nagina TV studio',
    caption: 'Nagina TV studio',
    captionUr: 'نگینہ ٹی وی اسٹوڈیو',
  },
  {
    id: 'deen-e-islam',
    src: '/gallery/munir/13-deen-e-islam.jpg',
    alt: 'Allama Munir Ahmed Yusufi before the words Mujhe Deen-e-Islam se pyar hai',
    caption: 'Deen-e-Islam',
    captionUr: 'دینِ اسلام',
  },
  {
    id: 'yellow-hall',
    src: '/gallery/munir/14-yellow-hall.jpg',
    alt: 'Allama Munir Ahmed Yusufi speaking in a yellow hall with a microphone',
    caption: 'Address',
    captionUr: 'خطاب',
  },
  {
    id: 'pointing',
    src: '/gallery/munir/15-pointing.jpg',
    alt: 'Allama Munir Ahmed Yusufi pointing upward while teaching',
    caption: 'A point of teaching',
    captionUr: 'تعلیم کا نکتہ',
  },
  {
    id: 'microphone',
    src: '/gallery/munir/16-microphone.jpg',
    alt: 'Allama Munir Ahmed Yusufi speaking into a standing microphone',
    caption: 'At the microphone',
    captionUr: 'مائیکروفون پر',
  },
  {
    id: 'tafsir-reading',
    src: '/gallery/munir/17-tafsir-reading.jpg',
    alt: 'Allama Munir Ahmed Yusufi reading during Tafsir of the Quran',
    caption: 'Tafsir — reading',
    captionUr: 'تفسیر — تلاوت',
  },
  {
    id: 'quran',
    src: '/gallery/munir/18-quran.jpg',
    alt: 'Allama Munir Ahmed Yusufi reading from the Quran',
    caption: 'With the Quran',
    captionUr: 'قرآن کے ساتھ',
  },
  {
    id: 'tafsir-teaching',
    src: '/gallery/munir/19-tafsir-teaching.jpg',
    alt: 'Allama Munir Ahmed Yusufi teaching Tafsir with one finger raised',
    caption: 'Tafsir — teaching',
    captionUr: 'تفسیر — تدریس',
  },
  {
    id: 'explaining',
    src: '/gallery/munir/20-explaining.jpg',
    alt: 'Allama Munir Ahmed Yusufi explaining a passage with open hands',
    caption: 'Explaining',
    captionUr: 'وضاحت',
  },
  {
    id: 'turning-pages',
    src: '/gallery/munir/21-turning-pages.jpg',
    alt: 'Allama Munir Ahmed Yusufi turning the pages of a large book',
    caption: 'Turning the pages',
    captionUr: 'صفحات پلٹتے ہوئے',
  },
  {
    id: 'study',
    src: '/gallery/munir/22-study.jpg',
    alt: 'Allama Munir Ahmed Yusufi studying a text at the desk',
    caption: 'Study',
    captionUr: 'مطالعہ',
  },
  {
    id: 'navy-studio',
    src: '/gallery/munir/23-navy-studio.jpg',
    alt: 'Allama Munir Ahmed Yusufi teaching with both hands open in a navy studio',
    caption: 'Open-handed teaching',
    captionUr: 'کھلے ہاتھوں سے تدریس',
  },
  {
    id: 'younger-portrait',
    src: '/gallery/munir/24-younger-portrait.jpg',
    alt: 'A younger portrait of Allama Munir Ahmed Yusufi in white turban and brown waistcoat',
    caption: 'Earlier years',
    captionUr: 'ابتدائی برس',
  },
  {
    id: 'younger-lecture',
    src: '/gallery/munir/25-younger-lecture.jpg',
    alt: 'A younger Allama Munir Ahmed Yusufi delivering a lecture',
    caption: 'Earlier lecture',
    captionUr: 'پہلا بیان',
  },
];

/**
 * Malfoozat posters of Munir-e-Islam (Allama Munir Ahmed Yusufi).
 * English captions follow the translation printed on each card.
 */
export const SPIRITUAL_GUIDE_SAYINGS: readonly SpiritualGuidePhoto[] = [
  {
    id: 'saying-wrong-matters',
    src: '/gallery/munir-sayings/01-wrong-matters.webp',
    alt: 'Saying of Muneer-ul-Islam RA: Those who get entangled over wrong matters cannot do the work of Deen',
    caption: 'Those who get entangled over wrong matters cannot do the work of Deen.',
    captionUr: 'جو لوگ غلط بات پر الجھ جاتے ہیں، وہ دین کا کام نہیں کرسکتے۔',
  },
  {
    id: 'saying-love-enemies',
    src: '/gallery/munir-sayings/02-love-enemies.webp',
    alt: 'Saying of Muneer-ul-Islam RA: The Messenger of Allah would show love even to his mortal enemies, yet we desert even our dearest friends',
    caption:
      'The Messenger of Allah ﷺ would show love even to his mortal enemies, yet we desert even our dearest friends.',
    captionUr:
      'حضور سیدنا رسول اللہ ﷺ جانی دشمنوں سے بھی پیار فرماتے اور ہم اپنے جانی دوستوں کو بھی چھوڑ دیتے ہیں۔',
  },
  {
    id: 'saying-perfect-believer',
    src: '/gallery/munir-sayings/03-perfect-believer.webp',
    alt: 'Saying of Muneer-ul-Islam RA: A perfect believer also fulfils the duty of ordering the good and forbidding the evil',
    caption:
      'A perfect believer is formed when they also fulfil the duty of ordering the good and forbidding the evil.',
    captionUr:
      'مومنِ کامل تب بنتا ہے جب امر بالمعروف اور نہی عن المنکر کا فرض بھی ادا کرتا ہے۔',
  },
  {
    id: 'saying-knowledge',
    src: '/gallery/munir-sayings/04-knowledge.webp',
    alt: 'Saying of Muneer-ul-Islam RA: Knowledge is not the name of reading a book, but understanding it',
    caption: 'Knowledge is not the name of reading a book, but understanding it.',
    captionUr: 'علم کتاب پڑھنے کا نام نہیں، اسے سمجھنے کا نام ہے۔',
  },
  {
    id: 'saying-protect-faith',
    src: '/gallery/munir-sayings/05-protect-faith.webp',
    alt: 'Saying of Muneer-ul-Islam RA: To protect one’s faith, acquire knowledge of Islam from the teachings of the Prophet ﷺ',
    caption:
      'To protect oneself from those who steal one’s faith, the teachings of the Prophet ﷺ are urgently needed; make it a habit to acquire knowledge of Islam.',
    captionUr:
      'ایمان کے چوروں سے بچنے کیلئے تعلیماتِ نبوی ﷺ کی اشد ضرورت ہے، دین اسلام کا علم حاصل کیا کریں۔',
  },
  {
    id: 'saying-self-reflection',
    src: '/gallery/munir-sayings/06-self-reflection.webp',
    alt: 'Saying of Muneer-ul-Islam RA: The day I start reflecting upon myself, I will become a true devotee of Allah',
    caption: 'The day I start reflecting upon myself, I will become a true devotee of Allah.',
    captionUr: 'جس دن میں نے اپنے اوپر غور شروع کر دیا تو میں بندہ بن جاؤں گا۔',
  },
  {
    id: 'saying-own-station',
    src: '/gallery/munir-sayings/07-own-station.webp',
    alt: 'Saying of Muneer-ul-Islam RA: A man should understand his own station',
    caption: 'A man should understand his own station.',
    captionUr: 'انسان کو اپنی حیثیت سمجھنی چاہیے۔',
  },
  {
    id: 'saying-prayer-manner',
    src: '/gallery/munir-sayings/08-prayer-manner.webp',
    alt: 'Saying of Muneer-ul-Islam RA: Prayer should feel like standing before the Creator and Master of the universe',
    caption:
      'The manner of offering prayer should be such that the person himself realises that he is standing before the Creator and Master of the universe, not in any ordinary court.',
    captionUr:
      'نماز کا انداز ایسا ہونا چاہیے کہ خود بندے کو احساس ہو کہ وہ کائنات کے خالق و مالک کے حضور کھڑا ہے، کسی عام دربار میں نہیں۔',
  },
  {
    id: 'saying-commanding-self',
    src: '/gallery/munir-sayings/09-commanding-self.webp',
    alt: 'Saying of Muneer-ul-Islam RA: The greatest enemy of man is the commanding self, burned through the performance of prayer',
    caption:
      'The greatest enemy of man is the commanding self (nafs-al-ammara), and this enemy is burned through the performance of prayer.',
    captionUr:
      'انسان کا سب سے بڑا دشمن نفسِ امارہ ہے، اور یہ دشمن نماز کی ادائیگی سے جلتا ہے۔',
  },
  {
    id: 'saying-gentleness',
    src: '/gallery/munir-sayings/10-gentleness.webp',
    alt: 'Saying of Muneer-ul-Islam RA: Gentleness is a special favour from Allah; whoever receives it gains His mercy',
    caption:
      'Gentleness is a special favour from Allah Almighty; whoever receives it gains the mercy of Almighty Lord.',
    captionUr:
      'نرمی اللہ تعالیٰ کی خاص عطا ہے؛ جسے یہ نصیب ہو، اسے ربِّ کریم کی رحمت ملتی ہے۔',
  },
  {
    id: 'saying-no-hesitation',
    src: '/gallery/munir-sayings/11-no-hesitation.webp',
    alt: 'Saying of Muneer-ul-Islam RA: One must not hesitate in the service of one’s beloved generous master ﷺ',
    caption:
      'One must not have any hesitation in the slavery of one’s beloved generous master, peace be upon him and his family.',
    captionUr:
      'اپنے پیارے کریم صلی اللہ علیہ وآلہ وسلم کی غلامی میں کسی قسم کی ہچکچاہٹ نہیں کرنی چاہیے۔',
  },
  {
    id: 'saying-work-of-deen',
    src: '/gallery/munir-sayings/12-work-of-deen.webp',
    alt: 'Saying of Muneer-ul-Islam RA: Son, keep doing the work of Deen; Allah Himself will fulfil all your tasks',
    caption: 'Son, keep doing the work of Deen. Allah Himself will fulfil all your tasks.',
    captionUr: 'بیٹا، دین کا کام کرتے رہو۔ اللہ تعالیٰ خود تمہارے سب کام پورے فرما دیں گے۔',
  },
];
