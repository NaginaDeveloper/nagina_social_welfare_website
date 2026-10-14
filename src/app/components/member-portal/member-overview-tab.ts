import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import type { PublicAppeal } from '../../models/appeal';
import { appealDonateQuery } from '../../models/appeal';
import type { MemberProfile } from '../../models/membership';
import type { MemberDonationRecord, MemberPortalEvent } from '../../services/member-portal.service';
import { CentreContacts } from '../centre-contacts/centre-contacts';
import { Icon } from '../ui/icon';
import { AppealCard } from './appeal-card';
import { MemberCard } from './member-card';
import { MemberPortalLoading } from './member-portal-loading';
import { formatMoney } from './member-portal.types';
import { StatTile } from './stat-tile';

@Component({
  selector: 'app-member-overview-tab',
  imports: [RouterLink, CentreContacts, Icon, AppealCard, MemberCard, MemberPortalLoading, StatTile],
  templateUrl: './member-overview-tab.html',
})
export class MemberOverviewTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  readonly member = input.required<MemberProfile>();
  readonly certificateLoading = input(false);
  readonly donations = input<readonly MemberDonationRecord[]>([]);
  readonly donationsLoading = input(false);
  readonly events = input<readonly MemberPortalEvent[]>([]);
  readonly eventsLoading = input(false);
  readonly appeals = input<readonly PublicAppeal[]>([]);
  readonly appealsLoading = input(false);

  readonly downloadCertificate = output<void>();

  protected readonly givenThisYear = computed(() => {
    const year = new Date().getFullYear();
    const total = this.donations()
      .filter((d) => d.paidAt && new Date(d.paidAt).getFullYear() === year)
      .reduce((sum, d) => sum + (Number.isFinite(d.amount) ? d.amount : 0), 0);
    return formatMoney(total);
  });

  protected readonly giftCount = computed(() => this.donations().length);
  protected readonly upcomingCount = computed(() => this.events().length);
  protected readonly nextEvent = computed(() => this.events()[0] ?? null);
  protected readonly topAppeals = computed(() => this.appeals().slice(0, 2));

  protected donateLink(appeal: PublicAppeal) {
    return { commands: ['/membership/home'], queryParams: appealDonateQuery(appeal) };
  }

  protected eventTitle(event: MemberPortalEvent): string {
    return this.i18n.pick(event.title, event.titleUr || event.title);
  }
}
