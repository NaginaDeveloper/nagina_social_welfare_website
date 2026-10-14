import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from './icon';

let nextId = 0;

/** Labelled password input with a show / hide toggle, styled with the `field` utilities. */
@Component({
  selector: 'app-password-field',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <label class="field-label" [attr.for]="id">{{ label() }}</label>
    <div class="relative">
      <input
        [id]="id"
        [type]="visible() ? 'text' : 'password'"
        class="field pe-12"
        dir="ltr"
        [name]="name()"
        [attr.autocomplete]="autocomplete()"
        [attr.minlength]="minlength()"
        [attr.aria-describedby]="hint() ? id + '-hint' : null"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        required
      />
      <button
        type="button"
        class="absolute inset-y-0 end-0 mt-1.5 flex w-12 items-center justify-center rounded-e-2xl text-slate-warm transition-colors hover:text-forest"
        [attr.aria-label]="visible() ? i18n.t('auth.hidePassword') : i18n.t('auth.showPassword')"
        [attr.aria-pressed]="visible()"
        [attr.aria-controls]="id"
        (click)="visible.set(!visible())"
      >
        <app-icon [name]="visible() ? 'eye-off' : 'eye'" size="h-5 w-5" />
      </button>
    </div>
    @if (hint()) {
      <span class="field-hint" [id]="id + '-hint'">{{ hint() }}</span>
    }
  `,
})
export class PasswordField {
  protected readonly i18n = inject(LanguageService);
  protected readonly id = `pw-${++nextId}`;
  protected readonly visible = signal(false);

  readonly label = input.required<string>();
  readonly name = input('password');
  readonly autocomplete = input<'current-password' | 'new-password'>('current-password');
  readonly minlength = input<number | null>(null);
  readonly hint = input('');
  readonly value = model('');
}
