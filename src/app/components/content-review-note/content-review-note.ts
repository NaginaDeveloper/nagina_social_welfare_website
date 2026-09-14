import { Component, input } from '@angular/core';
import {
  CONTENT_REVIEW,
  type ContentReviewEntry,
} from '../../config/content-review.config';

@Component({
  selector: 'app-content-review-note',
  template: `
    @if (entry(); as review) {
      <aside
        class="mx-auto mt-10 max-w-3xl rounded-xl border border-mist bg-sand/50 px-5 py-4 text-sm text-slate-warm"
      >
        @if (review.lastChecked) {
          <p>
            <span class="font-semibold text-forest">Last checked:</span>
            {{ review.lastChecked }}
          </p>
        }
        @if (review.reviewer?.name) {
          <p class="mt-1">
            <span class="font-semibold text-forest">Reviewed by:</span>
            {{ review.reviewer.name }}
            @if (review.reviewer.credentials) {
              <span> — {{ review.reviewer.credentials }}</span>
            }
            @if (review.reviewer.reviewedOn) {
              <span> ({{ review.reviewer.reviewedOn }})</span>
            }
          </p>
        }
        @if (review.sources?.length) {
          <p class="mt-2 font-semibold text-forest">Sources</p>
          <ul class="mt-1 list-disc space-y-1 ps-5">
            @for (source of review.sources; track source) {
              <li>{{ source }}</li>
            }
          </ul>
        }
        <p class="mt-2 text-xs leading-relaxed">
          Religious guidance on this site is educational. For personal rulings, consult a
          qualified scholar. Impact and programme claims are published only when approved.
        </p>
      </aside>
    }
  `,
})
export class ContentReviewNote {
  readonly pageId = input.required<string>();

  protected entry(): ContentReviewEntry | undefined {
    const id = this.pageId();
    return CONTENT_REVIEW[id];
  }
}
