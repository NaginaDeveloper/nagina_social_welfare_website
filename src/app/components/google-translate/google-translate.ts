import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { GoogleTranslateService } from '../../i18n/google-translate.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-google-translate',
  template: `
    <div
      class="nagina-translate flex flex-wrap items-center gap-2.5 rounded-full border border-gold/35 bg-white/[0.07] px-3 py-2"
      (focusin)="prepare()"
      (pointerdown)="prepare()"
    >
      <!-- Google Translate icon (coloured, always visible) -->
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white"
        aria-hidden="true"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" focusable="false">
          <path
            fill="#4285F4"
            d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z"
          />
          <path fill="#34A853" d="M18.5 10h-2l-3.5 9h2l.8-2h3.4l.8 2h2L18.5 10zm-1.5 5.35L18.15 12l1.15 3.35H17z" />
          <path
            fill="#FBBC05"
            d="M22 12c0-.55-.05-1.09-.14-1.61H12v3.05h5.62c-.24 1.27-.97 2.35-2.07 3.07v2.55h3.35C20.44 17.36 22 14.92 22 12z"
          />
          <path
            fill="#EA4335"
            d="M12 22c2.7 0 4.96-.89 6.61-2.41l-3.35-2.55c-.9.6-2.06.96-3.26.96-2.5 0-4.62-1.69-5.38-3.96H3.9v2.63C5.59 19.7 8.55 22 12 22z"
          />
        </svg>
      </span>

      <div class="flex min-w-0 flex-col leading-tight">
        <span class="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-300">
          {{ i18n.t('translate.label') }}
        </span>
        <span class="text-[0.7rem] text-cream/75">Google Translate</span>
      </div>

      <label class="sr-only" [attr.for]="hostId">{{ i18n.t('translate.label') }}</label>
      <div [id]="hostId" class="nagina-translate-host min-h-9 min-w-[10.5rem]"></div>
    </div>
  `,
})
export class GoogleTranslate implements AfterViewInit {
  @Input() hostId = 'nagina-google-translate-footer';

  protected readonly i18n = inject(LanguageService);
  private readonly translate = inject(GoogleTranslateService);

  ngAfterViewInit(): void {
    // Mount as soon as the footer host exists (do not wait for a click).
    queueMicrotask(() => this.translate.remount(this.hostId));
  }

  protected prepare(): void {
    this.translate.prepareForInternational(this.hostId);
  }
}
