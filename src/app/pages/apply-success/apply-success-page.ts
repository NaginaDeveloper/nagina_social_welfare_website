import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../page-shell';
import { LanguageService } from '../../i18n/language.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-apply-success-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell title="Application sent">
      <section class="bg-cream py-16 sm:py-24">
        <div
          class="mx-auto max-w-2xl px-5 text-center sm:px-8"
          [attr.dir]="i18n.isUr() ? 'rtl' : null"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            {{ i18n.t('applySuccess.eyebrow') }}
          </p>
          <h1 class="mt-4 font-display text-3xl font-bold text-forest sm:text-4xl">
            {{ i18n.t('applySuccess.title') }}
          </h1>
          <p class="mt-5 text-base leading-relaxed text-slate-warm sm:text-lg">
            {{ i18n.t('applySuccess.lead') }}
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              routerLink="/madrasa"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-emerald"
            >
              {{ i18n.t('applySuccess.madrasa') }}
            </a>
            <a
              routerLink="/"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-forest/15 bg-white px-6 py-3 text-sm font-semibold text-forest"
            >
              {{ i18n.t('applySuccess.home') }}
            </a>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class ApplySuccessPage {
  protected readonly i18n = inject(LanguageService);
}
