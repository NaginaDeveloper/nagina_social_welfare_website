import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberPortalService, portalErrorMessage } from '../../services/member-portal.service';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';
import { AuthSplitLayout } from '../../components/member-portal/auth-split-layout';
import { Icon } from '../../components/ui/icon';
import { PasswordField } from '../../components/ui/password-field';

@Component({
  selector: 'app-membership-reset-password-page',
  imports: [NextSteps, PageShell, RouterLink, AuthSplitLayout, Icon, PasswordField],
  template: `
    <app-page-shell [title]="i18n.t('crumb.resetPassword')" [parent]="{ path: '/membership/login', labelKey: 'nav.memberLogin' }">
      <app-auth-split-layout
        [eyebrow]="i18n.t('auth.recoveryEyebrow')"
        [heading]="i18n.t('memberReset.title')"
        [lead]="i18n.t('memberReset.lead')"
      >
        @if (done()) {
          <div class="banner-ok flex items-start gap-3" role="status">
            <app-icon name="check" size="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" [strokeWidth]="2.4" />
            <p>{{ i18n.t('memberReset.done') }}</p>
          </div>
          <a routerLink="/membership/login" class="btn btn-primary btn-lg mt-6 w-full">{{ i18n.t('memberLogin.signIn') }}</a>
        } @else if (!token) {
          <div class="banner-error" role="alert">{{ i18n.t('memberReset.invalidLink') }}</div>
          <a routerLink="/membership/forgot-password" class="btn btn-secondary-light mt-6">{{ i18n.t('auth.requestNewLink') }}</a>
        } @else {
          <form class="space-y-5" (submit)="$event.preventDefault(); submit()" novalidate>
            <app-password-field
              [label]="i18n.t('memberReset.password')"
              [(value)]="password"
              name="password"
              autocomplete="new-password"
              [minlength]="8"
              [hint]="i18n.t('auth.passwordRule')"
            />
            <app-password-field
              [label]="i18n.t('memberReset.confirm')"
              [(value)]="confirm"
              name="confirm"
              autocomplete="new-password"
            />
            @if (error(); as err) {
              <p class="banner-error" role="alert">{{ err }}</p>
            }
            <button type="submit" [disabled]="loading()" class="btn btn-primary btn-lg w-full">
              {{ loading() ? i18n.t('memberReset.saving') : i18n.t('memberReset.save') }}
            </button>
          </form>
        }
      </app-auth-split-layout>
      <app-next-steps page="/membership/login" />
    </app-page-shell>
  `,
})
export class MembershipResetPasswordPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly portal = inject(MemberPortalService);
  private readonly route = inject(ActivatedRoute);

  protected token = '';
  protected password = '';
  protected confirm = '';
  protected readonly loading = signal(false);
  protected readonly done = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
  }

  protected async submit(): Promise<void> {
    if (this.password.length < 8) {
      this.error.set(this.i18n.t('memberReset.tooShort'));
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set(this.i18n.t('memberReset.mismatch'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.portal.resetPassword(this.token, this.password);
      this.done.set(true);
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
