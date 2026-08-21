/** One of the six authentic books (Kutub al-Sittah). */
export type HadithBookSlug =
  | 'bukhari'
  | 'muslim'
  | 'abudawud'
  | 'tirmidhi'
  | 'nasai'
  | 'ibnmajah';

/** Chapter (kitab / section) within a collection. */
export interface HadithChapterSummary {
  readonly number: number;
  readonly englishName: string;
  readonly urduName: string;
  readonly arabicName: string;
  readonly hadithCount?: number;
}

/** Static catalog entry for one collection. */
export interface HadithBookCatalog {
  readonly slug: HadithBookSlug | string;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly nameUr: string;
  readonly chapters: readonly HadithChapterSummary[];
}

/** One hadith with Arabic, Urdu, and English text. */
export interface HadithEntry {
  readonly hadithNumber: number;
  readonly arabicNumber: number | string;
  readonly arabic: string;
  readonly urdu: string;
  readonly english: string;
  readonly referenceBook: number;
  readonly referenceHadith: number;
}

/** Fully loaded chapter ready for the reader UI. */
export interface HadithChapterDetail {
  readonly bookSlug: string;
  readonly bookNameEn: string;
  readonly bookNameAr: string;
  readonly bookNameUr: string;
  readonly chapterNumber: number;
  readonly chapterNameEn: string;
  readonly chapterNameUr: string;
  readonly chapterNameAr: string;
  readonly hadiths: readonly HadithEntry[];
}

/** Raw section response from fawazahmed0/hadith-api. */
export interface HadithApiSectionResponse {
  readonly metadata?: {
    readonly name?: string;
    readonly section?: Record<string, string>;
    readonly section_detail?: Record<
      string,
      {
        readonly hadithnumber_first?: number;
        readonly hadithnumber_last?: number;
        readonly arabicnumber_first?: number;
        readonly arabicnumber_last?: number;
      }
    >;
  };
  readonly hadiths?: readonly HadithApiHadithRaw[];
}

export interface HadithApiHadithRaw {
  readonly hadithnumber?: number;
  readonly arabicnumber?: number | string;
  readonly text?: string;
  readonly reference?: {
    readonly book?: number;
    readonly hadith?: number;
  };
}
