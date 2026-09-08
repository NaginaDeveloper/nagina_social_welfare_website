import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import {
  FALLBACK_METAL_PRICES,
  TROY_OUNCE_GRAMS,
  type MetalPrices,
} from '../models/zakat';
import { roundRate } from './zakat-calc';

interface GoldApiQuote {
  readonly price?: number;
  readonly updatedAt?: string;
}

interface FrankfurterRates {
  readonly rates?: { readonly GBP?: number };
}

@Injectable({ providedIn: 'root' })
export class MetalPricesService {
  private readonly zone = inject(NgZone);

  private readonly pricesSignal = signal<MetalPrices>(FALLBACK_METAL_PRICES);
  private readonly loadingSignal = signal(false);

  readonly prices = this.pricesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isLive = computed(() => this.pricesSignal().source === 'live');

  async load(): Promise<void> {
    if (this.loadingSignal()) {
      return;
    }
    this.loadingSignal.set(true);
    await this.zone.runOutsideAngular(async () => {
      try {
        const next = await this.fetchLive();
        this.zone.run(() => this.pricesSignal.set(next));
      } catch {
        this.zone.run(() => {
          if (this.pricesSignal().source !== 'live') {
            this.pricesSignal.set(FALLBACK_METAL_PRICES);
          }
        });
      } finally {
        this.zone.run(() => this.loadingSignal.set(false));
      }
    });
  }

  private async fetchLive(): Promise<MetalPrices> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const [gold, silver, fx] = await Promise.all([
        readJson<GoldApiQuote>('https://api.gold-api.com/price/XAU', controller.signal),
        readJson<GoldApiQuote>('https://api.gold-api.com/price/XAG', controller.signal),
        readJson<FrankfurterRates>(
          'https://api.frankfurter.dev/v1/latest?from=USD&to=GBP',
          controller.signal,
        ),
      ]);
      const gbpPerUsd = fx.rates?.GBP;
      if (
        !(gold.price && gold.price > 0 && silver.price && silver.price > 0 && gbpPerUsd && gbpPerUsd > 0)
      ) {
        throw new Error('Incomplete metal prices');
      }
      return {
        goldGbpPerGram: roundRate((gold.price * gbpPerUsd) / TROY_OUNCE_GRAMS),
        silverGbpPerGram: roundRate((silver.price * gbpPerUsd) / TROY_OUNCE_GRAMS),
        source: 'live',
        updatedAt: gold.updatedAt ?? new Date().toISOString(),
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

async function readJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Metal price request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}
