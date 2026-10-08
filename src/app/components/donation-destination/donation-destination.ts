import { Component, OnInit, computed, effect, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { campusTown, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';

/**
 * Which centre a gift supports. One of the published centres is always
 * selected: the head office by default. A `?campus=` link or a tap overrides it.
 */
@Component({
  selector: 'app-donation-destination',
  template: `
    <fieldset [attr.dir]="i18n.isUr() ? 'rtl' : null" data-testid="donation-destination">
      <legend class="sr-only">{{ i18n.t('donate.destination') }}</legend>
      <div class="grid gap-2 sm:grid-cols-2" role="radiogroup" [attr.aria-label]="i18n.t('donate.destination')">
        @for (campus of campusService.campuses(); track campus.id) {
          <button
            type="button"
            role="radio"
            [class]="optionClass(selected() === campus.id)"
            [attr.aria-checked]="selected() === campus.id"
            [attr.data-destination]="campus.id"
            (click)="selectedChange.emit(campus.id)"
          >
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              [class]="iconClass(selected() === campus.id)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 20V11l8-6 8 6v9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20v-5h6v5M12 5V3.5" />
              </svg>
            </span>
            <span class="min-w-0 text-start">
              <span class="block font-display text-base font-bold leading-tight sm:text-lg">{{ town(campus) }}</span>
              <span [class]="hintClass(selected() === campus.id)">
                {{ campus.displayName }}
                @if (isHeadOffice(campus)) {
                  · {{ i18n.t('home.headOffice') }}
                }
              </span>
            </span>
            @if (selected() === campus.id) {
              <svg class="ms-auto h-5 w-5 shrink-0 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            }
          </button>
        } @empty {
          <p class="text-sm text-slate-warm" aria-live="polite">{{ i18n.t('campus.loading') }}</p>
        }
      </div>
    </fieldset>
  `,
})
export class DonationDestination implements OnInit {
  readonly selected = input.required<string>();
  readonly selectedChange = output<string>();

  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);

  /** True once the selection names a published centre. */
  protected readonly hasChoice = computed(() => this.campusService.byId(this.selected()) !== null);

  constructor() {
    // Pre-select the head office as soon as the list is known, unless the page already set one.
    effect(() => {
      const campuses = this.campusService.campuses();
      if (campuses.length === 0 || this.selected()) return;
      const head = campuses.find((c) => c.postcode === ORGANIZATION.postalCode);
      this.selectedChange.emit((head ?? campuses[0]).id);
    });
  }

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected isHeadOffice(campus: Campus): boolean {
    return campus.postcode === ORGANIZATION.postalCode;
  }

  protected optionClass(active: boolean): string {
    const base =
      'flex min-h-14 items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition-all duration-200 sm:px-4';
    return active
      ? `${base} border-forest bg-forest text-cream shadow-soft`
      : `${base} border-mist bg-white text-forest hover:border-gold/50`;
  }

  protected iconClass(active: boolean): string {
    return active
      ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold text-forest'
      : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald-600';
  }

  protected hintClass(active: boolean): string {
    return `block truncate text-xs ${active ? 'text-cream/75' : 'text-slate-warm'}`;
  }
}
