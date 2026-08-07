import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type {
  AlQuranEditionsResponse,
  AlQuranSurahListResponse,
  QuranAyah,
  SurahDetail,
  SurahSummary,
} from '../models/quran';

const API_BASE = 'https://api.alquran.cloud/v1';

/** Arabic Uthmani + Kanzul Iman (Urdu) + Kanzul Iman (English) + Alafasy audio. */
const SURAH_EDITIONS = 'quran-uthmani,ur.kanzuliman,en.ahmedraza,ar.alafasy';

/** Bismillah — shown above every surah except At-Tawbah (9). */
export const BISMILLAH_ARABIC = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

@Injectable({ providedIn: 'root' })
export class QuranService {
  private readonly surahsSignal = signal<SurahSummary[]>([]);
  private readonly currentSurahSignal = signal<SurahDetail | null>(null);
  private readonly loadingListSignal = signal(false);
  private readonly loadingSurahSignal = signal(false);
  private readonly listLoadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly querySignal = signal('');
  private readonly showEnglishSignal = signal(false);
  private readonly playingAyahSignal = signal<number | null>(null);
  private readonly playingSurahSignal = signal(false);

  private readonly cache = new Map<number, SurahDetail>();
  private audio: HTMLAudioElement | null = null;
  private playQueue: readonly QuranAyah[] = [];
  private playIndex = -1;

  readonly surahs = this.surahsSignal.asReadonly();
  readonly currentSurah = this.currentSurahSignal.asReadonly();
  readonly loadingList = this.loadingListSignal.asReadonly();
  readonly loadingSurah = this.loadingSurahSignal.asReadonly();
  readonly listLoaded = this.listLoadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();
  readonly showEnglish = this.showEnglishSignal.asReadonly();
  readonly playingAyah = this.playingAyahSignal.asReadonly();
  readonly playingSurah = this.playingSurahSignal.asReadonly();

  readonly filteredSurahs = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    const all = this.surahsSignal();
    if (!q) return all;
    return all.filter(
      (s) =>
        String(s.number) === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.revelationType.toLowerCase().includes(q),
    );
  });

  constructor(private readonly http: HttpClient) {}

  async loadSurahs(): Promise<void> {
    if (this.listLoadedSignal() && !this.errorSignal()) return;
    this.loadingListSignal.set(true);
    this.errorSignal.set(null);
    try {
      const res = await firstValueFrom(
        this.http.get<AlQuranSurahListResponse>(`${API_BASE}/surah`),
      );
      this.surahsSignal.set(
        (res.data ?? []).map((s) => ({
          number: s.number,
          name: s.name,
          englishName: s.englishName,
          englishNameTranslation: s.englishNameTranslation,
          numberOfAyahs: s.numberOfAyahs,
          revelationType: s.revelationType,
        })),
      );
      this.listLoadedSignal.set(true);
    } catch (err) {
      this.errorSignal.set('Unable to load the Holy Quran surah list right now.');
      this.listLoadedSignal.set(true);
      console.error(err);
    } finally {
      this.loadingListSignal.set(false);
    }
  }

  async openSurah(number: number): Promise<void> {
    this.stop();
    this.errorSignal.set(null);

    const cached = this.cache.get(number);
    if (cached) {
      this.currentSurahSignal.set(cached);
      return;
    }

    this.loadingSurahSignal.set(true);
    this.currentSurahSignal.set(null);
    try {
      const res = await firstValueFrom(
        this.http.get<AlQuranEditionsResponse>(
          `${API_BASE}/surah/${number}/editions/${SURAH_EDITIONS}`,
        ),
      );
      const detail = this.normalize(res);
      this.cache.set(number, detail);
      this.currentSurahSignal.set(detail);
    } catch (err) {
      this.errorSignal.set('Unable to open this blessed Surah right now.');
      console.error(err);
    } finally {
      this.loadingSurahSignal.set(false);
    }
  }

  backToList(): void {
    this.stop();
    this.currentSurahSignal.set(null);
    this.errorSignal.set(null);
  }

  setQuery(value: string): void {
    this.querySignal.set(value);
  }

  toggleEnglish(): void {
    this.showEnglishSignal.update((v) => !v);
  }

  setShowEnglish(value: boolean): void {
    this.showEnglishSignal.set(value);
  }

  /** Play a single ayah (stops continuous surah mode). */
  playAyah(ayah: QuranAyah): void {
    if (!ayah.audioUrl) return;
    this.playingSurahSignal.set(false);
    this.playQueue = [];
    this.playIndex = -1;

    if (this.playingAyahSignal() === ayah.numberInSurah && this.audio && !this.audio.paused) {
      this.stop();
      return;
    }

    this.startAudio(ayah.audioUrl, ayah.numberInSurah, () => {
      this.playingAyahSignal.set(null);
    });
  }

  /** Continuous playback of the current surah from the start (or a given ayah). */
  playSurah(fromAyah?: number): void {
    const surah = this.currentSurahSignal();
    if (!surah) return;

    const ayahs = surah.ayahs.filter((a) => !!a.audioUrl);
    if (ayahs.length === 0) return;

    if (this.playingSurahSignal() && this.audio && !this.audio.paused) {
      this.stop();
      return;
    }

    this.playQueue = ayahs;
    const startIdx =
      fromAyah != null
        ? Math.max(
            0,
            ayahs.findIndex((a) => a.numberInSurah === fromAyah),
          )
        : 0;
    this.playIndex = startIdx === -1 ? 0 : startIdx;
    this.playingSurahSignal.set(true);
    this.playQueueItem();
  }

  stop(): void {
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }
    this.playingAyahSignal.set(null);
    this.playingSurahSignal.set(false);
    this.playQueue = [];
    this.playIndex = -1;
  }

  /** Tear down audio for component destroy. */
  destroy(): void {
    this.stop();
  }

  showsBismillah(surahNumber: number): boolean {
    // At-Tawbah has none; Al-Fatiha counts Bismillah as ayah 1.
    return surahNumber !== 1 && surahNumber !== 9;
  }

  private playQueueItem(): void {
    const ayah = this.playQueue[this.playIndex];
    if (!ayah) {
      this.stop();
      return;
    }
    this.startAudio(ayah.audioUrl, ayah.numberInSurah, () => {
      this.playIndex += 1;
      if (this.playIndex < this.playQueue.length) {
        this.playQueueItem();
      } else {
        this.stop();
      }
    });
  }

  private startAudio(url: string, numberInSurah: number, onEnded: () => void): void {
    if (!this.audio) {
      this.audio = new Audio();
    }
    const el = this.audio;
    el.onended = null;
    el.onerror = null;
    el.pause();
    el.src = url;
    this.playingAyahSignal.set(numberInSurah);
    el.onended = () => onEnded();
    el.onerror = () => {
      console.error('Holy Quran audio failed to load', url);
      onEnded();
    };
    void el.play().catch((err) => {
      console.error(err);
      this.stop();
    });
  }

  private normalize(res: AlQuranEditionsResponse): SurahDetail {
    const editions = res.data ?? [];
    const arabic = editions.find((e) => e.edition?.identifier === 'quran-uthmani') ?? editions[0];
    const urdu = editions.find((e) => e.edition?.identifier === 'ur.kanzuliman');
    const english = editions.find((e) => e.edition?.identifier === 'en.ahmedraza');
    const audio = editions.find((e) => e.edition?.identifier === 'ar.alafasy');

    const meta = arabic;
    const count = meta?.ayahs?.length ?? 0;
    const ayahs: QuranAyah[] = [];

    for (let i = 0; i < count; i++) {
      const a = meta.ayahs[i];
      const u = urdu?.ayahs[i];
      const e = english?.ayahs[i];
      const aud = audio?.ayahs[i];
      const sajdaRaw = a.sajda;
      const sajda =
        typeof sajdaRaw === 'boolean' ? sajdaRaw : !!sajdaRaw && typeof sajdaRaw === 'object';

      ayahs.push({
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: (a.text ?? '').replace(/^\uFEFF/, '').trim(),
        urdu: (u?.text ?? '').trim(),
        english: (e?.text ?? '').trim(),
        audioUrl: aud?.audio ?? '',
        sajda,
      });
    }

    return {
      number: meta.number,
      name: meta.name,
      englishName: meta.englishName,
      englishNameTranslation: meta.englishNameTranslation,
      numberOfAyahs: meta.numberOfAyahs,
      revelationType: meta.revelationType,
      ayahs,
    };
  }
}
