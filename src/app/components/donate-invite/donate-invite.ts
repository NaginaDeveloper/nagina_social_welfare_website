import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';

/**
 * Soft, non-intrusive donate prompt — used once near the end of a page
 * (or site-wide before the footer). Not a sticky/floating CTA.
 */
@Component({
  selector: 'app-donate-invite',
  imports: [RouterLink],
  templateUrl: './donate-invite.html',
})
export class DonateInvite {
  protected readonly i18n = inject(LanguageService);

  /** Visual surface — cream sits above the forest footer; forest suits cream pages. */
  readonly tone = input<'cream' | 'forest'>('cream');

  /** Optional overrides; when unset, native EN/UR keys are used. */
  readonly eyebrow = input<string | undefined>(undefined);
  readonly headline = input<string | undefined>(undefined);
  readonly lead = input<string | undefined>(undefined);
  readonly ctaLabel = input<string | undefined>(undefined);
}
