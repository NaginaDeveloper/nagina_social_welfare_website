import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { PageShell } from '../page-shell';
import { MembershipStatusPanel } from '../../components/membership/membership-status-panel';

@Component({
  selector: 'app-membership-track-page',
  imports: [PageShell, RouterLink, MembershipStatusPanel],
  template: `
    <app-page-shell title="Track membership application">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-2xl px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            {{ i18n.t('membershipTrack.eyebrow') }}
          </p>
          <h1 class="mt-4 font-display text-3xl font-bold text-forest sm:text-4xl">
            {{ i18n.t('membershipTrack.title') }}
          </h1>
          <p class="mt-5 text-base leading-relaxed text-slate-warm sm:text-lg">
            {{ i18n.t('membershipTrack.lead') }}
          </p>
          <div class="mt-8 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft sm:px-8">
            <app-membership-status-panel [initialId]="idFromQuery" [autoLookup]="!!idFromQuery" />
          </div>
          <p class="mt-8 text-center text-sm text-slate-warm">
            {{ i18n.t('membershipTrack.applyPrompt') }}
            <a routerLink="/membership" class="font-semibold text-gold-700 hover:underline">
              {{ i18n.t('membership.title') }}
            </a>
          </p>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class MembershipTrackPage {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  protected readonly idFromQuery =
    this.route.snapshot.queryParamMap.get('id')?.trim() ?? '';
}
