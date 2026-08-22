import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink],
  template: `
    <div class="border-b border-mist/80 bg-sand/80 pt-16 sm:pt-[4.75rem]">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-3 sm:px-8 sm:py-3.5">
        <a
          routerLink="/"
          class="text-sm font-medium text-slate-warm transition-colors hover:text-forest"
        >
          Home
        </a>
        <span class="text-mist" aria-hidden="true">/</span>
        <span class="text-sm font-semibold text-forest">{{ title() }}</span>
      </div>
    </div>
    <div class="page-shell-body">
      <ng-content />
    </div>
  `,
})
export class PageShell {
  readonly title = input.required<string>();
}
