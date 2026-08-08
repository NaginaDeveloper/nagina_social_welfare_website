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

  protected readonly presets = [10, 25, 50, 100] as const;

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

  protected selectPreset(value: number | 'custom'): void {
    this.selectedPreset.set(value);
    this.checkoutError.set(null);
  }

  protected onCustomAmountInput(value: string): void {
    this.customAmount.set(value);
    this.selectedPreset.set('custom');
    this.checkoutError.set(null);
  }

  protected resolvedAmount(): number | null {
    if (this.selectedPreset() === 'custom') {
      const n = Number(this.customAmount().trim());
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    }
    return this.selectedPreset() as number;
  }

  protected async startCardDonation(): Promise<void> {
    if (this.checkoutLoading()) {
      return;
    }

    const amount = this.resolvedAmount();
    if (amount === null || amount < 5) {
      this.checkoutError.set('Enter a valid donation amount of at least £5.');
      return;
    }
    if (amount > 25_000) {
      this.checkoutError.set('Maximum online donation is £25,000.');
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
