import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { MarkazAbout } from '../../config/centre-about.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

/** Peterborough's own page body: photos, week-and-year rhythm, guide, head office (English text). */
@Component({
  selector: 'app-centre-markaz',
  imports: [Reveal, Icon, RouterLink],
  templateUrl: './centre-markaz.html',
})
export class CentreMarkaz {
  readonly about = input.required<MarkazAbout>();

  protected readonly i18n = inject(LanguageService);
}
