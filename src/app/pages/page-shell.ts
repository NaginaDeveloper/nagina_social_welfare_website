import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink],
  template: `
    <div class="border-b border-mist/80 bg-sand/80 pt-[var(--header-clearance)]">
      <div class="site-wrap py-3 sm:py-3.5">
        <div class="flex flex-wrap items-center gap-2">
          <a
            routerLink="/"
            class="text-sm font-medium text-slate-warm transition-colors hover:text-forest"
          >
            {{ homeLabel() }}
          </a>
          @if (parent(); as crumb) {
            <span class="text-mist" aria-hidden="true">/</span>
            <a [routerLink]="crumb.path" class="text-sm font-medium text-slate-warm transition-colors hover:text-forest">
              {{ i18n.t(crumb.labelKey) }}
            </a>
          }
          <span class="text-mist" aria-hidden="true">/</span>
          <span class="text-sm font-semibold text-forest">{{ title() }}</span>
        </div>
      </div>
    </div>
    <div class="page-shell-body">
      <ng-content />
    </div>
  `,
})
export class PageShell {
  protected readonly i18n = inject(LanguageService);

  readonly title = input.required<string>();
  readonly homeLabelKey = input('nav.home');
  /** Middle crumb for nested pages, e.g. Apply above Track Application. */
  readonly parent = input<{ path: string; labelKey: string } | null>(null);

  protected homeLabel(): string {
    return this.i18n.t(this.homeLabelKey());
  }
}
