import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { VenueMap } from '../venue-map/venue-map';

/** Map with a madrasa picker; the organisation map until campuses load. */
@Component({
  selector: 'app-campus-map',
  imports: [VenueMap],
  template: `
    @if (campusService.campuses().length > 1) {
      <div
        class="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center"
        role="group"
        [attr.aria-label]="i18n.t('madrasa.mapPick')"
        [attr.dir]="i18n.isUr() ? 'rtl' : null"
      >
        @for (campus of campusService.campuses(); track campus.id) {
          <button
            type="button"
            class="inline-flex min-h-11 w-full items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold sm:w-auto"
            [class]="campus.id === selected()?.id
              ? 'border-forest bg-forest text-cream'
              : 'border-mist bg-white text-forest hover:border-gold/55'"
            [attr.aria-pressed]="campus.id === selected()?.id"
            (click)="selectedId.set(campus.id)"
          >
            {{ campus.displayName }} · {{ town(campus) }}
          </button>
        }
      </div>
    }
    <app-venue-map [campus]="selected()" />
  `,
})
export class CampusMap implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly selectedId = signal<string | null>(null);

  protected readonly selected = computed<Campus | null>(
    () => this.campusService.byId(this.selectedId()) ?? this.campusService.campuses()[0] ?? null,
  );

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }
}
