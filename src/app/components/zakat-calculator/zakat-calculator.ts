import { Component, NgZone, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import {
  GOLD_KARATS,
  GOLD_NISAB_GRAMS,
  GOLD_NISAB_TOLA,
  SILVER_NISAB_GRAMS,
  SILVER_NISAB_TOLA,
  TOLA_GRAMS,
  ZAKAT_RATE,
  type GoldKarat,
  type SilverPurity,
  type WeightUnit,
} from '../../models/zakat';
import { MetalPricesService } from '../../services/metal-prices.service';
import { calculateZakat } from '../../services/zakat-calc';
import { RelatedPages } from '../related-pages/related-pages';

interface GoldRow {
  readonly id: number;
  weight: string;
  unit: WeightUnit;
  karat: GoldKarat;
}

interface SilverRow {
  readonly id: number;
  weight: string;
  unit: WeightUnit;
  purity: SilverPurity;
}

let nextRowId = 1;

function newGoldRow(): GoldRow {
  return { id: nextRowId++, weight: '', unit: 'g', karat: 22 };
}

function newSilverRow(): SilverRow {
  return { id: nextRowId++, weight: '', unit: 'g', purity: 999 };
}

@Component({
  selector: 'app-zakat-calculator',
  imports: [FormsModule, RouterLink, RelatedPages],
  templateUrl: './zakat-calculator.html',
})
export class ZakatCalculator implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly metals = inject(MetalPricesService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  protected readonly related = [
    { path: '/zakat/what-is-zakat', label: 'What is Zakat?', hint: 'UK guide' },
    { path: '/zakat/rules', label: 'Zakat rules', hint: 'Assets, nisab and FAQs' },
    { path: '/donate', label: 'Donate', hint: 'Give your calculated Zakat' },
    { path: '/work', label: 'Our work', hint: 'How gifts are used' },
    { path: '/impact', label: 'Impact', hint: 'Approved programme evidence' },
    { path: '/contact', label: 'Contact', hint: 'Questions about giving' },
  ] as const;

  protected readonly goldKarats = GOLD_KARATS;
  protected readonly goldNisabTola = GOLD_NISAB_TOLA;
  protected readonly silverNisabTola = SILVER_NISAB_TOLA;
  protected readonly goldNisabGrams = GOLD_NISAB_GRAMS;
  protected readonly silverNisabGrams = SILVER_NISAB_GRAMS;
  protected readonly tolaGrams = TOLA_GRAMS;
  protected readonly zakatPercent = ZAKAT_RATE * 100;

  protected readonly cash = signal('');
  protected readonly business = signal('');
  protected readonly investments = signal('');
  protected readonly receivables = signal('');
  protected readonly debts = signal('');
  protected readonly hawlComplete = signal(true);
  protected readonly goldItems = signal<GoldRow[]>([newGoldRow()]);
  protected readonly silverItems = signal<SilverRow[]>([newSilverRow()]);

  protected readonly result = computed(() =>
    calculateZakat({
      cashGbp: parseAmount(this.cash()),
      gold: this.goldItems().map((row) => ({
        weight: parseAmount(row.weight),
        unit: row.unit,
        karat: row.karat,
      })),
      silver: this.silverItems().map((row) => ({
        weight: parseAmount(row.weight),
        unit: row.unit,
        purity: row.purity,
      })),
      businessGbp: parseAmount(this.business()),
      investmentsGbp: parseAmount(this.investments()),
      receivablesGbp: parseAmount(this.receivables()),
      debtsGbp: parseAmount(this.debts()),
      hawlComplete: this.hawlComplete(),
      goldGbpPerGram: this.metals.prices().goldGbpPerGram,
      silverGbpPerGram: this.metals.prices().silverGbpPerGram,
    }),
  );

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      void this.metals.load();
    });
  }

  protected gbp(value: number): string {
    return value.toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  protected grams(value: number): string {
    return value.toLocaleString('en-GB', { maximumFractionDigits: 2 });
  }

  protected priceDate(): string {
    const raw = this.metals.prices().updatedAt;
    const parsed = Date.parse(raw);
    if (Number.isNaN(parsed)) {
      return raw;
    }
    return new Date(parsed).toLocaleDateString(this.i18n.isUr() ? 'ur-PK' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  protected setGold(id: number, patch: Partial<Omit<GoldRow, 'id'>>): void {
    this.goldItems.update((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  protected setGoldKarat(id: number, value: string | number): void {
    const karat = Number(value) as GoldKarat;
    if ((this.goldKarats as readonly number[]).includes(karat)) {
      this.setGold(id, { karat });
    }
  }

  protected setSilver(id: number, patch: Partial<Omit<SilverRow, 'id'>>): void {
    this.silverItems.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  protected setSilverPurity(id: number, value: string | number): void {
    const purity = Number(value) as SilverPurity;
    if (purity === 999 || purity === 925) {
      this.setSilver(id, { purity });
    }
  }

  protected addGold(): void {
    this.goldItems.update((rows) => [...rows, newGoldRow()]);
  }

  protected addSilver(): void {
    this.silverItems.update((rows) => [...rows, newSilverRow()]);
  }

  protected removeGold(id: number): void {
    this.goldItems.update((rows) => (rows.length > 1 ? rows.filter((row) => row.id !== id) : rows));
  }

  protected removeSilver(id: number): void {
    this.silverItems.update((rows) =>
      rows.length > 1 ? rows.filter((row) => row.id !== id) : rows,
    );
  }

  protected reset(): void {
    this.cash.set('');
    this.business.set('');
    this.investments.set('');
    this.receivables.set('');
    this.debts.set('');
    this.hawlComplete.set(true);
    this.goldItems.set([newGoldRow()]);
    this.silverItems.set([newSilverRow()]);
  }

  protected async giveZakat(): Promise<void> {
    const due = this.result().zakatDueGbp;
    if (due <= 0) {
      return;
    }
    await this.router.navigate(['/donate'], {
      queryParams: { fund: 'zakat', amount: due.toFixed(2) },
    });
  }
}

function parseAmount(raw: string): number {
  const n = Number(String(raw).trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
}
