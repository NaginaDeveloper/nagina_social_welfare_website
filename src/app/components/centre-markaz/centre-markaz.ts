import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { MarkazAbout } from '../../config/centre-about.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { SITE_ORIGIN } from '../../seo/seo.config';
import { SeoService } from '../../seo/seo.service';
import { faqPageJsonLd } from '../../seo/structured-data';
import { CentreLegacy } from '../centre-legacy/centre-legacy';
import { Icon } from '../ui/icon';

/** Peterborough's own page body: photos, week-and-year rhythm, guide, head office (English text). */
@Component({
  selector: 'app-centre-markaz',
  imports: [Reveal, Icon, RouterLink, CentreLegacy],
  templateUrl: './centre-markaz.html',
})
export class CentreMarkaz {
  readonly about = input.required<MarkazAbout>();

  protected readonly i18n = inject(LanguageService);

  constructor() {
    const seo = inject(SeoService);
    // Mirrors the visible questions and answers so the markup matches the page.
    effect(() => {
      const node = faqPageJsonLd(this.about().faqs, `${SITE_ORIGIN}/peterborough/`);
      seo.setExtraJsonLd('faq', node ? [node] : null);
    });
    inject(DestroyRef).onDestroy(() => seo.setExtraJsonLd('faq', null));
  }
}
