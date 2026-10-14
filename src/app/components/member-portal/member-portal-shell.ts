import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

/**
 * Dashboard header above the member sidebar and panels: greeting, membership number and
 * centre, plus a sign-out button on phones (the desktop sidebar has its own).
 */
@Component({
  selector: 'app-member-portal-shell',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="relative isolate overflow-hidden rounded-3xl border border-mist bg-gradient-to-br from-sand via-cream to-white px-5 py-6 sm:px-8 sm:py-8">
      <div class="geo-pattern absolute inset-0 -z-10 opacity-20" aria-hidden="true"></div>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="min-w-0">
          <p class="eyebrow">{{ i18n.t('memberHome.eyebrow') }}</p>
          <h1 class="mt-2 font-display text-2xl font-bold leading-tight text-forest sm:text-4xl">
            {{ i18n.t('memberHome.greeting') }},
            <span class="text-gold-gradient">{{ firstName() }}</span>
          </h1>
          <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-warm">
            @if (membershipNumber()) {
              <span class="inline-flex items-center gap-1.5">
                <app-icon name="user" size="h-4 w-4 text-gold-600" />
                <span class="font-mono font-semibold text-forest" dir="ltr">{{ membershipNumber() }}</span>
              </span>
            }
            @if (campusName()) {
              <span class="inline-flex items-center gap-1.5">
                <app-icon name="pin" size="h-4 w-4 text-gold-600" />
                {{ campusName() }}
              </span>
            }
          </p>
        </div>
        <button type="button" class="btn btn-secondary-light btn-sm lg:hidden" (click)="signOut.emit()">
          <app-icon name="logout" size="h-4 w-4" />
          {{ i18n.t('memberHome.signOut') }}
        </button>
      </div>
    </header>
  `,
})
export class MemberPortalShell {
  protected readonly i18n = inject(LanguageService);

  readonly fullName = input.required<string>();
  readonly membershipNumber = input<string>('');
  readonly campusName = input<string>('');

  readonly signOut = output<void>();

  protected readonly firstName = computed(() => this.fullName().trim().split(/\s+/)[0] || this.fullName());
}
