import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { isEventToday } from '../../config/upcoming-events.config';
import { LanguageService } from '../../i18n/language.service';
import { EventsService } from '../../services/events.service';
import { PrayerTimesService } from '../../services/prayer-times.service';

@Component({
  selector: 'app-home-spotlight',
  imports: [RouterLink],
  templateUrl: './home-spotlight.html',
})
export class HomeSpotlight implements OnInit {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  protected readonly prayer = inject(PrayerTimesService);
  private readonly events = inject(EventsService);

  protected readonly event = computed(() => this.events.spotlightEvent());

  ngOnInit(): void {
    void this.events.load();
  }

  protected eventTitle(): string {
    const event = this.event();
    if (!event) {
      return '';
    }
    return this.i18n.lang() === 'ur' ? event.titleUr : event.title;
  }

  protected eventMeta(): string {
    const event = this.event();
    if (!event) {
      return '';
    }
    if (this.i18n.lang() === 'ur') {
      return event.whenLabelUr ?? event.recurringUr ?? event.audienceUr;
    }
    return event.whenLabel ?? event.recurring ?? event.audience;
  }

  protected eventIsToday(): boolean {
    const event = this.event();
    return !!event && isEventToday(event);
  }
}
