import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { centreReviewUrl } from '../../config/centre-pages.config';
import { LanguageService } from '../../i18n/language.service';
import { authorInitial, reviewAge, starString, type GoogleReview, type GoogleReviewsData } from '../../models/google-reviews';
import { GoogleReviewsService } from '../../services/google-reviews.service';

/** A centre's Google rating and its written reviews (newest first), with links to read them on Google and add one. */
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
            @for (review of visible(); track $index) {
              <li class="flex flex-col rounded-2xl border border-mist bg-white p-5 shadow-soft">
                <p class="text-gold" [attr.aria-label]="starsLabel(review.rating)">
                  <span aria-hidden="true">{{ stars(review.rating) }}</span>
                </p>
                <p class="mt-3 line-clamp-6 text-sm leading-relaxed text-slate-warm">{{ review.text }}</p>
                @if (review.reply) {
                  <div class="mt-3 rounded-xl bg-mist/40 p-3 text-xs leading-relaxed text-slate-warm" data-testid="google-review-reply">
                    <p class="font-semibold text-forest">{{ i18n.t('reviews.reply') }}</p>
                    <p class="mt-1 line-clamp-4">{{ review.reply }}</p>
                  </div>
                }
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
                    <span class="text-slate-warm">{{ age(review) }}</span>
                  </div>
                </div>
              </li>
            }
          </ul>
          @if (data.reviews.length > preview) {
            <div class="mt-6 text-center">
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                [attr.aria-expanded]="expanded()"
                (click)="expanded.set(!expanded())"
                data-testid="google-reviews-toggle"
              >
                {{ expanded() ? i18n.t('reviews.showFewer') : showAllLabel(data.reviews.length) }}
              </button>
            </div>
          }
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

  /** Cards shown before "Show all"; two rows on desktop. */
  protected readonly preview = 6;
  protected readonly expanded = signal(false);

  private readonly loaded = signal<GoogleReviewsData | null>(null);
  protected readonly reviewUrl = computed(() => centreReviewUrl(this.campusId()));

  /** Written reviews only; a centre with no profile, no data or no rating shows nothing. */
  protected readonly shown = computed<GoogleReviewsData | null>(() => {
    const data = this.loaded();
    if (!data || !this.reviewUrl() || (data.rating === null && !data.reviews.length)) return null;
    return { ...data, reviews: data.reviews.filter((r) => r.text) };
  });

  protected readonly visible = computed<readonly GoogleReview[]>(() => {
    const reviews = this.shown()?.reviews ?? [];
    return this.expanded() ? reviews : reviews.slice(0, this.preview);
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

  protected age(review: GoogleReview): string {
    return reviewAge(review.publishTime, review.when, this.i18n.isUr() ? 'ur' : 'en-GB');
  }

  protected showAllLabel(n: number): string {
    return this.i18n.t('reviews.showAll').replace('{n}', String(n));
  }

  protected countLabel(data: GoogleReviewsData): string {
    return this.i18n.t('reviews.count').replace('{n}', String(data.count));
  }

  protected starsLabel(rating: number): string {
    return this.i18n.t('reviews.starsLabel').replace('{n}', String(rating));
  }
}
