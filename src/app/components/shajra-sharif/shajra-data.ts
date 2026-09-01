export interface ShajraSaint {
  readonly name: string;
  readonly nameUr: string;
  readonly title?: string;
  readonly titleUr?: string;
  /** رضی اللہ تعالیٰ عنہ / عنہم — omitted for Rasool Allah ﷺ. */
  readonly honorific?: string;
}

export interface ShajraPage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly captionUr: string;
  readonly kashkoolPage?: number;
  readonly saints: readonly ShajraSaint[];
  readonly honour?: boolean;
}

export type ShajraSilsilaId =
  | 'naqshbandi-manzoom'
  | 'naqshbandi-mukhtasar'
  | 'chishti'
  | 'qadri';

export type ShajraOrderId = 'naqshbandi' | 'chishti' | 'qadri';

export interface ShajraSilsila {
  readonly id: ShajraSilsilaId;
  readonly orderId: ShajraOrderId;
  readonly titleEn: string;
  readonly titleUr: string;
  readonly recitationEn?: string;
  readonly recitationUr?: string;
  readonly kashkoolStart: number;
  readonly kashkoolEnd: number;
  readonly noteEn?: string;
  readonly noteUr?: string;
  readonly followNoteEn?: string;
  readonly followNoteUr?: string;
  readonly pages: readonly ShajraPage[];
}

export interface ShajraOrder {
  readonly id: ShajraOrderId;
  readonly titleEn: string;
  readonly titleUr: string;
  readonly silsilaIds: readonly ShajraSilsilaId[];
}

const RA = 'رضی اللہ تعالیٰ عنہ';
const RAHUM = 'رضی اللہ تعالیٰ عنہم';
const RAHMA = 'علیہ الرحمہ';

function s(
  name: string,
  nameUr: string,
  extra?: { title?: string; titleUr?: string; honorific?: string | null },
): ShajraSaint {
  const honorific = extra?.honorific === null ? undefined : (extra?.honorific ?? RA);
  return {
    name,
    nameUr,
    title: extra?.title,
    titleUr: extra?.titleUr,
    honorific,
  };
}

function kashkool(n: number): string {
  return `gallery/shajra/kashkool/${n}.jpg`;
}

export function toEasternDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export const SHAJRA_TITLE_PAGE: ShajraPage = {
  id: 'kashkool-208',
  src: kashkool(208),
  kashkoolPage: 208,
  alt: 'Kashkool e Yousufi page 208: ornamental title Shajra-haye Mubarakah, the blessed spiritual lineages',
  caption: 'The blessed spiritual lineages',
  captionUr: 'شجرہ ہائے مبارکہ',
  saints: [],
};

const mukhtasarPages: readonly ShajraPage[] = [
  {
    id: 'kashkool-218',
    src: 'gallery/shajra/01.jpg',
    kashkoolPage: 218,
    alt: 'Kashkool page 218: opening of the shorter Naqshbandi Mujaddidi Yusufi Shajra',
    caption: 'Opening — the Prophet ﷺ, Ahl-e-Bait and Sahaba',
    captionUr: 'آغاز — حضور ﷺ، اہل بیت اور صحابہ',
    saints: [
      s('Muhammad Rasool Allah ﷺ', 'حضور محمد رسول اللہ ﷺ', {
        title: 'Sayyid of the two worlds, King of the Messengers',
        titleUr: 'سید العالمین، سلطان الانبیاء',
        honorific: null,
      }),
      s('The Ahl-e-Bait', 'اہل بیت', {
        title: 'The blessed family of Mustafa ﷺ',
        titleUr: 'آلِ مصطفیٰ ﷺ',
        honorific: RAHUM,
      }),
      s('The noble Companions', 'صحابہ کرام', {
        title: 'All the Sahaba',
        titleUr: 'تمام صحابہ',
        honorific: RAHUM,
      }),
      s('Abu Bakr Siddiq', 'ابو بکر صدیق', {
        title: 'as-Siddiq al-Akbar',
        titleUr: 'الصدیق الاکبر',
      }),
      s('Salman Farsi', 'سلمان فارسی', {
        title: 'Pride of the holy ones',
        titleUr: 'فخر الاصفیاء',
      }),
      s('Imam Qasim bin Abu Bakr Siddiq', 'امام قاسم بن ابو بکر صدیق'),
    ],
  },
  {
    id: 'kashkool-219',
    src: 'gallery/shajra/02.jpg',
    kashkoolPage: 219,
    alt: 'Kashkool page 219: Imam Jafar Sadiq through Darwish Muhammad',
    caption: 'Imam Jafar Sadiq to Darwish Muhammad',
    captionUr: 'امام جعفر صادق تا خواجہ درویش',
    saints: [
      s('Imam Jafar Sadiq', 'امام جعفر صادق', {
        title: 'Imam of the truthful',
        titleUr: 'امام الصادقین',
      }),
      s('Bayazid Bastami', 'بایزید بسطامی'),
      s('Abul Hasan Kharqani', 'ابو الحسن خرقانی'),
      s('Abu Ali Farmadi', 'ابو علی فارمدی'),
      s('Yusuf Hamdani', 'یوسف ہمدانی'),
      s('Abdul Khaliq Ghajadwani', 'عبد الخالق غجدوانی'),
      s('Muhammad Arif Riwgari', 'محمد عارف ریوگری'),
      s('Mahmood Anjir Faghnawi', 'محمود انجیر فغنوی'),
      s('Azizan Ali Ramitani', 'عزیزان علی رامیتنی'),
      s('Muhammad Baba Samasi', 'محمد بابا سماسی'),
      s('Sayyid Amir Kulal', 'سید امیر کلال'),
      s('Bahauddin Naqshband', 'بہاؤ الدین نقشبند'),
      s('Muhammad Yaqub Charkhi', 'محمد یعقوب چرخی'),
      s('Ubaidullah Ahrar', 'عبید اللہ احرار'),
      s('Muhammad Zahid', 'محمد زاہد'),
      s('Darwish Muhammad', 'درویش محمد'),
    ],
  },
  {
    id: 'kashkool-220',
    src: 'gallery/shajra/03.jpg',
    kashkoolPage: 220,
    alt: 'Kashkool page 220: Mujaddid Alf Thani through the saints of Chora Sharif',
    caption: 'Mujaddid Alf Thani to Noor Muhammad Chorahi',
    captionUr: 'مجدد الف ثانی تا نور محمد چوراہی',
    saints: [
      s('Muhammad Amkanagi', 'محمد امکنگی'),
      s('Muhammad Baqi Billah', 'محمد باقی باللہ'),
      s('Ahmad Faruqi Sirhindi', 'احمد فاروقی سرہندی', {
        title: 'Imam Rabbani Mujaddid Alf Thani',
        titleUr: 'امام ربانی مجدد الف ثانی',
      }),
      s('Muhammad Masoom', 'محمد معصوم', {
        title: 'Qayyum of the age',
        titleUr: 'قیومِ زمانہ',
      }),
      s('Hujjatullah', 'حجت اللہ'),
      s('Muhammad Zubair', 'محمد زبیر'),
      s('Qutb-ud-Din', 'قطب الدین', {
        title: 'Qutb of the gnostics',
        titleUr: 'قطب العارفین',
      }),
      s('Jamalullah', 'جمال اللہ'),
      s('Shah Isa', 'شاہ عیسیٰ'),
      s('Noor Muhammad Chorahi', 'نور محمد چوراہی'),
      s('Bawa Ji Khwaja Faqir', 'باوا جی خواجہ فقیر'),
      s('The saints of Chora Sharif', 'چورا شریف کے اولیاء', {
        title: 'Khak-e-Chora, like stars of the galaxy',
        titleUr: 'خاکِ چورا، کہکشاں کے ستاروں کی مانند',
        honorific: RAHUM,
      }),
    ],
  },
  {
    id: 'kashkool-221',
    src: 'gallery/shajra/04.jpg',
    kashkoolPage: 221,
    alt: 'Kashkool page 221: later mashayikh of the Yusufi Nagina chain',
    caption: 'The later mashayikh',
    captionUr: 'بعد کے مشائخ',
    saints: [
      s('Shah La-Sani', 'شاہ لاثانی'),
      s('Ali Akbar', 'علی اکبر'),
      s('Ali Asghar', 'علی اصغر'),
      s('Shah Jamaat Ali', 'شاہ جماعت علی'),
      s('Shah Muhammad Hussain', 'شاہ محمد حسین', {
        title: 'Pir of the perfect ones',
        titleUr: 'پیرِ کاملین',
      }),
      s('Amir-e-Millat', 'امیرِ ملت'),
      s('Hafiz', 'حافظ'),
      s('Murshid Haji Muhammad Yusuf Ali Nagina', 'مرشد حاجی محمد یوسف علی نگینہ', {
        title: 'eloquent guide',
        titleUr: 'فصیح رہنما',
      }),
    ],
  },
];

export const SHAJRA_SILSILAS: readonly ShajraSilsila[] = [
  {
    id: 'naqshbandi-manzoom',
    orderId: 'naqshbandi',
    titleEn: 'Silsila ‘Aliyah Naqshbandiyah Mujaddidiyah Yusufiyah',
    titleUr: 'شجرہ عالیہ نقشبندیہ مجددیہ یوسفیہ',
    recitationEn: 'The longer recitation',
    recitationUr: 'منظوم تلاوت',
    kashkoolStart: 209,
    kashkoolEnd: 217,
    noteEn:
      'The first two stanzas on the opening page are a blessing; the Naqshbandi Shajra begins from the third stanza.',
    noteUr: 'پہلے دو بند تبرکاً ہیں؛ شجرہ نقشبندیہ تیسرے بند سے شروع ہوتا ہے۔',
    followNoteEn: 'The shorter recitation of this same silsila follows.',
    followNoteUr: 'اسی سلسلے کی مختصر تلاوت آگے ہے۔',
    pages: [
      {
        id: 'kashkool-209',
        src: kashkool(209),
        kashkoolPage: 209,
        alt: 'Kashkool page 209: opening of the longer Naqshbandi Mujaddidi Yusufi Shajra',
        caption: 'Opening hamd — the Prophet ﷺ and the Panjtan',
        captionUr: 'آغاز حمد — حضور ﷺ اور پنجتن',
        saints: [
          s('Muhammad Rasool Allah ﷺ', 'حضور محمد رسول اللہ ﷺ', {
            title: 'Noor-e-Jahan, Jaan-e-Jaan',
            titleUr: 'محمد نور جہاں، جانِ جاں',
            honorific: null,
          }),
          s('The Panjtan and Ahl-e-Bait', 'پنجتن اور اہل بیت', {
            honorific: RAHUM,
          }),
          s('Imam Hussain', 'امام حسین', {
            title: 'Shabbir, leader of Paradise',
            titleUr: 'شبیر، سردارِ جناں',
          }),
        ],
      },
      {
        id: 'kashkool-210',
        src: kashkool(210),
        kashkoolPage: 210,
        alt: 'Kashkool page 210: verses for the Companions and Abu Bakr Siddiq',
        caption: 'The Companions and Abu Bakr Siddiq',
        captionUr: 'صحابہ اور ابو بکر صدیق',
        saints: [
          s('The noble Companions', 'صحابہ کرام', {
            title: 'Leaders of the caravan',
            titleUr: 'امیرِ کارواں',
            honorific: RAHUM,
          }),
          s('Abu Bakr Siddiq', 'ابو بکر صدیق', {
            title: 'as-Siddiq al-Akbar',
            titleUr: 'صدیق اکبر',
          }),
        ],
      },
      {
        id: 'kashkool-211',
        src: kashkool(211),
        kashkoolPage: 211,
        alt: 'Kashkool page 211: Salman Farsi, Imam Qasim and Imam Jafar Sadiq',
        caption: 'Salman Farsi to Imam Jafar Sadiq',
        captionUr: 'سلمان فارسی تا امام جعفر صادق',
        saints: [
          s('Salman Farsi', 'سلمان فارسی', {
            title: 'Pride of the holy ones',
            titleUr: 'فخر قدسیاں',
          }),
          s('Imam Qasim', 'حضرت قاسم', {
            title: 'Eternal grace',
            titleUr: 'لطفِ جاوداں',
          }),
          s('Imam Jafar Sadiq', 'امام جعفر صادق', {
            title: 'Imam of the truthful',
            titleUr: 'امام صادقاں',
          }),
        ],
      },
      {
        id: 'kashkool-212',
        src: kashkool(212),
        kashkoolPage: 212,
        alt: 'Kashkool page 212: Bayazid, Abul Hasan, Yusuf Hamdani and the early Khwajagan',
        caption: 'Bayazid to the Khwajagan',
        captionUr: 'بایزید تا خواجگان',
        saints: [
          s('Bayazid Bastami', 'بایزید بسطامی'),
          s('Abul Hasan Kharqani', 'ابو الحسن خرقانی', {
            title: 'Qutb of the world',
            titleUr: 'قطبِ جہاں',
          }),
          s('Abu Ali Farmadi', 'ابو علی فارمدی'),
          s('Yusuf Hamdani', 'یوسف ہمدانی', {
            title: 'Murshid Yusuf of the Khwajagan',
            titleUr: 'مرشد یوسف ہمدانی',
          }),
          s('Abdul Khaliq Ghajadwani', 'عبد الخالق غجدوانی'),
          s('Muhammad Arif Riwgari', 'محمد عارف ریوگری'),
          s('Mahmood Anjir Faghnawi', 'محمود انجیر فغنوی'),
        ],
      },
      {
        id: 'kashkool-213',
        src: kashkool(213),
        kashkoolPage: 213,
        alt: 'Kashkool page 213: Ali Ramitani through Yaqub Charkhi',
        caption: 'Ali Ramitani to Yaqub Charkhi',
        captionUr: 'علی رامیتنی تا یعقوب چرخی',
        saints: [
          s('Azizan Ali Ramitani', 'عزیزان علی رامیتنی', {
            title: 'Pir-e-Maghan',
            titleUr: 'پیرِ مغاں',
          }),
          s('Muhammad Baba Samasi', 'محمد بابا سماسی'),
          s('Alauddin Attar', 'علاؤ الدین عطار'),
          s('Sayyid Amir Kulal', 'سید امیر کلال'),
          s('Bahauddin Naqshband', 'شاہ بہاؤ الدین نقشبند', {
            title: 'Master of masters',
            titleUr: 'خواجہ خواجگاں',
          }),
          s('Muhammad Yaqub Charkhi', 'محمد یعقوب چرخی'),
        ],
      },
      {
        id: 'kashkool-214',
        src: kashkool(214),
        kashkoolPage: 214,
        alt: 'Kashkool page 214: Ubaidullah Ahrar through Mujaddid Alf Thani',
        caption: 'Ubaidullah Ahrar to Mujaddid Alf Thani',
        captionUr: 'عبید اللہ احرار تا مجدد الف ثانی',
        saints: [
          s('Ubaidullah Ahrar', 'شاہ عبید اللہ احرار'),
          s('Muhammad Zahid', 'خواجہ محمد زاہد'),
          s('Darwish Muhammad', 'خواجہ درویش محمد'),
          s('Muhammad Amkanagi', 'خواجہ محمد امکنگی'),
          s('Muhammad Baqi Billah', 'محمد باقی باللہ'),
          s('Ahmad Faruqi Sirhindi', 'احمد فاروقی سرہندی', {
            title: 'Mujaddid Alf Thani',
            titleUr: 'مجدد الف ثانی',
          }),
        ],
      },
      {
        id: 'kashkool-215',
        src: kashkool(215),
        kashkoolPage: 215,
        alt: 'Kashkool page 215: Muhammad Masoom through Shah Jamalullah',
        caption: 'Muhammad Masoom to Shah Jamalullah',
        captionUr: 'محمد معصوم تا شاہ جمال اللہ',
        saints: [
          s('Muhammad Masoom', 'حضرت معصوم', {
            title: 'Qayyum of the age',
            titleUr: 'قیومِ زماں',
          }),
          s('Hujjatullah', 'حجت اللہ'),
          s('Muhammad Zubair', 'محمد زبیر'),
          s('Qutb-ud-Din', 'خواجہ قطب الدین', {
            title: 'Qutb of the gnostics',
            titleUr: 'قطب عارفاں',
          }),
          s('Jamalullah', 'شاہ جمال اللہ', {
            title: 'Pride of majesty',
            titleUr: 'فخر مہ و شاں',
          }),
        ],
      },
      {
        id: 'kashkool-216',
        src: kashkool(216),
        kashkoolPage: 216,
        alt: 'Kashkool page 216: Shah Isa, Noor Muhammad Chorahi and the saints of Chora',
        caption: 'Shah Isa to the saints of Chora Sharif',
        captionUr: 'شاہ عیسیٰ تا اولیاء چورا شریف',
        saints: [
          s('Shah Isa', 'سید عیسیٰ', {
            title: 'Refuge of the helpless',
            titleUr: 'پناہِ بے کساں',
          }),
          s('Noor Muhammad Chorahi', 'خواجہ نور محمد چوراہی', {
            title: 'Light of the world',
            titleUr: 'نور جہاں',
          }),
          s('Bawa Ji Khwaja Faqir', 'باوا جی خواجہ فقیر'),
          s('The saints of Chora Sharif', 'چورا شریف کے اولیاء', {
            title: 'Khak-e-Chora, like stars of the galaxy',
            titleUr: 'خاکِ چورا، مثلِ نجم و کہکشاں',
            honorific: RAHUM,
          }),
        ],
      },
      {
        id: 'kashkool-217',
        src: kashkool(217),
        kashkoolPage: 217,
        alt: 'Kashkool page 217: later mashayikh ending with Murshid Yusuf Nagina',
        caption: 'The later mashayikh, to Murshid Yusuf Nagina',
        captionUr: 'بعد کے مشائخ، تا مرشد یوسف نگینہ',
        saints: [
          s('Shah La-Sani', 'شاہ لاثانی'),
          s('Ali Akbar', 'علی اکبر'),
          s('Ali Asghar', 'علی اصغر'),
          s('Shah Jamaat Ali', 'شاہ جماعت علی'),
          s('Shah Muhammad Hussain', 'شاہ محمد حسین'),
          s('Amir-e-Millat', 'امیرِ ملت'),
          s('Murshid Haji Muhammad Yusuf Ali Nagina', 'مرشد یوسف نگینہ', {
            honorific: RAHMA,
          }),
        ],
      },
    ],
  },
  {
    id: 'naqshbandi-mukhtasar',
    orderId: 'naqshbandi',
    titleEn: 'Silsila ‘Aliyah Naqshbandiyah Mujaddidiyah Yusufiyah',
    titleUr: 'شجرہ مبارکہ عالیہ نقشبندیہ مجددیہ یوسفیہ',
    recitationEn: 'The shorter recitation',
    recitationUr: 'مختصر تلاوت',
    kashkoolStart: 218,
    kashkoolEnd: 221,
    noteEn: 'When time is short, this is the recitation of the same Naqshbandi chain as above.',
    noteUr: 'جب وقت کم ہو، اسی نقشبندی سلسلے کی یہ مختصر تلاوت پڑھی جائے۔',
    pages: mukhtasarPages,
  },
  {
    id: 'chishti',
    orderId: 'chishti',
    titleEn: 'Silsila Chishtiyah Sabriyah Sirajiyah Sardariyah Yusufiyah',
    titleUr: 'شجرہ مبارکہ چشتیہ صبریہ سراجیہ سرداریہ یوسفیہ',
    kashkoolStart: 222,
    kashkoolEnd: 225,
    pages: [
      {
        id: 'kashkool-222',
        src: kashkool(222),
        kashkoolPage: 222,
        alt: 'Kashkool page 222: opening of the Chishti Sabri Siraji Sardari Yusufi Shajra',
        caption: 'Opening — the Prophet ﷺ, Ahl-e-Bait and the early mashayikh',
        captionUr: 'آغاز — حضور ﷺ، اہل بیت اور اوائل مشائخ',
        saints: [
          s('Muhammad Rasool Allah ﷺ', 'حضور محمد رسول اللہ ﷺ', {
            title: 'Master of the world, King of the faith',
            titleUr: 'سرورِ عالم، شاہِ دیں',
            honorific: null,
          }),
          s('The Ahl-e-Bait', 'آلِ مصطفیٰ', {
            honorific: RAHUM,
          }),
          s('The noble Companions', 'صحابہ کرام', { honorific: RAHUM }),
          s('Sayyidah Fatimah Zahra', 'سیدہ فاطمہ زہرا', {
            title: 'Khair-un-Nisa of the worlds',
            titleUr: 'خیر النساء عالمیں',
            honorific: 'رضی اللہ تعالیٰ عنہا',
          }),
          s('Ali ibn Abi Talib', 'علی ابن ابی طالب', {
            title: 'Haider, Safdar, Amir al-Mu’minin',
            titleUr: 'حیدر و صفدر امیر المومنین',
          }),
          s('Hasan Basri', 'شاہ حسن بصری'),
          s('Abdul Wahid bin Zaid', 'عبد الواحد بن زید'),
          s('Fuzail ibn Iyad', 'شاہ فضیل ابن عیاض'),
        ],
      },
      {
        id: 'kashkool-223',
        src: kashkool(223),
        kashkoolPage: 223,
        alt: 'Kashkool page 223: Ibrahim Adham through Baba Farid',
        caption: 'Ibrahim Adham to Fariduddin Ganjshakar',
        captionUr: 'ابراہیم ادہم تا فرید الدین گنج شکر',
        saints: [
          s('Ibrahim Adham', 'شاہ ابراہیم ادہم'),
          s('Huzaifa Marashi', 'شاہ حذیفہ مرعشی'),
          s('Abu Hubaira Basri', 'ابو ہبیرہ بصری'),
          s('Mamshad Alawi', 'حضرت ممشاد علوی'),
          s('Abu Ishaq Shami', 'شیخ ابو اسحاق شامی'),
          s('Ahmad Abdal Chishti', 'احمد ابدال چشتی'),
          s('Nasiruddin Yusuf Chishti', 'شاہ ناصر الدین یوسف'),
          s('Maudud Chishti', 'خواجہ مودود چشتی'),
          s('Sharif Zandani', 'شاہ شریف زندنی'),
          s('Usman Harooni', 'حضرت عثمان ہارونی'),
          s('Moinuddin Chishti', 'شاہ معین الدین چشتی'),
          s('Qutbuddin Bakhtiyar Kaki', 'شاہ قطب الدین بختیار کاکی'),
          s('Fariduddin Ganjshakar', 'شاہ فرید الدین گنج شکر', {
            title: 'Qibla of the lovers',
            titleUr: 'قبلہ عاشقین',
          }),
        ],
      },
      {
        id: 'kashkool-224',
        src: kashkool(224),
        kashkoolPage: 224,
        alt: 'Kashkool page 224: Alauddin Sabir through Abu Saeed',
        caption: 'Alauddin Sabir to Abu Saeed',
        captionUr: 'علاؤ الدین صابر تا ابو سعید',
        saints: [
          s('Alauddin Sabir', 'شاہ علاؤ الدین'),
          s('Shamsuddin Turk', 'خواجہ شمس الدین', {
            title: 'Shams of the gnostics',
            titleUr: 'شمس عارفین',
          }),
          s('Jalaluddin Panipati', 'شاہ جلال الدین'),
          s('Ahmad Abdul Haqq', 'احمد عبد الحق'),
          s('Khwaja Arif', 'خواجہ عارف'),
          s('Abdul Quddus', 'عبد القدوس'),
          s('Nizamuddin', 'شاہ نظام الدین', {
            title: 'Imam of the God-fearing',
            titleUr: 'امام المتقین',
          }),
          s('Abu Saeed', 'ابو سعید'),
        ],
      },
      {
        id: 'kashkool-225',
        src: kashkool(225),
        kashkoolPage: 225,
        alt: 'Kashkool page 225: later Chishti mashayikh ending with Murshid Yusuf Nagina',
        caption: 'The later mashayikh, to Murshid Yusuf Nagina',
        captionUr: 'بعد کے مشائخ، تا مرشد یوسف نگینہ',
        saints: [
          s('Shah Muhammad Sadiq', 'شاہ محمد صادق'),
          s('Dawud Aziz', 'داود عزیز'),
          s('Abul Ma’ali', 'ابو المعالی'),
          s('Shah Miran', 'شاہ میراں'),
          s('Shah Inayat', 'شاہ عنایت'),
          s('Abdul Karim', 'خواجہ عبد الکریم'),
          s('Abdur Rahman', 'عبد الرحمن'),
          s('Ali Hussain', 'علی حسین'),
          s('Shah Muhammad Hussain', 'شاہ محمد حسین'),
          s('Shah Siraj ul Haqq', 'شاہ سراج الحق'),
          s('Sardar Ahmad', 'حضرت سردار احمد'),
          s('Murshid Haji Muhammad Yusuf Ali Nagina', 'مرشد یوسف نگینہ', {
            honorific: RAHMA,
          }),
        ],
      },
    ],
  },
  {
    id: 'qadri',
    orderId: 'qadri',
    titleEn: 'Silsila ‘Aliyah Qadiriyah Razawiyah Yusufiyah',
    titleUr: 'شجرہ عالیہ قادریہ رضویہ یوسفیہ',
    kashkoolStart: 226,
    kashkoolEnd: 233,
    pages: [
      {
        id: 'kashkool-226',
        src: kashkool(226),
        kashkoolPage: 226,
        alt: 'Kashkool page 226: opening of the Qadri Razawi Yusufi Shajra',
        caption: 'Opening — the Prophet ﷺ and the Imams of the Ahl-e-Bait',
        captionUr: 'آغاز — حضور ﷺ اور ائمہ اہل بیت',
        saints: [
          s('Muhammad Rasool Allah ﷺ', 'حضور محمد رسول اللہ ﷺ', {
            title: 'Mustafa ﷺ',
            titleUr: 'محمد مصطفیٰ ﷺ',
            honorific: null,
          }),
          s('The family and Companions', 'آل و اصحاب محمد', { honorific: RAHUM }),
          s('Ali ibn Abi Talib', 'علی ابن ابی طالب', {
            title: 'Mushkil Kusha',
            titleUr: 'شہ مشکل کشا',
          }),
          s('Imam Hussain', 'امام حسین', {
            title: 'The martyr of Karbala',
            titleUr: 'شہیدِ کربلا',
          }),
          s('Imam Zayn al-Abidin', 'امام زین العابدین', {
            title: 'Sayyid al-Sajjad',
            titleUr: 'سید سجاد',
          }),
          s('Imam Muhammad al-Baqir', 'امام محمد باقر', {
            title: 'Baqir of the people of guidance',
            titleUr: 'باقر اہل ہدیٰ',
          }),
        ],
      },
      {
        id: 'kashkool-227',
        src: kashkool(227),
        kashkoolPage: 227,
        alt: 'Kashkool page 227: Imam Jafar Sadiq through Abdul Wahid',
        caption: 'Imam Jafar Sadiq to Abdul Wahid',
        captionUr: 'امام جعفر صادق تا عبد الواحد',
        saints: [
          s('Imam Jafar Sadiq', 'امام جعفر صادق'),
          s('Imam Musa al-Kazim', 'امام موسیٰ کاظم'),
          s('Imam Ali al-Rida', 'امام علی رضا'),
          s('Ma’ruf Karkhi', 'معروف کرخی'),
          s('Sari al-Saqti', 'سری سقطی'),
          s('Junayd Baghdadi', 'جنید بغدادی'),
          s('Abu Bakr Shibli', 'ابو بکر شبلی'),
          s('Abdul Wahid', 'عبد الواحد'),
        ],
      },
      {
        id: 'kashkool-228',
        src: kashkool(228),
        kashkoolPage: 228,
        alt: 'Kashkool page 228: Abu al-Farah through Shaykh Abdul Qadir Jilani',
        caption: 'Abu al-Farah to Shaykh Abdul Qadir Jilani',
        captionUr: 'ابو الفرح تا شیخ عبد القادر جیلانی',
        saints: [
          s('Abu al-Farah Tartusi', 'ابو الفرح طرطوسی'),
          s('Abu al-Hasan', 'ابو الحسن'),
          s('Abu Saeed Mubarak', 'ابو سعید مبارک'),
          s('Shaykh Abdul Qadir Jilani', 'شیخ عبد القادر جیلانی', {
            title: 'Ghaus-e-Azam',
            titleUr: 'غوث اعظم',
          }),
        ],
      },
      {
        id: 'kashkool-229',
        src: kashkool(229),
        kashkoolPage: 229,
        alt: 'Kashkool page 229: later Qadri mashayikh',
        caption: 'The later Qadri mashayikh',
        captionUr: 'بعد کے قادری مشائخ',
        saints: [
          s('Nizam, Salih and Mansur', 'نظام، صالح اور منصور', { honorific: RAHUM }),
          s('Ali, Musa, Hasan and Ahmad', 'علی، موسیٰ، حسن اور احمد', {
            honorific: RAHUM,
          }),
        ],
      },
      {
        id: 'kashkool-230',
        src: kashkool(230),
        kashkoolPage: 230,
        alt: 'Kashkool page 230: Jamal al-Awliya and the table of grace',
        caption: 'Jamal al-Awliya',
        captionUr: 'جمال الاولیاء',
        saints: [
          s('Jamal al-Awliya', 'مولا جمال الاولیاء'),
          s('Fazlullah', 'فضل اللہ'),
        ],
      },
      {
        id: 'kashkool-231',
        src: kashkool(231),
        kashkoolPage: 231,
        alt: 'Kashkool page 231: Hamza, Shams-ud-Din and the family of the Messenger',
        caption: 'Hamza, Shams-ud-Din and the family of the Messenger',
        captionUr: 'حمزہ، شمس الدین اور آل رسول',
        saints: [
          s('Hamza', 'حمزہ', {
            title: 'The martyr of love',
            titleUr: 'شہیدِ عشق',
          }),
          s('Shams-ud-Din', 'شمس الدین', {
            title: 'Badr of the darkness',
            titleUr: 'بدر الدجیٰ',
          }),
          s('The family of the Messenger', 'آل رسول', { honorific: RAHUM }),
        ],
      },
      {
        id: 'kashkool-232',
        src: kashkool(232),
        kashkoolPage: 232,
        alt: 'Kashkool page 232: Abul Hussain Ahmad Noori, Imam Ahmad Raza and Hamid Raza',
        caption: 'Ahmad Noori to Hamid Raza',
        captionUr: 'احمد نوری تا حامد رضا',
        saints: [
          s('Abul Hussain Ahmad Noori', 'ابو الحسین احمد نوری'),
          s('Imam Ahmad Raza Khan', 'امام احمد رضا خان'),
          s('Hamid Raza', 'حامد رضا'),
        ],
      },
      {
        id: 'kashkool-233',
        src: kashkool(233),
        kashkoolPage: 233,
        alt: 'Kashkool page 233: closing verses for Sarfaraz Ahmad and Murshid Yusuf Nagina',
        caption: 'Closing — Sarfaraz Ahmad and Murshid Yusuf Nagina',
        captionUr: 'اختتام — سرفراز احمد اور مرشد یوسف نگینہ',
        saints: [
          s('Sarfaraz Ahmad', 'سرفراز احمد'),
          s('Murshid Haji Muhammad Yusuf Ali Nagina', 'مرشد یوسف نگینہ', {
            honorific: RAHMA,
          }),
        ],
      },
    ],
  },
];

export const SHAJRA_ORDERS: readonly ShajraOrder[] = [
  {
    id: 'naqshbandi',
    titleEn: 'Naqshbandi Mujaddidi Yusufi',
    titleUr: 'نقشبندیہ مجددیہ یوسفیہ',
    silsilaIds: ['naqshbandi-manzoom', 'naqshbandi-mukhtasar'],
  },
  {
    id: 'chishti',
    titleEn: 'Chishti Sabri Siraji Sardari Yusufi',
    titleUr: 'چشتیہ صبریہ سراجیہ سرداریہ یوسفیہ',
    silsilaIds: ['chishti'],
  },
  {
    id: 'qadri',
    titleEn: 'Qadri Razawi Yusufi',
    titleUr: 'قادریہ رضویہ یوسفیہ',
    silsilaIds: ['qadri'],
  },
];

export const SHAJRA_HONOUR: ShajraPage = {
  id: 'nagina',
  src: 'gallery/shajra/05-haji-muhammad-yusuf-ali-nagina.jpg',
  alt: 'Commemorative poster of Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
  caption: 'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
  captionUr: 'پیر طریقت رہبر شریعت حضرت حاجی محمد یوسف علی نگینہ رضی اللہ تعالیٰ عنہ',
  honour: true,
  saints: [
    s(
      'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
      'پیر طریقت رہبر شریعت حضرت حاجی محمد یوسف علی نگینہ',
    ),
  ],
};

export function silsilaById(id: ShajraSilsilaId): ShajraSilsila {
  const found = SHAJRA_SILSILAS.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Unknown silsila: ${id}`);
  }
  return found;
}
