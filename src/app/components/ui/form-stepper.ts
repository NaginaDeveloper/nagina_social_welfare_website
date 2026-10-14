import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from './icon';

export interface FormStep {
  /** i18n key for the step title. */
  readonly key: string;
  /** i18n key for the one-line hint under the title. */
  readonly hint: string;
}

/**
 * Multi-step form progress, lifted from the admissions form so every stepped form on the
 * site looks the same. `list` is the tall sidebar version (desktop); `bar` is the compact
 * progress strip for phones. Completed steps are buttons that jump back; future steps are
 * disabled until reached.
 */
@Component({
  selector: 'app-form-stepper',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'list') {
      <nav [attr.aria-label]="i18n.t('stepper.ariaLabel')" [attr.dir]="i18n.isUr() ? 'rtl' : null">
        <ol class="space-y-1">
          @for (meta of steps(); track meta.key; let i = $index) {
            <li>
              <button
                type="button"
                class="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-start transition-colors"
                [class.bg-sand]="current() === i"
                [class.hover:bg-sand/60]="i < current()"
                [disabled]="i > current()"
                [attr.aria-current]="current() === i ? 'step' : null"
                (click)="goTo.emit(i)"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  [class.bg-forest]="i <= current()"
                  [class.text-cream]="i <= current()"
                  [class.border]="i > current()"
                  [class.border-mist]="i > current()"
                  [class.text-slate-warm]="i > current()"
                >
                  @if (i < current()) {
                    <app-icon name="check" size="h-3.5 w-3.5" [strokeWidth]="2.5" />
                    <span class="sr-only">{{ i18n.t('stepper.done') }}</span>
                  } @else {
                    {{ i + 1 }}
                  }
                </span>
                <span class="min-w-0">
                  <span
                    class="block text-sm font-semibold"
                    [class.text-forest]="i <= current()"
                    [class.text-slate-warm]="i > current()"
                  >
                    {{ i18n.t(meta.key) }}
                  </span>
                  <span class="block text-xs leading-snug text-slate-warm">{{ i18n.t(meta.hint) }}</span>
                </span>
              </button>
            </li>
          }
        </ol>
      </nav>
    } @else {
      <div [attr.dir]="i18n.isUr() ? 'rtl' : null">
        <ol class="flex items-center gap-2" [attr.aria-label]="i18n.t('stepper.ariaLabel')">
          @for (meta of steps(); track meta.key; let i = $index) {
            <li class="flex-1">
              <button
                type="button"
                class="block h-1.5 w-full rounded-full transition-colors"
                [class.bg-forest]="i <= current()"
                [class.bg-mist]="i > current()"
                [disabled]="i > current()"
                [attr.aria-label]="i18n.t(meta.key)"
                [attr.aria-current]="current() === i ? 'step' : null"
                (click)="goTo.emit(i)"
              ></button>
            </li>
          }
        </ol>
        <p class="mt-2 text-sm text-slate-warm">
          <span class="font-semibold text-forest">
            {{ i18n.t('stepper.progress') }} {{ current() + 1 }} {{ i18n.t('stepper.of') }} {{ total() }}
          </span>
          · {{ i18n.t(currentStep().key) }}
        </p>
      </div>
    }
  `,
})
export class FormStepper {
  protected readonly i18n = inject(LanguageService);

  readonly steps = input.required<readonly FormStep[]>();
  readonly current = input.required<number>();
  readonly variant = input<'list' | 'bar'>('list');

  readonly goTo = output<number>();

  protected readonly total = computed(() => this.steps().length);
  protected readonly currentStep = computed(
    () => this.steps()[Math.min(this.current(), this.steps().length - 1)] ?? this.steps()[0],
  );
}
