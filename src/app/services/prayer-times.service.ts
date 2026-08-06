import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type {
  AlAdhanTimingsResponse,
  DayTimings,
  PrayerName,
  PrayerSlot,
} from '../models/prayer-time';

/** Peterborough city centre — near Burmer Road (PE1). */
export const PETERBOROUGH_LAT = 52.5695;
export const PETERBOROUGH_LNG = -0.2405;
export const PRAYER_TIMEZONE = 'Europe/London';

/** Muslim World League + Hanafi Asr. */
const METHOD = 3;
const SCHOOL = 1;

const PRAYER_ORDER: readonly PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

@Injectable({ providedIn: 'root' })
export class PrayerTimesService {
  private readonly todaySignal = signal<DayTimings | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly nowSignal = signal(Date.now());
  private readonly loadedSignal = signal(false);

  private clockId: ReturnType<typeof setInterval> | null = null;

  readonly today = this.todaySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();

  /** Five salah slots for today with Begins / Ends. */
  readonly slots = computed(() => this.todaySignal()?.slots ?? []);

  readonly sunrise = computed(() => this.todaySignal()?.sunrise ?? '');

  readonly dateInfo = computed(() => this.todaySignal()?.date ?? null);

  /**
   * Prayer whose window contains "now" (begins inclusive, ends exclusive).
   * Null before Fajr or in the gap after Isha ends (until next Fajr).
   */
  readonly currentPrayer = computed<PrayerName | null>(() => {
    const day = this.todaySignal();
    if (!day) return null;
    const minutes = this.londonMinutes(this.nowSignal());
    for (const slot of day.slots) {
      const start = parseHm(slot.begins);
      const end = this.endMinutes(slot, day);
      if (start <= end) {
        if (minutes >= start && minutes < end) return slot.name;
      } else {
        // Window crosses midnight (Isha → next Fajr)
        if (minutes >= start || minutes < end) return slot.name;
      }
    }
    return null;
  });

  /** Next prayer whose begins is still ahead today, else tomorrow's Fajr. */
  readonly nextPrayer = computed<{ name: PrayerName; begins: string; isTomorrow: boolean } | null>(() => {
    const day = this.todaySignal();
    if (!day) return null;
    const minutes = this.londonMinutes(this.nowSignal());
    for (const name of PRAYER_ORDER) {
      const begins = day.begins[name];
      if (parseHm(begins) > minutes) {
        return { name, begins, isTomorrow: false };
      }
    }
    return { name: 'Fajr', begins: day.nextFajr, isTomorrow: true };
  });

  /** Human countdown to the next prayer begins (e.g. "1h 12m"). */
  readonly countdown = computed(() => {
    const next = this.nextPrayer();
    const day = this.todaySignal();
    if (!next || !day) return '';
    const nowMin = this.londonMinutes(this.nowSignal());
    let target = parseHm(next.begins);
    if (next.isTomorrow || target <= nowMin) {
      target += 24 * 60;
    }
    const diff = Math.max(0, target - nowMin);
    return formatDuration(diff);
  });

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<void> {
    if (this.todaySignal() && !this.errorSignal()) return;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const todayDate = this.londonDateParts(Date.now());
      const tomorrowDate = this.londonDateParts(Date.now() + 24 * 60 * 60 * 1000);

      const [todayRes, tomorrowRes] = await Promise.all([
        this.fetchDay(todayDate),
        this.fetchDay(tomorrowDate),
      ]);

      const nextFajr = stripTimezoneSuffix(tomorrowRes.data.timings.Fajr);
      this.todaySignal.set(this.normalize(todayRes, nextFajr));
      this.loadedSignal.set(true);
      this.startClock();
    } catch (err) {
      this.errorSignal.set('Unable to load prayer times right now.');
      this.loadedSignal.set(true);
      console.error(err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /** Stop the live clock (tests / teardown). */
  stopClock(): void {
    if (this.clockId != null) {
      clearInterval(this.clockId);
      this.clockId = null;
    }
  }

  private startClock(): void {
    this.stopClock();
    this.nowSignal.set(Date.now());
    this.clockId = setInterval(() => this.nowSignal.set(Date.now()), 30_000);
  }

  private fetchDay(parts: { day: string; month: string; year: string }) {
    const date = `${parts.day}-${parts.month}-${parts.year}`;
    const url =
      `https://api.aladhan.com/v1/timings/${date}` +
      `?latitude=${PETERBOROUGH_LAT}` +
      `&longitude=${PETERBOROUGH_LNG}` +
      `&method=${METHOD}` +
      `&school=${SCHOOL}` +
      `&timezonestring=${encodeURIComponent(PRAYER_TIMEZONE)}`;
    return firstValueFrom(this.http.get<AlAdhanTimingsResponse>(url));
  }

  private normalize(res: AlAdhanTimingsResponse, nextFajr: string): DayTimings {
    const t = res.data.timings;
    const fajr = stripTimezoneSuffix(t.Fajr);
    const sunrise = stripTimezoneSuffix(t.Sunrise);
    const dhuhr = stripTimezoneSuffix(t.Dhuhr);
    const asr = stripTimezoneSuffix(t.Asr);
    const maghrib = stripTimezoneSuffix(t.Maghrib);
    const isha = stripTimezoneSuffix(t.Isha);

    const begins = {
      Fajr: fajr,
      Sunrise: sunrise,
      Dhuhr: dhuhr,
      Asr: asr,
      Maghrib: maghrib,
      Isha: isha,
    } as const;

    const slots: PrayerSlot[] = [
      { name: 'Fajr', begins: fajr, ends: sunrise },
      { name: 'Dhuhr', begins: dhuhr, ends: asr },
      { name: 'Asr', begins: asr, ends: maghrib },
      { name: 'Maghrib', begins: maghrib, ends: isha },
      { name: 'Isha', begins: isha, ends: nextFajr },
    ];

    const g = res.data.date.gregorian;
    const h = res.data.date.hijri;

    return {
      date: {
        gregorian: `${g.weekday.en}, ${Number(g.day)} ${g.month.en} ${g.year}`,
        hijri: `${Number(h.day)} ${h.month.en} ${h.year} AH`,
        weekday: g.weekday.en,
      },
      sunrise,
      slots,
      begins,
      nextFajr,
    };
  }

  private endMinutes(slot: PrayerSlot, day: DayTimings): number {
    if (slot.name === 'Isha') return parseHm(day.nextFajr);
    return parseHm(slot.ends);
  }

  /** Minutes since local midnight in Europe/London. */
  private londonMinutes(epochMs: number): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PRAYER_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(epochMs));
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    return hour * 60 + minute;
  }

  private londonDateParts(epochMs: number): { day: string; month: string; year: string } {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: PRAYER_TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).formatToParts(new Date(epochMs));
    return {
      day: parts.find((p) => p.type === 'day')?.value ?? '01',
      month: parts.find((p) => p.type === 'month')?.value ?? '01',
      year: parts.find((p) => p.type === 'year')?.value ?? '2026',
    };
  }
}

/** Strip " (BST)" / " (GMT)" suffixes from AlAdhan time strings. */
export function stripTimezoneSuffix(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** Parse "HH:mm" into minutes since midnight. */
export function parseHm(value: string): number {
  const [h, m] = stripTimezoneSuffix(value).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
