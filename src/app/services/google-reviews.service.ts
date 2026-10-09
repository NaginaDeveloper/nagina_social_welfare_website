import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GOOGLE_REVIEWS_URL } from '../config/google-reviews-api.config';
import { parseGoogleReviews, type GoogleReviewsData } from '../models/google-reviews';

/**
 * A centre's Google rating and recent reviews, fetched in the browser so new reviews appear
 * without a release. Prerender skips it, and any failure just means the section stays hidden.
 */
@Injectable({ providedIn: 'root' })
export class GoogleReviewsService {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly loads = new Map<string, Promise<GoogleReviewsData | null>>();

  load(campusId: string): Promise<GoogleReviewsData | null> {
    if (!this.browser) return Promise.resolve(null);
    let pending = this.loads.get(campusId);
    if (!pending) {
      pending = firstValueFrom(
        this.http.get<unknown>(`${GOOGLE_REVIEWS_URL}?campus=${encodeURIComponent(campusId)}`),
      )
        .then(parseGoogleReviews)
        .catch(() => null);
      this.loads.set(campusId, pending);
    }
    return pending;
  }
}
