import { Component, OnInit, computed, inject } from '@angular/core';
import {
  MADRASA_SESSIONS,
  MADRASA_TIMETABLE_CAMPUS_ID,
} from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import { CampusService } from '../../services/campus.service';
import { posterCaption } from '../../models/campus';

@Component({
  selector: 'app-apply-intake',
  templateUrl: './apply-intake.html',
})
export class ApplyIntake implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly posterHref = '/posters/madrasa-admission-2026.jpg';
  protected readonly sessions = MADRASA_SESSIONS;
  protected readonly timetableCampus = computed(() =>
    this.campusService.byId(MADRASA_TIMETABLE_CAMPUS_ID),
  );
  protected readonly posterHint = computed(() =>
    posterCaption(this.i18n.t('apply.intake.posterHint'), this.timetableCampus()?.displayName ?? ''),
  );

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected sessionTitle(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.titleUr : session.title;
  }

  protected sessionTime(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.timeUr : session.time;
  }

  protected sessionAges(id: string): string {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) return '';
    return this.i18n.lang() === 'ur' ? session.agesUr : session.ages;
  }

  protected scrollToForm(event: Event): void {
    event.preventDefault();
    document.getElementById('apply-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
