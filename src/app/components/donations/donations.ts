import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../../services/donation.service';

interface BankField {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}

@Component({
  selector: 'app-donations',
  imports: [FormsModule],
  templateUrl: './donations.html',
})
export class Donations {
  private readonly donations = inject(DonationService);

  protected readonly copiedKey = signal<string | null>(null);
  protected readonly selectedPreset = signal<number | 'custom'>(25);
  protected readonly customAmount = signal('');
  protected readonly checkoutLoading = signal(false);
  protected readonly checkoutError = signal<string | null>(null);

  protected readonly presets = [5, 10, 25, 50, 100] as const;
  protected readonly minDonationGbp = 5;
  protected readonly maxDonationGbp = 25_000;

  protected readonly fields: readonly BankField[] = [
    { label: 'Account name', value: 'NAGINA SOCIAL WELFAR' },
    { label: 'Bank', value: 'NatWest' },
    { label: 'Sort code', value: '54-21-38', mono: true },
    { label: 'Account number', value: '29135877', mono: true },
    { label: 'BIC', value: 'NWBKGB2L', mono: true },
    { label: 'IBAN', value: 'GB09 NWBK 5421 3829 1358 77', mono: true },
  ];

  protected readonly referenceHint =
    'Please use your name as the payment reference so we can thank you.';

  /** NatWest PayIt reusable payment request (bank app / QR). */
  protected readonly payItUrl =
    'https://paymentrequest.natwestpayit.com/reusable-links/3fe8950a-0193-440a-b9c4-38deb3144a55';

  /** PayPal managed QR / pay link for Nagina Social Welfare UK Ltd. */
  protected readonly payPalUrl =
    'https://www.paypal.com/qrcodes/managed/a41a6032-4bec-46fe-b9e9-91f58f35a36b';

  protected selectPreset(value: number | 'custom'): void {
    this.selectedPreset.set(value);
    this.checkoutError.set(null);
  }

  protected onCustomAmountInput(value: string | number | null): void {
    this.customAmount.set(value == null ? '' : String(value));
    this.selectedPreset.set('custom');
    this.checkoutError.set(null);
  }

  protected resolvedAmount(): number | null {
    if (this.selectedPreset() === 'custom') {
      const n = Number(String(this.customAmount()).trim());
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    }
    return this.selectedPreset() as number;
  }

  /** Used to disable the donate CTA when custom amount is below the minimum. */
  protected canStartCheckout(): boolean {
    const amount = this.resolvedAmount();
    return (
      amount !== null &&
      amount >= this.minDonationGbp &&
      amount <= this.maxDonationGbp
    );
  }

  protected async startCardDonation(): Promise<void> {
    if (this.checkoutLoading()) {
      return;
    }

    const amount = this.resolvedAmount();
    if (amount === null || amount < this.minDonationGbp) {
      this.checkoutError.set(
        `Minimum online donation is £${this.minDonationGbp}. Please enter £${this.minDonationGbp} or more.`,
      );
      return;
    }
    if (amount > this.maxDonationGbp) {
      this.checkoutError.set(
        `Maximum online donation is £${this.maxDonationGbp.toLocaleString('en-GB')}.`,
      );
      return;
    }

    this.checkoutLoading.set(true);
    this.checkoutError.set(null);

    try {
      const { hostedCheckoutUrl } = await this.donations.createHostedCheckout(amount);
      window.location.href = hostedCheckoutUrl;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not start payment. Please try again or use bank transfer.';
      this.checkoutError.set(message);
      this.checkoutLoading.set(false);
    }
  }

  protected async copyValue(label: string, value: string): Promise<void> {
    let text = value;
    if (label === 'Sort code') {
      text = value.replace(/-/g, '');
    } else if (label === 'IBAN') {
      text = value.replace(/\s/g, '');
    }
    try {
      await navigator.clipboard.writeText(text);
      this.copiedKey.set(label);
      window.setTimeout(() => {
        if (this.copiedKey() === label) {
          this.copiedKey.set(null);
        }
      }, 2000);
    } catch {
      // Clipboard may be blocked; leave UI unchanged.
    }
  }
}
