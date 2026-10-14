import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';
import { MEMBER_TABS, type MemberTab } from './member-portal.types';

/**
 * Member area navigation. A vertical list on desktop and a horizontally scrolling tab
 * strip on phones. Each entry is a real link (`/membership/home?tab=…`) so tabs can be
 * bookmarked and deep-linked from emails; the page reacts to the query parameter.
 */
@Component({
  selector: 'app-member-sidebar',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="i18n.t('memberHome.navLabel')" class="lg:sticky lg:top-24">
      <!-- Phone / tablet: scrolling tab strip -->
      <div class="-mx-5 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:hidden [scrollbar-width:none]">
        <ul class="flex min-w-max gap-1.5 rounded-2xl border border-mist bg-white p-1.5 shadow-soft" role="tablist">
          @for (t of tabs; track t.id) {
            <li role="presentation">
              <a
                role="tab"
                routerLink="/membership/home"
                [queryParams]="queryFor(t.id)"
                [attr.aria-selected]="active() === t.id"
                [attr.aria-controls]="'member-panel-' + t.id"
                [id]="'member-tab-' + t.id"
                class="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-xs font-semibold transition-colors sm:text-sm"
                [class.bg-forest]="active() === t.id"
                [class.text-cream]="active() === t.id"
                [class.shadow-soft]="active() === t.id"
                [class.text-forest/80]="active() !== t.id"
                [class.hover:bg-forest/5]="active() !== t.id"
              >
                <app-icon [name]="t.icon" size="h-4 w-4 shrink-0" />
                {{ i18n.t(t.labelKey) }}
              </a>
            </li>
          }
        </ul>
      </div>

      <!-- Desktop: vertical list -->
      <ul class="hidden space-y-1 rounded-3xl border border-mist bg-white p-2.5 shadow-soft lg:block" role="tablist">
        @for (t of tabs; track t.id) {
          <li role="presentation">
            <a
              role="tab"
              routerLink="/membership/home"
              [queryParams]="queryFor(t.id)"
              [attr.aria-selected]="active() === t.id"
              [attr.aria-controls]="'member-panel-' + t.id"
              [id]="'member-tab-desktop-' + t.id"
              class="nav-item"
              [class.nav-item-active]="active() === t.id"
            >
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                [class.bg-white/10]="active() === t.id"
                [class.bg-sand]="active() !== t.id"
                [class.text-gold-300]="active() === t.id"
                [class.text-emerald-600]="active() !== t.id"
                aria-hidden="true"
              >
                <app-icon [name]="t.icon" size="h-4 w-4" />
              </span>
              {{ i18n.t(t.labelKey) }}
            </a>
          </li>
        }
        <li role="presentation" class="border-t border-mist pt-2 mt-2">
          <button type="button" class="nav-item text-slate-warm" (click)="signOut.emit()">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand text-slate-warm" aria-hidden="true">
              <app-icon name="logout" size="h-4 w-4" />
            </span>
            {{ i18n.t('memberHome.signOut') }}
          </button>
        </li>
      </ul>
    </nav>
  `,
})
export class MemberSidebar {
  protected readonly i18n = inject(LanguageService);
  protected readonly tabs = MEMBER_TABS;

  readonly active = input.required<MemberTab>();
  readonly signOut = output<void>();

  protected queryFor(id: MemberTab): Record<string, string> | null {
    return id === 'overview' ? null : { tab: id };
  }
}
