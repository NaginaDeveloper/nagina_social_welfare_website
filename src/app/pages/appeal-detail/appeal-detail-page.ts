import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LanguageService } from '../../i18n/language.service';
import { AppealsService } from '../../services/appeals.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { SeoService } from '../../seo/seo.service';
import { APPEAL_DETAIL_SEO } from '../../seo/seo.config';
import {
  appealDaysLeft,
  appealDonateQuery,
  appealGuestDonateQuery,
  appealIsGeneral,
  appealIsOpen,
  formatGbp,
  type PublicAppeal,
} from '../../models/appeal';
import { eventDescriptionHtml, eventHtmlToPlain } from '../../utils/event-html';
import { loginUrlFor } from '../../utils/safe-return-url';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';
import { Icon } from '../../components/ui/icon';
import { formatPortalDate } from '../../components/member-portal/member-portal.types';

/**
 * One appeal: story, progress and the two ways to give. Client-rendered (appeals are
 * created in the admin app at any time); title, description and image are set at runtime,
 * and a missing or draft appeal is marked noindex.
 */
@Component({
  selector: 'app-appeal-detail-page',
  imports: [PageShell, NextSteps, RouterLink, Icon],
  template: `
    <app-page-shell [title]="crumb()" [parent]="{ path: '/appeals', labelKey: 'nav.appeals' }">
      @if (state() === 'loading') {
        <section class="bg-cream py-12 sm:py-16" aria-busy="true">
          <div class="site-wrap">
            <p class="sr-only" role="status">{{ i18n.t('appeals.loading') }}</p>
            <div class="grid gap-8 lg:grid-cols-[1fr_22rem]" aria-hidden="true">
              <div class="space-y-4">
                <div class="aspect-[16/9] animate-pulse rounded-3xl bg-mist/60"></div>
                <div class="h-8 w-2/3 animate-pulse rounded-xl bg-mist/60"></div>
                <div class="h-24 animate-pulse rounded-xl bg-mist/60"></div>
              </div>
              <div class="h-80 animate-pulse rounded-3xl bg-mist/60"></div>
            </div>
          </div>
        </section>
      } @else if (appeal(); as a) {
        <section class="bg-cream py-10 sm:py-14">
          <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
            <div class="grid items-start gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
              <!-- Story -->
              <article class="min-w-0">
                <div class="relative overflow-hidden rounded-3xl bg-sand shadow-soft">
                  @if (a.coverImageUrl; as cover) {
                    <img [src]="cover" alt="" class="aspect-[16/9] w-full object-cover" decoding="async" />
                  } @else {
                    <div class="relative aspect-[16/9] bg-gradient-to-br from-forest via-emerald to-forest-800">
                      <div class="geo-pattern-dense absolute inset-0 opacity-60" aria-hidden="true"></div>
                      <div class="absolute inset-0 flex items-center justify-center text-gold-300" aria-hidden="true">
                        <app-icon name="megaphone" size="h-16 w-16" [strokeWidth]="1.3" />
                      </div>
                    </div>
                  }
                </div>

                <div class="mt-6 flex flex-wrap items-center gap-2">
                  <span class="pill bg-forest/5 text-forest">
                    <app-icon name="pin" size="h-3.5 w-3.5 text-gold-600" />
                    {{ centre() }}
                  </span>
                  <span class="pill bg-gold/15 text-gold-700">{{ i18n.t('donate.' + a.fund) }}</span>
                  @if (!open()) {
                    <span class="pill bg-slate-warm/10 text-slate-warm">{{ i18n.t('appeals.closedPill') }}</span>
                  }
                </div>
                <h1 class="page-title mt-4">{{ title() }}</h1>
                @if (summary()) {
                  <p class="page-lead">{{ summary() }}</p>
                }

                @if (storyHtml()) {
                  <div class="event-rich-text mt-8 max-w-3xl text-base leading-relaxed text-forest/90" [innerHTML]="storyHtml()"></div>
                }

                <p class="mt-10 text-xs text-slate-warm">
                  {{ i18n.t('appeals.giftAidNote') }}
                </p>
              </article>

              <!-- Progress + give -->
              <aside class="lg:sticky lg:top-28">
                <div class="card">
                  <p class="font-display text-3xl font-bold leading-none text-forest" dir="ltr">{{ raised() }}</p>
                  <p class="mt-1 text-sm text-slate-warm">
                    {{ i18n.t('memberHome.appeal.raised') }} · {{ i18n.t('memberHome.appeal.of') }}
                    <span class="font-semibold text-forest" dir="ltr">{{ target() }}</span>
                  </p>
                  <div
                    class="progress-track mt-4 h-2.5"
                    role="progressbar"
                    [attr.aria-valuenow]="a.progressPct"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    [attr.aria-label]="i18n.t('appeals.progressAria')"
                  >
                    <span class="progress-fill" [style.width.%]="a.progressPct"></span>
                  </div>
                  <dl class="mt-5 grid grid-cols-3 gap-3 border-t border-mist pt-5 text-center">
                    <div class="flex flex-col-reverse">
                      <dt class="mt-0.5 text-xs text-slate-warm">{{ i18n.t('appeals.funded') }}</dt>
                      <dd class="font-display text-xl font-bold text-forest" dir="ltr">{{ a.progressPct }}%</dd>
                    </div>
                    <div class="flex flex-col-reverse">
                      <dt class="mt-0.5 text-xs text-slate-warm">{{ i18n.t('memberHome.appeal.donors') }}</dt>
                      <dd class="font-display text-xl font-bold text-forest" dir="ltr">{{ a.donorCount }}</dd>
                    </div>
                    <div class="flex flex-col-reverse">
                      <dt class="mt-0.5 text-xs text-slate-warm">{{ i18n.t('memberHome.appeal.daysLeft') }}</dt>
                      <dd class="font-display text-xl font-bold text-forest" dir="ltr">{{ daysLeft() ?? '∞' }}</dd>
                    </div>
                  </dl>
                  @if (a.deadline) {
                    <p class="mt-4 flex items-center gap-1.5 text-xs text-slate-warm">
                      <app-icon name="clock" size="h-3.5 w-3.5" />
                      {{ i18n.t('appeals.closes') }} {{ deadline() }}
                    </p>
                  }

                  @if (open()) {
                    <div class="mt-6 space-y-3">
                      <a [routerLink]="memberLink().commands" [queryParams]="memberLink().queryParams" class="btn btn-primary btn-lg w-full">
                        <app-icon name="heart" size="h-5 w-5" />
                        {{ i18n.t('appeals.donateMember') }}
                      </a>
                      <a routerLink="/donate" [queryParams]="guestQuery()" class="btn btn-secondary-light btn-lg w-full">
                        {{ i18n.t('appeals.donateGuest') }}
                      </a>
                    </div>
                    <p class="mt-4 text-xs leading-relaxed text-slate-warm">{{ i18n.t('appeals.memberVsGuest') }}</p>
                  } @else {
                    <p class="banner-info mt-6">{{ i18n.t('appeals.closedLead') }}</p>
                    <a routerLink="/appeals" class="btn btn-primary mt-4 w-full">{{ i18n.t('appeals.seeLive') }}</a>
                  }
                </div>
                <a routerLink="/appeals" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-gold-700">
                  <app-icon name="arrow" size="h-4 w-4 rotate-180 rtl:rotate-0" />
                  {{ i18n.t('appeals.allAppeals') }}
                </a>
              </aside>
            </div>
          </div>
        </section>
      } @else {
        <section class="bg-cream py-16 sm:py-24">
          <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
            <div class="card mx-auto max-w-lg text-center">
              <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-600" aria-hidden="true">
                <app-icon name="megaphone" size="h-7 w-7" [strokeWidth]="1.5" />
              </span>
              <h1 class="mt-4 font-display text-2xl font-bold text-forest">{{ i18n.t('appeals.notFoundTitle') }}</h1>
              <p class="mt-2 text-sm leading-relaxed text-slate-warm">{{ i18n.t('appeals.notFoundLead') }}</p>
              <div class="mt-6 flex flex-wrap justify-center gap-3">
                <a routerLink="/appeals" class="btn btn-primary">{{ i18n.t('appeals.allAppeals') }}</a>
                <a routerLink="/donate" class="btn btn-secondary-light">{{ i18n.t('appeals.generalGift') }}</a>
              </div>
            </div>
          </div>
        </section>
      }
      <app-next-steps page="/appeals" />
    </app-page-shell>
  `,
})
export class AppealDetailPage {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly appealsApi = inject(AppealsService);
  private readonly auth = inject(MemberAuthService);
  private readonly seo = inject(SeoService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => (p.get('id') ?? '').trim())), {
    initialValue: '',
  });

  protected readonly appeal = signal<PublicAppeal | null>(null);
  protected readonly state = signal<'loading' | 'ready' | 'missing'>('loading');

  protected readonly title = computed(() => {
    const a = this.appeal();
    return a ? this.i18n.pick(a.title, a.titleUr || a.title) : '';
  });
  protected readonly summary = computed(() => {
    const a = this.appeal();
    return a ? this.i18n.pick(a.summary, a.summaryUr || a.summary) : '';
  });
  protected readonly crumb = computed(() => this.title() || this.i18n.t('appeals.crumb'));
  protected readonly storyHtml = computed(() => eventDescriptionHtml(this.appeal()?.storyHtml));
  protected readonly raised = computed(() => formatGbp(this.appeal()?.raisedTotal ?? 0));
  protected readonly target = computed(() => formatGbp(this.appeal()?.targetAmount ?? 0));
  protected readonly daysLeft = computed(() => {
    const a = this.appeal();
    return a ? appealDaysLeft(a) : null;
  });
  protected readonly deadline = computed(() => formatPortalDate(this.appeal()?.deadline, this.i18n.lang()));
  protected readonly open = computed(() => {
    const a = this.appeal();
    return !!a && appealIsOpen(a);
  });
  protected readonly centre = computed(() => {
    const a = this.appeal();
    if (!a) return '';
    return appealIsGeneral(a) ? this.i18n.t('memberHome.appeal.general') : a.campusName || a.campusId;
  });
  protected readonly guestQuery = computed(() => {
    const a = this.appeal();
    return a ? appealGuestDonateQuery(a) : {};
  });

  /** Members go straight to the donate tab; everyone else signs in first and comes back. */
  protected readonly memberLink = computed(() => {
    const a = this.appeal();
    const query = a ? appealDonateQuery(a) : { tab: 'donate' };
    if (this.auth.member()) return { commands: ['/membership/home'], queryParams: query as Record<string, string> };
    const login = loginUrlFor(`/membership/home?${new URLSearchParams(query as Record<string, string>).toString()}`);
    return { commands: [login.path], queryParams: login.queryParams };
  });

  constructor() {
    effect(() => {
      const id = this.id();
      if (!this.browser) return;
      untracked(() => void this.load(id));
    });
    // Runtime meta: re-applied when the language changes too.
    effect(() => {
      const a = this.appeal();
      const state = this.state();
      this.i18n.lang();
      untracked(() => this.applySeo(a, state));
    });
  }

  private async load(id: string): Promise<void> {
    this.state.set('loading');
    this.appeal.set(null);
    const appeal = id ? await this.appealsApi.get(id) : null;
    if (id !== this.id()) return;
    this.appeal.set(appeal);
    this.state.set(appeal ? 'ready' : 'missing');
  }

  private applySeo(a: PublicAppeal | null, state: 'loading' | 'ready' | 'missing'): void {
    if (state === 'loading') return;
    if (!a) {
      this.seo.apply({ ...APPEAL_DETAIL_SEO, robots: 'noindex, follow' });
      return;
    }
    const summary = a.summary || eventHtmlToPlain(a.storyHtml).slice(0, 155);
    this.seo.apply({
      ...APPEAL_DETAIL_SEO,
      title: `${a.title} | Appeal | Nagina Social Welfare UK`,
      description: summary || APPEAL_DETAIL_SEO.description,
      path: `/appeals/${encodeURIComponent(a.id)}/`,
      breadcrumb: a.title,
      ...(a.coverImageUrl ? { image: a.coverImageUrl } : {}),
      robots: a.status === 'live' ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    });
  }
}
