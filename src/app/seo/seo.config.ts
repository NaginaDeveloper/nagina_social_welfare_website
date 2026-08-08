/** Canonical public site origin (GitHub Pages custom domain). */
export const SITE_ORIGIN = 'https://www.naginasocialwelfare.co.uk';

export const SITE_NAME = 'Nagina Social Welfare';

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/brand/nagina.png`;

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Path only, e.g. "/" or "/quran" */
  readonly path: string;
  readonly keywords?: string;
  readonly image?: string;
  readonly type?: 'website' | 'article';
}

export const HOME_SEO: PageSeo = {
  title: 'Nagina Social Welfare UK | Islamic Education & Community Welfare',
  description:
    'Nagina Social Welfare UK unites faith and compassion — Markaz Deen-e-Islam education, community welfare, Namaz times, Quran Majeed with Kanzul Iman, and Islamic books in Peterborough.',
  path: '/',
  keywords:
    'Nagina Social Welfare, Markaz Deen-e-Islam, Islamic education UK, Peterborough mosque welfare, Ahle Sunnat, community welfare',
  type: 'website',
};

export const NAMAZ_SEO: PageSeo = {
  title: 'Namaz Times Peterborough | Nagina Social Welfare UK',
  description:
    'Daily Namaz (salah) times for Peterborough, UK with live now and next prayer, plus a Qibla compass — from Nagina Social Welfare.',
  path: '/namaz',
  keywords: 'Namaz times Peterborough, prayer times UK, salah timetable, Qibla compass',
  type: 'website',
};

export const QURAN_SEO: PageSeo = {
  title: 'Blessed Quran Majeed with Kanzul Iman | Nagina Social Welfare',
  description:
    'Read the Blessed Quran Majeed in Arabic with Kanzul Iman Urdu translation by Aala Hazrat Imam Ahmed Raza Khan, English toggle, and Alafasy recitation.',
  path: '/quran',
  keywords:
    'Quran Majeed, Kanzul Iman, Holy Quran Urdu, Ahmed Raza Khan, Quran with translation, Alafasy',
  type: 'website',
};

export const BOOKS_SEO: PageSeo = {
  title: 'Islamic Books Library | Seedha Rasta | Nagina Social Welfare',
  description:
    'Browse and download Islamic books from the Seedha Rasta library — free PDFs for learning and guidance from Nagina Social Welfare UK.',
  path: '/books',
  keywords: 'Islamic books PDF, Seedha Rasta, free Islamic library UK, Urdu Islamic books',
  type: 'website',
};

export const SERMONS_SEO: PageSeo = {
  title: 'Sermons by Baba Ji Sarkar | Bayanat | Nagina Social Welfare',
  description:
    'Watch blessed bayanat and sermons by Baba Ji Sarkar from the Seedha Rasta collection — searchable video library via Nagina TV on YouTube.',
  path: '/sermons',
  keywords:
    'Baba Ji Sarkar bayanat, Seedha Rasta sermons, Nagina TV, Islamic lectures UK, Ahle Sunnat bayan',
  type: 'website',
};

export const KHATME_NABUWWAT_SEO: PageSeo = {
  title: 'Khatme Nabuwwat | Finality of Prophethood | Nagina Social Welfare',
  description:
    'Belief in the absolute finality of the Prophethood of Muhammad ﷺ — Khatam-un-Nabiyyin — the cornerstone of Islamic faith, with Quran and Hadith on the Seal of the Prophets.',
  path: '/khatme-nabuwwat',
  keywords:
    'Khatme Nabuwwat, Khatam-un-Nabiyyin, Finality of Prophethood, Seal of the Prophets, Quran 33:40, Ahle Sunnat',
  image: `${SITE_ORIGIN}/media/khatme-nabuwwat.jpg`,
  type: 'article',
};

export const DONATE_THANKS_SEO: PageSeo = {
  title: 'Thank You for Your Donation | Nagina Social Welfare UK',
  description:
    'Thank you for supporting Nagina Social Welfare UK — your gift helps Islamic education and community welfare.',
  path: '/donate/thanks',
  keywords: 'donate Nagina Social Welfare, thank you donation UK',
  type: 'website',
};
