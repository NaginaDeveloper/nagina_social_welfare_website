import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

/**
 * Two-panel layout for the member auth pages (sign in, set / forgot / reset password):
 * a forest brand panel with the logo and three member benefits, and a white form card.
 * The page passes its heading and lead; the form goes in the content slot.
 */
@Component({
  selector: 'app-auth-split-layout',
  imports: [RouterLink, Icon, WhatsappIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-cream py-8 sm:py-12 lg:py-16">
      <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
        <div
          class="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-mist bg-white shadow-portal lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
        >
          <!-- Brand panel -->
          <aside class="relative isolate overflow-hidden bg-gradient-to-br from-forest via-emerald to-forest-800 px-6 py-8 text-cream sm:px-10 sm:py-12">
            <div class="geo-pattern-dense absolute inset-0 -z-10 opacity-70" aria-hidden="true"></div>
            <div
              class="absolute -top-24 -end-24 -z-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
              aria-hidden="true"
            ></div>
            <div class="flex h-full flex-col">
              <a routerLink="/" class="inline-flex items-center gap-3" [attr.aria-label]="org.charityName">
                <img
                  src="/brand/nagina-128.webp"
                  alt=""
                  width="48"
                  height="48"
                  class="h-12 w-12 rounded-full bg-white/90 object-contain p-1 shadow-soft"
                  decoding="async"
                />
                <span class="font-display text-lg font-bold leading-tight text-white">{{ org.charityName }}</span>
              </a>

              <p class="eyebrow-on-dark mt-10">{{ i18n.t('auth.brandEyebrow') }}</p>
              <h2 class="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {{ i18n.t('auth.brandTitle') }}
              </h2>
              <p class="mt-3 max-w-md text-sm leading-relaxed text-sand/85 sm:text-base">
                {{ i18n.t('auth.brandLead') }}
              </p>

              <ul class="mt-8 space-y-3.5">
                @for (key of benefits; track key) {
                  <li class="flex items-start gap-3 text-sm leading-relaxed text-cream/95">
                    <span
                      class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-300"
                      aria-hidden="true"
                    >
                      <app-icon name="check" size="h-3.5 w-3.5" [strokeWidth]="2.4" />
                    </span>
                    <span>{{ i18n.t(key) }}</span>
                  </li>
                }
              </ul>

              <div class="mt-auto pt-10">
                <a
                  [href]="helpWhatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-white"
                >
                  <app-whatsapp-icon class="h-4 w-4" [inverse]="true" />
                  {{ i18n.t('auth.helpWhatsApp') }}
                </a>
                <p class="mt-4 text-xs leading-relaxed text-sand/70" dir="ltr">
                  {{ org.legalName }} · {{ i18n.t('footer.charity') }} {{ org.charityNumber }} ·
                  {{ i18n.t('footer.company') }} {{ org.companyNumber }}
                </p>
              </div>
            </div>
          </aside>

          <!-- Form panel -->
          <div class="px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
            <div class="mx-auto max-w-md">
              <p class="eyebrow">{{ eyebrow() }}</p>
              <h1 class="mt-3 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">{{ heading() }}</h1>
              @if (lead()) {
                <p class="mt-3 text-sm leading-relaxed text-slate-warm sm:text-base">{{ lead() }}</p>
              }
              <div class="mt-8">
                <ng-content />
              </div>
            </div>
          </div>
        </div>

        <p class="mt-6 text-center text-sm text-slate-warm">
          <a routerLink="/" class="inline-flex items-center gap-1.5 font-semibold text-forest hover:text-gold-700">
            <app-icon name="arrow" size="h-4 w-4 rtl:-scale-x-100" />
            {{ i18n.t('auth.backHome') }}
          </a>
        </p>
      </div>
    </section>
  `,
})
export class AuthSplitLayout {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly benefits = ['auth.benefit1', 'auth.benefit2', 'auth.benefit3'] as const;
  protected readonly helpWhatsapp = whatsappHref(
    'Assalamu alaikum, I need help signing in to the Nagina Social Welfare UK member area.',
  );

  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly lead = input<string>('');
}
