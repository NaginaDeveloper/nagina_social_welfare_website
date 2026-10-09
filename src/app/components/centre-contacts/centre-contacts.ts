import { Component, OnInit, booleanAttribute, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import {
  campusDirectionsUrl,
  campusTown,
  campusWhatsappHref,
  type Campus,
} from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { Icon } from '../ui/icon';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

/**
 * Both centres' WhatsApp, phone and email in one block, so no page ever
 * shows a single "head office" contact. Falls back to the charity contact
 * only while the centre list is unavailable.
 */
@Component({
  selector: 'app-centre-contacts',
  imports: [Icon, RouterLink, WhatsappIcon],
  template: `
    @if (compact()) {
      <!-- One slim line: each centre's WhatsApp and phone, then the Contact page. -->
      <div
        class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-sm"
        [attr.dir]="i18n.isUr() ? 'rtl' : null"
        data-testid="centre-contacts-compact"
      >
        @if (title()) {
          <span [class]="dark() ? 'font-semibold text-white' : 'font-semibold text-forest'">{{ title() }}</span>
        }
        @for (campus of campusService.campuses(); track campus.id) {
          <span class="inline-flex flex-wrap items-center gap-2" [attr.data-campus]="campus.id">
            <span [class]="dark() ? 'font-semibold text-gold-300' : 'font-semibold text-gold-600'">{{ town(campus) }}</span>
            <a [href]="whatsapp(campus)" target="_blank" rel="noopener noreferrer" [class]="primaryClass()">
              <app-whatsapp-icon class="h-4 w-4" [inverse]="dark()" />
              {{ i18n.t('campus.whatsapp') }}
            </a>
            <a [href]="'tel:' + campus.phoneE164" [class]="linkClass()" dir="ltr">
              <app-icon name="phone" size="h-4 w-4 shrink-0" />
              {{ campus.phoneDisplay }}
            </a>
          </span>
        }
        <a
          routerLink="/contact"
          [class]="dark() ? 'font-semibold text-gold-300 underline decoration-gold/40 underline-offset-2 hover:text-white' : 'font-semibold text-gold-700 underline decoration-gold/40 underline-offset-2 hover:text-forest'"
        >
          {{ i18n.pick('All contact details', 'تمام رابطے کی تفصیلات') }} →
        </a>
      </div>
    } @else {
    <div [attr.dir]="i18n.isUr() ? 'rtl' : null" data-testid="centre-contacts">
      @if (title()) {
        <p [class]="dark() ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-forest'">{{ title() }}</p>
      }
      @if (campusService.campuses().length > 0) {
        <div class="grid gap-3 sm:grid-cols-2" [class.mt-3]="!!title()">
          @for (campus of campusService.campuses(); track campus.id) {
            <div [class]="cardClass()" [attr.data-campus]="campus.id">
              <p class="text-[0.62rem] font-semibold uppercase tracking-[0.2em]" [class]="dark() ? 'text-gold-300' : 'text-gold-600'">
                {{ town(campus) }}
              </p>
              <p class="mt-0.5 font-display text-base font-bold" [class]="dark() ? 'text-white' : 'text-forest'">{{ campus.displayName }}</p>
              <ul class="mt-2.5 space-y-1.5 text-sm">
                <li>
                  <a [href]="whatsapp(campus)" target="_blank" rel="noopener noreferrer" [class]="primaryClass()">
                    <app-whatsapp-icon class="h-4 w-4" [inverse]="dark()" />
                    {{ i18n.t('campus.whatsapp') }} · <span dir="ltr">{{ campus.phoneDisplay }}</span>
                  </a>
                </li>
                <li>
                  <a [href]="'tel:' + campus.phoneE164" [class]="linkClass()" dir="ltr">
                    <app-icon name="phone" size="h-4 w-4 shrink-0" />
                    {{ campus.phoneDisplay }}
                  </a>
                </li>
                <li>
                  <a [href]="'mailto:' + email(campus)" [class]="linkClass() + ' break-all'" dir="ltr">
                    <app-icon name="mail" size="h-4 w-4 shrink-0" />
                    {{ email(campus) }}
                  </a>
                </li>
                @if (showAddress()) {
                  <li>
                    <a [href]="directions(campus)" target="_blank" rel="noopener noreferrer" [class]="linkClass()">
                      <app-icon name="pin" size="h-4 w-4 shrink-0" />
                      {{ campus.addressLine }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      } @else {
        <div [class]="cardClass()" [class.mt-3]="!!title()">
          <ul class="space-y-1.5 text-sm">
            <li>
              <a [href]="orgWhatsapp" target="_blank" rel="noopener noreferrer" [class]="primaryClass()">
                <app-whatsapp-icon class="h-4 w-4" [inverse]="dark()" />
                {{ i18n.t('campus.whatsapp') }}
              </a>
            </li>
            <li><a [href]="'tel:' + org.phoneTel" [class]="linkClass()" dir="ltr"><app-icon name="phone" size="h-4 w-4" />{{ org.phoneDisplay }}</a></li>
            <li><a [href]="'mailto:' + org.email" [class]="linkClass() + ' break-all'" dir="ltr"><app-icon name="mail" size="h-4 w-4" />{{ org.email }}</a></li>
          </ul>
        </div>
      }
    </div>
    }
  `,
})
export class CentreContacts implements OnInit {
  /** Optional heading above the cards. */
  readonly title = input<string>('');
  /** `dark` for forest/green panels, `light` for cream/white pages. */
  readonly tone = input<'light' | 'dark'>('light');
  /** Show the street address with a directions link. */
  readonly showAddress = input(false);
  /** One slim line (WhatsApp and phone per centre, then the Contact page) instead of cards. */
  readonly compact = input(false, { transform: booleanAttribute });
  /** Start of the WhatsApp message; the centre name is appended. */
  readonly prefill = input('Assalamu alaikum, I have a question for');

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;
  protected readonly orgWhatsapp = whatsappHref('Assalamu alaikum, I have a question for Nagina Social Welfare.');

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected dark(): boolean {
    return this.tone() === 'dark';
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected email(campus: Campus): string {
    return campus.email || ORGANIZATION.email;
  }

  protected whatsapp(campus: Campus): string {
    return campusWhatsappHref(campus, `${this.prefill()} ${campus.displayName} (${campusTown(campus)}).`);
  }

  protected directions(campus: Campus): string {
    return campusDirectionsUrl(campus);
  }

  protected cardClass(): string {
    return this.dark()
      ? 'rounded-2xl border border-white/10 bg-white/5 p-4'
      : 'rounded-2xl border border-mist bg-white p-4 shadow-soft';
  }

  protected primaryClass(): string {
    return this.dark()
      ? 'inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-gold'
      : 'inline-flex items-center gap-2 font-semibold text-forest hover:text-gold-600';
  }

  protected linkClass(): string {
    return this.dark()
      ? 'inline-flex items-center gap-2 text-cream/85 hover:text-white'
      : 'inline-flex items-center gap-2 text-slate-warm hover:text-forest';
  }
}
