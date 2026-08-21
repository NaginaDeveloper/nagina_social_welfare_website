import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { PageShell } from '../page-shell';
import { ApplicationStatusPanel } from '../../components/apply/application-status-panel';

@Component({
  selector: 'app-apply-track-page',
  imports: [PageShell, RouterLink, ApplicationStatusPanel],
  template: `
    <app-page-shell title="Track application">
      <section class="bg-cream py-16 sm:py-24">
        <div
          class="mx-auto max-w-2xl px-5 sm:px-8"
          [attr.dir]="i18n.isUr() ? 'rtl' : null"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            {{ i18n.t('applyTrack.eyebrow') }}
          </p>
          <h1 class="mt-4 font-display text-3xl font-bold text-forest sm:text-4xl">
            {{ i18n.t('applyTrack.title') }}
          </h1>
          <p class="mt-5 text-base leading-relaxed text-slate-warm sm:text-lg">
            {{ i18n.t('applyTrack.lead') }}
          </p>

          <div class="mt-8 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft sm:px-8">
            <app-application-status-panel [initialId]="idFromQuery" [autoLookup]="!!idFromQuery" />
          </div>

          <p class="mt-8 text-center text-sm text-slate-warm">
            {{ i18n.t('applyTrack.applyPrompt') }}
            <a routerLink="/apply" class="font-semibold text-gold-700 hover:underline">
              {{ i18n.t('apply.title') }}
            </a>
          </p>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class ApplyTrackPage {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  protected readonly idFromQuery =
    this.route.snapshot.queryParamMap.get('id')?.trim() ?? '';
}
