import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { QuranAcademyAbout } from '../../config/centre-about.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { CentreLegacy } from '../centre-legacy/centre-legacy';
import { Icon } from '../ui/icon';

/** Manchester's own page body: welcome, facts, and the shared legacy and chain story (English text). */
@Component({
  selector: 'app-centre-quran-academy',
  imports: [Reveal, Icon, RouterLink, CentreLegacy],
  templateUrl: './centre-quran-academy.html',
})
export class CentreQuranAcademy {
  readonly about = input.required<QuranAcademyAbout>();
  readonly centreId = input.required<string>();

  protected readonly i18n = inject(LanguageService);
}
