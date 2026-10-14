import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberPortalService, portalErrorMessage } from '../../services/member-portal.service';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';
import { AuthSplitLayout } from '../../components/member-portal/auth-split-layout';
import { Icon } from '../../components/ui/icon';

@Component({
  selector: 'app-membership-forgot-password-page',
  imports: [NextSteps, PageShell, FormsModule, RouterLink, AuthSplitLayout, Icon],
  template: `
    <app-page-shell title="Forgot password" [parent]="{ path: '/membership/login', labelKey: 'nav.memberLogin' }">
      <app-auth-split-layout
        [eyebrow]="i18n.t('auth.recoveryEyebrow')"
        [heading]="i18n.t('memberForgot.title')"
        [lead]="i18n.t('memberForgot.lead')"
      >
        @if (sent()) {
          <div class="banner-ok flex items-start gap-3" role="status">
            <app-icon name="mail" size="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p class="font-semibold">{{ i18n.t('auth.checkInbox') }}</p>
              <p class="mt-1 text-slate-warm">{{ message() }}</p>
            </div>
          </div>
          <button type="button" class="btn btn-ghost-light btn-sm mt-4" (click)="sent.set(false)">
            {{ i18n.t('auth.tryAnotherEmail') }}
          </button>
        } @else {
          <form class="space-y-5" (submit)="$event.preventDefault(); submit()" novalidate>
            <label class="field-label">
              {{ i18n.t('memberLogin.email') }}
              <input type="email" class="field" dir="ltr" [(ngModel)]="email" name="email" autocomplete="email" inputmode="email" required />
            </label>
            @if (error(); as err) {
              <p class="banner-error" role="alert">{{ err }}</p>
            }
            <button type="submit" [disabled]="loading()" class="btn btn-primary btn-lg w-full">
              {{ loading() ? i18n.t('memberForgot.sending') : i18n.t('memberForgot.send') }}
            </button>
          </form>
        }
        <p class="mt-8 text-sm">
          <a routerLink="/membership/login" class="inline-flex items-center gap-1.5 font-semibold text-gold-700 hover:underline">
            <app-icon name="arrow" size="h-4 w-4 rotate-180 rtl:rotate-0" />
            {{ i18n.t('memberForgot.back') }}
          </a>
        </p>
      </app-auth-split-layout>
      <app-next-steps page="/membership/login" />
    </app-page-shell>
  `,
})
export class MembershipForgotPasswordPage {
  protected readonly i18n = inject(LanguageService);
  private readonly portal = inject(MemberPortalService);

  protected email = '';
  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly message = signal('');
  protected readonly error = signal<string | null>(null);

  protected async submit(): Promise<void> {
    if (!this.email.trim()) {
      this.error.set(this.i18n.t('auth.enterEmail'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      const msg = await this.portal.requestPasswordReset(this.email);
      this.message.set(msg);
      this.sent.set(true);
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }
}
