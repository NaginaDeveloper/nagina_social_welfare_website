import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import {
  campusDirectionsUrl,
  campusTown,
  campusWhatsappHref,
  type Campus,
} from '../../models/campus';
import { CampusService } from '../../services/campus.service';

@Component({
  selector: 'app-campus-cards',
  imports: [RouterLink],
  template: `
    @if (campusService.campuses().length > 0) {
      <ul class="grid gap-5 md:grid-cols-2" [attr.dir]="i18n.isUr() ? 'rtl' : null">
        @for (campus of campusService.campuses(); track campus.id) {
          <li
            class="flex flex-col rounded-2xl border border-mist bg-white px-5 py-6 shadow-soft sm:px-7"
            [attr.data-campus]="campus.id"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">{{ town(campus) }}</p>
            <h3 class="mt-2 font-display text-xl font-bold text-forest sm:text-2xl">{{ campus.displayName }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-warm sm:text-base">{{ campus.addressLine }}</p>
            <p class="mt-2 text-sm">
              <a [href]="'tel:' + campus.phoneE164" class="font-semibold text-gold-700 hover:underline">
                {{ i18n.t('campus.call') }} · {{ campus.phoneDisplay }}
              </a>
            </p>
            <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              @if (showApply()) {
                <a
                  routerLink="/apply"
                  [queryParams]="{ campus: campus.id }"
                  fragment="apply-form"
                  class="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-5 py-2.5 text-sm font-semibold text-forest shadow-soft sm:w-auto"
                >
                  {{ i18n.t('campus.apply') }}
                </a>
              }
              <a
                [href]="whatsapp(campus)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold/40 bg-white px-5 py-2.5 text-sm font-semibold text-forest sm:w-auto"
              >
                {{ i18n.t('campus.whatsapp') }}
              </a>
              <a
                [href]="directions(campus)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-mist px-5 py-2.5 text-sm font-medium text-slate-warm sm:w-auto"
              >
                {{ i18n.t('campus.directions') }}
              </a>
            </div>
          </li>
        }
      </ul>
    } @else if (campusService.loaded()) {
      <p class="text-center text-sm text-slate-warm">{{ i18n.t('campus.unavailable') }}</p>
    } @else {
      <p class="text-center text-sm text-slate-warm" aria-live="polite">{{ i18n.t('campus.loading') }}</p>
    }
  `,
})
export class CampusCards implements OnInit {
  readonly showApply = input(true);
  /** WhatsApp message prefix; the madrasa name is appended. */
  readonly whatsappPrefill = input('Assalamu alaikum, I have a question about');

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected whatsapp(campus: Campus): string {
    return campusWhatsappHref(campus, `${this.whatsappPrefill()} ${campus.displayName}.`);
  }

  protected directions(campus: Campus): string {
    return campusDirectionsUrl(campus);
  }
}
