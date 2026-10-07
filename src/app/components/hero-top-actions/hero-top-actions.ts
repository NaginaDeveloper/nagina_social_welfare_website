import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-hero-top-actions',
  imports: [RouterLink, Icon],
  templateUrl: './hero-top-actions.html',
})
export class HeroTopActions {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
}
