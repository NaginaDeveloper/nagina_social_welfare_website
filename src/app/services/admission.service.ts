import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SUBMIT_ADMISSION_URL, APPLICATION_STATUS_URL } from '../config/admission-api.config';
import type {
  AdmissionSubmitPayload,
  ApplicationStatusResponse,
  SubmitAdmissionResponse,
} from '../models/admission';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private readonly http = inject(HttpClient);

  async submit(payload: AdmissionSubmitPayload): Promise<SubmitAdmissionResponse> {
    try {
      return await firstValueFrom(
        this.http.post<SubmitAdmissionResponse>(SUBMIT_ADMISSION_URL, payload),
      );
    } catch (err) {
      throw new Error(messageFromHttp(err, 'submit'));
    }
  }

  async lookupStatus(applicationId: string): Promise<ApplicationStatusResponse> {
    try {
      return await firstValueFrom(
        this.http.get<ApplicationStatusResponse>(APPLICATION_STATUS_URL, {
          params: { id: applicationId.trim() },
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
      return 'We could not reach the admissions server. Check your connection and try again.';
    }
    if (err.status === 429) {
      return 'Too many requests from this network. Please wait a few minutes and try again.';
    }
    if (err.status === 403) {
      return kind === 'lookup'
        ? 'This page could not check your application. Please refresh and try again.'
        : 'This page could not send your application. Please refresh and try again.';
    }
    return fallback;
  }
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

function parseErrorBody(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    const trimmed = body.trim();
    try {
      return parseErrorBody(JSON.parse(trimmed));
    } catch {
      if (trimmed.length < 280 && !trimmed.startsWith('<')) return trimmed;
      return null;
    }
  }
  if (!body || typeof body !== 'object') return null;
  const rec = body as Record<string, unknown>;
  if (typeof rec['error'] === 'string' && rec['error'].trim()) return rec['error'].trim();
  if (typeof rec['message'] === 'string' && rec['message'].trim()) {
    return rec['message'].trim();
  }
  const nested = rec['error'];
  if (nested && typeof nested === 'object') {
    const inner = nested as Record<string, unknown>;
    if (typeof inner['message'] === 'string' && inner['message'].trim()) {
      return inner['message'].trim();
    }
  }
  return null;
}
