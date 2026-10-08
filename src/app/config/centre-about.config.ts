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
