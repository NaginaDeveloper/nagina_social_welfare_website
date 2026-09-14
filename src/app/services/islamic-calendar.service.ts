import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CalendarDay {
  readonly gregorianDay: number;
  readonly gregorianDate: string;
  readonly weekdayEn: string;
  readonly hijriDay: number;
  readonly hijriMonthEn: string;
  readonly hijriMonthAr: string;
  readonly hijriYear: string;
  readonly hijriLabel: string;
  readonly isToday: boolean;
  /** 0 = Sunday … 6 = Saturday (Gregorian weekday index). */
  readonly weekdayIndex: number;
}

export interface CalendarMonth {
  readonly year: number;
  readonly month: number;
  readonly monthName: string;
  readonly days: readonly CalendarDay[];
  readonly hijriRangeLabel: string;
}

interface AlAdhanGToHDay {
  readonly gregorian: {
    readonly date: string;
    readonly day: string;
    readonly weekday: { readonly en: string };
    readonly month: { readonly number: number; readonly en: string };
    readonly year: string;
  };
  readonly hijri: {
    readonly day: string;
    readonly month: { readonly number: number; readonly en: string; readonly ar: string };
    readonly year: string;
  };
}

interface AlAdhanGToHResponse {
  readonly code: number;
  readonly data: readonly AlAdhanGToHDay[];
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

@Injectable({ providedIn: 'root' })
export class IslamicCalendarService {
  private readonly monthSignal = signal<CalendarMonth | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly month = this.monthSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  async load(year: number, month: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const url = `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`;
      const res = await firstValueFrom(this.http.get<AlAdhanGToHResponse>(url));
      if (res.code !== 200 || !res.data?.length) {
        throw new Error('Calendar unavailable');
      }
      const todayKey = this.londonYmd();
      const days: CalendarDay[] = res.data.map((row) => {
        const gDay = Number(row.gregorian.day);
        const hDay = Number(row.hijri.day);
        const gregorianDate = `${row.gregorian.year}-${String(row.gregorian.month.number).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`;
        return {
          gregorianDay: gDay,
          gregorianDate,
          weekdayEn: row.gregorian.weekday.en,
          hijriDay: hDay,
          hijriMonthEn: row.hijri.month.en,
          hijriMonthAr: row.hijri.month.ar,
          hijriYear: row.hijri.year,
          hijriLabel: `${hDay} ${row.hijri.month.en}`,
          isToday: gregorianDate === todayKey,
          weekdayIndex: WEEKDAY_INDEX[row.gregorian.weekday.en] ?? 0,
        };
      });

      const first = days[0];
      const last = days[days.length - 1];
      const hijriRangeLabel =
        first.hijriMonthEn === last.hijriMonthEn && first.hijriYear === last.hijriYear
          ? `${first.hijriMonthEn} ${first.hijriYear} AH`
          : `${first.hijriLabel} – ${last.hijriLabel} ${last.hijriYear} AH`;

      this.monthSignal.set({
        year,
        month,
        monthName: first ? res.data[0].gregorian.month.en : '',
        days,
        hijriRangeLabel,
      });
    } catch {
      this.errorSignal.set('Could not load the Islamic calendar. Please try again.');
      this.monthSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private londonYmd(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value ?? '2026';
    const m = parts.find((p) => p.type === 'month')?.value ?? '01';
    const d = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${y}-${m}-${d}`;
  }
}
