/** Summary of a surah from the AlQuran Cloud /surah list. */
export interface SurahSummary {
  readonly number: number;
  readonly name: string;
  readonly englishName: string;
  readonly englishNameTranslation: string;
  readonly numberOfAyahs: number;
  readonly revelationType: 'Meccan' | 'Medinan' | string;
}

/** One ayah with Arabic, translations, and optional audio. */
export interface QuranAyah {
  readonly number: number;
  readonly numberInSurah: number;
  readonly arabic: string;
  readonly urdu: string;
  readonly english: string;
  readonly audioUrl: string;
  readonly sajda: boolean;
}

/** Fully loaded surah ready for the reader UI. */
export interface SurahDetail {
  readonly number: number;
  readonly name: string;
  readonly englishName: string;
  readonly englishNameTranslation: string;
  readonly numberOfAyahs: number;
  readonly revelationType: string;
  readonly ayahs: readonly QuranAyah[];
}

/** AlQuran Cloud list envelope: GET /v1/surah */
export interface AlQuranSurahListResponse {
  readonly code: number;
  readonly status: string;
  readonly data: readonly AlQuranSurahMeta[];
}

export interface AlQuranSurahMeta {
  readonly number: number;
  readonly name: string;
  readonly englishName: string;
  readonly englishNameTranslation: string;
  readonly numberOfAyahs: number;
  readonly revelationType: string;
}

/** AlQuran Cloud editions envelope: GET /v1/surah/{n}/editions/... */
export interface AlQuranEditionsResponse {
  readonly code: number;
  readonly status: string;
  readonly data: readonly AlQuranEditionSurah[];
}

export interface AlQuranEditionSurah {
  readonly number: number;
  readonly name: string;
  readonly englishName: string;
  readonly englishNameTranslation: string;
  readonly revelationType: string;
  readonly numberOfAyahs: number;
  readonly ayahs: readonly AlQuranAyahRaw[];
  readonly edition?: {
    readonly identifier: string;
    readonly language: string;
    readonly name: string;
    readonly englishName: string;
    readonly format: string;
    readonly type: string;
  };
}

export interface AlQuranAyahRaw {
  readonly number: number;
  readonly text: string;
  readonly numberInSurah: number;
  readonly juz?: number;
  readonly manzil?: number;
  readonly page?: number;
  readonly ruku?: number;
  readonly hizbQuarter?: number;
  readonly sajda?: boolean | { readonly id: number; readonly recommended: boolean; readonly obligatory: boolean };
  readonly audio?: string;
  readonly audioSecondary?: readonly string[];
}
