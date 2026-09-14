import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { DonationService } from '../../services/donation.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';
import { RelatedPages, type RelatedPageLink } from '../related-pages/related-pages';

export type DonationFund = 'zakat' | 'sadaqah' | 'lillah' | 'fitrana';

interface BankField {
  readonly labelKey: string;
  readonly value: string;
  readonly mono?: boolean;
}

interface FundOption {
  readonly id: DonationFund;
  readonly titleKey: string;
  readonly hintKey: string;
  readonly reference: string;
}

@Component({
  selector: 'app-donations',
  imports: [FormsModule, WhatsappIcon, RouterLink, RelatedPages],
  templateUrl: './donations.html',
})
export class Donations implements OnInit {
  private readonly donations = inject(DonationService);
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly givingWhatsApp = whatsappHref(
    'Assalamu alaikum, I have a question about donating to Nagina Social Welfare.',
  );

  protected readonly related: readonly RelatedPageLink[] = [
    { path: '/zakat', label: 'Zakat calculator', hint: 'Estimate before you give' },
    { path: '/zakat/what-is-zakat', label: 'What is Zakat?', hint: 'UK guide' },
    { path: '/work', label: 'Our work', hint: 'Education and welfare' },
    { path: '/impact', label: 'Impact', hint: 'Approved evidence' },
    { path: '/privacy', label: 'Privacy', hint: 'How donations are handled' },
    { path: '/contact', label: 'Contact', hint: 'Ask before you give' },
  ];

  protected readonly copiedKey = signal<string | null>(null);
  protected readonly selectedPreset = signal<number | 'custom'>(25);
  protected readonly customAmount = signal('');
  protected readonly checkoutLoading = signal(false);
  protected readonly checkoutError = signal<string | null>(null);
  protected readonly fund = signal<DonationFund>('sadaqah');

  protected readonly presets = [5, 10, 25, 50, 100] as const;
  protected readonly minDonationGbp = 5;
  protected readonly maxDonationGbp = 25_000;

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
    { labelKey: 'donate.accountName', value: 'NAGINA SOCIAL WELFAR' },
    { labelKey: 'donate.bank', value: 'NatWest' },
    { labelKey: 'donate.sortCode', value: '54-21-38', mono: true },
    { labelKey: 'donate.accountNumber', value: '29135877', mono: true },
    { labelKey: 'donate.bic', value: 'NWBKGB2L', mono: true },
    { labelKey: 'donate.iban', value: 'GB09 NWBK 5421 3829 1358 77', mono: true },
  ];

  protected readonly payItUrl =
    'https://paymentrequest.natwestpayit.com/reusable-links/3fe8950a-0193-440a-b9c4-38deb3144a55';

  protected readonly payPalUrl =
    'https://www.paypal.com/qrcodes/managed/a41a6032-4bec-46fe-b9e9-91f58f35a36b';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const fund = params.get('fund');
      if (fund === 'zakat' || fund === 'sadaqah' || fund === 'lillah' || fund === 'fitrana') {
        this.fund.set(fund);
      }
      const amountRaw = params.get('amount');
      if (!amountRaw) {
        return;
      }
      const amount = Number(amountRaw);
      if (Number.isFinite(amount) && amount > 0) {
        this.selectedPreset.set('custom');
        this.customAmount.set(amount.toFixed(2));
        this.checkoutError.set(null);
      }
    });
  }

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
    if (label === 'donate.sortCode' || label === 'Sort code') {
      text = value.replace(/-/g, '');
    } else if (label === 'donate.iban' || label === 'IBAN') {
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
