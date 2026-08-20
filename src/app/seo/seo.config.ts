/** Canonical public site origin (GitHub Pages custom domain). */
export const SITE_ORIGIN = 'https://www.naginasocialwelfare.co.uk';

export const SITE_NAME = 'Nagina Social Welfare';

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/brand/nagina.png`;

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Path only, e.g. "/" or "/quran/" */
  readonly path: string;
  readonly keywords?: string;
  readonly image?: string;
  readonly type?: 'website' | 'article';
  /** Set to noindex for thank-you / duplicate URLs that should not appear in Google. */
  readonly robots?: string;
}

export const HOME_SEO: PageSeo = {
  title: 'Nagina Social Welfare UK | Islamic Education & Community Welfare',
  description:
    'Nagina Social Welfare UK unites faith and compassion — Markaz Deen-e-Islam education, community welfare, Namaz times, Quran Majeed with Kanzul Iman, and Islamic books in Peterborough. Registered charity 1196514.',
  path: '/',
  keywords:
    'Nagina Social Welfare, Markaz Deen-e-Islam, madrasa Peterborough, Islamic education UK, Peterborough Islamic institute, Ahle Sunnat, community welfare',
  type: 'website',
};

export const ABOUT_SEO: PageSeo = {
  title: 'About Us | Nagina Social Welfare UK',
  description:
    'Learn about Nagina Social Welfare UK — building a legacy of knowledge and compassion through Markaz Deen-e-Islam and community welfare.',
  path: '/about/',
  keywords: 'About Nagina Social Welfare, Markaz Deen-e-Islam, Islamic charity UK',
  type: 'website',
};

export const WORK_SEO: PageSeo = {
  title: 'Our Work | Markaz Deen-e-Islam & Welfare | Nagina Social Welfare',
  description:
    'One mission carried by two dedicated arms — Islamic education at Markaz Deen-e-Islam and community welfare across the UK.',
  path: '/work/',
  keywords: 'Our Work, Markaz Deen-e-Islam, community welfare UK, Islamic education',
  type: 'website',
};

export const MADRASA_SEO: PageSeo = {
  title: 'Madrasa & Islamic Institute Peterborough | Markaz Deen-e-Islam',
  description:
    'Markaz Deen-e-Islam is a madrasa and Islamic institute in Peterborough offering Quran classes and Islamic education for children — enrol on WhatsApp. 103 Burmer Road, PE1 3HT.',
  path: '/madrasa/',
  keywords:
    'madrasa Peterborough, Islamic school Peterborough, Quran classes for children Peterborough, Islamic classes for kids Peterborough, evening madrasa, weekend Islamic school, Islamic institute Peterborough, Markaz Deen-e-Islam',
  type: 'website',
};

export const SPIRITUAL_GUIDE_SEO: PageSeo = {
  title: 'Spiritual Guide | Munir-e-Islam | Nagina Social Welfare',
  description:
    'Honouring Allama Munir Ahmed Yusufi — Munir-e-Islam — spiritual guide of Markaz Deen-e-Islam and Nagina Social Welfare, with photographs from Nagina TV.',
  path: '/spiritual-guide/',
  keywords: 'Spiritual Guide, Munir-e-Islam, Allama Munir Ahmed Yusufi, Pir-o-Murshid',
  type: 'website',
};

export const GUIDANCE_SEO: PageSeo = {
  title: 'Guidance | Teachings & Counsel | Nagina Social Welfare',
  description:
    'Timeless teachings that guide character, knowledge and charity — counsel from Munir-e-Islam for preachers, students and supporters.',
  path: '/guidance/',
  keywords: 'Islamic guidance, Munir-e-Islam teachings, character and charity',
  type: 'website',
};

export const NAMAZ_SEO: PageSeo = {
  title: 'Namaz Times Peterborough | Nagina Social Welfare UK',
  description:
    'Daily Namaz (salah) times for Peterborough, UK with live now and next prayer windows and a Qibla compass. These are personal begin and end times, not Jamaat.',
  path: '/namaz/',
  keywords: 'Namaz times Peterborough, prayer times UK, salah timetable, Qibla compass',
  type: 'website',
};

export const QURAN_SEO: PageSeo = {
  title: 'Blessed Quran Majeed with Kanzul Iman | Nagina Social Welfare',
  description:
    'Read the Blessed Quran Majeed in Arabic with Kanzul Iman Urdu translation by Aala Hazrat Imam Ahmed Raza Khan, English toggle, and Alafasy recitation.',
  path: '/quran/',
  keywords:
    'Quran Majeed, Kanzul Iman, Holy Quran Urdu, Ahmed Raza Khan, Quran with translation, Alafasy',
  type: 'website',
};

export const BOOKS_SEO: PageSeo = {
  title: 'Islamic Books Library | Seedha Rasta | Nagina Social Welfare',
  description:
    'Browse and download Islamic books from the Seedha Rasta library — free PDFs for learning and guidance from Nagina Social Welfare UK.',
  path: '/books/',
  keywords: 'Islamic books PDF, Seedha Rasta, free Islamic library UK, Urdu Islamic books',
  type: 'website',
};

export const SERMONS_SEO: PageSeo = {
  title: 'Sermons by Baba Ji Sarkar | Bayanat | Nagina Social Welfare',
  description:
    'Watch blessed bayanat and sermons by Baba Ji Sarkar from the Seedha Rasta collection — searchable video library via Nagina TV on YouTube.',
  path: '/sermons/',
  keywords:
    'Baba Ji Sarkar bayanat, Seedha Rasta sermons, Nagina TV, Islamic lectures UK, Ahle Sunnat bayan',
  type: 'website',
};

export const APPS_SEO: PageSeo = {
  title: 'Mobile Apps | Nagina Social Welfare',
  description:
    'Purpose-built mobile apps for parents, teachers, administrators and collectors — available on the Google Play Store.',
  path: '/apps/',
  keywords: 'Nagina apps, Markaz Deen-e-Islam app, Islamic school app UK',
  type: 'website',
};

export const EVENTS_SEO: PageSeo = {
  title: 'Events | Gatherings & Announcements | Nagina Social Welfare',
  description:
    'Event photos, posters and programmes from Markaz Deen-e-Islam — including the Grand Annual Mehfil-e-Naat. Message us on WhatsApp for the next date.',
  path: '/events/',
  keywords: 'Islamic events Peterborough, Markaz Deen-e-Islam gatherings, Nagina events',
  type: 'website',
};

export const DONATE_SEO: PageSeo = {
  title: 'Donate | Support Our Mission | Nagina Social Welfare UK',
  description:
    'Donate Zakat, Sadaqah, Lillah or Fitrana to Nagina Social Welfare UK (charity 1196514) by SumUp, PayPal, NatWest PayIt or bank transfer.',
  path: '/donate/',
  keywords: 'Donate Nagina Social Welfare, SumUp donation UK, Islamic charity Peterborough',
  type: 'website',
};

export const ASSISTANT_SEO: PageSeo = {
  title: 'Nagina Assistant | Islamic Guidance & Site Help',
  description:
    'Ask Nagina Assistant in English or Urdu about creed pages, guidance, books, donations, and site information from Nagina Social Welfare UK.',
  path: '/assistant/',
  keywords:
    'Nagina Assistant, Islamic AI assistant, Urdu Islamic help, Nagina guidance assistant',
  type: 'website',
};

export const CONTACT_SEO: PageSeo = {
  title: 'Contact | Nagina Social Welfare UK',
  description:
    'Contact Nagina Social Welfare UK in Peterborough on WhatsApp, phone or email — madrasa enrolment, donations and general enquiries.',
  path: '/contact/',
  keywords: 'Contact Nagina Social Welfare, Peterborough Islamic centre contact',
  type: 'website',
};

export const PRIVACY_SEO: PageSeo = {
  title: 'Privacy Notice | Nagina Social Welfare UK',
  description:
    'How Nagina Social Welfare handles information when you use this website, including donations via SumUp.',
  path: '/privacy/',
  keywords: 'Privacy notice, GDPR, Nagina Social Welfare data protection',
  type: 'website',
};

export const SAFEGUARDING_SEO: PageSeo = {
  title: 'Safeguarding | Nagina Social Welfare UK',
  description:
    'How Nagina Social Welfare and Markaz Deen-e-Islam keep children and adults at risk safe — contact us on WhatsApp or email, or request the full policy.',
  path: '/safeguarding/',
  keywords: 'Safeguarding, child protection, Markaz Deen-e-Islam, Nagina Social Welfare',
  type: 'website',
};

export const KHATME_NABUWWAT_SEO: PageSeo = {
  title: 'Khatme Nabuwwat | Finality of Prophethood | Nagina Social Welfare',
  description:
    'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — Khatam-un-Nabiyyin — the cornerstone of Islamic faith, with Quran and Hadith on the Seal of the Prophets.',
  path: '/khatme-nabuwwat/',
  keywords:
    'Khatme Nabuwwat, Khatam-un-Nabiyyin, Finality of Prophethood, Seal of the Prophets, Quran 33:40, Ahle Sunnat',
  image: `${SITE_ORIGIN}/media/khatme-nabuwwat.jpg`,
  type: 'article',
};

export const AHLE_BAIT_SEO: PageSeo = {
  title: 'Ahle Bait | Elevated Status of Ahl al-Bayt | Nagina Social Welfare',
  description:
    'The elevated status of Ahl al-Bayt in the Quran and Sunnah — a Sunni perspective on love, honour and reverence for the Blessed Household of the Prophet ﷺ.',
  path: '/ahle-bait/',
  keywords:
    'Ahle Bait, Ahl al-Bayt, Aal-e-Pak, Ayat al-Tathir, Hadith al-Thaqalayn, Ahl al-Kisa, Ahle Sunnat',
  image: `${SITE_ORIGIN}/media/shan-ahle-bait.jpg`,
  type: 'article',
};

export const SAHABA_IKRAM_SEO: PageSeo = {
  title: 'Sahaba Ikram | Belief Regarding the Companions | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Sahabah — upright Companions of the Prophet ﷺ, loved and respected as an integral part of Islamic faith.',
  path: '/sahaba-ikram/',
  keywords:
    'Sahaba Ikram, Sahabah, Companions of the Prophet, Ahl al-Sunnah, Khulafa ar-Rashidun, Ahle Sunnat',
  image: `${SITE_ORIGIN}/media/sahaba-ikram.jpg`,
  type: 'article',
};

export const AULIA_KARAM_SEO: PageSeo = {
  title: 'Aulia Karam | Belief Regarding the Awliya Allah | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Awliya Allah — friends of Allah honoured through faith and taqwa, with Surah Yunus 10:62 and authentic Hadith on Aulia Karam.',
  path: '/aulia-karam/',
  keywords:
    'Aulia Karam, Awliya Allah, Awliya, Yunus 10:62, Ala inna awliya Allah, friends of Allah, Ahle Sunnat, Hanafi Barelvi',
  image: `${SITE_ORIGIN}/media/aulia-karam.jpg`,
  type: 'article',
};

export const BASIC_BELIEFS_SEO: PageSeo = {
  title: 'Basic Beliefs | Hanafi Barelvi Ahl al-Sunnah FAQ | Nagina Social Welfare',
  description:
    'Frequently asked questions on the basic aqeedah of Hanafi Barelvi Ahl al-Sunnah wa’l-Jama’ah — Tawhid, Khatme Nabuwwat, love for the Prophet ﷺ, Ahle Bait, Sahaba, and Awliya.',
  path: '/basic-beliefs/',
  keywords:
    'Basic beliefs, aqeedah, Hanafi Barelvi, Ahl al-Sunnah, iman, Khatme Nabuwwat, Tawhid, Ahle Sunnat, Sunni creed FAQ',
  type: 'article',
};

export const DONATE_THANKS_SEO: PageSeo = {
  title: 'Thank You for Your Donation | Nagina Social Welfare UK',
  description:
    'Thank you for supporting Nagina Social Welfare UK — your gift helps Islamic education and community welfare.',
  path: '/donate/thanks/',
  keywords: 'donate Nagina Social Welfare, thank you donation UK',
  type: 'website',
  robots: 'noindex, follow',
};
