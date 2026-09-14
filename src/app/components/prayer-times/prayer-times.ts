import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PrayerTimesService } from '../../services/prayer-times.service';
import type { PrayerName } from '../../models/prayer-time';
import { Qibla } from '../qibla/qibla';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { CONTENT_REVIEW } from '../../config/content-review.config';

@Component({
  selector: 'app-prayer-times',
  imports: [NgClass, Qibla, RelatedPages, ContentReviewNote],
  templateUrl: './prayer-times.html',
})
export class PrayerTimes implements OnInit, OnDestroy {
  protected readonly prayer = inject(PrayerTimesService);
  protected readonly i18n = inject(LanguageService);
  protected readonly lastChecked = CONTENT_REVIEW['namaz']?.lastChecked ?? '';

  protected readonly related: readonly RelatedPageLink[] = [
    {
      path: '/peterborough',
      label: 'Peterborough community',
      hint: 'Address, services and schedules',
    },
    {
      path: '/madrasa',
      label: 'Madrasa classes',
      hint: 'Markaz Deen-e-Islam timetable',
    },
    {
      path: '/events',
      label: 'Events',
      hint: 'Gatherings and announcements',
    },
    {
      path: '/ramadan',
      label: 'Ramadan in Peterborough',
      hint: 'Local Ramadan information',
    },
    {
      path: '/calendar',
      label: 'Islamic calendar',
      hint: 'Hijri dates and method notes',
    },
    {
      path: '/contact',
      label: 'Contact',
      hint: 'WhatsApp, phone and email',
    },
  ];

  ngOnInit(): void {
    void this.prayer.load();
  }

  ngOnDestroy(): void {
    this.prayer.stopClock();
  }

  protected isCurrent(name: PrayerName): boolean {
    return this.prayer.currentPrayer() === name;
  }

  protected isNext(name: PrayerName): boolean {
    const next = this.prayer.nextPrayer();
    return !!next && !next.isTomorrow && next.name === name;
  }
}
