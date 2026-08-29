import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LAST_MEMBERSHIP_EMAIL_KEY,
  LAST_MEMBERSHIP_ID_KEY,
} from '../../config/membership-api.config';
import { LanguageService } from '../../i18n/language.service';
import type { MembershipApplicationStatus } from '../../models/membership';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-membership-status-panel',
  imports: [FormsModule],
  templateUrl: './membership-status-panel.html',
})
export class MembershipStatusPanel implements OnInit {
  readonly initialId = input('');
  readonly autoLookup = input(false);

  protected readonly i18n = inject(LanguageService);
  private readonly membership = inject(MembershipService);

  protected readonly id = signal('');
  protected readonly email = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<{
    applicationId: string;
    status: MembershipApplicationStatus;
    applicantName?: string;
    submittedAt?: string;
    membershipNumber?: string;
    note?: string;
  } | null>(null);

  ngOnInit(): void {
    const fromInput = this.initialId().trim();
    const stored = this.readStoredId();
    const start = fromInput || stored;
    if (start) this.id.set(start);
    const storedEmail = this.readStoredEmail();
    if (storedEmail) this.email.set(storedEmail);
    if (start && storedEmail && this.autoLookup()) {
      void this.lookup();
    }
  }

  protected async lookup(): Promise<void> {
    const applicationId = this.id().trim();
    const applicantEmail = this.email().trim();
    this.error.set(null);
    this.result.set(null);
    if (!applicationId) {
      this.error.set(this.i18n.t('membershipTrack.err.required'));
      return;
    }
    if (!applicantEmail || !applicantEmail.includes('@')) {
      this.error.set(this.i18n.t('membershipTrack.err.emailRequired'));
      return;
    }
    this.loading.set(true);
    try {
      const data = await this.membership.lookupStatus(applicationId, applicantEmail);
      this.result.set(data);
      try {
        sessionStorage.setItem(LAST_MEMBERSHIP_ID_KEY, data.applicationId);
        sessionStorage.setItem(LAST_MEMBERSHIP_EMAIL_KEY, applicantEmail.toLowerCase());
      } catch {
        // ignore
      }
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : this.i18n.t('membershipTrack.err.lookup'),
      );
    } finally {
      this.loading.set(false);
    }
  }

  protected statusKey(status: MembershipApplicationStatus): string {
    return `membershipTrack.status.${status}`;
  }

  protected statusHint(status: MembershipApplicationStatus): string {
    return `membershipTrack.hint.${status}`;
  }

  protected tone(status: MembershipApplicationStatus): string {
    if (status === 'APPROVED') return 'border-emerald bg-forest text-cream';
    if (status === 'REJECTED' || status === 'WITHDRAWN') {
      return 'border-red-200 bg-red-50 text-red-950';
    }
    if (status === 'NEEDS_INFO') return 'border-amber-200 bg-amber-50 text-amber-950';
    return 'border-gold/40 bg-sand/70 text-forest';
  }

  protected formatDate(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(this.i18n.isUr() ? 'ur-PK' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private readStoredId(): string {
    try {
      return sessionStorage.getItem(LAST_MEMBERSHIP_ID_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }

  private readStoredEmail(): string {
    try {
      return sessionStorage.getItem(LAST_MEMBERSHIP_EMAIL_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }
}
