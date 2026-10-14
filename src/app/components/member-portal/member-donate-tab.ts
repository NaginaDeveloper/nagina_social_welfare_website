import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { appealDaysLeft, appealIsGeneral, formatGbp, type PublicAppeal } from '../../models/appeal';
import type { DonationFund } from '../../models/membership';
import { DonationDestination } from '../donation-destination/donation-destination';
import { Icon } from '../ui/icon';
import { MemberPortalLoading } from './member-portal-loading';
import { DONATION_PRESETS, MEMBER_DONATION_FUNDS } from './member-portal.types';

@Component({
  selector: 'app-member-donate-tab',
  imports: [FormsModule, RouterLink, Icon, DonationDestination, MemberPortalLoading],
  templateUrl: './member-donate-tab.html',
})
export class MemberDonateTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly funds = MEMBER_DONATION_FUNDS;
  protected readonly presets = DONATION_PRESETS;

  readonly donatedBanner = input(false);
  /** Appeal from `?appeal=`; locks fund and centre. */
  readonly appeal = input<PublicAppeal | null>(null);
  readonly appealLoading = input(false);
  /** `?appeal=` named something that is no longer open. */
  readonly appealMissing = input(false);
  readonly donateFund = input.required<DonationFund>();
  readonly donateCampus = input.required<string>();
  readonly donateAmount = input.required<number | 'custom'>();
  readonly donateCustom = input('');
  readonly donateLoading = input(false);
  readonly donateAcknowledged = input(false);

  readonly fundChange = output<DonationFund>();
  readonly campusChange = output<string>();
  readonly amountChange = output<number | 'custom'>();
  readonly customAmountChange = output<string>();
  readonly acknowledgeChange = output<boolean>();
  readonly startDonation = output<void>();
  readonly clearAppeal = output<void>();

  protected readonly locked = computed(() => this.appeal() !== null);
  /** Section numbers shift by one when the appeal banner is shown. */
  protected readonly offset = computed(() => (this.locked() ? 1 : 0));

  protected readonly appealTitle = computed(() => {
    const a = this.appeal();
    return a ? this.i18n.pick(a.title, a.titleUr || a.title) : '';
  });
  protected readonly appealCentre = computed(() => {
    const a = this.appeal();
    if (!a) return '';
    return appealIsGeneral(a) ? this.i18n.t('memberHome.appeal.general') : a.campusName || a.campusId;
  });
  protected readonly appealRaised = computed(() => (this.appeal() ? formatGbp(this.appeal()!.raisedTotal) : ''));
  protected readonly appealTarget = computed(() => (this.appeal() ? formatGbp(this.appeal()!.targetAmount) : ''));
  protected readonly appealDays = computed(() => (this.appeal() ? appealDaysLeft(this.appeal()!) : null));

  protected readonly summaryAmount = computed(() => {
    const amount = this.donateAmount();
    if (amount === 'custom') {
      const n = Number(this.donateCustom());
      return Number.isFinite(n) && n > 0 ? formatGbp(n, 2) : '—';
    }
    return formatGbp(amount);
  });

  protected fundLabel(fund: DonationFund): string {
    return this.i18n.t(`donate.${fund}`);
  }

  protected daysLabel(): string {
    const days = this.appealDays();
    if (days === null) return this.i18n.t('memberHome.appeal.openEnded');
    if (days === 0) return this.i18n.t('memberHome.appeal.closesToday');
    return `${days} ${this.i18n.t(days === 1 ? 'memberHome.appeal.dayLeft' : 'memberHome.appeal.daysLeft')}`;
  }
}
