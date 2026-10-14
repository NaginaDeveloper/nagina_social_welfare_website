import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { appealDonateQuery, appealIsGeneral, type PublicAppeal } from '../../models/appeal';
import { Icon } from '../ui/icon';
import { AppealCard } from './appeal-card';
import { MemberPortalLoading } from './member-portal-loading';

/** Live appeals for the member, their own centre's first. */
@Component({
  selector: 'app-member-appeals-tab',
  imports: [RouterLink, Icon, AppealCard, MemberPortalLoading],
  template: `
    <div id="member-panel-appeals" role="tabpanel" aria-labelledby="member-tab-appeals" class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="eyebrow">{{ i18n.t('memberHome.tabAppeals') }}</p>
          <h2 class="mt-1 font-display text-2xl font-bold text-forest sm:text-3xl">{{ i18n.t('memberHome.appeal.liveTitle') }}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.appeal.liveLead') }}</p>
        </div>
        <a routerLink="/appeals" class="btn btn-ghost-light btn-sm">
          {{ i18n.t('appeals.title') }}
          <app-icon name="external" size="h-4 w-4" />
        </a>
      </div>

      @if (loading()) {
        <app-member-portal-loading [rows]="2" [offsetTop]="false" />
      } @else if (error(); as err) {
        <div class="banner-error flex flex-wrap items-center justify-between gap-3" role="alert">
          <span>{{ err }}</span>
          <button type="button" class="btn btn-secondary-light btn-sm" (click)="retry.emit()">{{ i18n.t('appeals.retry') }}</button>
        </div>
      } @else if (!sorted().length) {
        <div class="rounded-3xl border border-dashed border-mist bg-sand/40 px-6 py-12 text-center">
          <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-600" aria-hidden="true">
            <app-icon name="megaphone" size="h-7 w-7" [strokeWidth]="1.5" />
          </span>
          <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.appeal.empty') }}</p>
          <a routerLink="/membership/home" [queryParams]="{ tab: 'donate' }" class="btn btn-primary mt-6">
            <app-icon name="heart" size="h-4 w-4" />
            {{ i18n.t('memberHome.quickDonate') }}
          </a>
        </div>
      } @else {
        <div class="grid gap-5 md:grid-cols-2">
          @for (appeal of sorted(); track appeal.id) {
            <app-appeal-card [appeal]="appeal" [donateLink]="donateLink(appeal)" />
          }
        </div>
      }
    </div>
  `,
})
export class MemberAppealsTab {
  protected readonly i18n = inject(LanguageService);

  readonly appeals = input<readonly PublicAppeal[]>([]);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  /** The member's own centre, listed before the others. */
  readonly campusId = input<string>('');

  readonly retry = output<void>();

  protected readonly sorted = computed(() => {
    const mine = this.campusId();
    const rank = (a: PublicAppeal) => (a.campusId === mine && mine ? 0 : appealIsGeneral(a) ? 1 : 2);
    return [...this.appeals()].sort((a, b) => rank(a) - rank(b));
  });

  protected donateLink(appeal: PublicAppeal) {
    return { commands: ['/membership/home'], queryParams: appealDonateQuery(appeal) };
  }
}
