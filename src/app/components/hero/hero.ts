import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, WhatsappIcon],
  templateUrl: './hero.html',
})
export class Hero {
  protected readonly i18n = inject(LanguageService);
  protected readonly whatsapp = whatsappHref(
    'Assalamu alaikum, I would like to get in touch with Nagina Social Welfare.',
  );
}
