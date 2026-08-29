import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberAuthService } from '../../services/member-auth.service';
import {
  MemberPortalService,
  portalErrorMessage,
  type MemberDonationRecord,
  type MemberNewsletter,
  type MemberPortalEvent,
} from '../../services/member-portal.service';
import type { DonationFund } from '../../models/membership';
import { isValidUkPhone, formatUkPhoneE164, formatUkPhoneForDisplay } from '../../validators/uk.validators';
import { PageShell } from '../page-shell';
import { MemberPortalShell } from '../../components/member-portal/member-portal-shell';
import { MemberPortalLoading } from '../../components/member-portal/member-portal-loading';
import { MemberOverviewTab } from '../../components/member-portal/member-overview-tab';
import { MemberProfileTab, type MemberProfileSavePayload } from '../../components/member-portal/member-profile-tab';
import { MemberDonateTab } from '../../components/member-portal/member-donate-tab';
import { MemberEventsTab } from '../../components/member-portal/member-events-tab';
import { MemberNewslettersTab } from '../../components/member-portal/member-newsletters-tab';
import { MEMBER_TABS, parseMemberTab, type MemberTab } from '../../components/member-portal/member-portal.types';
import { whatsappHref } from '../../config/organization.config';
import { portalErrorBannerClass, portalPrimaryBtnClass } from '../../components/member-portal/member-portal.shared';

@Component({
  selector: 'app-membership-home-page',
  imports: [
    PageShell,
    RouterLink,
    MemberPortalShell,
    MemberPortalLoading,
    MemberOverviewTab,
    MemberProfileTab,
    MemberDonateTab,
    MemberEventsTab,
    MemberNewslettersTab,
  ],
  templateUrl: './membership-home-page.html',
  styleUrl: './membership-home-page.css',
})
export class MembershipHomePage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly orgWhatsApp = whatsappHref(
    'Assalamu alaikum, I am interested in volunteering with Nagina Social Welfare UK.',
  );
  protected readonly tabs = MEMBER_TABS;
  protected readonly portalErrorBannerClass = portalErrorBannerClass;
  protected readonly portalPrimaryBtnClass = portalPrimaryBtnClass;

  private readonly auth = inject(MemberAuthService);
  private readonly portal = inject(MemberPortalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly member = this.auth.member;
  protected readonly loading = this.auth.loading;
  protected readonly tab = signal<MemberTab>('overview');

  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly phoneError = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly certificateLoading = signal(false);
  protected readonly donatedBanner = signal(false);

  protected readonly donateFund = signal<DonationFund>('sadaqah');
  protected readonly donateAmount = signal<number | 'custom'>(25);
  protected readonly donateCustom = signal('');
  protected readonly donateLoading = signal(false);
  protected readonly donateAcknowledged = signal(false);
  protected readonly donations = signal<MemberDonationRecord[]>([]);
  protected readonly donationsLoading = signal(false);

  protected readonly events = signal<MemberPortalEvent[]>([]);
  protected readonly eventsLoading = signal(false);
  protected readonly rsvpBusy = signal<string | null>(null);

  protected readonly newsletters = signal<MemberNewsletter[]>([]);
  protected readonly newslettersLoading = signal(false);
  protected readonly newslettersError = signal<string | null>(null);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('donated') === '1') {
      this.donatedBanner.set(true);
      this.activateTab('donate', { syncUrl: false });
    } else {
      this.tab.set(parseMemberTab(params.get('tab')));
    }

    this.route.queryParamMap.subscribe((map) => {
      if (map.get('donated') === '1') {
        this.donatedBanner.set(true);
      }
      const next = parseMemberTab(map.get('tab'));
      if (next !== this.tab()) {
        this.activateTab(next, { syncUrl: false });
      }
    });

    void this.auth.restoreSession().then(() => {
      const m = this.auth.member();
      if (!m) {
        void this.router.navigate(['/membership/login']);
        return;
      }
      void this.loadDonations();
      void this.loadEvents();
      if (this.tab() === 'newsletters') void this.loadNewsletters();
    });
  }

  protected pageTitle(): string {
    return this.i18n.t('memberHome.pageTitle');
  }

  protected setTab(id: MemberTab): void {
    this.activateTab(id, { syncUrl: true });
  }

  private activateTab(id: MemberTab, options: { syncUrl: boolean }): void {
    this.tab.set(id);
    this.error.set(null);
    if (id === 'donate') void this.loadDonations();
    if (id === 'events') void this.loadEvents();
    if (id === 'newsletters') void this.loadNewsletters();
    if (options.syncUrl) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: id === 'overview' ? null : id },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  protected async saveProfile(payload: MemberProfileSavePayload): Promise<void> {
    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);
    this.phoneError.set(null);
    const trimmedPhone = payload.phone.trim();
    if (!trimmedPhone || !isValidUkPhone(trimmedPhone)) {
      this.phoneError.set(this.i18n.t('membership.err.phone'));
      this.saving.set(false);
      return;
    }
    try {
      await this.auth.updateProfile({
        phone: formatUkPhoneE164(trimmedPhone),
        marketingOptIn: payload.marketingOptIn,
        address: {
          line1: payload.address.line1.trim(),
          line2: payload.address.line2.trim(),
          city: payload.address.city.trim(),
          postcode: payload.address.postcode.trim(),
        },
        interests: payload.interests,
      });
      this.saved.set(true);
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.saving.set(false);
    }
  }

  protected async downloadCertificate(): Promise<void> {
    this.certificateLoading.set(true);
    this.error.set(null);
    try {
      await this.portal.downloadCertificate();
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.certificateLoading.set(false);
    }
  }

  protected donateAmountValue(): number | null {
    if (this.donateAmount() === 'custom') {
      const n = Number(this.donateCustom());
      return Number.isFinite(n) ? n : null;
    }
    const preset = this.donateAmount();
    return typeof preset === 'number' ? preset : null;
  }

  protected async startDonation(): Promise<void> {
    if (!this.donateAcknowledged()) {
      this.error.set(this.i18n.t('memberHome.donateAckRequired'));
      return;
    }
    const amount = this.donateAmountValue();
    if (amount == null || amount < 5) {
      this.error.set(this.i18n.t('memberHome.donateMin'));
      return;
    }
    this.donateLoading.set(true);
    this.error.set(null);
    try {
      const url = await this.portal.startDonationCheckout(amount, this.donateFund());
      window.location.href = url;
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.donateLoading.set(false);
    }
  }

  protected async setRsvp(event: MemberPortalEvent, status: 'going' | 'cancelled'): Promise<void> {
    this.rsvpBusy.set(event.id);
    this.error.set(null);
    try {
      await this.portal.rsvpEvent(event.id, status, 1);
      await this.loadEvents();
    } catch (err) {
      this.error.set(portalErrorMessage(err));
    } finally {
      this.rsvpBusy.set(null);
    }
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/membership/login']);
  }

  private async loadDonations(): Promise<void> {
    this.donationsLoading.set(true);
    try {
      this.donations.set(await this.portal.listDonations());
    } catch {
      this.donations.set([]);
    } finally {
      this.donationsLoading.set(false);
    }
  }

  private async loadEvents(): Promise<void> {
    this.eventsLoading.set(true);
    try {
      this.events.set(await this.portal.listEvents());
    } catch {
      this.events.set([]);
    } finally {
      this.eventsLoading.set(false);
    }
  }

  private async loadNewsletters(): Promise<void> {
    this.newslettersLoading.set(true);
    this.newslettersError.set(null);
    try {
      this.newsletters.set(await this.portal.listNewsletters());
    } catch (err) {
      this.newsletters.set([]);
      this.newslettersError.set(portalErrorMessage(err));
    } finally {
      this.newslettersLoading.set(false);
    }
  }
}
