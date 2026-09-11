import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink],
  template: `
    <div class="border-b border-mist/80 bg-sand/80 pt-16 sm:pt-[4.75rem]">
      <div class="site-wrap flex flex-wrap items-center gap-2 py-3 sm:py-3.5">
        <a
          routerLink="/"
          class="text-sm font-medium text-slate-warm transition-colors hover:text-forest"
        >
          {{ homeLabel() }}
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
  private readonly i18n = inject(LanguageService);

  readonly title = input.required<string>();
  readonly homeLabelKey = input('nav.home');

  protected homeLabel(): string {
    return this.i18n.t(this.homeLabelKey());
  }
}
