import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  MEMBERSHIP_STATUS_URL,
  SUBMIT_MEMBERSHIP_URL,
} from '../config/membership-api.config';
import type {
  MembershipStatusResponse,
  MembershipSubmitPayload,
  SubmitMembershipResponse,
} from '../models/membership';

@Injectable({ providedIn: 'root' })
export class MembershipService {
  private readonly http = inject(HttpClient);

  async submit(payload: MembershipSubmitPayload): Promise<SubmitMembershipResponse> {
    let lostResponse = false;
    try {
      return await withRetry(async () => {
        try {
          return await firstValueFrom(
            this.http.post<SubmitMembershipResponse>(SUBMIT_MEMBERSHIP_URL, payload),
          );
        } catch (err) {
          if (err instanceof HttpErrorResponse && err.status === 0) lostResponse = true;
          throw err;
        }
      });
    } catch (err) {
      // An earlier attempt may have been saved before its reply was lost, so the
      // retry then hits the duplicate-email check.
      if (lostResponse && err instanceof HttpErrorResponse && err.status === 409) {
        throw new Error(
          'Your application may already have been received. Please check your email for a confirmation before trying again.',
        );
      }
      throw new Error(messageFromHttp(err, 'submit'));
    }
  }

  async lookupStatus(
    applicationId: string,
    email: string,
  ): Promise<MembershipStatusResponse> {
    try {
      return await firstValueFrom(
        this.http.get<MembershipStatusResponse>(MEMBERSHIP_STATUS_URL, {
          params: {
            id: applicationId.trim(),
            email: email.trim().toLowerCase(),
          },
        }),
      );
    } catch (err) {
      throw new Error(messageFromHttp(err, 'lookup'));
    }
  }
}

/** Waits before each retry; the server cold-starts in a few seconds. */
export const SUBMIT_RETRY_DELAYS_MS = [1500, 3500];

/**
 * True for failures where the request never got a real answer: no response at all
 * (status 0 — network drop, or a server error without CORS headers) or a server-side
 * 5xx. 4xx answers (validation, duplicate, rate limit) are final.
 */
export function isRetryableHttpError(err: unknown): boolean {
  if (!(err instanceof HttpErrorResponse)) return false;
  return err.status === 0 || [500, 502, 503, 504].includes(err.status);
}

export async function withRetry<T>(
  run: () => Promise<T>,
  delaysMs: readonly number[] = SUBMIT_RETRY_DELAYS_MS,
  sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (err) {
      if (attempt >= delaysMs.length || !isRetryableHttpError(err)) throw err;
      await sleep(delaysMs[attempt]);
    }
  }
}

function messageFromHttp(err: unknown, kind: 'submit' | 'lookup'): string {
  const fallback =
    kind === 'lookup'
      ? 'Could not look up that application. Please try again.'
      : 'Could not submit your application. Please try again or contact us.';
  if (err instanceof HttpErrorResponse) {
    const parsed = parseErrorBody(err.error);
    if (parsed) return parsed;
    if (err.status === 0) {
      return 'We could not reach the membership server. Check your connection and try again.';
    }
    if (err.status === 429) {
      return 'Too many requests from this network. Please wait a few minutes and try again.';
    }
    return fallback;
  }
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

function parseErrorBody(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    try {
      return parseErrorBody(JSON.parse(body.trim()));
    } catch {
      return body.trim().length < 280 ? body.trim() : null;
    }
  }
  if (!body || typeof body !== 'object') return null;
  const rec = body as Record<string, unknown>;
  if (typeof rec['error'] === 'string' && rec['error'].trim()) return rec['error'].trim();
  return null;
}
