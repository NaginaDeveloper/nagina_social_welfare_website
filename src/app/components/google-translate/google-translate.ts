import { Component, Input, inject } from '@angular/core';
import { GoogleTranslateService } from '../../i18n/google-translate.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-google-translate',
  template: `
    <div
      class="nagina-translate inline-flex h-8 max-h-8 items-center gap-2 overflow-hidden"
      (focusin)="prepare()"
      (pointerdown)="prepare()"
    >
      <label class="sr-only" [attr.for]="hostId">{{ i18n.t('translate.label') }}</label>
      <span class="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold-300/90">
        {{ i18n.t('translate.label') }}
      </span>
      <div [id]="hostId" class="nagina-translate-host h-8 max-h-8 min-w-[8.5rem] overflow-hidden"></div>
    </div>
  `,
})
export class GoogleTranslate {
  @Input() hostId = 'nagina-google-translate-footer';

  protected readonly i18n = inject(LanguageService);
  private readonly translate = inject(GoogleTranslateService);

  protected prepare(): void {
    this.translate.prepareForInternational(this.hostId);
  }
}
