import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { IslamicCalendarService } from '../../services/islamic-calendar.service';

@Component({
  selector: 'app-islamic-calendar',
  imports: [RouterLink, RelatedPages, ContentReviewNote],
  templateUrl: './islamic-calendar.html',
})
export class IslamicCalendar implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly calendar = inject(IslamicCalendarService);

  private readonly viewYear = signal(2026);
  private readonly viewMonth = signal(1);

  protected readonly weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

  protected readonly leadingBlanks = computed(() => {
    const month = this.calendar.month();
    if (!month?.days.length) return [];
    const first = month.days[0].weekdayIndex;
    return Array.from({ length: first }, (_, i) => i);
  });

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Today’s Hijri date with namaz' },
    { path: '/ramadan', label: 'Ramadan', hint: 'How to find local Ramadan info' },
    { path: '/events', label: 'Events', hint: 'Gatherings tied to the Islamic year' },
    { path: '/peterborough', label: 'Peterborough', hint: 'Local centre and services' },
  ];

  ngOnInit(): void {
    const now = this.londonParts();
    this.viewYear.set(now.year);
    this.viewMonth.set(now.month);
    void this.calendar.ensureToday();
    void this.calendar.load(now.year, now.month);
  }

  protected prevMonth(): void {
    let y = this.viewYear();
    let m = this.viewMonth() - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    this.viewYear.set(y);
    this.viewMonth.set(m);
    void this.calendar.load(y, m);
  }

  protected nextMonth(): void {
    let y = this.viewYear();
    let m = this.viewMonth() + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    this.viewYear.set(y);
    this.viewMonth.set(m);
    void this.calendar.load(y, m);
  }

  protected goToday(): void {
    const now = this.londonParts();
    this.viewYear.set(now.year);
    this.viewMonth.set(now.month);
    void this.calendar.load(now.year, now.month);
  }

  private londonParts(): { year: number; month: number } {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: 'numeric',
    }).formatToParts(new Date());
    return {
      year: Number(parts.find((p) => p.type === 'year')?.value ?? 2026),
      month: Number(parts.find((p) => p.type === 'month')?.value ?? 1),
    };
  }
}
