import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LAST_MEMBERSHIP_ID_KEY } from '../../config/membership-api.config';
import { LanguageService } from '../../i18n/language.service';
import { PageShell } from '../page-shell';
import { MembershipStatusPanel } from '../../components/membership/membership-status-panel';
import { NextSteps } from '../../components/next-steps/next-steps';
import { Icon, type UiIconName } from '../../components/ui/icon';

@Component({
  selector: 'app-membership-success-page',
  imports: [NextSteps, PageShell, RouterLink, MembershipStatusPanel, Icon],
  template: `
    <app-page-shell title="Application sent" [parent]="{ path: '/membership', labelKey: 'nav.membership' }">
      <section class="bg-cream py-12 sm:py-20">
        <div class="site-wrap" [attr.dir]="i18n.isUr() ? 'rtl' : null">
          <div class="mx-auto max-w-2xl">
            <div class="card overflow-hidden !p-0">
              <div class="relative isolate bg-gradient-to-br from-forest via-emerald to-forest-800 px-6 py-10 text-center text-cream sm:px-10">
                <div class="geo-pattern-dense absolute inset-0 -z-10 opacity-60" aria-hidden="true"></div>
                <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold-300 ring-8 ring-white/5" aria-hidden="true">
                  <app-icon name="check" size="h-8 w-8" [strokeWidth]="2.4" />
                </span>
                <p class="eyebrow-on-dark mt-5">{{ i18n.t('membershipSuccess.eyebrow') }}</p>
                <h1 class="page-title-on-dark mt-3 !text-3xl sm:!text-4xl">{{ i18n.t('membershipSuccess.title') }}</h1>
                <p class="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-sand/85 sm:text-base">{{ i18n.t('membershipSuccess.lead') }}</p>
              </div>

              <div class="px-6 py-8 sm:px-10">
                @if (applicationId()) {
                  <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-mist bg-sand/40 px-5 py-4">
                    <div class="min-w-0">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">{{ i18n.t('membershipSuccess.idLabel') }}</p>
                      <p class="mt-1 break-all font-mono text-lg font-semibold tracking-wide text-forest" dir="ltr">{{ applicationId() }}</p>
                    </div>
                    <button type="button" class="btn btn-secondary-light btn-sm" (click)="copyId()">
                      {{ copied() ? i18n.t('membershipSuccess.copied') : i18n.t('membershipSuccess.copy') }}
                    </button>
                  </div>
                }

                <h2 class="mt-8 font-display text-lg font-bold text-forest">{{ i18n.t('membershipSuccess.nextTitle') }}</h2>
                <ol class="mt-5">
                  @for (step of timeline; track step.title; let i = $index; let last = $last) {
                    <li class="relative flex gap-4 pb-7 last:pb-0">
                      @if (!last) {
                        <span class="absolute start-[1.1875rem] top-10 bottom-0 w-px bg-mist" aria-hidden="true"></span>
                      }
                      <span
                        class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        [class.bg-forest]="i === 0"
                        [class.text-gold-300]="i === 0"
                        [class.border-2]="i !== 0"
                        [class.border-mist]="i !== 0"
                        [class.bg-white]="i !== 0"
                        [class.text-slate-warm]="i !== 0"
                        aria-hidden="true"
                      >
                        <app-icon [name]="step.icon" size="h-5 w-5" [strokeWidth]="i === 0 ? 2.4 : 1.8" />
                      </span>
                      <div class="min-w-0 pt-1.5">
                        <p class="font-semibold text-forest">
                          {{ i18n.t(step.title) }}
                          @if (i === 0) {
                            <span class="pill ms-2 bg-emerald/10 text-emerald-700">{{ i18n.t('membershipSuccess.done') }}</span>
                          }
                        </p>
                        <p class="mt-1 text-sm leading-relaxed text-slate-warm">{{ i18n.t(step.text) }}</p>
                      </div>
                    </li>
                  }
                </ol>
              </div>
            </div>

            <div class="card mt-6">
              <app-membership-status-panel [initialId]="applicationId()" [autoLookup]="true" />
            </div>

            <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a routerLink="/appeals" class="btn btn-primary">{{ i18n.t('membershipSuccess.seeAppeals') }}</a>
              <a routerLink="/" class="btn btn-secondary-light">{{ i18n.t('membershipSuccess.home') }}</a>
            </div>
          </div>
        </div>
      </section>
      <app-next-steps page="/membership/success" />
    </app-page-shell>
  `,
})
export class MembershipSuccessPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  protected readonly applicationId = signal('');
  protected readonly copied = signal(false);
  protected readonly timeline: readonly { icon: UiIconName; title: string; text: string }[] = [
    { icon: 'check', title: 'membershipSuccess.step1Title', text: 'membershipSuccess.step1Text' },
    { icon: 'shield', title: 'membershipSuccess.step2Title', text: 'membershipSuccess.step2Text' },
    { icon: 'mail', title: 'membershipSuccess.step3Title', text: 'membershipSuccess.step3Text' },
  ];

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
