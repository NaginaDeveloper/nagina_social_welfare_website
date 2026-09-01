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

/** Published evening classes at Markaz Deen-e-Islam. */
export const MADRASA_SESSIONS: readonly MadrasaSession[] = [
  {
    id: 'class1',
    title: 'Class 1',
    titleUr: 'کلاس ۱',
    days: 'Daily',
    daysUr: 'روزانہ',
    time: '16:30–17:30',
    timeUr: '۴:۳۰–۵:۳۰',
    ages: 'Full',
    agesUr: 'بھری ہوئی',
  },
  {
    id: 'class2',
    title: 'Class 2',
    titleUr: 'کلاس ۲',
    days: 'Daily',
    daysUr: 'روزانہ',
    time: '17:30–18:30',
    timeUr: '۵:۳۰–۶:۳۰',
    ages: 'Full',
    agesUr: 'بھری ہوئی',
  },
  {
    id: 'class3',
    title: 'Class 3',
    titleUr: 'کلاس ۳',
    days: 'Daily',
    daysUr: 'روزانہ',
    time: '18:30–19:30',
    timeUr: '۶:۳۰–۷:۳۰',
    ages: '10 years and above — places available',
    agesUr: '۱۰ سال اور اس سے اوپر — جگہ دستیاب',
  },
];
