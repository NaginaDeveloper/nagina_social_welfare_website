import { Component, inject } from '@angular/core';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-apply-intake',
  templateUrl: './apply-intake.html',
})
export class ApplyIntake {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly posterHref = '/posters/madrasa-admission-2026.jpg';
  protected readonly markazLogo = 'brand/markaz.png';

  protected readonly subjects = [
    { title: 'apply.intake.quran', hint: 'apply.intake.quranHint' },
    { title: 'apply.intake.teachings', hint: 'apply.intake.teachingsHint' },
    { title: 'apply.intake.hadith', hint: 'apply.intake.hadithHint' },
    { title: 'apply.intake.academics', hint: 'apply.intake.academicsHint' },
  ] as const;

  protected scrollToForm(event: Event): void {
    event.preventDefault();
    document.getElementById('apply-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
