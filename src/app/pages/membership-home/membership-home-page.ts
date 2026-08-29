import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { whatsappHref } from '../../config/organization.config';
import { eventDescriptionHtml, eventHtmlToPlain } from '../../utils/event-html';
import { MemberAuthService } from '../../services/member-auth.service';
import {
  MemberPortalService,
  portalErrorMessage,
  type MemberDonationRecord,
  type MemberNewsletter,
  type MemberPortalEvent,
} from '../../services/member-portal.service';
import {
  VOLUNTEER_INTEREST_OPTIONS,
  type DonationFund,
  type MemberInterests,
  type VolunteerInterest,
} from '../../models/membership';
import { PageShell } from '../page-shell';

type MemberTab = 'overview' | 'profile' | 'donate' | 'events' | 'newsletters';

@Component({
  selector: 'app-membership-home-page',
  imports: [PageShell, FormsModule, RouterLink],
  templateUrl: './membership-home-page.html',
  styleUrl: './membership-home-page.css',
})
export class MembershipHomePage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly orgWhatsApp = whatsappHref(
    'Assalamu alaikum, I am interested in volunteering with Nagina Social Welfare UK.',
  );
  protected readonly interestOptions = VOLUNTEER_INTEREST_OPTIONS;
  protected readonly donationFunds: readonly DonationFund[] = [
    'zakat',
    'sadaqah',
    'lillah',
    'fitrana',
  ];
  protected readonly donationPresets = [5, 10, 25, 50, 100] as const;

  private readonly auth = inject(MemberAuthService);
  private readonly portal = inject(MemberPortalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly member = this.auth.member;
  protected readonly loading = this.auth.loading;
  protected readonly tab = signal<MemberTab>('overview');

  protected phone = '';
  protected marketingOptIn = false;
  protected addressLine1 = '';
  protected addressLine2 = '';
  protected addressCity = '';
  protected addressPostcode = '';
  protected volunteerInterests = signal<VolunteerInterest[]>([]);
  protected skills = '';
  protected languages = '';
  protected heardAbout = '';

  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly certificateLoading = signal(false);
  protected readonly donatedBanner = signal(false);

  protected readonly donateFund = signal<DonationFund>('sadaqah');
  protected readonly donateAmount = signal<number | 'custom'>(25);
  protected readonly donateCustom = signal('');
  protected readonly donateLoading = signal(false);
  protected donateAcknowledged = false;
  protected readonly donations = signal<MemberDonationRecord[]>([]);
  protected readonly donationsLoading = signal(false);

  protected readonly events = signal<MemberPortalEvent[]>([]);
  protected readonly eventsLoading = signal(false);
  protected readonly rsvpBusy = signal<string | null>(null);

  protected readonly newsletters = signal<MemberNewsletter[]>([]);
  protected readonly newslettersLoading = signal(false);
  protected readonly newslettersError = signal<string | null>(null);

  protected readonly tabs: readonly { id: MemberTab; labelKey: string }[] = [
    { id: 'overview', labelKey: 'memberHome.tabOverview' },
    { id: 'profile', labelKey: 'memberHome.tabProfile' },
    { id: 'donate', labelKey: 'memberHome.tabDonate' },
    { id: 'events', labelKey: 'memberHome.tabEvents' },
    { id: 'newsletters', labelKey: 'memberHome.tabNewsletters' },
  ];

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('donated') === '1') {
      this.donatedBanner.set(true);
      this.tab.set('donate');
    }
    void this.auth.restoreSession().then(() => {
      const m = this.auth.member();
      if (!m) {
        void this.router.navigate(['/membership/login']);
        return;
      }
      this.hydrateProfile(m);
      void this.loadDonations();
      void this.loadEvents();
    });
  }

  protected setTab(id: MemberTab): void {
    this.tab.set(id);
    this.error.set(null);
    if (id === 'donate') void this.loadDonations();
    if (id === 'events') void this.loadEvents();
    if (id === 'newsletters') void this.loadNewsletters();
  }

  protected interestChecked(value: VolunteerInterest): boolean {
    return this.volunteerInterests().includes(value);
  }

  protected toggleInterest(value: VolunteerInterest, checked: boolean): void {
    const set = new Set(this.volunteerInterests());
    if (checked) set.add(value);
    else set.delete(value);
    this.volunteerInterests.set([...set]);
  }

  protected async saveProfile(): Promise<void> {
    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);
    try {
      const interests: MemberInterests = {
        volunteerInterests: this.volunteerInterests(),
        ...(this.skills.trim() ? { skills: this.skills.trim() } : {}),
        ...(this.languages.trim() ? { languages: this.languages.trim() } : {}),
        ...(this.heardAbout.trim() ? { heardAbout: this.heardAbout.trim() } : {}),
      };
      await this.auth.updateProfile({
        phone: this.phone.trim(),
        marketingOptIn: this.marketingOptIn,
        address: {
          line1: this.addressLine1.trim(),
          line2: this.addressLine2.trim(),
          city: this.addressCity.trim(),
          postcode: this.addressPostcode.trim(),
        },
        interests,
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
    if (!this.donateAcknowledged) {
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

  protected eventWhatsapp(event: MemberPortalEvent): string {
    return whatsappHref(event.whatsappPrefill || `RSVP: ${event.title}`);
  }

  protected memberUpdateHtml(raw: string): string {
    return eventDescriptionHtml(raw);
  }

  protected eventPlainDescription(event: MemberPortalEvent): string {
    return eventHtmlToPlain(event.description);
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

  private hydrateProfile(m: NonNullable<ReturnType<typeof this.auth.member>>): void {
    this.phone = m.phone ?? '';
    this.marketingOptIn = m.marketingOptIn === true;
    this.addressLine1 = m.address?.line1 ?? '';
    this.addressLine2 = m.address?.line2 ?? '';
    this.addressCity = m.address?.city ?? '';
    this.addressPostcode = m.address?.postcode ?? '';
    this.volunteerInterests.set(m.interests?.volunteerInterests ?? []);
    this.skills = m.interests?.skills ?? '';
    this.languages = m.interests?.languages ?? '';
    this.heardAbout = m.interests?.heardAbout ?? '';
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
