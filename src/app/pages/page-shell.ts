import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../i18n/language.service';
import { HeroTopActions } from '../components/hero-top-actions/hero-top-actions';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink, HeroTopActions],
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
          <span class="text-mist" aria-hidden="true">/</span>
          <span class="text-sm font-semibold text-forest">{{ title() }}</span>
        </div>
        <app-hero-top-actions class="mt-3 block" variant="compact" />
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
