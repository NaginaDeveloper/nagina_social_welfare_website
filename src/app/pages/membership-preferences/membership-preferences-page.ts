import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberPortalService, portalErrorMessage } from '../../services/member-portal.service';
import { PageShell } from '../page-shell';
import { Icon } from '../../components/ui/icon';

type PrefsState = 'loading' | 'invalid' | 'ready' | 'saved';

/**
 * Email preferences behind the tokenised link in member emails — no sign-in needed.
 * `?unsubscribe=1` (the one-click link) preselects "stop" and asks for one confirm.
 * The token is removed from the address bar as soon as it has been read.
 */
@Component({
  selector: 'app-membership-preferences-page',
  imports: [PageShell, RouterLink, Icon],
  template: `
    <app-page-shell title="Email preferences" [parent]="{ path: '/membership', labelKey: 'nav.membership' }">
      <section class="bg-cream py-12 sm:py-20">
        <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <div class="mx-auto max-w-xl">
            <div class="text-center">
              <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-gold-300 shadow-soft" aria-hidden="true">
                <app-icon name="mail" size="h-7 w-7" />
              </span>
              <p class="eyebrow mt-5">{{ i18n.t('memberPrefs.eyebrow') }}</p>
              <h1 class="mt-3 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">{{ i18n.t('memberPrefs.title') }}</h1>
            </div>

            <div class="card mt-8">
              @switch (state()) {
                @case ('loading') {
                  <div class="space-y-3" aria-busy="true">
                    <p class="sr-only" role="status">{{ i18n.t('memberPrefs.loading') }}</p>
                    <div class="h-5 w-1/2 animate-pulse rounded-lg bg-mist/70" aria-hidden="true"></div>
                    <div class="h-20 animate-pulse rounded-2xl bg-mist/60" aria-hidden="true"></div>
                  </div>
                }
                @case ('invalid') {
                  <div class="text-center">
                    <p class="font-display text-xl font-bold text-forest">{{ i18n.t('memberPrefs.invalidTitle') }}</p>
                    <p class="mt-2 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberPrefs.invalidLead') }}</p>
                    <div class="mt-6 flex flex-wrap justify-center gap-3">
                      <a routerLink="/membership/login" [queryParams]="{ returnUrl: '/membership/home?tab=profile' }" class="btn btn-primary">
                        {{ i18n.t('memberPrefs.signInInstead') }}
                      </a>
                      <a routerLink="/contact" class="btn btn-secondary-light">{{ i18n.t('nav.contact') }}</a>
                    </div>
                  </div>
                }
                @case ('ready') {
                  <p class="text-sm text-slate-warm">
                    {{ i18n.t('memberPrefs.forLabel') }}
                    <span class="font-semibold text-forest">{{ fullName() }}</span>
                    <span class="font-mono text-forest" dir="ltr"> · {{ emailMasked() }}</span>
                  </p>

                  @if (confirmStop()) {
                    <div class="mt-5 rounded-2xl border border-gold/40 bg-gold/5 p-5">
                      <p class="font-display text-lg font-bold text-forest">{{ i18n.t('memberPrefs.stopConfirmTitle') }}</p>
                      <p class="mt-1 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberPrefs.stopConfirmLead') }}</p>
                      <div class="mt-5 flex flex-wrap gap-3">
                        <button type="button" class="btn btn-primary" [disabled]="busy()" (click)="stopAll()">
                          {{ busy() ? i18n.t('memberPrefs.saving') : i18n.t('memberPrefs.stopConfirm') }}
                        </button>
                        <button type="button" class="btn btn-ghost-light" [disabled]="busy()" (click)="confirmStop.set(false)">
                          {{ i18n.t('memberPrefs.keepThem') }}
                        </button>
                      </div>
                    </div>
                  } @else {
                    <div class="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-mist bg-sand/40 p-4 sm:p-5">
                      <div class="min-w-0">
                        <p id="prefs-marketing-label" class="font-semibold text-forest">{{ i18n.t('memberHome.prefMarketing') }}</p>
                        <p id="prefs-marketing-hint" class="mt-1 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.prefMarketingHint') }}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        class="relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors disabled:opacity-60"
                        [class.bg-forest]="optIn()"
                        [class.bg-mist]="!optIn()"
                        [attr.aria-checked]="optIn()"
                        aria-labelledby="prefs-marketing-label"
                        aria-describedby="prefs-marketing-hint"
                        [disabled]="busy()"
                        (click)="toggle()"
                      >
                        <span
                          class="inline-block h-5 w-5 rounded-full bg-white shadow-soft transition-transform"
                          [class.translate-x-6]="optIn() && !i18n.isUr()"
                          [class.translate-x-1]="!optIn() && !i18n.isUr()"
                          [class.-translate-x-6]="optIn() && i18n.isUr()"
                          [class.-translate-x-1]="!optIn() && i18n.isUr()"
                        ></span>
                      </button>
                    </div>
                    @if (optIn()) {
                      <button type="button" class="btn btn-ghost-light btn-sm mt-4" [disabled]="busy()" (click)="confirmStop.set(true)">
                        {{ i18n.t('memberPrefs.stopAll') }}
                      </button>
                    }
                  }

                  @if (error(); as err) {
                    <p class="banner-error mt-5" role="alert">{{ err }}</p>
                  }
                  <p class="field-hint mt-5">{{ i18n.t('memberHome.prefServiceNote') }}</p>
                }
                @case ('saved') {
                  <div class="text-center">
                    <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald/15 text-emerald-600" aria-hidden="true">
                      <app-icon name="check" size="h-6 w-6" [strokeWidth]="2.4" />
                    </span>
                    <p class="mt-4 font-display text-xl font-bold text-forest" role="status">
                      {{ optIn() ? i18n.t('memberPrefs.savedOn') : i18n.t('memberPrefs.savedOff') }}
                    </p>
                    <p class="mt-2 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberPrefs.savedLead') }}</p>
                    <div class="mt-6 flex flex-wrap justify-center gap-3">
                      <button type="button" class="btn btn-secondary-light" (click)="state.set('ready')">{{ i18n.t('memberPrefs.change') }}</button>
                      <a routerLink="/" class="btn btn-ghost-light">{{ i18n.t('auth.backHome') }}</a>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class MembershipPreferencesPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly portal = inject(MemberPortalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly state = signal<PrefsState>('loading');
  protected readonly fullName = signal('');
  protected readonly emailMasked = signal('');
  protected readonly optIn = signal(false);
  protected readonly confirmStop = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  private token = '';

  ngOnInit(): void {
    if (!this.browser) return;
    const params = this.route.snapshot.queryParamMap;
    this.token = params.get('token')?.trim() ?? '';
    const unsubscribe = params.get('unsubscribe') === '1';
    // Keep the token out of the address bar, history and any shared screenshot.
    void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    void this.load(unsubscribe);
  }

  private async load(unsubscribe: boolean): Promise<void> {
    if (!this.token) {
      this.state.set('invalid');
      return;
    }
    try {
      const prefs = await this.portal.getPreferences(this.token);
      this.fullName.set(prefs.fullName);
      this.emailMasked.set(prefs.emailMasked);
      this.optIn.set(prefs.marketingOptIn);
      this.confirmStop.set(unsubscribe && prefs.marketingOptIn);
      this.state.set('ready');
    } catch {
      this.state.set('invalid');
    }
  }

  protected toggle(): Promise<void> {
    return this.save({ marketingOptIn: !this.optIn() });
  }

  protected stopAll(): Promise<void> {
    return this.save({ unsubscribeAll: true });
  }

  private async save(patch: { marketingOptIn?: boolean; unsubscribeAll?: boolean }): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      this.optIn.set(await this.portal.updatePreferences(this.token, patch));
      this.confirmStop.set(false);
      this.state.set('saved');
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.busy.set(false);
    }
  }
}
