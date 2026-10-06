import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { CampusCards } from '../campus-cards/campus-cards';
import { CampusMap } from '../campus-map/campus-map';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

type ContactReason = 'enrolment' | 'donation' | 'namaz' | 'general';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink, CampusCards, CampusMap, WhatsappIcon],
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  /** Use h2 when embedded on the homepage so only one H1 remains. */
  readonly headingLevel = input<'h1' | 'h2'>('h1');

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;
  protected readonly whatsapp = whatsappHref();
  protected readonly name = signal('');
  protected readonly reason = signal<ContactReason>('general');
  /** Campus id, or `general` for the charity office number. */
  protected readonly centre = signal('general');
  protected readonly message = signal('');

  protected readonly reasons: readonly { id: ContactReason; key: string }[] = [
    { id: 'enrolment', key: 'contact.reason.enrolment' },
    { id: 'donation', key: 'contact.reason.donation' },
    { id: 'namaz', key: 'contact.reason.namaz' },
    { id: 'general', key: 'contact.reason.general' },
  ];

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected campusWhatsapp(campus: Campus): string {
    return campusWhatsappHref(campus, `Assalamu alaikum, I have a question for ${campus.displayName}.`);
  }

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
    const campus = this.campusService.byId(this.centre());
    const lines = [
      'Assalamu alaikum',
      this.name().trim() ? `Name: ${this.name().trim()}` : '',
      `Reason: ${reasonLabel}`,
      campus ? `Centre: ${campus.displayName} (${campusTown(campus)})` : '',
      this.message().trim(),
    ].filter(Boolean);
    const text = lines.join('\n');
    const href = campus ? campusWhatsappHref(campus, text) : whatsappHref(text);
    window.open(href, '_blank', 'noopener,noreferrer');
  }
}
