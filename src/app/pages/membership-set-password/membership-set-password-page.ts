import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberAuthService } from '../../services/member-auth.service';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-membership-set-password-page',
  imports: [PageShell, FormsModule],
  template: `
    <app-page-shell title="Set password">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-md px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <h1 class="font-display text-3xl font-bold text-forest">{{ i18n.t('memberSetPassword.title') }}</h1>
          <p class="mt-4 text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberSetPassword.lead') }}</p>
          @if (!token()) {
            <p class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {{ i18n.t('memberSetPassword.missingToken') }}
            </p>
          } @else {
            <form class="mt-8 space-y-4 rounded-[1.5rem] border border-mist bg-white px-5 py-8 shadow-soft" (submit)="$event.preventDefault(); submit()">
              <label class="block text-sm font-medium text-forest">
                {{ i18n.t('memberSetPassword.password') }}
                <input type="password" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="password" name="password" autocomplete="new-password" />
              </label>
              <label class="block text-sm font-medium text-forest">
                {{ i18n.t('memberSetPassword.confirm') }}
                <input type="password" class="mt-1.5 w-full min-h-12 rounded-2xl border border-mist bg-sand/40 px-4" [(ngModel)]="confirm" name="confirm" autocomplete="new-password" />
              </label>
              @if (error()) {
                <p class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ error() }}</p>
              }
              <button type="submit" [disabled]="loading()" class="w-full min-h-12 rounded-full bg-forest text-sm font-semibold text-cream disabled:opacity-60">
                {{ loading() ? i18n.t('memberSetPassword.saving') : i18n.t('memberSetPassword.save') }}
              </button>
            </form>
          }
        </div>
      </section>
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

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token')?.trim() ?? '');
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
      await this.router.navigate(['/membership/home']);
    } catch (err) {
      this.error.set(this.auth.error() ?? (err instanceof Error ? err.message : null));
    } finally {
      this.loading.set(false);
    }
  }
}
