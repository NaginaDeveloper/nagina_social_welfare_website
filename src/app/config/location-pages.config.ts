import { ORGANIZATION } from './organization.config';

/**
 * The /locations/<town>/ donation pages. Text supplied by the office in the
 * Peterborough and Manchester SEO documents (ticket NTM-0352); H1 and H2 headings
 * are kept exactly as written.
 */
export interface LocationPage {
  readonly id: 'peterborough' | 'manchester';
  readonly town: string;
  readonly path: string;
  /** The centre's own page, linked from the donation page. */
  readonly centrePath: string;
  readonly kicker: string;
  readonly h1: string;
  readonly subtitle: string;
  readonly intro: readonly string[];
  readonly centreHeading: string;
  readonly centreLead: string;
  readonly centreName: string;
  readonly addressLines: readonly string[];
  readonly centreText?: string;
  readonly goesHeading: string;
  readonly goesLead: string;
  readonly goesItems: readonly { readonly label: string; readonly text: string }[];
  readonly goesClosing: string;
  readonly onlineHeading: string;
  readonly onlineLead: string;
  readonly methods: readonly string[];
  readonly categoriesHeading: string;
  readonly categoriesLead: string;
  readonly categories: readonly { readonly label: string; readonly text: string }[];
  readonly categoriesClosing: string;
  readonly whyHeading: string;
  readonly whyText: readonly string[];
  readonly tagline: string;
  readonly contactHeading: string;
  /** Phone is only shown where the office supplied one for the centre. */
  readonly phone: boolean;
}

const GOES_ITEMS = [
  { label: 'Islamic education', text: 'Quran classes, Islamic studies and madrasa programmes for the local community.' },
  { label: 'Food and langar', text: 'Community meals and food support for those who need it.' },
  { label: 'Poverty relief', text: 'Help for individuals and families facing financial hardship.' },
  { label: 'Community welfare', text: 'Charity collections, donation drives and community support.' },
  { label: 'Educational activities', text: 'Learning opportunities and a positive environment for students.' },
] as const;

const METHODS = ['Debit or credit card', 'PayPal', 'NatWest PayIt', 'Direct Bank Transfer'] as const;

const CATEGORIES = [
  { label: 'Zakat', text: 'the annual obligatory charity for eligible Muslims.' },
  { label: 'Sadaqah', text: 'voluntary giving that you can make at any time.' },
  { label: 'Lillah', text: 'a donation given for the sake of Allah to support charity work.' },
  { label: 'Fitrana', text: 'charity given at the end of Ramadan, also known as Zakat al-Fitr.' },
] as const;

export const LOCATION_PAGES: Readonly<Record<string, LocationPage>> = {
  peterborough: {
    id: 'peterborough',
    town: 'Peterborough',
    path: '/locations/peterborough',
    centrePath: '/peterborough',
    kicker: 'Nagina Social Welfare UK',
    h1: 'Donate to an Islamic Charity in Peterborough',
    subtitle: 'Support Islamic Education, Zakat, Sadaqah and Community Welfare',
    intro: [
      `At Nagina Social Welfare UK, we believe every act of kindness can make a real difference. As a registered UK charity (Charity No. ${ORGANIZATION.charityNumber}), our mission is to promote Islamic education, strengthen our community and relieve poverty. Your donation helps people in Peterborough and beyond.`,
      'Through our work in Peterborough, we create opportunities for learning, compassion and community support. Whether you are searching for an Islamic charity in Peterborough, Quran classes, or a simple way to give Zakat or Sadaqah, your donation helps us continue this important work.',
    ],
    centreHeading: 'Our Peterborough Centre: Markaz Deen-e-Islam',
    centreLead: 'Our Peterborough centre, Markaz Deen-e-Islam, is based at:',
    centreName: 'Markaz Deen-e-Islam',
    addressLines: [ORGANIZATION.streetAddress, `${ORGANIZATION.addressLocality} ${ORGANIZATION.postalCode}`, ORGANIZATION.addressCountryName],
    centreText:
      'Markaz Deen-e-Islam is a welcoming local base for Islamic education and community activities in Peterborough, helping people connect with the Quran and Islamic teachings.',
    goesHeading: 'Where Does Your Donation Go?',
    goesLead: 'Your generosity supports the work of Nagina Social Welfare UK, including:',
    goesItems: GOES_ITEMS,
    goesClosing: 'Every donation helps us continue our charity work and serve the community in Peterborough and beyond.',
    onlineHeading: 'How Can You Donate Online?',
    onlineLead: 'You can donate to Nagina Social Welfare UK using any of the following payment methods:',
    methods: METHODS,
    categoriesHeading: 'Zakat, Sadaqah, Lillah and Fitrana Donations',
    categoriesLead: 'You can give through any of the following donation categories:',
    categories: CATEGORIES,
    categoriesClosing: 'Please select the appropriate donation category when you donate.',
    whyHeading: 'Why Your Support Matters',
    whyText: [
      'Whether you give a small amount or a larger gift, your generosity helps us continue our education and welfare work. Together, we can build a stronger, more compassionate community in Peterborough.',
    ],
    tagline: 'Donate today. Support education. Help those in need.',
    contactHeading: 'Contact Nagina Social Welfare UK in Peterborough',
    phone: true,
  },
  manchester: {
    id: 'manchester',
    town: 'Manchester',
    path: '/locations/manchester',
    centrePath: '/manchester',
    kicker: 'With Nagina Social Welfare UK',
    h1: 'Donate to an Islamic Charity in Manchester',
    subtitle: 'Support Islamic Education, Zakat, Sadaqah and Community Welfare',
    intro: [
      'At Nagina Social Welfare UK, we believe every act of kindness can make a real difference.',
      `As a registered UK charity (Charity No. ${ORGANIZATION.charityNumber}), our mission is to promote Islamic education, strengthen our community and relieve poverty.`,
      'Through our centres in Manchester and Peterborough, we create opportunities for learning, compassion and community support. Whether you are looking for an Islamic charity in Manchester, Quran classes or a simple way to give Zakat or Sadaqah, your donation helps us continue this important work.',
    ],
    centreHeading: 'Our Manchester Centre: Quran Academy in Partington',
    centreLead: 'Our Manchester Quran Academy is based at:',
    centreName: 'Quran Academy',
    addressLines: ['Partington Community Centre', 'Manchester, M31 4FL', 'United Kingdom'],
    centreText:
      'Our Manchester centre supports Islamic education and community activities, helping people connect with the Quran and Islamic teachings.',
    goesHeading: 'Where Does Your Donation Go?',
    goesLead: 'Your generosity supports the work of Nagina Social Welfare UK, including:',
    goesItems: GOES_ITEMS,
    goesClosing: 'Every donation helps us continue our charity work and serve the community in Manchester and beyond.',
    onlineHeading: 'How Can You Donate Online?',
    onlineLead: 'Donating to our work is simple. You can give using any of the following payment methods:',
    methods: METHODS,
    categoriesHeading: 'Zakat, Sadaqah, Lillah and Fitrana Donations',
    categoriesLead: 'You can give through any of the following donation categories:',
    categories: CATEGORIES,
    categoriesClosing: 'Please select the appropriate donation category when you donate.',
    whyHeading: 'Why Your Support Matters',
    whyText: [
      'Whether you give a small amount or a larger gift, your generosity helps us continue our education and welfare work.',
      'Together, we can build a stronger, more compassionate community in Manchester and beyond.',
    ],
    tagline: 'Donate today. Support education. Help those in need.',
    contactHeading: 'Contact Nagina Social Welfare UK in Manchester',
    phone: false,
  },
};

export function locationPage(id: string): LocationPage | null {
  return LOCATION_PAGES[id] ?? null;
}
