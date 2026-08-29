import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberPortalService, portalErrorMessage } from '../../services/member-portal.service';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-membership-reset-password-page',
  imports: [PageShell, FormsModule, RouterLink],
  template: `
    <app-page-shell title="Reset password">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-md px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <h1 class="font-display text-3xl font-bold text-forest">{{ i18n.t('memberReset.title') }}</h1>
          <p class="mt-4 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberReset.lead') }}</p>
          @if (done()) {
            <p class="mt-6 rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-forest">{{ i18n.t('memberReset.done') }}</p>
            <a routerLink="/membership/login" class="mt-6 inline-flex min-h-12 items-center rounded-full bg-forest px-6 text-sm font-semibold text-cream">
              {{ i18n.t('memberLogin.signIn') }}
            </a>
          } @else {
            <form class="mt-8 space-y-4 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft" (submit)="$event.preventDefault(); submit()">
              <label class="block text-sm font-medium text-forest">
                {{ i18n.t('memberReset.password') }}
                <input type="password" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="password" name="password" autocomplete="new-password" minlength="8" />
              </label>
              <label class="block text-sm font-medium text-forest">
                {{ i18n.t('memberReset.confirm') }}
                <input type="password" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="confirm" name="confirm" autocomplete="new-password" />
              </label>
              @if (error()) {
                <p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ error() }}</p>
              }
              <button type="submit" [disabled]="loading() || !token" class="w-full min-h-12 rounded-full bg-forest text-sm font-semibold text-cream disabled:opacity-60">
                {{ loading() ? i18n.t('memberReset.saving') : i18n.t('memberReset.save') }}
              </button>
            </form>
          }
        </div>
      </section>
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
    if (!this.token) {
      this.error.set(this.i18n.t('memberReset.invalidLink'));
    }
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
