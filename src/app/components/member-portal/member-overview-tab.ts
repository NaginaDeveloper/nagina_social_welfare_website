import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import type { MemberProfile } from '../../models/membership';
import {
  portalCardClass,
  portalGoldBtnClass,
  portalOutlineBtnClass,
  portalPrimaryBtnClass,
} from './member-portal.shared';
import type { MemberTab } from './member-portal.types';

@Component({
  selector: 'app-member-overview-tab',
  templateUrl: './member-overview-tab.html',
})
export class MemberOverviewTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly portalCardClass = portalCardClass;
  protected readonly portalPrimaryBtnClass = portalPrimaryBtnClass;
  protected readonly portalOutlineBtnClass = portalOutlineBtnClass;
  protected readonly portalGoldBtnClass = portalGoldBtnClass;

  readonly member = input.required<MemberProfile>();
  readonly certificateLoading = input(false);
  readonly orgWhatsApp = input.required<string>();

  readonly downloadCertificate = output<void>();
  readonly logout = output<void>();
  readonly navigateTab = output<MemberTab>();
}
