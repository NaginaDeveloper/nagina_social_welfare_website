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
    try {
      return await firstValueFrom(
        this.http.post<SubmitMembershipResponse>(SUBMIT_MEMBERSHIP_URL, payload),
      );
    } catch (err) {
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
