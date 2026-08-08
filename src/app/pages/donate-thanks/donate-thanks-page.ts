import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-donate-thanks-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell title="Thank you">
      <section class="bg-cream py-16 sm:py-24">
        <div class="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            Donation
          </p>
          <h1 class="mt-4 font-display text-3xl font-bold text-forest sm:text-4xl">
            Thank you for your generosity
          </h1>
          <p class="mt-5 text-base leading-relaxed text-slate-warm sm:text-lg">
            If you completed payment on SumUp’s secure page, your gift supports
            Islamic education and community welfare across the UK. A receipt may
            come from SumUp depending on the payment method used.
          </p>
          <p class="mt-4 text-sm leading-relaxed text-slate-warm">
            Prefer bank transfer instead? You can still use our UK account details
            on the donate section.
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              routerLink="/"
              fragment="donate"
              class="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-emerald"
            >
              Back to donate
            </a>
            <a
              routerLink="/"
              class="inline-flex min-h-12 items-center justify-center rounded-full border border-forest/15 bg-white px-6 py-3 text-sm font-semibold text-forest transition-colors hover:border-gold/40"
            >
              Home
            </a>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class DonateThanksPage {}
