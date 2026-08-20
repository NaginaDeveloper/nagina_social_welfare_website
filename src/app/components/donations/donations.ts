import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { DonationService } from '../../services/donation.service';

export type DonationFund = 'zakat' | 'sadaqah' | 'lillah' | 'fitrana';

interface BankField {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}

interface FundOption {
  readonly id: DonationFund;
  readonly titleKey: string;
  readonly hintKey: string;
  readonly reference: string;
}

/** Indicative UK nisab (silver-based, Hanafi caution). Update when gold/silver prices move. */
const SILVER_NISAB_GBP = 520;
const ZAKAT_RATE = 0.025;

@Component({
  selector: 'app-donations',
  imports: [FormsModule],
  templateUrl: './donations.html',
})
export class Donations {
  private readonly donations = inject(DonationService);
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly givingWhatsApp = whatsappHref(
    'Assalamu alaikum, I have a question about donating to Nagina Social Welfare.',
  );

  protected readonly copiedKey = signal<string | null>(null);
  protected readonly selectedPreset = signal<number | 'custom'>(25);
  protected readonly customAmount = signal('');
  protected readonly checkoutLoading = signal(false);
  protected readonly checkoutError = signal<string | null>(null);
  protected readonly fund = signal<DonationFund>('sadaqah');

  protected readonly savings = signal('0');
  protected readonly gold = signal('0');
  protected readonly silver = signal('0');
  protected readonly liabilities = signal('0');

  protected readonly presets = [5, 10, 25, 50, 100] as const;
  protected readonly minDonationGbp = 5;
  protected readonly maxDonationGbp = 25_000;
  protected readonly silverNisabGbp = SILVER_NISAB_GBP;
  protected readonly nisabUpdated = 'August 2026';

  protected readonly funds: readonly FundOption[] = [
    { id: 'zakat', titleKey: 'donate.zakat', hintKey: 'donate.zakatHint', reference: 'ZAKAT' },
    {
      id: 'sadaqah',
      titleKey: 'donate.sadaqah',
      hintKey: 'donate.sadaqahHint',
      reference: 'SADAQAH',
    },
    { id: 'lillah', titleKey: 'donate.lillah', hintKey: 'donate.lillahHint', reference: 'LILLAH' },
    {
      id: 'fitrana',
      titleKey: 'donate.fitrana',
      hintKey: 'donate.fitranaHint',
      reference: 'FITRANA',
    },
  ];

  protected readonly fields: readonly BankField[] = [
    { label: 'Account name', value: 'NAGINA SOCIAL WELFAR' },
    { label: 'Bank', value: 'NatWest' },
    { label: 'Sort code', value: '54-21-38', mono: true },
    { label: 'Account number', value: '29135877', mono: true },
    { label: 'BIC', value: 'NWBKGB2L', mono: true },
    { label: 'IBAN', value: 'GB09 NWBK 5421 3829 1358 77', mono: true },
  ];

  protected readonly payItUrl =
    'https://paymentrequest.natwestpayit.com/reusable-links/3fe8950a-0193-440a-b9c4-38deb3144a55';

  protected readonly payPalUrl =
    'https://www.paypal.com/qrcodes/managed/a41a6032-4bec-46fe-b9e9-91f58f35a36b';

  protected readonly zakatable = computed(() => {
    const assets =
      this.parseMoney(this.savings()) +
      this.parseMoney(this.gold()) +
      this.parseMoney(this.silver());
    return Math.max(0, Math.round((assets - this.parseMoney(this.liabilities())) * 100) / 100);
  });

  protected readonly zakatDue = computed(() => {
    const base = this.zakatable();
    if (base < SILVER_NISAB_GBP) {
      return 0;
    }
    return Math.round(base * ZAKAT_RATE * 100) / 100;
  });

  protected selectedFund(): FundOption {
    return this.funds.find((item) => item.id === this.fund()) ?? this.funds[1];
  }

  protected paymentReference(): string {
    return this.selectedFund().reference;
  }

  protected selectFund(id: DonationFund): void {
    this.fund.set(id);
  }

  protected selectPreset(value: number | 'custom'): void {
    this.selectedPreset.set(value);
    this.checkoutError.set(null);
  }

  protected onCustomAmountInput(value: string | number | null): void {
    this.customAmount.set(value == null ? '' : String(value));
    this.selectedPreset.set('custom');
    this.checkoutError.set(null);
  }

  protected applyZakatAmount(): void {
    const due = this.zakatDue();
    if (due < this.minDonationGbp) {
      return;
    }
    this.fund.set('zakat');
    this.selectedPreset.set('custom');
    this.customAmount.set(due.toFixed(2));
    this.checkoutError.set(null);
  }

  protected resolvedAmount(): number | null {
    if (this.selectedPreset() === 'custom') {
      const n = Number(String(this.customAmount()).trim());
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    }
    return this.selectedPreset() as number;
  }

  protected canStartCheckout(): boolean {
    const amount = this.resolvedAmount();
    return (
      amount !== null && amount >= this.minDonationGbp && amount <= this.maxDonationGbp
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
      const { hostedCheckoutUrl } = await this.donations.createHostedCheckout(
        amount,
        this.fund(),
      );
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

  protected setMoney(
    field: 'savings' | 'gold' | 'silver' | 'liabilities',
    value: string | number | null,
  ): void {
    this[field].set(value == null ? '0' : String(value));
  }

  private parseMoney(raw: string): number {
    const n = Number(String(raw).trim());
    return Number.isFinite(n) && n > 0 ? n : 0;
  }
}
