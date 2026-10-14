import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import type { MemberDonationRecord } from '../../services/member-portal.service';
import { Icon } from '../ui/icon';
import { DonationTable } from './donation-table';
import { MemberPortalLoading } from './member-portal-loading';
import { formatMoney } from './member-portal.types';
import { StatTile } from './stat-tile';

/** Donation history with totals and receipts. */
@Component({
  selector: 'app-member-donations-tab',
  imports: [RouterLink, Icon, DonationTable, MemberPortalLoading, StatTile],
  template: `
    <div id="member-panel-donations" role="tabpanel" aria-labelledby="member-tab-donations" class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="eyebrow">{{ i18n.t('memberHome.tabDonations') }}</p>
          <h2 class="mt-1 font-display text-2xl font-bold text-forest sm:text-3xl">{{ i18n.t('memberHome.donations.title') }}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.donations.lead') }}</p>
        </div>
        <a routerLink="/membership/home" [queryParams]="{ tab: 'donate' }" class="btn btn-primary btn-sm">
          <app-icon name="heart" size="h-4 w-4" />
          {{ i18n.t('memberHome.donations.giveAgain') }}
        </a>
      </div>

      @if (loading()) {
        <app-member-portal-loading [rows]="3" [offsetTop]="false" />
      } @else if (!donations().length) {
        <div class="rounded-3xl border border-dashed border-mist bg-sand/40 px-6 py-12 text-center">
          <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-600" aria-hidden="true">
            <app-icon name="receipt" size="h-7 w-7" [strokeWidth]="1.5" />
          </span>
          <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-warm">{{ i18n.t('memberHome.donateEmpty') }}</p>
          <a routerLink="/membership/home" [queryParams]="{ tab: 'donate' }" class="btn btn-primary mt-6">
            {{ i18n.t('memberHome.donations.emptyCta') }}
          </a>
        </div>
      } @else {
        <div class="grid gap-3 sm:grid-cols-3">
          <app-stat-tile icon="heart" [label]="i18n.t('memberHome.donations.total')" [value]="total()" />
          <app-stat-tile icon="calendar" [label]="i18n.t('memberHome.donations.thisYear')" [value]="thisYear()" />
          <app-stat-tile icon="receipt" [label]="i18n.t('memberHome.donations.count')" [value]="donations().length" />
        </div>
        <div class="card">
          <app-donation-table [donations]="donations()" />
        </div>
      }
    </div>
  `,
})
export class MemberDonationsTab {
  protected readonly i18n = inject(LanguageService);

  readonly donations = input<readonly MemberDonationRecord[]>([]);
  readonly loading = input(false);

  protected readonly total = computed(() =>
    formatMoney(this.donations().reduce((sum, d) => sum + (Number.isFinite(d.amount) ? d.amount : 0), 0)),
  );

  protected readonly thisYear = computed(() => {
    const year = new Date().getFullYear();
    return formatMoney(
      this.donations()
        .filter((d) => d.paidAt && new Date(d.paidAt).getFullYear() === year)
        .reduce((sum, d) => sum + (Number.isFinite(d.amount) ? d.amount : 0), 0),
    );
  });
}
