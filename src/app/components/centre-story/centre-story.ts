import { Component, inject, input } from '@angular/core';
import type { CentreAbout } from '../../config/centre-about.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

/** A centre's own About Us, Activities, Aim, Vision and Message (English text). */
@Component({
  selector: 'app-centre-story',
  imports: [Reveal, Icon],
  templateUrl: './centre-story.html',
})
export class CentreStory {
  readonly story = input.required<CentreAbout>();

  protected readonly i18n = inject(LanguageService);
}
