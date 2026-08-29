import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import type { DonationFund } from '../../models/membership';
import type { MemberDonationRecord } from '../../services/member-portal.service';
import { MemberPortalEmpty } from './member-portal-empty';
import { MemberPortalLoading } from './member-portal-loading';
import {
  MEMBER_DONATION_FUNDS,
  portalCardClass,
  portalInputClass,
  portalPrimaryBtnClass,
  portalSuccessBannerClass,
} from './member-portal.shared';

@Component({
  selector: 'app-member-donate-tab',
  imports: [FormsModule, RouterLink, MemberPortalLoading, MemberPortalEmpty],
  templateUrl: './member-donate-tab.html',
})
export class MemberDonateTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly funds = MEMBER_DONATION_FUNDS;
  protected readonly presets = [5, 10, 25, 50, 100] as const;
  protected readonly portalCardClass = portalCardClass;
  protected readonly portalInputClass = portalInputClass;
  protected readonly portalPrimaryBtnClass = portalPrimaryBtnClass;
  protected readonly portalSuccessBannerClass = portalSuccessBannerClass;

  readonly donatedBanner = input(false);
  readonly donateFund = input.required<DonationFund>();
  readonly donateAmount = input.required<number | 'custom'>();
  readonly donateCustom = input('');
  readonly donateLoading = input(false);
  readonly donateAcknowledged = input(false);
  readonly donations = input<MemberDonationRecord[]>([]);
  readonly donationsLoading = input(false);

  readonly fundChange = output<DonationFund>();
  readonly amountChange = output<number | 'custom'>();
  readonly customAmountChange = output<string>();
  readonly acknowledgeChange = output<boolean>();
  readonly startDonation = output<void>();

  protected fundLabel(fund: DonationFund): string {
    return this.i18n.t(`donate.${fund}`);
  }

  protected formatMoney(amount: number, currency = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
  }

  protected formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
  }
}
