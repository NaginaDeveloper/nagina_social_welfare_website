import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type UiIconName } from '../ui/icon';

/** Dashed empty state with an icon, a title and a line of help; actions go in the content slot. */
@Component({
  selector: 'app-member-portal-empty',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-3xl border border-dashed border-mist bg-sand/40 px-6 py-12 text-center" [class.mt-6]="offsetTop()">
      <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-600" aria-hidden="true">
        <app-icon [name]="icon()" size="h-7 w-7" [strokeWidth]="1.5" />
      </span>
      @if (title()) {
        <p class="mt-4 font-display text-lg font-bold text-forest">{{ title() }}</p>
      }
      <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-warm">{{ message() }}</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3 empty:hidden"><ng-content /></div>
    </div>
  `,
})
export class MemberPortalEmpty {
  readonly message = input.required<string>();
  readonly title = input<string>('');
  readonly icon = input<UiIconName>('sparkle');
  readonly offsetTop = input(false);
}
