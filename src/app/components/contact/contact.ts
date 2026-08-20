import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { VenueMap } from '../venue-map/venue-map';

type ContactReason = 'enrolment' | 'donation' | 'namaz' | 'general';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink, VenueMap],
  templateUrl: './contact.html',
})
export class Contact {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly whatsapp = whatsappHref();
  protected readonly name = signal('');
  protected readonly reason = signal<ContactReason>('general');
  protected readonly message = signal('');

  protected readonly reasons: readonly { id: ContactReason; key: string }[] = [
    { id: 'enrolment', key: 'contact.reason.enrolment' },
    { id: 'donation', key: 'contact.reason.donation' },
    { id: 'namaz', key: 'contact.reason.namaz' },
    { id: 'general', key: 'contact.reason.general' },
  ];

  protected setReason(value: string): void {
    if (
      value === 'enrolment' ||
      value === 'donation' ||
      value === 'namaz' ||
      value === 'general'
    ) {
      this.reason.set(value);
    }
  }

  protected openWhatsAppForm(): void {
    const reasonLabel = this.i18n.t(
      this.reasons.find((item) => item.id === this.reason())?.key ?? 'contact.reason.general',
    );
    const lines = [
      'Assalamu alaikum',
      this.name().trim() ? `Name: ${this.name().trim()}` : '',
      `Reason: ${reasonLabel}`,
      this.message().trim(),
    ].filter(Boolean);
    window.open(whatsappHref(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }
}
