import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageShell } from '../page-shell';
import { locationPage } from '../../config/location-pages.config';
import { ORGANIZATION } from '../../config/organization.config';

/** `/locations/peterborough/` and `/locations/manchester/` (location id in route data). */
@Component({
  selector: 'app-location-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell [title]="page()?.town ?? ''">
      @if (page(); as p) {
        <section class="relative overflow-hidden bg-cream py-20 sm:py-28" dir="ltr" lang="en" [attr.data-testid]="'location-' + p.id">
          <div class="geo-pattern absolute inset-0 opacity-20" aria-hidden="true"></div>
          <div class="relative site-wrap">
            <div class="mx-auto max-w-3xl">
              <header class="text-center">
                <span class="mb-4 inline-block eyebrow">{{ p.kicker }}</span>
                <h1 class="page-title">{{ p.h1 }}</h1>
                <p class="page-lead mx-auto">{{ p.subtitle }}</p>
                <a routerLink="/donate" class="btn btn-primary btn-lg mt-8" data-testid="location-donate-top">Donate</a>
              </header>

              <div class="mt-12 space-y-4 text-base leading-relaxed text-slate-warm">
                @for (para of p.intro; track $index) {
                  <p>{{ para }}</p>
                }
              </div>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.centreHeading }}</h2>
              <p class="mt-3 text-base leading-relaxed text-slate-warm">{{ p.centreLead }}</p>
              <address class="mt-3 rounded-2xl border border-gold/30 bg-white px-5 py-4 not-italic leading-relaxed text-forest shadow-soft">
                <strong>{{ p.centreName }}</strong>
                @for (line of p.addressLines; track line) {
                  <br />{{ line }}
                }
              </address>
              @if (p.centreText) {
                <p class="mt-4 text-base leading-relaxed text-slate-warm">{{ p.centreText }}</p>
              }
              <p class="mt-3 text-sm">
                <a [routerLink]="p.centrePath" class="font-semibold text-gold-600 underline decoration-gold/40 underline-offset-2 hover:text-forest">
                  See the {{ p.centreName }} centre page
                </a>
              </p>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.goesHeading }}</h2>
              <p class="mt-3 text-base leading-relaxed text-slate-warm">{{ p.goesLead }}</p>
              <ul class="mt-4 space-y-2 text-base leading-relaxed text-slate-warm">
                @for (item of p.goesItems; track item.label) {
                  <li class="rounded-xl border border-mist bg-white/90 px-4 py-3 shadow-soft"><strong class="text-forest">{{ item.label }}:</strong> {{ item.text }}</li>
                }
              </ul>
              <p class="mt-4 text-base leading-relaxed text-slate-warm">{{ p.goesClosing }}</p>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.onlineHeading }}</h2>
              <p class="mt-3 text-base leading-relaxed text-slate-warm">{{ p.onlineLead }}</p>
              <ul class="mt-4 grid gap-2 sm:grid-cols-2">
                @for (method of p.methods; track method) {
                  <li class="rounded-xl border border-mist bg-white/90 px-4 py-3 text-base text-forest shadow-soft">{{ method }}</li>
                }
              </ul>
              <p class="mt-4 text-base leading-relaxed text-slate-warm">
                Donate online:
                <a routerLink="/donate" class="font-semibold text-gold-600 underline decoration-gold/40 underline-offset-2 hover:text-forest">
                  www.naginasocialwelfare.co.uk/donate/
                </a>
              </p>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.categoriesHeading }}</h2>
              <p class="mt-3 text-base leading-relaxed text-slate-warm">{{ p.categoriesLead }}</p>
              <ul class="mt-4 space-y-2 text-base leading-relaxed text-slate-warm">
                @for (cat of p.categories; track cat.label) {
                  <li class="rounded-xl border border-mist bg-white/90 px-4 py-3 shadow-soft"><strong class="text-forest">{{ cat.label }}:</strong> {{ cat.text }}</li>
                }
              </ul>
              <p class="mt-4 text-base leading-relaxed text-slate-warm">{{ p.categoriesClosing }}</p>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.whyHeading }}</h2>
              <div class="mt-3 space-y-3 text-base leading-relaxed text-slate-warm">
                @for (para of p.whyText; track $index) {
                  <p>{{ para }}</p>
                }
              </div>
              <div class="mt-8 rounded-2xl bg-forest px-6 py-8 text-center shadow-portal">
                <p class="font-display text-xl font-bold text-gold-300 sm:text-2xl">{{ p.tagline }}</p>
                <a routerLink="/donate" class="btn btn-primary btn-lg mt-5" data-testid="location-donate-bottom">Donate now</a>
              </div>

              <h2 class="mt-14 font-display text-2xl font-bold text-forest sm:text-3xl">{{ p.contactHeading }}</h2>
              <dl class="mt-4 grid gap-3 sm:grid-cols-2" data-testid="location-contact">
                <div class="rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-soft">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Centre</dt>
                  <dd class="mt-1 text-sm leading-relaxed text-forest">{{ p.centreName }}</dd>
                </div>
                <div class="rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-soft">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Address</dt>
                  <dd class="mt-1 text-sm leading-relaxed text-forest">{{ p.addressLines.slice(0, 2).join(', ') }}</dd>
                </div>
                @if (p.phone) {
                  <div class="rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-soft">
                    <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Phone</dt>
                    <dd class="mt-1 text-sm leading-relaxed text-forest">
                      <a [href]="'tel:' + org.phoneTel" class="underline decoration-gold/40 underline-offset-2">{{ phoneIntl }}</a>
                    </dd>
                  </div>
                }
                <div class="rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-soft">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Email</dt>
                  <dd class="mt-1 break-words text-sm leading-relaxed text-forest">
                    <a [href]="'mailto:' + org.email" class="underline decoration-gold/40 underline-offset-2">{{ org.email }}</a>
                  </dd>
                </div>
                <div class="rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-soft">
                  <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">Registered Charity Number</dt>
                  <dd class="mt-1 text-sm leading-relaxed text-forest">{{ org.charityNumber }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      }
    </app-page-shell>
  `,
})
export class LocationPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly org = ORGANIZATION;
  /** "+44 7831 684738", as the office writes it. */
  protected readonly phoneIntl = `+44 ${ORGANIZATION.phoneDisplay.replace(/^0/, '')}`;
  protected readonly page = computed(() => locationPage(String(this.route.snapshot.data['locationId'] ?? '')));
}
