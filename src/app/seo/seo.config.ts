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
  /** Short label for breadcrumb schema (defaults to title before "|"). */
  readonly breadcrumb?: string;
  /** Sitemap changefreq when indexed. */
  readonly changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** Sitemap priority 0–1 when indexed. */
  readonly priority?: number;
}

export const HOME_SEO: PageSeo = {
  title: 'Nagina Social Welfare UK | Islamic Education & Welfare',
  description:
    'Nagina Social Welfare UK supports Islamic education and community welfare in Peterborough through trusted resources, local services and charitable work.',
  path: '/',
  keywords:
    'Nagina Social Welfare, UK based charity, Markaz Deen-e-Islam, madrasa Peterborough, Islamic education UK, Peterborough Islamic institute, Ahl al-Sunnah, community welfare, charity 1196514',
  type: 'website',
  breadcrumb: 'Home',
  changefreq: 'weekly',
  priority: 1.0,
};

export const ABOUT_SEO: PageSeo = {
  title: 'Our Vision | Nagina Social Welfare UK',
  description:
    'Nagina Social Welfare UK (charity 1196514) — our vision for knowledge, compassion and character across the UK, rooted in Peterborough.',
  path: '/about/',
  keywords: 'About Nagina Social Welfare, UK based charity 1196514, Islamic charity UK vision',
  type: 'website',
  breadcrumb: 'About',
  changefreq: 'monthly',
  priority: 0.8,
};

export const WORK_SEO: PageSeo = {
  title: 'Our Work | Education & Charity | Nagina Social Welfare',
  description:
    'Islamic education at Markaz Deen-e-Islam and community welfare from Nagina Social Welfare UK — who we help and how to ask.',
  path: '/work/',
  keywords: 'Our Work, Markaz Deen-e-Islam, community welfare UK, Islamic education, charity',
  type: 'website',
  breadcrumb: 'Our Work',
  changefreq: 'monthly',
  priority: 0.8,
};

export const PETERBOROUGH_SEO: PageSeo = {
  title: 'Peterborough Community | Nagina Social Welfare UK',
  description:
    'Find Nagina Social Welfare in Peterborough — address, madrasa timetable, prayer times, events, welfare support and how to contact us.',
  path: '/peterborough/',
  keywords:
    'Nagina Social Welfare Peterborough, Markaz Deen-e-Islam, Islamic community Peterborough, Burmer Road',
  type: 'website',
  breadcrumb: 'Peterborough',
  changefreq: 'weekly',
  priority: 0.95,
};

export const MADRASA_SEO: PageSeo = {
  title: 'Madrasa & Islamic Institute Peterborough | Markaz Deen-e-Islam',
  description:
    'Markaz Deen-e-Islam evening classes at 103 Burmer Road, Peterborough — ages, timetable, safeguarding and online admission.',
  path: '/madrasa/',
  keywords:
    'madrasa Peterborough, Islamic school Peterborough, Quran classes for children Peterborough, 2026 madrasa intake, evening madrasa 6:30pm, Markaz Deen-e-Islam',
  type: 'website',
  breadcrumb: 'Madrasa',
  changefreq: 'monthly',
  priority: 0.9,
};

export const APPLY_SEO: PageSeo = {
  title: 'Online Admission 2026 | Markaz Deen-e-Islam | Nagina Social Welfare',
  description:
    'Apply online for Markaz Deen-e-Islam 2026 intake. Class 1 and 2 for under 10s; Class 3 (18:30–19:30) for ages 10+.',
  path: '/apply/',
  keywords:
    'madrasa admission Peterborough 2026, Markaz Deen-e-Islam apply, online enrolment Islamic school Peterborough',
  type: 'website',
  breadcrumb: 'Apply',
  changefreq: 'monthly',
  priority: 0.85,
};

export const APPLY_SUCCESS_SEO: PageSeo = {
  title: 'Application Received | Markaz Deen-e-Islam',
  description:
    'Thank you — your Markaz Deen-e-Islam admission application has been received and will be reviewed shortly.',
  path: '/apply/success/',
  type: 'website',
  robots: 'noindex, follow',
};

export const APPLY_TRACK_SEO: PageSeo = {
  title: 'Track Application | Markaz Deen-e-Islam',
  description:
    'Check the status of your Markaz Deen-e-Islam admission application using the application ID from your confirmation email or submission screen.',
  path: '/apply/track/',
  type: 'website',
  robots: 'noindex, follow',
};

export const MEMBERSHIP_SEO: PageSeo = {
  title: 'Community Membership | Nagina Social Welfare UK',
  description:
    'Apply online to join the Nagina Social Welfare UK community. Free membership for adults aged 18+, reviewed by trustees.',
  path: '/membership/',
  keywords: 'Nagina Social Welfare membership, charity community UK, volunteer Peterborough',
  type: 'website',
  breadcrumb: 'Membership',
  changefreq: 'monthly',
  priority: 0.7,
};

export const MEMBERSHIP_SUCCESS_SEO: PageSeo = {
  title: 'Membership Application Received | Nagina Social Welfare UK',
  description: 'Thank you — your community membership application has been received.',
  path: '/membership/success/',
  robots: 'noindex, follow',
  type: 'website',
};

export const MEMBERSHIP_TRACK_SEO: PageSeo = {
  title: 'Track Membership Application | Nagina Social Welfare UK',
  description: 'Check the status of your community membership application.',
  path: '/membership/track/',
  robots: 'noindex, follow',
  type: 'website',
};

export const MEMBERSHIP_LOGIN_SEO: PageSeo = {
  title: 'Member Sign In | Nagina Social Welfare UK',
  description: 'Sign in to the Nagina Social Welfare UK community member area.',
  path: '/membership/login/',
  robots: 'noindex, follow',
  type: 'website',
};

export const MEMBERSHIP_HOME_SEO: PageSeo = {
  title: 'Member Area | Nagina Social Welfare UK',
  description: 'Your Nagina Social Welfare UK community membership.',
  path: '/membership/home/',
  robots: 'noindex, follow',
  type: 'website',
};

export const SPIRITUAL_GUIDE_SEO: PageSeo = {
  title: 'Spiritual Guide | Munir-e-Islam | Nagina Social Welfare',
  description:
    'Honouring Allama Munir Ahmed Yusufi — Munir-e-Islam — with the Yusufi Shajra Sharif and photographs from Nagina TV.',
  path: '/spiritual-guide/',
  keywords:
    'Spiritual Guide, Munir-e-Islam, Allama Munir Ahmed Yusufi, Pir-o-Murshid, Shajra Sharif, Naqshbandi Mujaddidi Yusufi',
  type: 'website',
  breadcrumb: 'Spiritual Guide',
  changefreq: 'monthly',
  priority: 0.8,
};

export const GUIDANCE_SEO: PageSeo = {
  title: 'Guidance | Teachings & Counsel | Nagina Social Welfare',
  description:
    'Timeless teachings that guide character, knowledge and charity — counsel from Munir-e-Islam for students and supporters.',
  path: '/guidance/',
  keywords: 'Islamic guidance, Munir-e-Islam teachings, character and charity',
  type: 'website',
  breadcrumb: 'Guidance',
  changefreq: 'monthly',
  priority: 0.8,
};

export const NAMAZ_SEO: PageSeo = {
  title: 'Prayer Times Peterborough | Salah | Nagina Social Welfare UK',
  description:
    'Daily Salah prayer times for Peterborough, UK — source, method and last-checked date, plus a Qibla compass. Personal begin/end times, not jamat.',
  path: '/namaz/',
  keywords: 'prayer times Peterborough, Salah times Peterborough, salah timetable UK, Qibla compass',
  type: 'website',
  breadcrumb: 'Prayer Times',
  changefreq: 'daily',
  priority: 0.95,
};

export const QURAN_SEO: PageSeo = {
  title: 'Blessed Quran Majeed with Kanzul Iman | Nagina Social Welfare',
  description:
    'Read the Blessed Quran Majeed in Arabic with Kanzul Iman Urdu translation, English toggle, and Alafasy recitation.',
  path: '/quran/',
  keywords: 'Quran Majeed, Kanzul Iman, Holy Quran Urdu, Ahmed Raza Khan, Quran with translation',
  type: 'website',
  breadcrumb: 'Quran Majeed',
  changefreq: 'weekly',
  priority: 0.9,
};

export const HADITH_SEO: PageSeo = {
  title: 'Kutub al-Sittah | Six Authentic Books of Hadith | Nagina Social Welfare',
  description:
    'Browse the six authentic books of Hadith — Sahih al-Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Nasa\'i, and Ibn Majah — in Arabic with Urdu and English.',
  path: '/hadith/',
  keywords: 'Kutub al-Sittah, Sahih Bukhari, Sahih Muslim, Hadith Urdu, six authentic books',
  type: 'website',
  breadcrumb: 'Hadith',
  changefreq: 'weekly',
  priority: 0.9,
};

export const SEEDHA_RASTAH_SEO: PageSeo = {
  title: 'Seedha Rastah | Educational Archive of Munir-e-Islam | Nagina Social Welfare',
  description:
    'Honouring Seedha Rastah — the educational archive of Allama Munir Ahmed Yusufi (Munir-e-Islam). PDF books, sermons and links.',
  path: '/seedha-rastah/',
  keywords: 'Seedha Rastah, Munir-e-Islam, Allama Munir Ahmed Yusufi, Islamic books archive',
  type: 'website',
  breadcrumb: 'Seedha Rastah',
  changefreq: 'monthly',
  priority: 0.85,
};

export const BOOKS_SEO: PageSeo = {
  title: 'Islamic Books Library | Seedha Rastah | Nagina Social Welfare',
  description:
    'Browse and download Islamic books from the Seedha Rastah library — free PDFs from Nagina Social Welfare UK.',
  path: '/books/',
  keywords: 'Islamic books PDF, Seedha Rastah, free Islamic library UK, Urdu Islamic books',
  type: 'website',
  breadcrumb: 'Books',
  changefreq: 'weekly',
  priority: 0.8,
};

export const SERMONS_SEO: PageSeo = {
  title: 'Sermons by Baba Ji Sarkar | Nagina Social Welfare',
  description:
    'Watch blessed sermons by Baba Ji Sarkar from the Seedha Rastah collection — searchable via Nagina TV on YouTube.',
  path: '/sermons/',
  keywords: 'Baba Ji Sarkar sermons, Seedha Rastah sermons, Nagina TV, Islamic lectures UK',
  type: 'website',
  breadcrumb: 'Sermons',
  changefreq: 'weekly',
  priority: 0.8,
};

export const APPS_SEO: PageSeo = {
  title: 'Mobile Apps | Nagina Social Welfare',
  description:
    'Purpose-built mobile apps for parents, teachers, administrators and collectors — on the Google Play Store.',
  path: '/apps/',
  keywords: 'Nagina apps, Markaz Deen-e-Islam app, Islamic school app UK',
  type: 'website',
  breadcrumb: 'Apps',
  changefreq: 'monthly',
  priority: 0.7,
};

export const EVENTS_SEO: PageSeo = {
  title: 'Events | Gatherings & Announcements | Nagina Social Welfare',
  description:
    'Event photos, posters and programmes from Markaz Deen-e-Islam in Peterborough. Message us on WhatsApp for the next date.',
  path: '/events/',
  keywords: 'Islamic events Peterborough, Markaz Deen-e-Islam gatherings, Nagina events',
  type: 'website',
  breadcrumb: 'Events',
  changefreq: 'weekly',
  priority: 0.8,
};

export const ZAKAT_SEO: PageSeo = {
  title: 'Zakat Calculator | Nagina Social Welfare UK',
  description:
    'Zakat calculator: 2.5%, gold and silver jewellery, UK nisab, tola and grams. Then give zakat to charity 1196514.',
  path: '/zakat/',
  keywords: 'zakat calculator UK, nisab, gold jewellery zakat, silver nisab, Nagina Social Welfare',
  type: 'website',
  breadcrumb: 'Zakat Calculator',
  changefreq: 'weekly',
  priority: 0.9,
};

export const WHAT_IS_ZAKAT_SEO: PageSeo = {
  title: 'What is Zakat? UK Guide | Nagina Social Welfare',
  description:
    'A clear UK guide to Zakat — what it is, who it helps, and how Nagina Social Welfare supports giving with trusted sources.',
  path: '/zakat/what-is-zakat/',
  keywords: 'what is zakat UK, zakat explained, Islamic charity, Nagina Social Welfare',
  type: 'article',
  breadcrumb: 'What is Zakat?',
  changefreq: 'monthly',
  priority: 0.85,
};

export const ZAKAT_RULES_SEO: PageSeo = {
  title: 'Zakat Rules in the UK | Nagina Social Welfare',
  description:
    'Zakat rules for UK Muslims — assets, nisab source and date, common questions and a clear disclaimer before using the calculator.',
  path: '/zakat/rules/',
  keywords: 'zakat rules UK, nisab UK, zakat assets, hawl, Nagina Social Welfare',
  type: 'article',
  breadcrumb: 'Zakat Rules',
  changefreq: 'monthly',
  priority: 0.85,
};

export const DUAS_SEO: PageSeo = {
  title: 'Daily Duas and Prayers | Nagina Social Welfare UK',
  description:
    'Checked daily duas with Arabic, transliteration and English meaning from Nagina Social Welfare UK — reviewed before publication.',
  path: '/duas/',
  keywords: 'daily duas, Islamic prayers English, dua transliteration, Nagina Social Welfare',
  type: 'article',
  breadcrumb: 'Daily Duas',
  changefreq: 'monthly',
  priority: 0.8,
};

export const CALENDAR_SEO: PageSeo = {
  title: 'Islamic Calendar | Nagina Social Welfare UK',
  description:
    'Islamic (Hijri) calendar notes for planning — method, key dates and where dates may change. Peterborough prayer times linked.',
  path: '/calendar/',
  keywords: 'Islamic calendar, Hijri calendar UK, Islamic dates, Nagina Social Welfare',
  type: 'website',
  breadcrumb: 'Islamic Calendar',
  changefreq: 'weekly',
  priority: 0.8,
};

export const RAMADAN_SEO: PageSeo = {
  title: 'Ramadan in Peterborough | Nagina Social Welfare UK',
  description:
    'Ramadan in Peterborough — how to use local prayer times, events and contact Nagina Social Welfare for support information.',
  path: '/ramadan/',
  keywords: 'Ramadan Peterborough, iftar Peterborough, Taraweeh, Nagina Social Welfare',
  type: 'website',
  breadcrumb: 'Ramadan',
  changefreq: 'weekly',
  priority: 0.85,
};

export const IMPACT_SEO: PageSeo = {
  title: 'Impact Update | Nagina Social Welfare UK',
  description:
    'Approved updates on Nagina Social Welfare UK programmes, dates and community impact — published only with trustee approval.',
  path: '/impact/',
  keywords: 'Nagina Social Welfare impact, charity annual report, Peterborough community welfare',
  type: 'website',
  breadcrumb: 'Impact',
  changefreq: 'monthly',
  priority: 0.75,
};

export const DONATE_SEO: PageSeo = {
  title: 'Donate | Support Our Mission | Nagina Social Welfare UK',
  description:
    'Donate Zakat, Sadaqah, Lillah or Fitrana to Nagina Social Welfare UK (charity 1196514) by SumUp, PayPal, NatWest PayIt or bank transfer.',
  path: '/donate/',
  keywords: 'Donate Nagina Social Welfare, Zakat, SumUp donation UK, Islamic charity Peterborough',
  type: 'website',
  breadcrumb: 'Donate',
  changefreq: 'monthly',
  priority: 0.9,
};

export const ASSISTANT_SEO: PageSeo = {
  title: 'Nagina Assistant | Islamic Guidance & Site Help',
  description:
    'Ask Nagina Assistant in English or Urdu about creed pages, guidance, books, donations and site information.',
  path: '/assistant/',
  keywords: 'Nagina Assistant, Islamic AI assistant, Urdu Islamic help, Nagina guidance assistant',
  type: 'website',
  breadcrumb: 'Assistant',
  changefreq: 'monthly',
  priority: 0.7,
};

export const CONTACT_SEO: PageSeo = {
  title: 'Contact | Nagina Social Welfare UK',
  description:
    'Contact Nagina Social Welfare UK in Peterborough — WhatsApp, phone or email for madrasa, donations and general enquiries.',
  path: '/contact/',
  keywords: 'Contact Nagina Social Welfare, Peterborough Islamic centre contact, madrasa admission',
  type: 'website',
  breadcrumb: 'Contact',
  changefreq: 'monthly',
  priority: 0.8,
};

export const PRIVACY_SEO: PageSeo = {
  title: 'Privacy Notice | Nagina Social Welfare UK',
  description:
    'How Nagina Social Welfare handles information when you use this website, including donations via SumUp.',
  path: '/privacy/',
  keywords: 'Privacy notice, GDPR, Nagina Social Welfare data protection',
  type: 'website',
  breadcrumb: 'Privacy',
  changefreq: 'yearly',
  priority: 0.5,
};

export const SAFEGUARDING_SEO: PageSeo = {
  title: 'Safeguarding | Nagina Social Welfare UK',
  description:
    'How Nagina Social Welfare and Markaz Deen-e-Islam keep children and adults at risk safe — WhatsApp, email or request the full policy.',
  path: '/safeguarding/',
  keywords: 'Safeguarding, child protection, Markaz Deen-e-Islam, Nagina Social Welfare',
  type: 'website',
  breadcrumb: 'Safeguarding',
  changefreq: 'yearly',
  priority: 0.6,
};

export const KHATME_NABUWWAT_SEO: PageSeo = {
  title: 'Finality of Prophethood | Nagina Social Welfare',
  description:
    'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — the Seal of the Prophets — a cornerstone of Islamic faith for Ahl al-Sunnah.',
  path: '/khatme-nabuwwat/',
  keywords: 'Finality of Prophethood, Khatam-un-Nabiyyin, Seal of the Prophets, Quran 33:40',
  image: `${SITE_ORIGIN}/media/khatme-nabuwwat.webp`,
  type: 'article',
  breadcrumb: 'Finality of Prophethood',
  changefreq: 'monthly',
  priority: 0.8,
};

export const AHLE_BAIT_SEO: PageSeo = {
  title: 'Ahl al-Bayt | The Prophet’s Family | Nagina Social Welfare',
  description:
    'The elevated status of Ahl al-Bayt — the Blessed Household of the Prophet Muhammad ﷺ — in the light of the Quran and Sunnah.',
  path: '/ahle-bait/',
  keywords: 'Ahl al-Bayt, Prophet’s family, Aal-e-Pak, Ayat al-Tathir, Hadith al-Thaqalayn',
  image: `${SITE_ORIGIN}/media/shan-ahle-bait.webp`,
  type: 'article',
  breadcrumb: 'Ahl al-Bayt',
  changefreq: 'monthly',
  priority: 0.8,
};

export const SAHABA_IKRAM_SEO: PageSeo = {
  title: 'Companions of the Prophet ﷺ | Sahabah | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Sahabah — upright Companions of the Messenger of Allah ﷺ.',
  path: '/sahaba-ikram/',
  keywords: 'Companions of the Prophet, Sahabah, Ahl al-Sunnah, Khulafa ar-Rashidun',
  image: `${SITE_ORIGIN}/media/sahaba-ikram.webp`,
  type: 'article',
  breadcrumb: 'Companions',
  changefreq: 'monthly',
  priority: 0.8,
};

export const AULIA_KARAM_SEO: PageSeo = {
  title: 'Awliya Allah | Friends of Allah | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Awliya Allah — friends of Allah honoured through faith and taqwa.',
  path: '/aulia-karam/',
  keywords: 'Awliya Allah, friends of Allah, Yunus 10:62, Ahl al-Sunnah, Hanafi Barelvi',
  image: `${SITE_ORIGIN}/media/aulia-karam.webp`,
  type: 'article',
  breadcrumb: 'Awliya Allah',
  changefreq: 'monthly',
  priority: 0.8,
};

export const BASIC_BELIEFS_SEO: PageSeo = {
  title: 'Basic Beliefs | Hanafi Barelvi Ahl al-Sunnah FAQ | Nagina Social Welfare',
  description:
    'FAQ on the basic creed of Hanafi Barelvi Ahl al-Sunnah — Tawhid, Finality of Prophethood, Ahl al-Bayt, Companions and Awliya.',
  path: '/basic-beliefs/',
  keywords: 'Basic beliefs, aqidah, Hanafi Barelvi, Ahl al-Sunnah, iman, Tawhid',
  type: 'article',
  breadcrumb: 'Basic Beliefs',
  changefreq: 'monthly',
  priority: 0.8,
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

/**
 * Single source for static HTML shells and sitemap generation.
 * Include every public route that should get a crawlable shell.
 * Indexed pages (no robots noindex) are written to sitemap.xml at build time.
 */
export const PUBLIC_SEO_PAGES: readonly PageSeo[] = [
  HOME_SEO,
  ABOUT_SEO,
  WORK_SEO,
  PETERBOROUGH_SEO,
  MADRASA_SEO,
  APPLY_SEO,
  APPLY_SUCCESS_SEO,
  APPLY_TRACK_SEO,
  MEMBERSHIP_SEO,
  MEMBERSHIP_SUCCESS_SEO,
  MEMBERSHIP_TRACK_SEO,
  MEMBERSHIP_LOGIN_SEO,
  SPIRITUAL_GUIDE_SEO,
  KHATME_NABUWWAT_SEO,
  AHLE_BAIT_SEO,
  SAHABA_IKRAM_SEO,
  AULIA_KARAM_SEO,
  BASIC_BELIEFS_SEO,
  GUIDANCE_SEO,
  NAMAZ_SEO,
  ZAKAT_SEO,
  WHAT_IS_ZAKAT_SEO,
  ZAKAT_RULES_SEO,
  DUAS_SEO,
  CALENDAR_SEO,
  RAMADAN_SEO,
  IMPACT_SEO,
  QURAN_SEO,
  HADITH_SEO,
  SEEDHA_RASTAH_SEO,
  BOOKS_SEO,
  SERMONS_SEO,
  APPS_SEO,
  EVENTS_SEO,
  DONATE_SEO,
  ASSISTANT_SEO,
  DONATE_THANKS_SEO,
  CONTACT_SEO,
  PRIVACY_SEO,
  SAFEGUARDING_SEO,
];
