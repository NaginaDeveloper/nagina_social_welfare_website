import type { UiIconName } from '../components/ui/icon';

/** A centre's own story, shown on its page and read by the assistant ingest. */
export interface CentreAbout {
  readonly name: string;
  readonly established: string;
  readonly venue: string;
  /** One line under the page title. */
  readonly lead: string;
  readonly about: readonly string[];
  readonly activitiesLead: string;
  readonly activities: readonly { readonly icon: UiIconName; readonly label: string }[];
  readonly activitiesClosing: string;
  readonly nextGeneration: readonly string[];
  /** Pull quote at the end of "Nurturing the Next Generation". */
  readonly nextGenerationHighlight: string;
  readonly aimLead: string;
  readonly aims: readonly string[];
  readonly aimClosing: string;
  readonly vision: readonly string[];
  readonly verse: { readonly text: string; readonly reference: string };
  readonly visionClosing: string;
  readonly message: string;
  readonly messageText: string;
}

/** Text supplied by Quran Academy, 8 Oct 2026. English only for now. */
export const CENTRE_ABOUT: Readonly<Record<string, CentreAbout>> = {
  manchester: {
    name: 'Quran Academy Partington',
    established: 'March 2023',
    venue: 'Partington Community Centre, Manchester',
    lead: 'Serving the Muslim community of Partington since March 2023 through Islamic education, spiritual development and community support.',
    about: [
      'Quran Academy Partington was established in March 2023 at the Community Centre in Partington, Manchester, with a heartfelt mission to serve the local Muslim community through Islamic education, spiritual development, and community support.',
      'Our aim is to create a welcoming place where Muslims of all ages can learn about Islam, strengthen their faith, worship Allah, and grow together as a community.',
      'From the beginning, Quran Academy has worked to provide opportunities for children, young people, families, and adults to connect with the Qur’an and Islamic teachings. Through regular classes and community activities, we seek to nurture a love for Allah, His Messenger Muhammad ﷺ, and the beautiful values taught by Islam.',
      'We are proud to support our community not only through education but also by bringing people together during important occasions and times of need.',
    ],
    activitiesLead:
      'Quran Academy Partington facilitates and supports a range of religious and community activities, including:',
    activities: [
      { icon: 'quran', label: 'Qur’an and Islamic studies' },
      { icon: 'mosque', label: 'Jumu’ah (Friday) prayer' },
      { icon: 'events', label: 'Ramadan Iftar gatherings' },
      { icon: 'worship', label: 'Taraweeh prayers during Ramadan' },
      { icon: 'family', label: 'Food support for families in need' },
      { icon: 'learn', label: 'Islamic activities and learning for children and young people' },
      { icon: 'companions', label: 'Community gatherings that encourage brotherhood and sisterhood' },
    ],
    activitiesClosing:
      'Through these activities, we hope to create a stronger, more connected and caring Muslim community in Partington and the surrounding areas.',
    nextGeneration: [
      'One of our key priorities is helping children and young people develop a strong connection with their faith.',
      'Many students have completed their Qur’an studies through Quran Academy, while others are continuing their journey towards memorising the Qur’an (Hifz).',
      'We also encourage our young students to develop confidence in speaking about Islamic values and sharing what they have learned. Our goal is not simply to teach children information, but to help them become confident, respectful and knowledgeable young Muslims who can contribute positively to their families and communities.',
    ],
    nextGenerationHighlight:
      'We believe that every child has the potential to become a little scholar — someone who loves learning, lives by Islamic values, and inspires others through good character and example.',
    aimLead:
      'Our greatest aim is to bring people closer to their Creator, Allah ﷻ, and strengthen their love for the Prophet Muhammad ﷺ. We strive to create a place where Muslims can:',
    aims: [
      'Come together to worship Allah ﷻ',
      'Learn the Qur’an and Islamic teachings',
      'Develop a stronger understanding of their Deen',
      'Build good character and Islamic values',
      'Strengthen their relationship with Allah',
      'Develop love for the Prophet Muhammad ﷺ',
      'Support one another as a community',
      'Raise children who are confident and proud of their Islamic identity',
      'Help those in need with compassion and dignity',
    ],
    aimClosing:
      'We believe that a strong community begins with strong faith, good character, knowledge and care for one another.',
    vision: [
      'Our vision is to establish Quran Academy Partington as a welcoming centre of Islamic learning, worship and community development.',
      'We want to create a place where every Muslim feels welcome — a place where people can come to pray, learn, ask questions, build friendships and strengthen their connection with Islam.',
      'We hope to inspire future generations to carry the teachings of the Qur’an in their hearts and reflect them through their words, actions and character.',
    ],
    verse: {
      text: 'And whoever holds firmly to Allah has certainly been guided to a straight path.',
      reference: 'Qur’an 3:101',
    },
    visionClosing:
      'At Quran Academy Partington, we believe that serving the community is an honour and a responsibility. With the help of Allah ﷻ, we aim to continue building a community rooted in Qur’an, Sunnah, knowledge, compassion and unity.',
    message: 'Learn. Worship. Grow. Serve.',
    messageText:
      'Together, let us build a community that is closer to Allah ﷻ, follows the example of the Prophet Muhammad ﷺ, and inspires future generations to live by the beautiful teachings of Islam.',
  },
};

export function centreAbout(campusId: string): CentreAbout | null {
  return CENTRE_ABOUT[campusId] ?? null;
}

/**
 * Peterborough's page, laid out differently from Manchester's: photos, the
 * rhythm of the week and year, the spiritual guide and the head office.
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
  readonly pillars: readonly { readonly title: string; readonly text: string }[];
}

export const MARKAZ_ABOUT: Readonly<Record<string, MarkazAbout>> = {
  peterborough: {
    name: 'Markaz Deen-e-Islam',
    lead: 'The head office of Nagina Social Welfare UK and home of our Peterborough Madrasa, on Burmer Road.',
    intro: [
      'Markaz Deen-e-Islam on Burmer Road is the head office of Nagina Social Welfare UK. It is home to our Peterborough Madrasa, to regular gatherings of remembrance and learning, and to the day-to-day work of the charity.',
      'Our work here is rooted in Ahl al-Sunnah wa’l-Jama‘ah belief, love of the Prophet Muhammad ﷺ and sincere worship, and is guided by the teaching of Munir-e-Islam: sweet manner, patience, knowledge and charity.',
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
      name: 'Munir-e-Islam, Allama Munir Ahmed Yusufi',
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
    pillars: [
      { title: 'Faith', text: 'Rooted in Ahl al-Sunnah belief, love of the Prophet ﷺ, and sincere worship.' },
      { title: 'Compassion', text: 'Welfare that uplifts families with dignity, care and practical help.' },
      { title: 'Knowledge', text: 'Education that lights minds: Qur’an, Salah and lasting character.' },
    ],
  },
};

export function markazAbout(campusId: string): MarkazAbout | null {
  return MARKAZ_ABOUT[campusId] ?? null;
}
