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
  selector: 'app-membership-set-password-page',
  imports: [NextSteps, PageShell, FormsModule, RouterLink, AuthSplitLayout, PasswordField],
  template: `
    <app-page-shell title="Set password" [parent]="{ path: '/membership/login', labelKey: 'nav.memberLogin' }">
      <app-auth-split-layout
        [eyebrow]="i18n.t('auth.welcomeEyebrow')"
        [heading]="i18n.t('memberSetPassword.title')"
        [lead]="i18n.t('memberSetPassword.lead')"
      >
        @if (!token()) {
          <div class="banner-error" role="alert">{{ i18n.t('memberSetPassword.missingToken') }}</div>
          <a routerLink="/membership/forgot-password" class="btn btn-secondary-light mt-6">{{ i18n.t('auth.requestNewLink') }}</a>
        } @else {
          <form class="space-y-5" (submit)="$event.preventDefault(); submit()" novalidate>
            <app-password-field
              [label]="i18n.t('memberSetPassword.password')"
              [(value)]="password"
              name="password"
              autocomplete="new-password"
              [minlength]="8"
              [hint]="i18n.t('auth.passwordRule')"
            />
            <app-password-field
              [label]="i18n.t('memberSetPassword.confirm')"
              [(value)]="confirm"
              name="confirm"
              autocomplete="new-password"
            />
            @if (error(); as err) {
              <p class="banner-error" role="alert">{{ err }}</p>
            }
            <button type="submit" [disabled]="loading()" class="btn btn-primary btn-lg w-full">
              {{ loading() ? i18n.t('memberSetPassword.saving') : i18n.t('memberSetPassword.save') }}
            </button>
          </form>
        }
      </app-auth-split-layout>
      <app-next-steps page="/membership/login" />
    </app-page-shell>
  `,
})
export class MembershipSetPasswordPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(MemberAuthService);
  private readonly router = inject(Router);

  protected password = '';
  protected confirm = '';
  protected readonly token = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  private returnUrl: string | null = null;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.token.set(params.get('token')?.trim() ?? '');
    this.returnUrl = safeReturnUrl(params.get('returnUrl'));
  }

  protected async submit(): Promise<void> {
    if (this.password.length < 8) {
      this.error.set(this.i18n.t('memberSetPassword.tooShort'));
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set(this.i18n.t('memberSetPassword.mismatch'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.auth.setPassword(this.token(), this.password);
      await this.router.navigateByUrl(this.returnUrl ?? '/membership/home', { replaceUrl: true });
    } catch (err) {
      this.error.set(this.auth.error() ?? (err instanceof Error ? err.message : null));
    } finally {
      this.loading.set(false);
    }
  }
}
