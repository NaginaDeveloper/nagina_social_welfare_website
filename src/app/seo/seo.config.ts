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
    'Nagina Social Welfare UK — a UK-based registered charity (1196514) uniting faith and compassion through Islamic education at Markaz Deen-e-Islam, community welfare, Salah prayer times, Quran Majeed with Kanzul Iman, and Islamic books in Peterborough.',
  path: '/',
  keywords:
    'Nagina Social Welfare, UK based charity, Markaz Deen-e-Islam, madrasa Peterborough, Islamic education UK, Peterborough Islamic institute, Ahl al-Sunnah, community welfare, charity 1196514',
  type: 'website',
};

export const ABOUT_SEO: PageSeo = {
  title: 'Our Vision | Nagina Social Welfare UK',
  description:
    'Nagina Social Welfare — Registered Charity United Kingdom 1196514. Our vision: to cultivate a united and flourishing society across the UK where knowledge inspires, compassion connects, and every individual grows in character and purpose.',
  path: '/about/',
  keywords: 'About Nagina Social Welfare, UK based charity 1196514, Islamic charity UK vision',
  type: 'website',
};

export const WORK_SEO: PageSeo = {
  title: 'Our Work | Education & Charity | Nagina Social Welfare',
  description:
    'One mission through education and charity — Islamic education at Markaz Deen-e-Islam and community welfare across the UK from registered charity Nagina Social Welfare.',
  path: '/work/',
  keywords: 'Our Work, Markaz Deen-e-Islam, community welfare UK, Islamic education, charity',
  type: 'website',
};

export const MADRASA_SEO: PageSeo = {
  title: 'Madrasa & Islamic Institute Peterborough | Markaz Deen-e-Islam',
  description:
    'Markaz Deen-e-Islam 2026 intake: evening classes at 103 Burmer Road, Peterborough. Class 1 and 2 for under 10s; Class 3 18:30–19:30 for ages 10+. Quran, Hadith, Islamic studies. Apply online.',
  path: '/madrasa/',
  keywords:
    'madrasa Peterborough, Islamic school Peterborough, Quran classes for children Peterborough, 2026 madrasa intake, evening madrasa 6:30pm, Markaz Deen-e-Islam',
  type: 'website',
};

export const APPLY_SEO: PageSeo = {
  title: 'Online Admission 2026 | Markaz Deen-e-Islam | Nagina Social Welfare',
  description:
    'Apply online for Markaz Deen-e-Islam 2026 intake. All three evening classes are open: Class 1 and 2 for under 10s, Class 3 (18:30–19:30 daily) for ages 10+.',
  path: '/apply/',
  keywords:
    'madrasa admission Peterborough 2026, Markaz Deen-e-Islam apply, online enrolment Islamic school Peterborough',
  type: 'website',
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
    'Honouring Allama Munir Ahmed Yusufi — Munir-e-Islam — with the Yusufi Shajra Sharif from Kashkool e Yousufi (Naqshbandi, Chishti and Qadri) and photographs from Nagina TV.',
  path: '/spiritual-guide/',
  keywords:
    'Spiritual Guide, Munir-e-Islam, Allama Munir Ahmed Yusufi, Pir-o-Murshid, Shajra Sharif, Naqshbandi Mujaddidi Yusufi, Chishti Sabri, Qadri Razawi, Kashkool e Yousufi',
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
  title: 'Prayer Times (Salah) Peterborough | Nagina Social Welfare UK',
  description:
    'Daily Salah (prayer) times for Peterborough, UK with live now and next prayer windows and a Qibla compass. These are personal begin and end times, not congregational prayer times.',
  path: '/namaz/',
  keywords: 'Salah times Peterborough, prayer times UK, salah timetable, Qibla compass',
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

export const HADITH_SEO: PageSeo = {
  title: 'Kutub al-Sittah | Six Authentic Books of Hadith | Nagina Social Welfare',
  description:
    'Browse the six authentic books of Hadith — Sahih al-Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Nasa\'i, and Ibn Majah — in Arabic with Urdu and English translations.',
  path: '/hadith/',
  keywords:
    'Kutub al-Sittah, Sahih Bukhari, Sahih Muslim, Hadith Urdu, six authentic books, Sunan Abu Dawud, Tirmidhi, Nasa\'i, Ibn Majah',
  type: 'website',
};

export const SEEDHA_RASTAH_SEO: PageSeo = {
  title: 'Seedha Rastah | Educational Archive of Munir-e-Islam | Nagina Social Welfare',
  description:
    'Honouring Seedha Rastah (seedharastah.com) — the educational archive of Allama Munir Ahmed Yusufi (Munir-e-Islam). Explore preserved PDF books, sermons, and links to the original website.',
  path: '/seedha-rastah/',
  keywords:
    'Seedha Rastah, seedharastah.com, Munir-e-Islam, Allama Munir Ahmed Yusufi, Islamic books archive, sermons, Nagina TV',
  type: 'website',
};

export const BOOKS_SEO: PageSeo = {
  title: 'Islamic Books Library | Seedha Rastah | Nagina Social Welfare',
  description:
    'Browse and download Islamic books from the Seedha Rastah library — free PDFs for learning and guidance from Nagina Social Welfare UK.',
  path: '/books/',
  keywords: 'Islamic books PDF, Seedha Rastah, free Islamic library UK, Urdu Islamic books',
  type: 'website',
};

export const SERMONS_SEO: PageSeo = {
  title: 'Sermons by Baba Ji Sarkar | Nagina Social Welfare',
  description:
    'Watch blessed sermons by Baba Ji Sarkar from the Seedha Rastah collection — searchable video library via Nagina TV on YouTube.',
  path: '/sermons/',
  keywords:
    'Baba Ji Sarkar sermons, Seedha Rastah sermons, Nagina TV, Islamic lectures UK, Ahl al-Sunnah',
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
    'Event photos, posters and programmes from Markaz Deen-e-Islam — including the Grand Annual Naat gathering (Mehfil-e-Naat). Message us on WhatsApp for the next date.',
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
    'Contact Nagina Social Welfare UK in Peterborough — apply online for madrasa admission, or reach us on WhatsApp, phone or email for donations and general enquiries.',
  path: '/contact/',
  keywords: 'Contact Nagina Social Welfare, Peterborough Islamic centre contact, madrasa admission',
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
  title: 'Finality of Prophethood | Nagina Social Welfare',
  description:
    'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — the Seal of the Prophets — a cornerstone of Islamic faith for Ahl al-Sunnah.',
  path: '/khatme-nabuwwat/',
  keywords:
    'Finality of Prophethood, Khatam-un-Nabiyyin, Seal of the Prophets, Quran 33:40, Ahl al-Sunnah',
  image: `${SITE_ORIGIN}/media/khatme-nabuwwat.jpg`,
  type: 'article',
};

export const AHLE_BAIT_SEO: PageSeo = {
  title: 'Ahl al-Bayt | The Prophet’s Family | Nagina Social Welfare',
  description:
    'The elevated status of Ahl al-Bayt — the Blessed Household of the Prophet Muhammad ﷺ — in the light of the Quran and Sunnah, from a Sunni perspective.',
  path: '/ahle-bait/',
  keywords:
    'Ahl al-Bayt, Prophet’s family, Aal-e-Pak, Ayat al-Tathir, Hadith al-Thaqalayn, Ahl al-Kisa, Ahl al-Sunnah',
  image: `${SITE_ORIGIN}/media/shan-ahle-bait.jpg`,
  type: 'article',
};

export const SAHABA_IKRAM_SEO: PageSeo = {
  title: 'Companions of the Prophet ﷺ | Sahabah | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Sahabah — upright Companions of the Messenger of Allah ﷺ (peace be upon him), loved and respected as an integral part of Islamic faith.',
  path: '/sahaba-ikram/',
  keywords:
    'Companions of the Prophet, Sahabah, Ahl al-Sunnah, Khulafa ar-Rashidun',
  image: `${SITE_ORIGIN}/media/sahaba-ikram.jpg`,
  type: 'article',
};

export const AULIA_KARAM_SEO: PageSeo = {
  title: 'Awliya Allah | Friends of Allah | Nagina Social Welfare',
  description:
    'The belief of Ahl al-Sunnah wal-Jama’ah regarding the Awliya Allah — friends of Allah honoured through faith and God-consciousness (taqwa), with Surah Yunus 10:62 and authentic Hadith.',
  path: '/aulia-karam/',
  keywords:
    'Awliya Allah, friends of Allah, Yunus 10:62, Ala inna awliya Allah, Ahl al-Sunnah, Hanafi Barelvi',
  image: `${SITE_ORIGIN}/media/aulia-karam.jpg`,
  type: 'article',
};

export const BASIC_BELIEFS_SEO: PageSeo = {
  title: 'Basic Beliefs | Hanafi Barelvi Ahl al-Sunnah FAQ | Nagina Social Welfare',
  description:
    'Frequently asked questions on the basic creed (aqidah) of Hanafi Barelvi Ahl al-Sunnah wa’l-Jama’ah — Tawhid, Finality of Prophethood, love for the Prophet ﷺ, Ahl al-Bayt, Companions, and Awliya.',
  path: '/basic-beliefs/',
  keywords:
    'Basic beliefs, aqidah, Hanafi Barelvi, Ahl al-Sunnah, iman, Finality of Prophethood, Tawhid, Sunni creed FAQ',
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
