import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import type { DonationFund } from '../../models/membership';
import {
  MemberPortalService,
  portalErrorMessage,
  type MemberDonationRecord,
} from '../../services/member-portal.service';
import { Icon } from '../ui/icon';
import { formatMoney, formatPortalDate } from './member-portal.types';

/**
 * Donation history: a table from `md` up and stacked cards on phones. Receipt downloads
 * are handled here so every place that lists gifts gets the same per-row busy state.
 */
@Component({
  selector: 'app-donation-table',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (receiptError(); as err) {
      <p class="banner-error mb-4" role="alert">{{ err }}</p>
    }

    <!-- md+: table -->
    <div class="hidden overflow-hidden rounded-2xl border border-mist md:block">
      <table class="w-full text-sm">
        <thead class="bg-sand/70 text-xs font-semibold uppercase tracking-[0.12em] text-slate-warm">
          <tr>
            <th scope="col" class="px-4 py-3 text-start">{{ i18n.t('memberHome.colDate') }}</th>
            <th scope="col" class="px-4 py-3 text-start">{{ i18n.t('memberHome.colFund') }}</th>
            <th scope="col" class="px-4 py-3 text-start">{{ i18n.t('memberHome.donations.colAppeal') }}</th>
            <th scope="col" class="px-4 py-3 text-end">{{ i18n.t('memberHome.colAmount') }}</th>
            <th scope="col" class="px-4 py-3 text-end">{{ i18n.t('memberHome.donations.colReceipt') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-mist bg-white">
          @for (d of donations(); track d.id) {
            <tr class="transition-colors hover:bg-sand/30">
              <td class="whitespace-nowrap px-4 py-3 text-forest">{{ date(d) }}</td>
              <td class="px-4 py-3">
                <span class="font-semibold text-forest">{{ fundLabel(d.fund) }}</span>
                <span class="block text-xs text-slate-warm">{{ d.campusName || i18n.t('memberHome.donations.general') }}</span>
              </td>
              <td class="px-4 py-3 text-slate-warm">{{ d.appealTitle || '—' }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-end font-display text-lg font-bold text-forest" dir="ltr">
                {{ money(d) }}
              </td>
              <td class="px-4 py-3 text-end">
                <button
                  type="button"
                  class="btn btn-secondary-light btn-sm"
                  [disabled]="isBusy(d.id)"
                  (click)="download(d)"
                >
                  <app-icon name="receipt" size="h-4 w-4" />
                  {{ isBusy(d.id) ? i18n.t('memberHome.receiptDownloading') : i18n.t('memberHome.receiptDownload') }}
                </button>
                @if (d.receiptId) {
                  <span class="mt-1 block font-mono text-[11px] text-slate-warm" dir="ltr">{{ d.receiptId }}</span>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Phones: cards -->
    <ul class="space-y-3 md:hidden">
      @for (d of donations(); track d.id) {
        <li class="rounded-2xl border border-mist bg-white p-4 shadow-soft">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-semibold text-forest">{{ fundLabel(d.fund) }}</p>
              <p class="text-xs text-slate-warm">
                {{ date(d) }} · {{ d.campusName || i18n.t('memberHome.donations.general') }}
              </p>
              @if (d.appealTitle) {
                <p class="mt-1 text-xs text-slate-warm">
                  <span class="font-semibold text-forest">{{ i18n.t('memberHome.donations.colAppeal') }}:</span>
                  {{ d.appealTitle }}
                </p>
              }
            </div>
            <p class="shrink-0 font-display text-xl font-bold text-forest" dir="ltr">{{ money(d) }}</p>
          </div>
          <div class="mt-3 flex items-center justify-between gap-3">
            @if (d.receiptId) {
              <span class="font-mono text-[11px] text-slate-warm" dir="ltr">{{ d.receiptId }}</span>
            } @else {
              <span></span>
            }
            <button type="button" class="btn btn-secondary-light btn-sm" [disabled]="isBusy(d.id)" (click)="download(d)">
              <app-icon name="receipt" size="h-4 w-4" />
              {{ isBusy(d.id) ? i18n.t('memberHome.receiptDownloading') : i18n.t('memberHome.receiptDownload') }}
            </button>
          </div>
        </li>
      }
    </ul>
  `,
})
export class DonationTable {
  protected readonly i18n = inject(LanguageService);
  private readonly portal = inject(MemberPortalService);

  readonly donations = input.required<readonly MemberDonationRecord[]>();

  protected readonly receiptBusy = signal<string | null>(null);
  protected readonly receiptError = signal<string | null>(null);

  protected fundLabel(fund: DonationFund): string {
    return this.i18n.t(`donate.${fund}`);
  }

  protected money(d: MemberDonationRecord): string {
    return formatMoney(d.amount, d.currency || 'GBP');
  }

  protected date(d: MemberDonationRecord): string {
    return formatPortalDate(d.paidAt, this.i18n.lang());
  }

  protected isBusy(id: string): boolean {
    return this.receiptBusy() === id;
  }

  protected async download(d: MemberDonationRecord): Promise<void> {
    if (this.receiptBusy()) return;
    this.receiptError.set(null);
    this.receiptBusy.set(d.id);
    try {
      await this.portal.downloadDonationReceipt(d.id, d.receiptId);
    } catch (err) {
      this.receiptError.set(portalErrorMessage(err));
    } finally {
      this.receiptBusy.set(null);
    }
  }
}
