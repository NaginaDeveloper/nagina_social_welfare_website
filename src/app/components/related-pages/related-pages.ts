import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface RelatedPageLink {
  readonly path: string;
  readonly label: string;
  readonly labelUr?: string;
  readonly hint?: string;
  readonly hintUr?: string;
}

@Component({
  selector: 'app-related-pages',
  imports: [RouterLink],
  template: `
    <nav
      class="mx-auto mt-14 max-w-4xl rounded-2xl border border-mist bg-white/90 px-5 py-6 shadow-soft sm:px-8 sm:py-8"
      [attr.aria-label]="heading()"
    >
      <h2 class="text-center font-display text-xl font-bold text-forest sm:text-2xl">
        {{ heading() }}
      </h2>
      @if (lead()) {
        <p class="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-warm">{{ lead() }}</p>
      }
      <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        @for (link of links(); track link.path) {
          <li>
            <a
              [routerLink]="link.path"
              class="flex h-full flex-col rounded-xl border border-mist bg-sand/40 px-4 py-3 transition-colors hover:border-gold/40 hover:bg-sand/70"
            >
              <span class="text-sm font-semibold text-forest">{{ link.label }}</span>
              @if (link.hint) {
                <span class="mt-1 text-xs leading-relaxed text-slate-warm">{{ link.hint }}</span>
              }
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class RelatedPages {
  readonly heading = input('Related pages');
  readonly lead = input<string | undefined>(undefined);
  readonly links = input.required<readonly RelatedPageLink[]>();
}
