import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { nextSpotlightEvent, isEventToday } from '../../config/upcoming-events.config';
import { LanguageService } from '../../i18n/language.service';
import { PrayerTimesService } from '../../services/prayer-times.service';

@Component({
  selector: 'app-home-spotlight',
  imports: [RouterLink],
  templateUrl: './home-spotlight.html',
})
export class HomeSpotlight {
  protected readonly i18n = inject(LanguageService);
  protected readonly prayer = inject(PrayerTimesService);
  protected readonly event = nextSpotlightEvent();

  protected eventTitle(): string {
    if (!this.event) {
      return '';
    }
    return this.i18n.lang() === 'ur' ? this.event.titleUr : this.event.title;
  }

  protected eventMeta(): string {
    if (!this.event) {
      return '';
    }
    if (this.i18n.lang() === 'ur') {
      return this.event.whenLabelUr ?? this.event.recurringUr ?? this.event.audienceUr;
    }
    return this.event.whenLabel ?? this.event.recurring ?? this.event.audience;
  }

  protected eventIsToday(): boolean {
    return !!this.event && isEventToday(this.event);
  }
}
