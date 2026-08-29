import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-membership-login-page',
  imports: [PageShell, FormsModule, RouterLink],
  template: `
    <app-page-shell title="Member sign in">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-md px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <h1 class="font-display text-3xl font-bold text-forest">{{ i18n.t('memberLogin.title') }}</h1>
          <p class="mt-4 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberLogin.lead') }}</p>
          <form class="mt-8 space-y-4 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft" (submit)="$event.preventDefault(); submit()">
            <label class="block text-sm font-medium text-forest">
              {{ i18n.t('memberLogin.email') }}
              <input type="email" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="email" name="email" autocomplete="email" />
            </label>
            <label class="block text-sm font-medium text-forest">
              {{ i18n.t('memberLogin.password') }}
              <input type="password" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="password" name="password" autocomplete="current-password" />
            </label>
            @if (error()) {
              <p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ error() }}</p>
            }
            <button type="submit" [disabled]="loading()" class="w-full min-h-12 rounded-full bg-forest text-sm font-semibold text-cream disabled:opacity-60">
              {{ loading() ? i18n.t('memberLogin.signingIn') : i18n.t('memberLogin.signIn') }}
            </button>
            <p class="text-center text-sm">
              <a routerLink="/membership/forgot-password" class="font-semibold text-gold-700 hover:underline">{{ i18n.t('memberLogin.forgot') }}</a>
            </p>
          </form>
          <p class="mt-6 text-center text-sm text-slate-warm">
            <a routerLink="/membership" class="font-semibold text-gold-700 hover:underline">{{ i18n.t('memberLogin.apply') }}</a>
          </p>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class MembershipLoginPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly auth = inject(MemberAuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.auth.restoreSession().then(() => {
      if (this.auth.member()) {
        void this.router.navigate(['/membership/home']);
      }
    });
  }

  protected async submit(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.auth.login(this.email, this.password);
      await this.router.navigate(['/membership/home']);
    } catch (err) {
      this.error.set(this.auth.error() ?? (err instanceof Error ? err.message : null));
    } finally {
      this.loading.set(false);
    }
  }
}
