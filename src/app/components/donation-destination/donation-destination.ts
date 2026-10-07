import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';

/** One of the published centres; every gift is attributed to a centre. */
@Component({
  selector: 'app-donation-destination',
  template: `
    <fieldset [attr.dir]="i18n.isUr() ? 'rtl' : null" data-testid="donation-destination">
      <legend class="text-sm font-semibold text-forest">{{ i18n.t('donate.destination') }} *</legend>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        @for (campus of campusService.campuses(); track campus.id) {
          <button
            type="button"
            [class]="optionClass(selected() === campus.id)"
            [attr.aria-pressed]="selected() === campus.id"
            [attr.data-destination]="campus.id"
            (click)="selectedChange.emit(campus.id)"
          >
            <span class="block font-display text-lg font-bold">{{ campus.displayName }}</span>
            <span [class]="hintClass(selected() === campus.id)">{{ centreHint(campus) }}</span>
          </button>
        }
      </div>
      @if (!hasChoice()) {
        <p class="mt-2 text-sm text-gold-700" data-testid="donation-destination-required">{{ i18n.t('donate.chooseCentre') }}</p>
      }
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

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected centreHint(campus: Campus): string {
    return this.i18n.t('donate.centreHint').replace('{town}', campusTown(campus));
  }

  protected optionClass(active: boolean): string {
    const base = 'rounded-2xl border px-4 py-3.5 text-left transition-colors';
    return active
      ? `${base} border-forest bg-forest text-cream`
      : `${base} border-mist bg-white text-forest`;
  }

  protected hintClass(active: boolean): string {
    return `mt-1 block text-sm leading-relaxed ${active ? 'text-cream/75' : 'text-slate-warm'}`;
  }
}
