import { Component, Input, inject } from '@angular/core';
import { GoogleTranslateService } from '../../i18n/google-translate.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-google-translate',
  template: `
    <div
      class="flex items-center gap-1.5"
      (focusin)="prepare()"
      (pointerdown)="prepare()"
    >
      <label class="sr-only" [attr.for]="hostId">{{ i18n.t('translate.label') }}</label>
      <span class="hidden text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cream/55 sm:inline">
        {{ i18n.t('translate.label') }}
      </span>
      <div [id]="hostId" class="min-h-8 min-w-[6.5rem]"></div>
    </div>
  `,
})
export class GoogleTranslate {
  @Input() hostId = 'nagina-google-translate-desktop';

  protected readonly i18n = inject(LanguageService);
  private readonly translate = inject(GoogleTranslateService);

  protected prepare(): void {
    this.translate.prepareForInternational(this.hostId);
  }
}
