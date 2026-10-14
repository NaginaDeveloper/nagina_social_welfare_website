import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MEMBERSHIP_API_BASE } from '../config/membership-api.config';
import { MemberAuthService } from './member-auth.service';
import type { DonationFund } from '../models/membership';

export interface MemberDonationRecord {
  id: string;
  amount: number;
  fund: DonationFund;
  /** Campus id, or `general`. Older records have neither field. */
  campus?: string;
  campusName?: string;
  currency: string;
  paidAt: string | null;
  checkoutReference: string;
  receiptId?: string | null;
  /** Appeal this gift was made to, when it came from an appeal link. */
  appealId?: string | null;
  appealTitle?: string | null;
}

export interface DonationCheckoutRequest {
  amount: number;
  fund: DonationFund;
  campus: string;
  /** When given, the server locks fund and centre to the appeal's own. */
  appealId?: string | null;
}

export interface MemberEmailPreferences {
  emailMasked: string;
  fullName: string;
  marketingOptIn: boolean;
}

export interface MemberPortalEvent {
  id: string;
  title: string;
  titleUr: string;
  description: string;
  descriptionUr: string;
  date: string;
  time: string;
  venue: string;
  whatsappPrefill: string;
  visibility: string;
  memberUpdate: string;
  images: { id: string; url: string; alt?: string }[];
  rsvpStatus: string | null;
  guestCount: number | null;
}

export interface MemberNewsletter {
  id: string;
  title: string;
  titleUr: string;
  summary: string;
  publishedAt: string | null;
  downloadUrl: string | null;
  htmlBody: string | null;
}

@Injectable({ providedIn: 'root' })
export class MemberPortalService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(MemberAuthService);

  private async bearerHeaders(): Promise<Record<string, string>> {
    const token = await this.auth.getIdToken();
    if (!token) throw new Error('Sign in required.');
    return { Authorization: `Bearer ${token}` };
  }

  async startDonationCheckout(request: DonationCheckoutRequest): Promise<string> {
    const headers = await this.bearerHeaders();
    const { amount, fund, campus, appealId } = request;
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; hostedCheckoutUrl: string }>(
        `${MEMBERSHIP_API_BASE}/api/membership/donate/checkout`,
        { amount, fund, campus, ...(appealId ? { appealId } : {}) },
        { headers },
      ),
    );
    return res.hostedCheckoutUrl;
  }

  /** Email preferences behind the tokenised link in campaign emails (no sign-in). */
  async getPreferences(token: string): Promise<MemberEmailPreferences> {
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean } & MemberEmailPreferences>(
        `${MEMBERSHIP_API_BASE}/api/membership/public/preferences`,
        { params: { token: token.trim() } },
      ),
    );
    return { emailMasked: res.emailMasked, fullName: res.fullName, marketingOptIn: res.marketingOptIn === true };
  }

  async updatePreferences(
    token: string,
    patch: { marketingOptIn?: boolean; unsubscribeAll?: boolean },
  ): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; marketingOptIn: boolean }>(
        `${MEMBERSHIP_API_BASE}/api/membership/public/preferences`,
        { token: token.trim(), ...patch },
      ),
    );
    return res.marketingOptIn === true;
  }

  async listDonations(): Promise<MemberDonationRecord[]> {
    const headers = await this.bearerHeaders();
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; donations: MemberDonationRecord[] }>(
        `${MEMBERSHIP_API_BASE}/api/membership/donations`,
        { headers },
      ),
    );
    return res.donations;
  }

  async listEvents(): Promise<MemberPortalEvent[]> {
    const headers = await this.bearerHeaders();
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; events: MemberPortalEvent[] }>(
        `${MEMBERSHIP_API_BASE}/api/membership/events`,
        { headers },
      ),
    );
    return res.events;
  }

  async rsvpEvent(
    eventId: string,
    status: 'going' | 'cancelled',
    guestCount?: number,
  ): Promise<void> {
    const headers = await this.bearerHeaders();
    await firstValueFrom(
      this.http.post(
        `${MEMBERSHIP_API_BASE}/api/membership/events/${encodeURIComponent(eventId)}/rsvp`,
        { status, guestCount },
        { headers },
      ),
    );
  }

  async listNewsletters(): Promise<MemberNewsletter[]> {
    const headers = await this.bearerHeaders();
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; newsletters: MemberNewsletter[] }>(
        `${MEMBERSHIP_API_BASE}/api/membership/newsletters`,
        { headers },
      ),
    );
    return res.newsletters;
  }

  async downloadCertificate(): Promise<void> {
    const headers = await this.bearerHeaders();
    const res = await fetch(`${MEMBERSHIP_API_BASE}/api/membership/certificate`, { headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body && typeof body.error === 'string' ? body.error : 'Could not download certificate.',
      );
    }
    const blob = await res.blob();
    const member = this.auth.member();
    const name = member?.membershipNumber || 'membership';
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NSW-membership-${name}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async downloadDonationReceipt(donationId: string, receiptId?: string | null): Promise<void> {
    const headers = await this.bearerHeaders();
    const res = await fetch(
      `${MEMBERSHIP_API_BASE}/api/membership/donations/${encodeURIComponent(donationId)}/receipt`,
      { headers },
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        body && typeof body.error === 'string' ? body.error : 'Could not download receipt.',
      );
    }
    const blob = await res.blob();
    const filename = receiptId?.trim()
      ? `${receiptId.trim().replace(/[^\w-]+/g, '_')}.pdf`
      : `NSW-donation-${donationId}.pdf`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async requestPasswordReset(email: string): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<{ ok: boolean; message: string }>(
        `${MEMBERSHIP_API_BASE}/api/membership/request-password-reset`,
        { email: email.trim().toLowerCase() },
      ),
    );
    return res.message;
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${MEMBERSHIP_API_BASE}/api/membership/reset-password`, {
        token: token.trim(),
        password,
      }),
    );
  }
}

export function portalErrorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error;
    if (body && typeof body === 'object' && typeof body.error === 'string') {
      return body.error;
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong. Please try again.';
}
