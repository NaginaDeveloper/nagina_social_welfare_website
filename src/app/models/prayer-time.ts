/** Five daily salah names shown in the Namaz board. */
export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

/** A single prayer window with begin and end clock times (HH:mm). */
export interface PrayerSlot {
  readonly name: PrayerName;
  readonly begins: string;
  readonly ends: string;
}

/** Gregorian + Hijri labels for the loaded day. */
export interface PrayerDateInfo {
  readonly gregorian: string;
  readonly hijri: string;
  readonly weekday: string;
}

/** Normalised day payload used by the UI. */
export interface DayTimings {
  readonly date: PrayerDateInfo;
  readonly sunrise: string;
  readonly slots: readonly PrayerSlot[];
  /** Raw begins used for current/next computation. */
  readonly begins: Readonly<Record<PrayerName | 'Sunrise', string>>;
  /** Next day's Fajr (HH:mm) — ends Isha. */
  readonly nextFajr: string;
}

/** AlAdhan API envelope for /timings*. */
export interface AlAdhanTimingsResponse {
  readonly code: number;
  readonly status: string;
  readonly data: AlAdhanDayData;
}

export interface AlAdhanDayData {
  readonly timings: AlAdhanTimings;
  readonly date: AlAdhanDate;
  readonly meta: {
    readonly timezone: string;
  };
}

export interface AlAdhanTimings {
  readonly Fajr: string;
  readonly Sunrise: string;
  readonly Dhuhr: string;
  readonly Asr: string;
  readonly Maghrib: string;
  readonly Isha: string;
  readonly Sunset?: string;
  readonly Imsak?: string;
  readonly Midnight?: string;
}

export interface AlAdhanDate {
  readonly readable: string;
  readonly hijri: {
    readonly day: string;
    readonly month: { readonly en: string; readonly ar: string };
    readonly year: string;
    readonly weekday: { readonly en: string };
  };
  readonly gregorian: {
    readonly date: string;
    readonly day: string;
    readonly month: { readonly en: string; readonly number: number };
    readonly year: string;
    readonly weekday: { readonly en: string };
  };
}
