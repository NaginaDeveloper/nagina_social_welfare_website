import type { ClassSlot } from '../models/admission';

export interface MadrasaSession {
  readonly id: string;
  /** The class the admission form sends for this session. */
  readonly slot: ClassSlot;
  readonly title: string;
  readonly titleUr: string;
  readonly days: string;
  readonly daysUr: string;
  readonly time: string;
  readonly timeUr: string;
  readonly ages: string;
  readonly agesUr: string;
}

/**
 * Published class times, keyed by campus id. Peterborough (Markaz Deen-e-Islam)
 * runs three evening classes split by age; Manchester (Quran Academy) runs one
 * weekday class for all ages.
 */
export const MADRASA_TIMETABLES: Readonly<Record<string, readonly MadrasaSession[]>> = {
  peterborough: [
    {
      id: 'class1',
      slot: 'class1',
      title: 'Class 1',
      titleUr: 'کلاس ۱',
      days: 'Daily',
      daysUr: 'روزانہ',
      time: '16:30–17:30',
      timeUr: '۴:۳۰–۵:۳۰',
      ages: 'Under 10',
      agesUr: '۱۰ سال سے کم',
    },
    {
      id: 'class2',
      slot: 'class2',
      title: 'Class 2',
      titleUr: 'کلاس ۲',
      days: 'Daily',
      daysUr: 'روزانہ',
      time: '17:30–18:30',
      timeUr: '۵:۳۰–۶:۳۰',
      ages: 'Under 10',
      agesUr: '۱۰ سال سے کم',
    },
    {
      id: 'class3',
      slot: 'class3',
      title: 'Class 3',
      titleUr: 'کلاس ۳',
      days: 'Daily',
      daysUr: 'روزانہ',
      time: '18:30–19:30',
      timeUr: '۶:۳۰–۷:۳۰',
      ages: '10 years and above',
      agesUr: '۱۰ سال اور اس سے اوپر',
    },
  ],
  manchester: [
    {
      id: 'weekday',
      slot: 'weekday',
      title: 'Madrasa Class',
      titleUr: 'مدرسہ کلاس',
      days: 'Monday to Friday',
      daysUr: 'پیر تا جمعہ',
      time: '17:00–18:00',
      timeUr: 'شام ۵:۰۰–۶:۰۰',
      ages: 'All ages',
      agesUr: 'تمام عمریں',
    },
  ],
};

/** Class times for a centre; empty when none are published (the centre shares them by phone). */
export function madrasaSessions(campusId: string | null | undefined): readonly MadrasaSession[] {
  return MADRASA_TIMETABLES[String(campusId ?? '').trim().toLowerCase()] ?? [];
}
