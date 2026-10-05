import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CREATE_DONATION_CHECKOUT_URL } from '../config/donation-api.config';
import { GENERAL_DONATION } from '../models/donation-destination';

export interface CreateCheckoutResponse {
  readonly checkoutId: string;
  readonly checkoutReference: string;
  readonly hostedCheckoutUrl: string;
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly http = inject(HttpClient);

  async createHostedCheckout(
    amount: number,
    fund: 'zakat' | 'sadaqah' | 'lillah' | 'fitrana' = 'sadaqah',
    campus: string = GENERAL_DONATION,
  ): Promise<CreateCheckoutResponse> {
    try {
      return await firstValueFrom(
        this.http.post<CreateCheckoutResponse>(CREATE_DONATION_CHECKOUT_URL, {
          amount,
          fund,
          campus,
        }),
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        const message =
          typeof err.error?.error === 'string'
            ? err.error.error
            : 'Could not start payment. Please try again or use bank transfer.';
        throw new Error(message);
      }
      throw new Error('Could not start payment. Please try again or use bank transfer.');
    }
  }
}
