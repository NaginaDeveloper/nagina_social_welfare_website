import type { UiIconName } from '../components/ui/icon';

/**
 * The legacy and unity text shared by the Peterborough and Manchester pages.
 * Source text supplied by the office on 12 Oct 2026 (Our Islamic Inspiration,
 * A Legacy of Education and Community Service, Our Commitment). The "one chain"
 * framing and the per-centre openings are drafted from it, for the office to check.
 */
export interface ChainNode {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly logo: string;
  readonly path?: string;
}

export interface CentreLegacyCopy {
  /** Opening paragraph of the inspiration panel, specific to the centre. */
  readonly inspirationOpening: string;
  /** Eyebrow and title of the unity block. */
  readonly chainEyebrow: string;
  readonly chainTitle: string;
  readonly chainText: readonly string[];
  /** The centre's own name inside the closing du'a. */
  readonly centreName: string;
}

export const SHAYKH_NAME = 'Shaykh Munir Ahmed Yusufi رحمہ اللہ';

export const INSPIRATION = {
  eyebrow: 'Our Islamic Inspiration',
  title: 'Inspired by a Legacy of Knowledge, Character and Service',
  paragraphs: [
    'The foundation of our work is inspired by a simple but profound principle: true Islamic education is not only about gaining knowledge; it is about transforming hearts, building character and serving humanity.',
    `${SHAYKH_NAME} dedicated his life to the teaching and propagation of Islam. Through his knowledge, humility, character and commitment to serving the Ummah, his teachings touched the hearts and lives of countless people.`,
    'His legacy continues through the institutions and charitable work established upon his vision.',
  ],
  links: [
    { path: '/spiritual-guide', label: 'Our spiritual guide' },
    { path: '/sermons', label: 'Sermons' },
    { path: '/seedha-rastah', label: 'Seedha Rastah' },
  ],
  portrait: '/gallery/munir/01-portrait.jpg',
} as const;

export const CHAIN_NODES: readonly ChainNode[] = [
  {
    id: 'pakistan',
    name: 'Nagina Social Welfare, Pakistan',
    role: `Founded by ${SHAYKH_NAME}`,
    logo: '/brand/nagina-256.webp',
  },
  {
    id: 'peterborough',
    name: 'Markaz Deen-e-Islam',
    role: 'Peterborough · Head office, Nagina Social Welfare UK',
    logo: '/brand/markaz-256.webp',
    path: '/peterborough',
  },
  {
    id: 'manchester',
    name: 'Quran Academy',
    role: 'Partington, Manchester · Second institution in the UK',
    logo: '/brand/quran-academy-256.webp',
    path: '/manchester',
  },
];

export const LEGACY = {
  eyebrow: 'A Legacy of Education and Community Service',
  title: 'Service to Humanity, Built on Knowledge',
  intro: `${SHAYKH_NAME} was the founder of Nagina Social Welfare, Pakistan, an organisation established with a commitment to Islamic education, community welfare and service to humanity.`,
  cards: [
    {
      icon: 'mosque' as UiIconName,
      title: 'Places of worship and learning',
      text: 'Through this legacy, many mosques and educational institutions have been established and supported, providing places of worship and learning for communities across Pakistan.',
    },
    {
      icon: 'quran' as UiIconName,
      title: 'Qur’an, Fiqh and Islamic teachings',
      text: 'Thousands of children have had the opportunity to learn the Holy Qur’an, Fiqh and Islamic teachings.',
    },
    {
      icon: 'learn' as UiIconName,
      title: 'Recognised academic pathways',
      text: 'Educational institutions connected with this work have sought to provide structured Islamic education and recognised academic pathways.',
    },
  ],
  closing:
    'This remarkable legacy reminds us that the most valuable investment we can make is in people — their faith, their knowledge, their character and their future.',
} as const;

export const PURPOSE = [
  'Our purpose is not simply to teach children to read the Holy Qur’an. We aspire to nurture a generation that understands the Holy Qur’an, lives by its teachings and reflects its values through beautiful character and conduct.',
  'We believe that when knowledge enters the heart and is reflected in character, it becomes a source of benefit for the individual, the family and the wider community.',
] as const;

export const AYAH = {
  arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
  translation: '“And say: My Lord, increase me in knowledge.”',
  source: 'Surah Ta-Ha, 20:114',
} as const;

export const COMMITMENT = {
  title: 'Our Commitment',
  lines: ['To educate with wisdom.', 'To inspire with faith.', 'To nurture with compassion.', 'To serve with sincerity.'],
  closing: 'And to build a generation connected to Allah ﷻ and the Messenger of Allah ﷺ.',
} as const;

export function duaText(centreName: string): readonly string[] {
  return [
    `We pray that ${centreName} becomes a sadaqah jariyah — a continuous source of benefit — by nurturing generations who carry the Holy Qur’an in their hearts, embody the Sunnah in their character and dedicate themselves to serving humanity.`,
    'Our inspiration comes from the Holy Qur’an, the Sunnah and the legacy of scholars who dedicated their lives to spreading knowledge and serving the Ummah.',
    'May Allah ﷻ accept this humble effort, bless our teachers and students, preserve the legacy of our scholars, and allow future generations to carry the light of Qur’an and Sunnah forward. Ameen.',
  ];
}

export const CENTRE_LEGACY: Readonly<Record<string, CentreLegacyCopy>> = {
  manchester: {
    centreName: 'Quran Academy Partington',
    inspirationOpening: `Quran Academy Partington is proud to be the second institution in the United Kingdom inspired by the teachings, vision and legacy of the great Islamic scholar, ${SHAYKH_NAME}.`,
    chainEyebrow: 'One Chain, One Family',
    chainTitle: 'A Link in the Chain of Nagina Social Welfare',
    chainText: [
      'Quran Academy does not stand alone. It is a link in the chain of Nagina Social Welfare, joined to our head office, Markaz Deen-e-Islam in Peterborough, and through it to the legacy that began in Pakistan.',
      'We say it plainly and with gratitude: this academy is nothing without the head office’s support and guidance. Its standards, its direction and its ability to serve all flow from that connection.',
      'We believe in unity. A chain is only as strong as its links are joined, and together, under one vision, we are far stronger than any one of us alone.',
    ],
  },
  peterborough: {
    centreName: 'Markaz Deen-e-Islam',
    inspirationOpening: `Markaz Deen-e-Islam is the home of this legacy in the United Kingdom, and Quran Academy Partington in Manchester is the second institution here inspired by the teachings, vision and legacy of the great Islamic scholar, ${SHAYKH_NAME}.`,
    chainEyebrow: 'One Chain, One Family',
    chainTitle: 'Where the Chain Is Held Together',
    chainText: [
      'Markaz Deen-e-Islam is the head office of Nagina Social Welfare UK. From here we guide, support and stand behind every centre in the chain, including Quran Academy Partington in Manchester.',
      'We believe in unity. A centre grows strongest when it is joined to the rest, and a head office is only as strong as the centres it serves. Neither stands alone.',
      'One family, one vision, one mission: knowledge, character and service.',
    ],
  },
};

export function centreLegacy(campusId: string): CentreLegacyCopy | null {
  return CENTRE_LEGACY[campusId] ?? null;
}
