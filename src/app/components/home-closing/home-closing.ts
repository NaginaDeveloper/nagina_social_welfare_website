import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { CentreContacts } from '../centre-contacts/centre-contacts';
import { Icon } from '../ui/icon';

/**
 * End of the home page: a short "Our Vision" teaser and a "Get in touch"
 * card. The full text lives on /about and the full contact form on /contact,
 * so the home page no longer repeats those pages.
 */
@Component({
  selector: 'app-home-closing',
  imports: [CentreContacts, Icon, Reveal, RouterLink],
  template: `
    <section class="relative bg-cream pb-20 pt-6 sm:pb-24" aria-label="About us and contact" data-testid="home-closing">
      <div class="site-wrap grid gap-5 md:grid-cols-2 md:gap-6" [attr.dir]="i18n.isUr() ? 'rtl' : null">
        <article class="hub-card !min-h-0 !p-6 sm:!p-8" appReveal>
          <span class="eyebrow">{{ i18n.t('about.homeEyebrow') }}</span>
          <h2 class="mt-2 font-display text-2xl font-bold text-forest sm:text-3xl">{{ i18n.t('about.homeTitle') }}</h2>
          <p class="mt-3 text-base leading-relaxed text-slate-warm">{{ i18n.t('about.homeLead') }}</p>
          <ul class="mt-5 flex flex-wrap gap-2">
            @for (key of pillars; track key) {
              <li class="rounded-full border border-gold/35 bg-white px-3.5 py-1.5 text-sm font-semibold text-forest">
                {{ i18n.t(key) }}
              </li>
            }
          </ul>
          <a routerLink="/about" class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-forest">
            {{ i18n.t('about.readMore') }}
            <app-icon name="arrow" size="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </article>

        <article class="relative overflow-hidden rounded-[1.25rem] bg-forest p-6 text-cream shadow-portal sm:p-8" [appReveal]="100">
          <div class="geo-pattern absolute inset-0 opacity-25" aria-hidden="true"></div>
          <div class="relative">
            <span class="eyebrow-on-dark">{{ i18n.t('contact.title') }}</span>
            <h2 class="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{{ i18n.pick('Get in Touch', 'رابطہ کریں') }}</h2>
            <p class="mt-3 text-base leading-relaxed text-cream/80">
              {{ i18n.pick('Message either centre on WhatsApp or give us a call. We are happy to help.', 'کسی بھی مرکز کو واٹس ایپ کریں یا کال کریں۔ ہمیں مدد کر کے خوشی ہوگی۔') }}
            </p>
            <app-centre-contacts class="mt-5 block [&_[data-testid=centre-contacts-compact]]:justify-start" tone="dark" compact />
          </div>
        </article>
      </div>
    </section>
  `,
})
export class HomeClosing {
  protected readonly i18n = inject(LanguageService);
  protected readonly pillars = ['about.pillar1Title', 'about.pillar2Title', 'about.pillar3Title'] as const;
}
