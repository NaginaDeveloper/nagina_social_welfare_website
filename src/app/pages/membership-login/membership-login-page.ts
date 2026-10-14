import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { safeReturnUrl } from '../../utils/safe-return-url';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';
import { AuthSplitLayout } from '../../components/member-portal/auth-split-layout';
import { PasswordField } from '../../components/ui/password-field';

@Component({
  selector: 'app-membership-login-page',
  imports: [NextSteps, PageShell, FormsModule, RouterLink, AuthSplitLayout, PasswordField],
  template: `
    <app-page-shell [title]="i18n.t('crumb.memberSignIn')" [parent]="{ path: '/membership', labelKey: 'nav.membershipHub' }">
      <app-auth-split-layout
        [eyebrow]="i18n.t('auth.signInEyebrow')"
        [heading]="i18n.t('memberLogin.title')"
        [lead]="i18n.t('memberLogin.lead')"
      >
        @if (returnUrl()) {
          <p class="banner-info mb-6" role="status">{{ i18n.t('auth.continueNotice') }}</p>
        }
        <form class="space-y-5" (submit)="$event.preventDefault(); submit()" novalidate>
          <label class="field-label">
            {{ i18n.t('memberLogin.email') }}
            <input
              type="email"
              class="field"
              dir="ltr"
              [(ngModel)]="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              required
            />
          </label>
          <div>
            <app-password-field [label]="i18n.t('memberLogin.password')" [(value)]="password" autocomplete="current-password" />
            <p class="mt-2 text-end text-sm">
              <a routerLink="/membership/forgot-password" class="font-semibold text-gold-700 hover:underline">
                {{ i18n.t('memberLogin.forgot') }}
              </a>
            </p>
          </div>
          @if (error(); as err) {
            <p class="banner-error" role="alert">{{ err }}</p>
          }
          <button type="submit" [disabled]="loading()" class="btn btn-primary btn-lg w-full">
            {{ loading() ? i18n.t('memberLogin.signingIn') : i18n.t('memberLogin.signIn') }}
          </button>
        </form>

        <div class="mt-8 rounded-2xl border border-mist bg-sand/40 px-4 py-4 text-sm leading-relaxed text-slate-warm">
          <p class="font-semibold text-forest">{{ i18n.t('auth.notMember') }}</p>
          <p class="mt-1">{{ i18n.t('auth.notMemberLead') }}</p>
          <a routerLink="/membership" class="mt-2 inline-flex font-semibold text-gold-700 hover:underline">
            {{ i18n.t('memberLogin.apply') }}
          </a>
        </div>
      </app-auth-split-layout>
      <app-next-steps page="/membership/login" />
    </app-page-shell>
  `,
})
export class MembershipLoginPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly auth = inject(MemberAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Sanitised `?returnUrl=` (member area only), or null. */
  protected readonly returnUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.returnUrl.set(safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl')));
    void this.auth.restoreSession(true).then(() => {
      if (this.auth.member()) void this.goOn();
    });
  }

  protected async submit(): Promise<void> {
    if (!this.email.trim() || !this.password) {
      this.error.set(this.i18n.t('auth.fillBoth'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.auth.login(this.email, this.password);
      await this.goOn();
    } catch (err) {
      this.error.set(this.auth.error() ?? (err instanceof Error ? err.message : null));
    } finally {
      this.loading.set(false);
    }
  }

  private goOn(): Promise<boolean> {
    return this.router.navigateByUrl(this.returnUrl() ?? '/membership/home', { replaceUrl: true });
  }
}
