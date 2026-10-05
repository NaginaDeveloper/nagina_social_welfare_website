import { Component, OnInit, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import {
  MADRASA_SESSIONS,
  MADRASA_TIMETABLE_CAMPUS_ID,
} from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { VenueMap } from '../venue-map/venue-map';
import { DeathCommitteeCallout } from '../death-committee-callout/death-committee-callout';
import { DEATH_COMMITTEE } from '../../config/death-committee.config';

/** Local page for one centre, filled from the published campus list. */
@Component({
  selector: 'app-centre',
  imports: [RouterLink, RelatedPages, ContentReviewNote, VenueMap, DeathCommitteeCallout],
  templateUrl: './centre.html',
})
export class Centre implements OnInit {
  readonly campusId = input.required<string>();

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  private readonly prayer = inject(PrayerTimesService);
  protected readonly org = ORGANIZATION;
  protected readonly sessions = MADRASA_SESSIONS;

  protected readonly campus = computed(() => this.campusService.byId(this.campusId()));
  protected readonly town = computed(() => {
    const campus = this.campus();
    return campus ? campusTown(campus) : '';
  });
  protected readonly hasTimetable = computed(
    () => this.campus()?.id === MADRASA_TIMETABLE_CAMPUS_ID,
  );
  protected readonly deathCommitteePath = DEATH_COMMITTEE.path;
  protected readonly hasDeathCommittee = computed(
    () => this.campus()?.id === DEATH_COMMITTEE.campusId,
  );
  protected readonly contactWhatsApp = computed(() => {
    const campus = this.campus();
    if (!campus) return '';
    return campusWhatsappHref(
      campus,
      `Assalamu alaikum, I would like to ask about ${campus.displayName} in ${this.town()}.`,
    );
  });

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/namaz', label: 'Prayer times', hint: 'Today’s namaz and Hijri date' },
    { path: '/madrasa', label: 'Madrasa', hint: 'Classes at every centre' },
    { path: '/events', label: 'Events', hint: 'Gatherings and announcements' },
    { path: '/work', label: 'Our work', hint: 'Education and welfare programmes' },
    { path: '/contact', label: 'Contact', hint: 'WhatsApp, phone and email' },
    { path: '/ramadan', label: 'Ramadan', hint: 'Local Ramadan information' },
  ];

  ngOnInit(): void {
    void this.campusService.load();
  }

  /** Fills `{town}`, `{name}` and `{address}` for this centre. */
  protected text(key: string): string {
    const campus = this.campus();
    return this.i18n
      .t(key)
      .replaceAll('{town}', this.town())
      .replaceAll('{name}', campus?.displayName ?? '')
      .replaceAll('{address}', campus?.addressLine ?? '');
  }

  protected showPrayerTimesHere(): void {
    const campus = this.campus();
    if (campus) void this.prayer.selectPlace(campus.id);
  }

  protected sessionTitle(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.title, session.titleUr);
  }

  protected sessionDays(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.days, session.daysUr);
  }

  protected sessionTime(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.time, session.timeUr);
  }

  protected sessionAges(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.pick(session.ages, session.agesUr);
  }
}
