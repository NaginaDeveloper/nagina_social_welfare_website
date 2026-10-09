import { Component, OnInit, computed, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { markazAbout } from '../../config/centre-about.config';
import { centreLogo, centreReviewUrl } from '../../config/centre-pages.config';
import { ORGANIZATION } from '../../config/organization.config';
import { madrasaSessions, type MadrasaSession } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { PrayerTimesService } from '../../services/prayer-times.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';
import { ContentReviewNote } from '../content-review-note/content-review-note';
import { VenueMap } from '../venue-map/venue-map';
import { CentreMarkaz } from '../centre-markaz/centre-markaz';

/** Local page for one centre, filled from the published campus list. */
@Component({
  selector: 'app-centre',
  imports: [NgTemplateOutlet, RouterLink, RelatedPages, ContentReviewNote, VenueMap, CentreMarkaz],
  templateUrl: './centre.html',
})
export class Centre implements OnInit {
  readonly campusId = input.required<string>();

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  private readonly prayer = inject(PrayerTimesService);
  protected readonly org = ORGANIZATION;

  protected readonly campus = computed(() => this.campusService.byId(this.campusId()));
  protected readonly logo = computed(() => centreLogo(this.campusId()));
  /** Google's review form for this centre's Business Profile; none until the centre has one. */
  protected readonly reviewUrl = computed(() => centreReviewUrl(this.campusId()));
  /** Peterborough's own page body, when the centre has one. */
  protected readonly markaz = computed(() => markazAbout(this.campusId()));
  /** Name and one-liner of a centre with its own page text, if any. */
  protected readonly own = computed(() => this.markaz());
  /** Ties the centre's own name back to the charity: "Nagina Social Welfare · Manchester". */
  protected readonly eyebrow = computed(() =>
    this.own() && !this.i18n.isUr()
      ? `Nagina Social Welfare · ${this.town()}`
      : this.i18n.t('centre.eyebrow'),
  );
  /** The centre's own name as the page title in English; "Nagina Social Welfare in {town}" otherwise. */
  protected readonly heading = computed(() => {
    const own = this.own();
    return own && !this.i18n.isUr() ? own.name : this.text('centre.title');
  });
  /** The centre's own one-liner in English; the shared line otherwise. */
  protected readonly lead = computed(() => {
    const own = this.own();
    return own && !this.i18n.isUr() ? own.lead : this.text('centre.lead');
  });
  protected readonly town = computed(() => {
    const campus = this.campus();
    return campus ? campusTown(campus) : '';
  });
  protected readonly sessions = computed(() => madrasaSessions(this.campusId()));
  protected readonly hasTimetable = computed(() => this.sessions().length > 0);
  protected readonly isHeadOffice = computed(
    () => this.campus()?.postcode === ORGANIZATION.postalCode,
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
    { path: '/namaz', label: 'Prayer Times', hint: 'Today’s namaz and Hijri date' },
    { path: '/madrasa', label: 'Madrasa', hint: 'Classes at every centre' },
    {
      path: '/safe-drop-off',
      label: 'Safe Drop-Off & Collection',
      labelUr: 'محفوظ ڈراپ آف اور پک اپ',
      hint: 'Parking and road safety video for parents',
      hintUr: 'والدین کے لیے پارکنگ اور سڑک کی حفاظت کی ویڈیو',
    },
    { path: '/events', label: 'Events', hint: 'Gatherings and announcements' },
    { path: '/work', label: 'Our Work', hint: 'Education and welfare programmes' },
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

  protected sessionTitle(session: MadrasaSession): string {
    return this.i18n.pick(session.title, session.titleUr);
  }

  protected sessionDays(session: MadrasaSession): string {
    return this.i18n.pick(session.days, session.daysUr);
  }

  protected sessionTime(session: MadrasaSession): string {
    return this.i18n.pick(session.time, session.timeUr);
  }

  protected sessionAges(session: MadrasaSession): string {
    return this.i18n.pick(session.ages, session.agesUr);
  }
}
