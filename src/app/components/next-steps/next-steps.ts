import { Component, OnInit, computed, inject, input } from '@angular/core';
import { centrePath } from '../../config/centre-pages.config';
import { buildNavGroups, type NavLink } from '../../config/navigation.config';
import { NEXT_STEPS } from '../../config/next-steps.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';

/** Links not in the header menus but worth cross-linking. */
const EXTRA_LINKS: readonly NavLink[] = [
  { labelKey: 'nav.memberLogin', path: '/membership/login', hintKey: 'nav.memberLoginHint', icon: 'privacy' },
];

/**
 * "Related Pages" for a route, resolved from the navigation config so labels
 * and hints stay translated and in one place. Drop it into a page wrapper:
 * `<app-next-steps page="/about" />`.
 */
@Component({
  selector: 'app-next-steps',
  imports: [RelatedPages],
  template: `
    @if (links().length > 0) {
      <section class="bg-cream pb-16 sm:pb-20">
        <div class="site-wrap">
          <app-related-pages
            class="block text-forest"
            [heading]="i18n.t('related.heading')"
            [lead]="i18n.t('related.lead')"
            [links]="links()"
          />
        </div>
      </section>
    }
  `,
})
export class NextSteps implements OnInit {
  /** The current route, e.g. `/about`. */
  readonly page = input.required<string>();

  protected readonly i18n = inject(LanguageService);
  private readonly campusService = inject(CampusService);

  private readonly navLinks = computed<readonly NavLink[]>(() => {
    const centreLinks = this.campusService.campuses().map(
      (campus): NavLink => ({
        labelKey: 'nav.centre',
        label: campusTown(campus),
        hint: campus.displayName,
        path: centrePath(campus.id),
        icon: 'mosque',
      }),
    );
    return [...buildNavGroups(centreLinks).flatMap((g) => g.items), ...EXTRA_LINKS];
  });

  protected readonly links = computed<readonly RelatedPageLink[]>(() => {
    const wanted = NEXT_STEPS[this.page()] ?? [];
    const all = this.navLinks();
    return wanted.flatMap((path) => {
      const link = all.find((item) => item.path === path);
      if (!link) return [];
      return [
        {
          path,
          label: link.label ?? this.i18n.t(link.labelKey),
          hint: link.hint ?? (link.hintKey ? this.i18n.t(link.hintKey) : ''),
        },
      ];
    });
  });

  ngOnInit(): void {
    void this.campusService.load();
  }
}
