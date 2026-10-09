import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { centreReviewUrl } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { authorInitial, starString, type GoogleReviewsData } from '../../models/google-reviews';
import { GoogleReviewsService } from '../../services/google-reviews.service';

/** A centre's Google rating and recent written reviews, with links to read them all and add one. */
@Component({
  selector: 'app-google-reviews',
  template: `
    @if (shown(); as data) {
      <section
        class="mx-auto mt-16 max-w-5xl"
        [attr.dir]="i18n.isUr() ? 'rtl' : null"
        [attr.lang]="i18n.isUr() ? 'ur' : null"
        data-testid="google-reviews"
        aria-labelledby="google-reviews-title"
      >
        <h2 id="google-reviews-title" class="text-center font-display text-2xl font-bold text-forest sm:text-3xl">
          {{ i18n.t('reviews.title') }}
        </h2>
        @if (data.rating !== null) {
          <p class="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-warm">
            <span class="font-display text-3xl font-bold text-forest">{{ data.rating.toFixed(1) }}</span>
            <span class="text-xl text-gold" aria-hidden="true">{{ stars(data.rating) }}</span>
            <span class="text-sm">{{ countLabel(data) }}</span>
          </p>
        }

        @if (data.reviews.length) {
          <ul class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            @for (review of data.reviews; track $index) {
              <li class="flex flex-col rounded-2xl border border-mist bg-white p-5 shadow-soft">
                <p class="text-gold" [attr.aria-label]="starsLabel(review.rating)">
                  <span aria-hidden="true">{{ stars(review.rating) }}</span>
                </p>
                <p class="mt-3 line-clamp-6 text-sm leading-relaxed text-slate-warm">{{ review.text }}</p>
                <div class="mt-auto flex items-center gap-3 pt-4">
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white"
                    aria-hidden="true"
                    >{{ initial(review.author) }}</span
                  >
                  <div class="min-w-0 text-xs">
                    @if (review.authorUrl) {
                      <a
                        [href]="review.authorUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block truncate font-semibold text-forest underline decoration-gold/40 underline-offset-2"
                        >{{ review.author }}</a
                      >
                    } @else {
                      <span class="block truncate font-semibold text-forest">{{ review.author }}</span>
                    }
                    <span class="text-slate-warm">{{ review.when }}</span>
                  </div>
                </div>
              </li>
            }
          </ul>
        }

        <p class="mt-6 text-center text-xs text-slate-warm">{{ i18n.t('reviews.attribution') }}</p>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
          @if (data.mapsUri) {
            <a
              [href]="data.mapsUri"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center justify-center rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-semibold text-forest shadow-soft"
              data-testid="google-reviews-read-all"
              >{{ i18n.t('reviews.readAll') }}</a
            >
          }
          @if (reviewUrl(); as url) {
            <a
              [href]="url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold/40 bg-white px-5 py-2.5 text-sm font-semibold text-forest shadow-soft"
              ><span class="text-gold" aria-hidden="true">★</span> {{ i18n.t('centre.linkReview') }}</a
            >
          }
        </div>
      </section>
    }
  `,
})
export class GoogleReviews implements OnInit {
  readonly campusId = input.required<string>();

  protected readonly i18n = inject(LanguageService);
  private readonly service = inject(GoogleReviewsService);

  private readonly loaded = signal<GoogleReviewsData | null>(null);
  protected readonly reviewUrl = computed(() => centreReviewUrl(this.campusId()));

  /** Written reviews only; a centre with no profile, no data or no rating shows nothing. */
  protected readonly shown = computed<GoogleReviewsData | null>(() => {
    const data = this.loaded();
    if (!data || !this.reviewUrl() || (data.rating === null && !data.reviews.length)) return null;
    return { ...data, reviews: data.reviews.filter((r) => r.text) };
  });

  ngOnInit(): void {
    if (this.reviewUrl()) void this.service.load(this.campusId()).then((data) => this.loaded.set(data));
  }

  protected stars(rating: number): string {
    return starString(rating);
  }

  protected initial(author: string): string {
    return authorInitial(author);
  }

  protected countLabel(data: GoogleReviewsData): string {
    return this.i18n.t('reviews.count').replace('{n}', String(data.count));
  }

  protected starsLabel(rating: number): string {
    return this.i18n.t('reviews.starsLabel').replace('{n}', String(rating));
  }
}
