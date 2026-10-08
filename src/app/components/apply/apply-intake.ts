import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { madrasaSessions, type MadrasaSession } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';
import type { Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';

@Component({
  selector: 'app-apply-intake',
  imports: [RouterLink],
  templateUrl: './apply-intake.html',
})
export class ApplyIntake implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly posterHref = '/posters/madrasa-admission-2026.jpg';

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected sessionsFor(campus: Campus): readonly MadrasaSession[] {
    return madrasaSessions(campus.id);
  }

  protected sessionTitle(session: MadrasaSession): string {
    return this.i18n.pick(session.title, session.titleUr);
  }

  protected sessionTime(session: MadrasaSession): string {
    return `${this.i18n.pick(session.time, session.timeUr)} · ${this.i18n.pick(session.days, session.daysUr)}`;
  }

  protected sessionAges(session: MadrasaSession): string {
    return this.i18n.pick(session.ages, session.agesUr);
  }

  protected scrollToForm(event: Event): void {
    event.preventDefault();
    document.getElementById('apply-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
