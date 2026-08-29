import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import type { MemberNewsletter } from '../../services/member-portal.service';
import { MemberPortalEmpty } from './member-portal-empty';
import { MemberPortalLoading } from './member-portal-loading';
import { portalCardClass, portalPrimaryBtnClass } from './member-portal.shared';

@Component({
  selector: 'app-member-newsletters-tab',
  imports: [MemberPortalLoading, MemberPortalEmpty],
  templateUrl: './member-newsletters-tab.html',
})
export class MemberNewslettersTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly portalCardClass = portalCardClass;
  protected readonly portalPrimaryBtnClass = portalPrimaryBtnClass;

  readonly marketingOptIn = input(false);
  readonly newsletters = input<MemberNewsletter[]>([]);
  readonly newslettersLoading = input(false);
  readonly newslettersError = input<string | null>(null);

  readonly openProfile = output<void>();

  protected formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
  }
}
