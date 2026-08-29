import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LAST_MEMBERSHIP_ID_KEY } from '../../config/membership-api.config';
import { LanguageService } from '../../i18n/language.service';
import { PageShell } from '../page-shell';
import { MembershipStatusPanel } from '../../components/membership/membership-status-panel';

@Component({
  selector: 'app-membership-success-page',
  imports: [PageShell, RouterLink, MembershipStatusPanel],
  template: `
    <app-page-shell title="Application sent">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-2xl px-5 sm:px-8" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <div class="text-center">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
              {{ i18n.t('membershipSuccess.eyebrow') }}
            </p>
            <h1 class="mt-4 font-display text-3xl font-bold text-forest sm:text-4xl">
              {{ i18n.t('membershipSuccess.title') }}
            </h1>
            <p class="mt-5 text-base leading-relaxed text-slate-warm sm:text-lg">
              {{ i18n.t('membershipSuccess.lead') }}
            </p>
          </div>

          @if (applicationId()) {
            <div class="mt-8 rounded-[1.5rem] border border-mist bg-white px-5 py-6 text-center shadow-soft sm:px-8">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                {{ i18n.t('membershipSuccess.idLabel') }}
              </p>
              <p class="mt-3 break-all font-mono text-lg font-semibold tracking-wide text-forest sm:text-xl">
                {{ applicationId() }}
              </p>
              <button
                type="button"
                class="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-mist px-5 text-sm font-semibold text-forest"
                (click)="copyId()"
              >
                {{ copied() ? i18n.t('membershipSuccess.copied') : i18n.t('membershipSuccess.copy') }}
              </button>
            </div>
          }

          <div class="mt-8 rounded-[1.5rem] border border-mist bg-white px-5 py-6 shadow-soft sm:px-8">
            <app-membership-status-panel [initialId]="applicationId()" [autoLookup]="true" />
          </div>

          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a routerLink="/membership" class="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream">
              {{ i18n.t('membershipSuccess.back') }}
            </a>
            <a routerLink="/" class="inline-flex min-h-12 items-center justify-center rounded-full border border-forest/15 bg-white px-6 py-3 text-sm font-semibold text-forest">
              {{ i18n.t('membershipSuccess.home') }}
            </a>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class MembershipSuccessPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  protected readonly applicationId = signal('');
  protected readonly copied = signal(false);

  ngOnInit(): void {
    const fromQuery = this.route.snapshot.queryParamMap.get('id')?.trim() ?? '';
    this.applicationId.set(fromQuery || this.readStored());
  }

  protected async copyId(): Promise<void> {
    const id = this.applicationId();
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.copied.set(false);
    }
  }

  private readStored(): string {
    try {
      return sessionStorage.getItem(LAST_MEMBERSHIP_ID_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }
}
