import type { UiIconName } from '../components/ui/icon';

/**
 * Peterborough's own page body: photos, the rhythm of the week and year,
 * the spiritual guide and the head office. Read by the assistant ingest too.
 * Drafted 8 Oct 2026 only from facts already published on this site (gallery
 * captions, timetable, spiritual guide and charity pages); for the office to
 * check and replace with its own words.
 */
export interface MarkazAbout {
  readonly name: string;
  readonly lead: string;
  readonly intro: readonly string[];
  readonly facts: readonly { readonly label: string; readonly value: string }[];
  readonly photos: readonly { readonly src: string; readonly alt: string; readonly caption: string }[];
  readonly rhythmLead: string;
  readonly rhythm: readonly {
    readonly when: string;
    readonly title: string;
    readonly text: string;
    readonly icon: UiIconName;
    readonly link?: { readonly path: string; readonly label: string };
  }[];
  readonly guide: {
    readonly name: string;
    readonly text: readonly string[];
    readonly image: string;
    readonly links: readonly { readonly path: string; readonly label: string }[];
  };
  readonly headOffice: {
    readonly text: string;
    readonly links: readonly { readonly path: string; readonly label: string; readonly icon: UiIconName }[];
  };
}

export const MARKAZ_ABOUT: Readonly<Record<string, MarkazAbout>> = {
  peterborough: {
    name: 'Markaz Deen-e-Islam',
    lead: 'The head office of Nagina Social Welfare UK and home of our Peterborough Madrasa, on Burmer Road.',
    intro: [
      'Markaz Deen-e-Islam on Burmer Road is the head office of Nagina Social Welfare UK. It is home to our Peterborough Madrasa, to regular gatherings of remembrance and learning, and to the day-to-day work of the charity.',
      'Our work here is rooted in Ahl al-Sunnah wa’l-Jama‘ah belief, love of the Prophet Muhammad ﷺ and sincere worship, and is guided by the teaching of Munir-e-Islam رحمۃ اللہ علیہ: sweet manner, patience, knowledge and charity.',
      'Children come each evening for Qur’an and Islamic studies. Sisters, brothers and families come for courses, gatherings and support.',
    ],
    facts: [
      { label: 'Head office', value: 'Nagina Social Welfare UK, registered charity 1196514' },
      { label: 'Madrasa', value: 'Three evening classes, split by age' },
      { label: 'Where', value: '103 Burmer Road, Peterborough PE1 3HT' },
    ],
    photos: [
      {
        src: '/media/ahle-bait-students.jpg',
        alt: 'Students of Markaz Deen-e-Islam holding certificates with their teachers',
        caption: 'Students with their certificates',
      },
      {
        src: '/media/ahle-bait-gathering.jpg',
        alt: 'Teachers and well-wishers gathered together at Markaz Deen-e-Islam',
        caption: 'Teachers and well-wishers',
      },
    ],
    rhythmLead: 'Something happens at Markaz every day. These are the regular parts of our week and year.',
    rhythm: [
      {
        when: 'Every evening',
        title: 'Madrasa classes',
        text: 'Three classes between 4:30 and 7:30 PM: two for children under 10 and one for ages 10 and above.',
        icon: 'learn',
        link: { path: '/safe-drop-off', label: 'Safe drop-off for parents' },
      },
      {
        when: 'Every week',
        title: 'Let’s Learn Salah',
        text: 'A weekly course to learn and improve Salah (Islah-e-Salah), for beginners and for anyone who wants to pray better.',
        icon: 'worship',
      },
      {
        when: 'Every month',
        title: 'Sisters’ gathering',
        text: 'A monthly “Let’s Learn Islam” gathering for sisters.',
        icon: 'family',
      },
      {
        when: 'Through the year',
        title: 'Zikr & Fikr',
        text: 'Evenings of remembrance and reflection.',
        icon: 'sparkle',
      },
      {
        when: 'Every year',
        title: 'Grand Annual Mehfil-e-Naat',
        text: 'Our yearly gathering in praise of the Prophet Muhammad ﷺ.',
        icon: 'events',
      },
      {
        when: 'Before Hajj',
        title: 'Hajj training',
        text: 'A seminar to help pilgrims prepare for Hajj.',
        icon: 'mosque',
      },
    ],
    guide: {
      name: 'Munir-e-Islam, Allama Munir Ahmed Yusufi رحمۃ اللہ علیہ',
      text: [
        'A beloved scholar and Sufi guide whose teaching of sweet manner, patience, knowledge and charity continues to light the work of Markaz Deen-e-Islam.',
        'His sermons and books, preserved from the Seedha Rastah archive, are free to watch and read on this website.',
      ],
      image: '/gallery/munir/01-portrait.jpg',
      links: [
        { path: '/spiritual-guide', label: 'Our spiritual guide' },
        { path: '/sermons', label: 'Sermons' },
        { path: '/seedha-rastah', label: 'Seedha Rastah' },
      ],
    },
    headOffice: {
      text: 'Markaz Deen-e-Islam is the registered head office of Nagina Social Welfare UK (charity 1196514), which runs Madrasas in Peterborough and Manchester. Giving, community membership and requests for help can all start here.',
      links: [
        { path: '/donate', label: 'Donate', icon: 'donate' },
        { path: '/membership', label: 'Become a member', icon: 'about' },
        { path: '/work', label: 'Our work', icon: 'work' },
        { path: '/events', label: 'Events', icon: 'events' },
      ],
    },
  },
};

export function markazAbout(campusId: string): MarkazAbout | null {
  return MARKAZ_ABOUT[campusId] ?? null;
}
