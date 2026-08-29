import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberPortalService, portalErrorMessage } from '../../services/member-portal.service';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-membership-forgot-password-page',
  imports: [PageShell, FormsModule, RouterLink],
  template: `
    <app-page-shell title="Forgot password">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-md px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <h1 class="font-display text-3xl font-bold text-forest">{{ i18n.t('memberForgot.title') }}</h1>
          <p class="mt-4 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberForgot.lead') }}</p>
          @if (sent()) {
            <p class="mt-6 rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-forest">{{ message() }}</p>
          } @else {
            <form class="mt-8 space-y-4 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft" (submit)="$event.preventDefault(); submit()">
              <label class="block text-sm font-medium text-forest">
                {{ i18n.t('memberLogin.email') }}
                <input type="email" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="email" name="email" autocomplete="email" />
              </label>
              @if (error()) {
                <p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ error() }}</p>
              }
              <button type="submit" [disabled]="loading()" class="w-full min-h-12 rounded-full bg-forest text-sm font-semibold text-cream disabled:opacity-60">
                {{ loading() ? i18n.t('memberForgot.sending') : i18n.t('memberForgot.send') }}
              </button>
            </form>
          }
          <p class="mt-6 text-center text-sm text-slate-warm">
            <a routerLink="/membership/login" class="font-semibold text-gold-700 hover:underline">{{ i18n.t('memberForgot.back') }}</a>
          </p>
        </div>
      </section>
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
