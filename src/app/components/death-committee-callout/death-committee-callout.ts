import { Component, OnInit, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEATH_COMMITTEE } from '../../config/death-committee.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown } from '../../models/campus';
import { CampusService } from '../../services/campus.service';

/** Highlight card for the Death Committee. `copy` picks the `<copy>.dc*` translation keys. */
@Component({
  selector: 'app-death-committee-callout',
  imports: [RouterLink],
  template: `
    <aside
      [class]="boxClass()"
      [attr.dir]="i18n.isUr() ? 'rtl' : null"
      [attr.lang]="i18n.isUr() ? 'ur' : null"
      data-testid="death-committee-callout"
    >
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-start gap-4">
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold-600 ring-1 ring-gold/40"
            aria-hidden="true"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-4.35-9.5-8.5C.8 9.6 2.4 5.5 6.2 5.1c2-.2 3.9.9 5.8 3 1.9-2.1 3.8-3.2 5.8-3 3.8.4 5.4 4.5 3.7 7.4C19 16.65 12 21 12 21Z" />
            </svg>
          </span>
          <div>
            <p [class]="eyebrowClass()">{{ text('dcEyebrow') }}</p>
            <h2 [class]="titleClass()">{{ text('dcTitle') }}</h2>
            <p [class]="bodyClass()">{{ text('dcBody') }}</p>
          </div>
        </div>
        <div class="flex shrink-0 flex-col gap-2.5 sm:items-end">
          <a
            [routerLink]="path"
            class="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-5 py-2.5 text-sm font-semibold text-forest shadow-soft"
          >
            {{ text('dcCta') }}
          </a>
          <a
            [href]="portalUrl"
            target="_blank"
            rel="noopener noreferrer"
            [class]="secondaryClass()"
          >
            {{ i18n.t('dc.register') }}
          </a>
        </div>
      </div>
    </aside>
  `,
})
export class DeathCommitteeCallout implements OnInit {
  readonly copy = input.required<'centre' | 'home' | 'work'>();
  readonly tone = input<'light' | 'dark'>('light');

  protected readonly i18n = inject(LanguageService);
  private readonly campusService = inject(CampusService);
  protected readonly path = DEATH_COMMITTEE.path;
  protected readonly portalUrl = DEATH_COMMITTEE.portalUrl;

  private readonly campus = computed(() => this.campusService.byId(DEATH_COMMITTEE.campusId));

  protected readonly boxClass = computed(() =>
    this.tone() === 'dark'
      ? 'block rounded-3xl border border-gold/40 bg-white/[0.07] px-6 py-6 backdrop-blur-sm sm:px-8'
      : 'block rounded-3xl border border-gold/45 bg-gradient-to-br from-gold/15 via-white to-white px-6 py-6 shadow-soft sm:px-8',
  );
  protected readonly eyebrowClass = computed(
    () =>
      `text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${this.tone() === 'dark' ? 'text-gold-300' : 'text-gold-700'}`,
  );
  protected readonly titleClass = computed(
    () => `mt-1 font-display text-xl font-bold sm:text-2xl ${this.tone() === 'dark' ? 'text-white' : 'text-forest'}`,
  );
  protected readonly bodyClass = computed(
    () =>
      `mt-1.5 max-w-2xl text-sm leading-relaxed ${this.tone() === 'dark' ? 'text-cream/80' : 'text-slate-warm'}`,
  );
  protected readonly secondaryClass = computed(() =>
    this.tone() === 'dark'
      ? 'inline-flex min-h-11 items-center justify-center rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold-300'
      : 'inline-flex min-h-11 items-center justify-center rounded-full border border-forest/15 bg-white px-5 py-2.5 text-sm font-semibold text-forest',
  );

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected text(key: string): string {
    const campus = this.campus();
    return this.i18n
      .t(`${this.copy()}.${key}`)
      .replaceAll('{town}', campus ? campusTown(campus) : 'Manchester')
      .replaceAll('{name}', campus?.displayName ?? 'Quran Academy');
  }
}
