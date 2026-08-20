export interface MadrasaSession {
  readonly id: string;
  readonly title: string;
  readonly titleUr: string;
  readonly days: string;
  readonly daysUr: string;
  readonly time: string;
  readonly timeUr: string;
  readonly ages: string;
  readonly agesUr: string;
}

/** High-level class windows — confirm current times on WhatsApp before publishing exact hours. */
export const MADRASA_SESSIONS: readonly MadrasaSession[] = [
  {
    id: 'weekday-quran',
    title: 'Quran classes',
    titleUr: 'قرآن کی کلاسیں',
    days: 'Weekday evenings',
    daysUr: 'ہفتہ کے دن شام',
    time: 'Ask for current times',
    timeUr: 'موجودہ اوقات پوچھیں',
    ages: 'Children',
    agesUr: 'بچے',
  },
  {
    id: 'weekend',
    title: 'Weekend Islamic school',
    titleUr: 'اختتامِ ہفتہ اسلامی اسکول',
    days: 'Weekends',
    daysUr: 'ہفتہ اور اتوار',
    time: 'Ask for current times',
    timeUr: 'موجودہ اوقات پوچھیں',
    ages: 'Children',
    agesUr: 'بچے',
  },
  {
    id: 'islamic-studies',
    title: 'Islamic studies & character',
    titleUr: 'اسلامی تعلیم اور کردار',
    days: 'Alongside Quran classes',
    daysUr: 'قرآن کی کلاسوں کے ساتھ',
    time: 'Ask for current times',
    timeUr: 'موجودہ اوقات پوچھیں',
    ages: 'Children',
    agesUr: 'بچے',
  },
];
