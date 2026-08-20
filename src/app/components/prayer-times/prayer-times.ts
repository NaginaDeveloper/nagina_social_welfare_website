import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PrayerTimesService } from '../../services/prayer-times.service';
import type { PrayerName } from '../../models/prayer-time';
import { Qibla } from '../qibla/qibla';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-prayer-times',
  imports: [NgClass, Qibla],
  templateUrl: './prayer-times.html',
})
export class PrayerTimes implements OnInit, OnDestroy {
  protected readonly prayer = inject(PrayerTimesService);
  protected readonly i18n = inject(LanguageService);

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
