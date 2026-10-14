import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import type { MemberNewsletter } from '../../services/member-portal.service';
import { Icon } from '../ui/icon';
import { MemberPortalEmpty } from './member-portal-empty';
import { MemberPortalLoading } from './member-portal-loading';
import { formatPortalDate } from './member-portal.types';

/** Past newsletter issues (PDF). Needs the appeals & news email preference switched on. */
@Component({
  selector: 'app-member-newsletters-tab',
  imports: [RouterLink, Icon, MemberPortalLoading, MemberPortalEmpty],
  template: `
    <div id="member-panel-newsletters" role="tabpanel" aria-labelledby="member-tab-newsletters" class="space-y-6">
      <div>
        <p class="eyebrow">{{ i18n.t('memberHome.tabNewsletters') }}</p>
        <h2 class="mt-1 font-display text-2xl font-bold text-forest sm:text-3xl">{{ i18n.t('memberHome.newsletters.title') }}</h2>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.newsletters.lead') }}</p>
      </div>

      @if (!marketingOptIn()) {
        <div class="card flex flex-col gap-5 border-gold/30 bg-gold/5 sm:flex-row sm:items-center">
          <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold-700" aria-hidden="true">
            <app-icon name="mail" size="h-6 w-6" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-display text-lg font-bold text-forest">{{ i18n.t('memberHome.newsletters.optInTitle') }}</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.newslettersOptIn') }}</p>
          </div>
          <a routerLink="/membership/home" [queryParams]="{ tab: 'profile' }" class="btn btn-primary shrink-0">
            {{ i18n.t('memberHome.newsletters.optInCta') }}
          </a>
        </div>
      } @else if (newslettersLoading()) {
        <app-member-portal-loading [rows]="2" [offsetTop]="false" />
      } @else if (newslettersError(); as err) {
        <p class="banner-error" role="alert">{{ err }}</p>
      } @else if (!newsletters().length) {
        <app-member-portal-empty icon="newsletter" [message]="i18n.t('memberHome.newslettersEmpty')" />
      } @else {
        <ul class="grid gap-4 sm:grid-cols-2">
          @for (issue of newsletters(); track issue.id) {
            <li class="card flex flex-col !p-5">
              <div class="flex items-start gap-4">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-gold-300" aria-hidden="true">
                  <app-icon name="newsletter" size="h-6 w-6" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold uppercase tracking-[0.14em] text-gold-600">{{ date(issue.publishedAt) }}</p>
                  <h3 class="mt-1 font-display text-lg font-bold leading-snug text-forest">{{ issue.title }}</h3>
                  @if (issue.summary) {
                    <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-warm">{{ issue.summary }}</p>
                  }
                </div>
              </div>
              @if (issue.downloadUrl) {
                <a [href]="issue.downloadUrl" target="_blank" rel="noopener" class="btn btn-secondary-light btn-sm mt-5 self-start">
                  <app-icon name="download" size="h-4 w-4" />
                  {{ i18n.t('memberHome.downloadIssue') }}
                </a>
              }
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class MemberNewslettersTab {
  protected readonly i18n = inject(LanguageService);

  readonly marketingOptIn = input(false);
  readonly newsletters = input<MemberNewsletter[]>([]);
  readonly newslettersLoading = input(false);
  readonly newslettersError = input<string | null>(null);

  protected date(iso: string | null): string {
    return formatPortalDate(iso, this.i18n.lang());
  }
}
