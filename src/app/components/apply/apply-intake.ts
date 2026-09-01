import { Component, inject } from '@angular/core';
import { ORGANIZATION } from '../../config/organization.config';
import { MADRASA_SESSIONS } from '../../config/madrasa-timetable.config';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-apply-intake',
  templateUrl: './apply-intake.html',
})
export class ApplyIntake {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly posterHref = '/posters/madrasa-admission-2026.jpg';
  protected readonly sessions = MADRASA_SESSIONS;

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
