import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { PrayerTimesService } from '../../services/prayer-times.service';
import type { PrayerName } from '../../models/prayer-time';
import { campusTown, type Campus } from '../../models/campus';
import { Qibla } from '../qibla/qibla';
import { LanguageService } from '../../i18n/language.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { CONTENT_REVIEW } from '../../config/content-review.config';
import { centrePath } from '../../config/centre-pages.config';

@Component({
  selector: 'app-prayer-times',
  imports: [NgClass, Qibla, RelatedPages, ContentReviewNote],
  templateUrl: './prayer-times.html',
})
export class PrayerTimes implements OnInit, OnDestroy {
  protected readonly prayer = inject(PrayerTimesService);
  protected readonly i18n = inject(LanguageService);
  protected readonly lastChecked = CONTENT_REVIEW['namaz']?.lastChecked ?? '';

  protected readonly footnote = computed(() =>
    this.i18n.t('namaz.footnote').replace('{town}', this.prayer.placeTown() || this.i18n.t('namaz.titleAccent')),
  );

  /** Points at the centre whose times are on screen. */
  private readonly centreLink = computed<RelatedPageLink[]>(() => {
    const id = this.prayer.placeCampusId();
    const town = this.prayer.placeTown();
    return id && town
      ? [{ path: centrePath(id), label: `${town} community`, hint: 'Address, services and schedules' }]
      : [];
  });

  protected readonly related = computed<readonly RelatedPageLink[]>(() => [
    {
      path: '/madrasa',
      label: 'Our madrasas',
      hint: 'Addresses, class times and admission',
    },
    ...this.centreLink(),
    {
      path: '/events',
      label: 'Events',
      hint: 'Gatherings and announcements',
    },
    {
      path: '/ramadan',
      label: 'Ramadan',
      hint: 'Ramadan information and support',
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
  ]);

  ngOnInit(): void {
    void this.prayer.load();
  }

  ngOnDestroy(): void {
    this.prayer.stopClock();
  }

  protected placeButtonLabel(campus: Campus): string {
    return campusTown(campus);
  }

  protected isCurrent(name: PrayerName): boolean {
    return this.prayer.currentPrayer() === name;
  }

  protected isNext(name: PrayerName): boolean {
    const next = this.prayer.nextPrayer();
    return !!next && !next.isTomorrow && next.name === name;
  }
}
