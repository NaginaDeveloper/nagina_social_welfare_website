import { Component, inject } from '@angular/core';
import { whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

@Component({
  selector: 'app-floating-whatsapp',
  imports: [WhatsappIcon],
  template: `
    <a
      [href]="whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-portal transition hover:brightness-110"
      [attr.aria-label]="i18n.t('contact.whatsapp')"
    >
      <app-whatsapp-icon class="h-6 w-6" [inverse]="true" />
    </a>
  `,
})
export class FloatingWhatsapp {
  protected readonly i18n = inject(LanguageService);
  protected readonly whatsapp = whatsappHref();
}
