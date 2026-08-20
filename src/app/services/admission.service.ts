import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SUBMIT_ADMISSION_URL } from '../config/admission-api.config';
import type {
  AdmissionSubmitPayload,
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
      if (err instanceof HttpErrorResponse) {
        const message =
          typeof err.error?.error === 'string'
            ? err.error.error
            : 'Could not submit your application. Please try again or contact us.';
        throw new Error(message);
      }
      throw new Error(
        'Could not submit your application. Please try again or contact us.',
      );
    }
  }
}
