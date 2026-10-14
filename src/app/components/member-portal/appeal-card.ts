import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Params } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { appealDaysLeft, appealIsGeneral, formatGbp, type PublicAppeal } from '../../models/appeal';
import { Icon } from '../ui/icon';
import { formatPortalDate } from './member-portal.types';

/**
 * One appeal: cover, title, summary, progress bar and the raised / target / donors / days-left
 * strip. The title links to the public appeal page; `donateLink` (a route + query) adds a
 * primary "Donate" action — the member tab points it at the donate tab, the public page at itself.
 */
@Component({
  selector: 'app-appeal-card',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <article class="flex h-full flex-col overflow-hidden rounded-3xl border border-mist bg-white shadow-soft transition-shadow hover:shadow-portal">
      <a [routerLink]="detailLink()" class="group relative block aspect-[16/9] overflow-hidden bg-sand" [attr.aria-label]="title()">
        @if (appeal().coverImageUrl; as cover) {
          <img
            [src]="cover"
            alt=""
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        } @else {
          <div class="geo-pattern absolute inset-0 bg-gradient-to-br from-forest via-emerald to-forest-800 opacity-100" aria-hidden="true"></div>
          <div class="absolute inset-0 flex items-center justify-center text-gold-300" aria-hidden="true">
            <app-icon name="megaphone" size="h-12 w-12" [strokeWidth]="1.4" />
          </div>
        }
        <span class="pill absolute top-3 start-3 bg-white/95 text-forest shadow-soft">
          <app-icon name="pin" size="h-3.5 w-3.5" />
          {{ centreLabel() }}
        </span>
        @if (daysLeft() !== null) {
          <span class="pill absolute top-3 end-3 bg-forest/90 text-gold-300 shadow-soft">
            <app-icon name="clock" size="h-3.5 w-3.5" />
            {{ daysLeftLabel() }}
          </span>
        }
      </a>

      <div class="flex flex-1 flex-col p-5 sm:p-6">
        <h3 class="font-display text-xl font-bold leading-snug text-forest">
          <a [routerLink]="detailLink()" class="hover:text-gold-700">{{ title() }}</a>
        </h3>
        @if (!compact()) {
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-warm">{{ summary() }}</p>
        }

        <div class="mt-5">
          <div class="flex items-end justify-between gap-3">
            <p class="text-sm text-slate-warm">
              <span class="font-display text-2xl font-bold leading-none text-forest" dir="ltr">{{ raised() }}</span>
              <span class="ms-1">{{ i18n.t('memberHome.appeal.raised') }}</span>
            </p>
            <p class="text-xs font-semibold text-slate-warm" dir="ltr">{{ appeal().progressPct }}%</p>
          </div>
          <div
            class="progress-track mt-2"
            role="progressbar"
            [attr.aria-valuenow]="appeal().progressPct"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-label]="i18n.t('appeals.progressAria')"
          >
            <span class="progress-fill" [style.width.%]="appeal().progressPct"></span>
          </div>
          <p class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-warm">
            <span>{{ i18n.t('memberHome.appeal.of') }} <span class="font-semibold text-forest" dir="ltr">{{ target() }}</span> {{ i18n.t('memberHome.appeal.target') }}</span>
            <span aria-hidden="true">·</span>
            <span><span class="font-semibold text-forest" dir="ltr">{{ appeal().donorCount }}</span> {{ donorsLabel() }}</span>
          </p>
        </div>

        <div class="mt-5 flex flex-wrap gap-2 pt-1">
          @if (donateLink(); as donate) {
            <a [routerLink]="donate.commands" [queryParams]="donate.queryParams" class="btn btn-primary btn-sm">
              <app-icon name="heart" size="h-4 w-4" />
              {{ donateLabel() || i18n.t('memberHome.appeal.donate') }}
            </a>
          }
          <a [routerLink]="detailLink()" class="btn btn-ghost-light btn-sm">
            {{ i18n.t('memberHome.appeal.readMore') }}
            <app-icon name="arrow" size="h-4 w-4 rtl:-scale-x-100" />
          </a>
        </div>
      </div>
    </article>
  `,
})
export class AppealCard {
  protected readonly i18n = inject(LanguageService);

  readonly appeal = input.required<PublicAppeal>();
  /** Route for the primary donate action; omit to hide the button. */
  readonly donateLink = input<{ commands: unknown[]; queryParams: Params } | null>(null);
  readonly donateLabel = input<string>('');
  /** Hide the summary (overview tiles). */
  readonly compact = input(false);

  protected readonly detailLink = computed(() => ['/appeals', this.appeal().id]);
  protected readonly title = computed(() => this.i18n.pick(this.appeal().title, this.appeal().titleUr || this.appeal().title));
  protected readonly summary = computed(() =>
    this.i18n.pick(this.appeal().summary, this.appeal().summaryUr || this.appeal().summary),
  );
  protected readonly raised = computed(() => formatGbp(this.appeal().raisedTotal));
  protected readonly target = computed(() => formatGbp(this.appeal().targetAmount));
  protected readonly daysLeft = computed(() => appealDaysLeft(this.appeal()));
  protected readonly centreLabel = computed(() =>
    appealIsGeneral(this.appeal()) ? this.i18n.t('memberHome.appeal.general') : this.appeal().campusName || this.appeal().campusId,
  );

  protected daysLeftLabel(): string {
    const days = this.daysLeft();
    if (days === null) return '';
    if (days === 0) return this.i18n.t('memberHome.appeal.closesToday');
    return `${days} ${this.i18n.t(days === 1 ? 'memberHome.appeal.dayLeft' : 'memberHome.appeal.daysLeft')}`;
  }

  protected donorsLabel(): string {
    return this.i18n.t(this.appeal().donorCount === 1 ? 'memberHome.appeal.donor' : 'memberHome.appeal.donors');
  }

  protected deadline(): string {
    return formatPortalDate(this.appeal().deadline, this.i18n.lang());
  }
}
