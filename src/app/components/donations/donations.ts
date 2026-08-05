import { Component, signal } from '@angular/core';

interface BankField {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
}

@Component({
  selector: 'app-donations',
  templateUrl: './donations.html',
})
export class Donations {
  protected readonly copiedKey = signal<string | null>(null);

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
