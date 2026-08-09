import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  /** Visual surface — cream sits above the forest footer; forest suits cream pages. */
  readonly tone = input<'cream' | 'forest'>('cream');

  readonly eyebrow = input('Give with intention');

  readonly headline = input('Help us continue this work');

  readonly lead = input(
    'Your gift supports Islamic education and community welfare across the UK.',
  );

  readonly ctaLabel = input('Donate Now');
}
