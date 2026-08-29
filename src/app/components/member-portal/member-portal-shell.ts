import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { portalEyebrowClass } from './member-portal.shared';
import type { MemberTab } from './member-portal.types';

@Component({
  selector: 'app-member-portal-shell',
  template: `
    <div class="relative overflow-hidden rounded-[1.75rem] border border-mist/80 bg-gradient-to-br from-sand via-cream to-white px-5 py-8 sm:px-8 sm:py-10">
      <div class="geo-pattern absolute inset-0 opacity-20" aria-hidden="true"></div>
      <div class="relative">
        <p [class]="portalEyebrowClass">{{ i18n.t('memberHome.eyebrow') }}</p>
        <h1 class="mt-4 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">
          {{ i18n.t('memberHome.welcome') }},
          <span class="text-gold-gradient">{{ fullName() }}</span>
        </h1>
      </div>
    </div>

    <nav
      class="mt-8 rounded-2xl border border-mist bg-sand/80 p-1.5"
      role="tablist"
      [attr.aria-label]="i18n.t('memberHome.tabListLabel')"
    >
      <div class="flex flex-wrap gap-1">
        @for (t of tabs(); track t.id) {
          <button
            type="button"
            role="tab"
            class="rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm"
            [id]="'member-tab-' + t.id"
            [attr.aria-selected]="activeTab() === t.id"
            [attr.aria-controls]="'member-panel-' + t.id"
            [class.bg-forest]="activeTab() === t.id"
            [class.text-cream]="activeTab() === t.id"
            [class.shadow-soft]="activeTab() === t.id"
            [class.text-forest]="activeTab() !== t.id"
            [class.hover:bg-white/70]="activeTab() !== t.id"
            (click)="tabChange.emit(t.id)"
          >
            {{ i18n.t(t.labelKey) }}
          </button>
        }
      </div>
    </nav>
  `,
})
export class MemberPortalShell {
  protected readonly i18n = inject(LanguageService);
  protected readonly portalEyebrowClass = portalEyebrowClass;

  readonly fullName = input.required<string>();
  readonly activeTab = input.required<MemberTab>();
  readonly tabs = input.required<readonly { id: MemberTab; labelKey: string }[]>();

  readonly tabChange = output<MemberTab>();
}
