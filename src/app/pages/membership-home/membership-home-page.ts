import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, type ParamMap } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { MemberAuthService } from '../../services/member-auth.service';
import {
  MemberPortalService,
  portalErrorMessage,
  type MemberDonationRecord,
  type MemberNewsletter,
  type MemberPortalEvent,
} from '../../services/member-portal.service';
import { AppealsService } from '../../services/appeals.service';
import { appealIsGeneral, appealIsOpen, type PublicAppeal } from '../../models/appeal';
import type { DonationFund } from '../../models/membership';
import { isValidUkPhone, formatUkPhoneE164 } from '../../validators/uk.validators';
import { loginUrlFor } from '../../utils/safe-return-url';
import { PageShell } from '../page-shell';
import { MemberPortalShell } from '../../components/member-portal/member-portal-shell';
import { MemberPortalLoading } from '../../components/member-portal/member-portal-loading';
import { MemberSidebar } from '../../components/member-portal/member-sidebar';
import { MemberOverviewTab } from '../../components/member-portal/member-overview-tab';
import { MemberAppealsTab } from '../../components/member-portal/member-appeals-tab';
import { MemberProfileTab, type MemberProfileSavePayload } from '../../components/member-portal/member-profile-tab';
import { MemberDonateTab } from '../../components/member-portal/member-donate-tab';
import { MemberDonationsTab } from '../../components/member-portal/member-donations-tab';
import { MemberEventsTab } from '../../components/member-portal/member-events-tab';
import { MemberNewslettersTab } from '../../components/member-portal/member-newsletters-tab';
import {
  DONATION_PRESETS,
  parseMemberTab,
  type MemberTab,
} from '../../components/member-portal/member-portal.types';

const FUNDS: readonly DonationFund[] = ['zakat', 'sadaqah', 'lillah', 'fitrana'];

/**
 * Member dashboard. Sidebar on desktop, scrolling tabs on phones; the active section is the
 * `?tab=` query parameter so campaign emails can deep-link (`?tab=donate&appeal=…&amount=…`).
 * Signed-out visitors are sent to sign in with a `returnUrl` back to the same view.
 */
@Component({
  selector: 'app-membership-home-page',
  imports: [
    PageShell,
    RouterLink,
    MemberPortalShell,
    MemberPortalLoading,
    MemberSidebar,
    MemberOverviewTab,
    MemberAppealsTab,
    MemberProfileTab,
    MemberDonateTab,
    MemberDonationsTab,
    MemberEventsTab,
    MemberNewslettersTab,
  ],
  templateUrl: './membership-home-page.html',
  styleUrl: './membership-home-page.css',
})
export class MembershipHomePage implements OnInit {
  protected readonly i18n = inject(LanguageService);

  private readonly auth = inject(MemberAuthService);
  private readonly portal = inject(MemberPortalService);
  private readonly appealsApi = inject(AppealsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly member = this.auth.member;
  protected readonly loading = this.auth.loading;
  protected readonly tab = signal<MemberTab>('overview');
  /** True once the session check has finished, so the signed-out state never flashes. */
  protected readonly ready = signal(false);

  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly phoneError = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly certificateLoading = signal(false);
  protected readonly donatedBanner = signal(false);

  protected readonly donateFund = signal<DonationFund>('sadaqah');
  /** Empty until the member picks a centre; every gift is attributed to one. */
  protected readonly donateCampus = signal<string>('');
  protected readonly donateAmount = signal<number | 'custom'>(25);
  protected readonly donateCustom = signal('');
  protected readonly donateLoading = signal(false);
  protected readonly donateAcknowledged = signal(false);
  protected readonly donations = signal<MemberDonationRecord[]>([]);
  protected readonly donationsLoading = signal(false);

  /** Appeal named by `?appeal=`; locks the fund and centre on the donate tab. */
  protected readonly donateAppeal = signal<PublicAppeal | null>(null);
  protected readonly donateAppealLoading = signal(false);
  protected readonly donateAppealMissing = signal(false);
  private appealParam = '';

  protected readonly appeals = signal<PublicAppeal[]>([]);
  protected readonly appealsLoading = signal(false);
  protected readonly appealsError = signal<string | null>(null);
  private appealsLoaded = false;

  protected readonly events = signal<MemberPortalEvent[]>([]);
  protected readonly eventsLoading = signal(false);
  protected readonly rsvpBusy = signal<string | null>(null);

  protected readonly newsletters = signal<MemberNewsletter[]>([]);
  protected readonly newslettersLoading = signal(false);
  protected readonly newslettersError = signal<string | null>(null);
  private newslettersLoaded = false;

  ngOnInit(): void {
    this.applyParams(this.route.snapshot.queryParamMap, true);

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((map) => this.applyParams(map, false));

    void this.auth.restoreSession(true).then(() => {
      this.ready.set(true);
      if (!this.auth.member()) {
        const login = loginUrlFor(this.router.url);
        void this.router.navigate([login.path], { queryParams: login.queryParams, replaceUrl: true });
        return;
      }
      void this.loadDonations();
      void this.loadEvents();
      void this.loadAppeals();
      if (this.tab() === 'newsletters') void this.loadNewsletters();
    });
  }

  protected pageTitle(): string {
    return this.i18n.t('memberHome.pageTitle');
  }

  /** Reads `?tab=&appeal=&fund=&amount=&donated=` (on load and on every in-app link). */
  private applyParams(map: ParamMap, initial: boolean): void {
    const donated = map.get('donated') === '1';
    if (donated) this.donatedBanner.set(true);

    const next: MemberTab = donated && !map.get('tab') ? 'donate' : parseMemberTab(map.get('tab'));
    if (initial || next !== this.tab()) this.activateTab(next);

    const fund = map.get('fund');
    if (fund && (FUNDS as readonly string[]).includes(fund)) this.donateFund.set(fund as DonationFund);

    const amount = Number(map.get('amount'));
    if (map.get('amount') && Number.isFinite(amount) && amount >= 5 && amount <= 100_000) {
      if ((DONATION_PRESETS as readonly number[]).includes(amount)) {
        this.donateAmount.set(amount);
      } else {
        this.donateAmount.set('custom');
        this.donateCustom.set(String(amount));
      }
    }

    const appealId = (map.get('appeal') ?? '').trim();
    if (appealId !== this.appealParam) {
      this.appealParam = appealId;
      void this.loadDonateAppeal(appealId);
    }
  }

  private activateTab(id: MemberTab): void {
    this.tab.set(id);
    this.error.set(null);
    if (!this.auth.member()) return;
    if (id === 'donate' || id === 'donations' || id === 'overview') void this.loadDonations();
    if (id === 'events') void this.loadEvents();
    if (id === 'newsletters' && !this.newslettersLoaded) void this.loadNewsletters();
    if ((id === 'appeals' || id === 'overview') && !this.appealsLoaded) void this.loadAppeals();
  }

  private async loadDonateAppeal(id: string): Promise<void> {
    this.donateAppealMissing.set(false);
    if (!id) {
      this.donateAppeal.set(null);
      return;
    }
    this.donateAppealLoading.set(true);
    try {
      const appeal = await this.appealsApi.get(id);
      if (id !== this.appealParam) return;
      if (appeal && appealIsOpen(appeal)) {
        this.donateAppeal.set(appeal);
        this.donateFund.set(appeal.fund);
        if (!appealIsGeneral(appeal)) this.donateCampus.set(appeal.campusId);
      } else {
        this.donateAppeal.set(null);
        this.donateAppealMissing.set(true);
      }
    } finally {
      if (id === this.appealParam) this.donateAppealLoading.set(false);
    }
  }

  protected clearAppeal(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { appeal: null, amount: null, donated: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
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
      this.newslettersLoaded = false;
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

  private donateAmountValue(): number | null {
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
    const appeal = this.donateAppeal();
    const campus = appeal ? appeal.campusId : this.donateCampus();
    if (!campus) {
      this.error.set(this.i18n.t('donate.chooseCentre'));
      return;
    }
    this.donateLoading.set(true);
    this.error.set(null);
    try {
      const url = await this.portal.startDonationCheckout({
        amount,
        fund: appeal ? appeal.fund : this.donateFund(),
        campus,
        appealId: appeal?.id ?? null,
      });
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

  protected reloadAppeals(): void {
    this.appealsLoaded = false;
    void this.loadAppeals();
  }

  private async loadDonations(): Promise<void> {
    if (this.donationsLoading()) return;
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

  private async loadAppeals(): Promise<void> {
    if (this.appealsLoading()) return;
    this.appealsLoading.set(true);
    this.appealsError.set(null);
    try {
      const all = await this.appealsApi.list(this.auth.member()?.campusId || null);
      this.appeals.set(all.filter((a) => appealIsOpen(a)));
      this.appealsLoaded = true;
    } catch (err) {
      this.appeals.set([]);
      this.appealsError.set(portalErrorMessage(err));
    } finally {
      this.appealsLoading.set(false);
    }
  }

  private async loadNewsletters(): Promise<void> {
    this.newslettersLoading.set(true);
    this.newslettersError.set(null);
    try {
      this.newsletters.set(await this.portal.listNewsletters());
      this.newslettersLoaded = true;
    } catch (err) {
      this.newsletters.set([]);
      this.newslettersError.set(portalErrorMessage(err));
    } finally {
      this.newslettersLoading.set(false);
    }
  }
}
