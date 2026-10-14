import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon, type UiIconName } from '../ui/icon';

/** One number with a label and optional hint, used in the member overview and donations tab. */
@Component({
  selector: 'app-stat-tile',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-tile h-full">
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-600"
        aria-hidden="true"
      >
        <app-icon [name]="icon()" size="h-5 w-5" />
      </span>
      <div class="min-w-0">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-warm">{{ label() }}</p>
        <p class="mt-1 font-display text-2xl font-bold leading-none text-forest sm:text-3xl" dir="ltr">
          {{ value() }}
        </p>
        @if (hint()) {
          <p class="mt-1.5 text-xs leading-snug text-slate-warm">{{ hint() }}</p>
        }
      </div>
    </div>
  `,
})
export class StatTile {
  readonly icon = input<UiIconName>('sparkle');
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly hint = input<string>('');
}
