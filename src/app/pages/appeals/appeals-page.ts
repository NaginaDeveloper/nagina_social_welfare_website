import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { AppealsService } from '../../services/appeals.service';
import { CampusService } from '../../services/campus.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { appealDonateQuery, appealIsGeneral, appealIsOpen, type PublicAppeal } from '../../models/appeal';
import { campusTown } from '../../models/campus';
import { loginUrlFor } from '../../utils/safe-return-url';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';
import { AppealCard } from '../../components/member-portal/appeal-card';
import { MemberPortalEmpty } from '../../components/member-portal/member-portal-empty';
import { Icon } from '../../components/ui/icon';

type CentreFilter = 'all' | 'general' | string;

/**
 * Public list of live fundraising appeals. Prerendered for search with the hero and the
 * "how giving works" panel; the appeals themselves load in the browser (they change daily).
 */
@Component({
  selector: 'app-appeals-page',
  imports: [PageShell, NextSteps, RouterLink, AppealCard, MemberPortalEmpty, Icon],
  template: `
    <app-page-shell title="Appeals">
      <!-- Hero -->
      <section class="relative isolate overflow-hidden bg-gradient-to-br from-forest via-emerald to-forest-800 py-14 text-cream sm:py-20">
        <div class="geo-pattern-dense absolute inset-0 -z-10 opacity-60" aria-hidden="true"></div>
        <div class="absolute -top-32 -end-24 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" aria-hidden="true"></div>
        <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <p class="eyebrow-on-dark">{{ i18n.t('appeals.eyebrow') }}</p>
          <h1 class="page-title-on-dark mt-4 max-w-3xl">{{ i18n.t('appeals.title') }}</h1>
          <p class="page-lead-on-dark">{{ i18n.t('appeals.lead') }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#live-appeals" class="btn btn-primary btn-lg">
              <app-icon name="heart" size="h-5 w-5" />
              {{ i18n.t('appeals.seeLive') }}
            </a>
            <a routerLink="/donate" class="btn btn-secondary btn-lg">{{ i18n.t('appeals.generalGift') }}</a>
          </div>
        </div>
      </section>

      <section id="live-appeals" class="scroll-mt-28 bg-cream py-12 sm:py-16">
        <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="eyebrow">{{ i18n.t('appeals.liveEyebrow') }}</p>
              <h2 class="mt-2 font-display text-2xl font-bold text-forest sm:text-3xl">{{ i18n.t('appeals.liveTitle') }}</h2>
            </div>
            @if (centreOptions().length > 2) {
              <div class="flex flex-wrap gap-2" role="group" [attr.aria-label]="i18n.t('appeals.filterLabel')">
                @for (opt of centreOptions(); track opt.id) {
                  <button
                    type="button"
                    class="btn btn-sm"
                    [class.btn-primary]="filter() === opt.id"
                    [class.btn-secondary-light]="filter() !== opt.id"
                    [attr.aria-pressed]="filter() === opt.id"
                    (click)="filter.set(opt.id)"
                  >
                    {{ opt.label }}
                  </button>
                }
              </div>
            }
          </div>

          <div class="mt-8">
            @if (loading()) {
              <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
                @for (i of [0, 1, 2]; track i) {
                  <div class="h-96 animate-pulse rounded-3xl bg-mist/60"></div>
                }
              </div>
              <p class="sr-only" role="status">{{ i18n.t('appeals.loading') }}</p>
            } @else if (error()) {
              <div class="banner-error flex flex-wrap items-center justify-between gap-3" role="alert">
                <span>{{ i18n.t('appeals.loadError') }}</span>
                <button type="button" class="btn btn-secondary-light btn-sm" (click)="load()">{{ i18n.t('appeals.retry') }}</button>
              </div>
            } @else if (!visible().length) {
              <app-member-portal-empty icon="megaphone" [title]="i18n.t('appeals.emptyTitle')" [message]="i18n.t('appeals.empty')">
                <a routerLink="/donate" class="btn btn-primary">{{ i18n.t('appeals.generalGift') }}</a>
              </app-member-portal-empty>
            } @else {
              <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                @for (appeal of visible(); track appeal.id) {
                  <app-appeal-card [appeal]="appeal" [donateLink]="memberDonateLink(appeal)" [donateLabel]="i18n.t('appeals.donateMember')" />
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- How giving works -->
      <section class="bg-white py-12 sm:py-16">
        <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <div class="grid gap-6 md:grid-cols-3">
            @for (step of howSteps; track step.title; let i = $index) {
              <div class="card">
                <span class="section-number">{{ i + 1 }}</span>
                <h3 class="mt-4 font-display text-lg font-bold text-forest">{{ i18n.t(step.title) }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-warm">{{ i18n.t(step.text) }}</p>
              </div>
            }
          </div>
          <p class="mt-8 text-center text-sm text-slate-warm">
            {{ i18n.t('appeals.notMember') }}
            <a routerLink="/membership" class="font-semibold text-gold-700 hover:underline">{{ i18n.t('appeals.joinLink') }}</a>
          </p>
        </div>
      </section>
      <app-next-steps page="/appeals" />
    </app-page-shell>
  `,
})
export class AppealsPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly appealsApi = inject(AppealsService);
  private readonly campuses = inject(CampusService);
  private readonly auth = inject(MemberAuthService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly appeals = signal<PublicAppeal[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly filter = signal<CentreFilter>('all');

  protected readonly howSteps = [
    { title: 'appeals.how1Title', text: 'appeals.how1Text' },
    { title: 'appeals.how2Title', text: 'appeals.how2Text' },
    { title: 'appeals.how3Title', text: 'appeals.how3Text' },
  ] as const;

  protected readonly centreOptions = computed(() => {
    const ids = new Set(this.appeals().filter((a) => !appealIsGeneral(a)).map((a) => a.campusId));
    const options: { id: CentreFilter; label: string }[] = [{ id: 'all', label: this.i18n.t('appeals.filterAll') }];
    if (this.appeals().some((a) => appealIsGeneral(a))) {
      options.push({ id: 'general', label: this.i18n.t('memberHome.appeal.general') });
    }
    for (const id of ids) {
      const campus = this.campuses.byId(id);
      const fallback = this.appeals().find((a) => a.campusId === id)?.campusName || id;
      options.push({ id, label: campus ? campusTown(campus) : fallback });
    }
    return options;
  });

  protected readonly visible = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.appeals();
    if (f === 'general') return this.appeals().filter((a) => appealIsGeneral(a));
    return this.appeals().filter((a) => a.campusId === f);
  });

  ngOnInit(): void {
    if (!this.browser) return;
    void this.campuses.load();
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const all = await this.appealsApi.list();
      this.appeals.set(all.filter((a) => appealIsOpen(a)));
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  /** Signed-in members go straight to the donate tab; everyone else signs in first. */
  protected memberDonateLink(appeal: PublicAppeal) {
    const query = appealDonateQuery(appeal);
    if (this.auth.member()) return { commands: ['/membership/home'], queryParams: query };
    const target = `/membership/home?${new URLSearchParams(query as Record<string, string>).toString()}`;
    const login = loginUrlFor(target);
    return { commands: [login.path], queryParams: login.queryParams };
  }
}
