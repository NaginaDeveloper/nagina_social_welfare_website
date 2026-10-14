import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MEMBERSHIP_API_BASE } from '../config/membership-api.config';
import type { PublicAppeal } from '../models/appeal';

/** Public, live fundraising appeals. No sign-in needed; the API caches for a minute. */
@Injectable({ providedIn: 'root' })
export class AppealsService {
  private readonly http = inject(HttpClient);
  private listCache: { key: string; at: number; appeals: PublicAppeal[] } | null = null;

  /** Live appeals, optionally narrowed to one centre (plus general appeals). */
  async list(campus?: string | null): Promise<PublicAppeal[]> {
    const key = campus?.trim() || '';
    if (this.listCache && this.listCache.key === key && Date.now() - this.listCache.at < 60_000) {
      return this.listCache.appeals;
    }
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; appeals: PublicAppeal[] }>(
        `${MEMBERSHIP_API_BASE}/api/membership/appeals`,
        { params: key ? { campus: key } : {} },
      ),
    );
    const appeals = res.appeals ?? [];
    this.listCache = { key, at: Date.now(), appeals };
    return appeals;
  }

  /** One appeal, or null when it does not exist or is still a draft. */
  async get(id: string): Promise<PublicAppeal | null> {
    const clean = id.trim();
    if (!clean) return null;
    try {
      const res = await firstValueFrom(
        this.http.get<{ ok: boolean; appeal: PublicAppeal }>(
          `${MEMBERSHIP_API_BASE}/api/membership/appeals/${encodeURIComponent(clean)}`,
        ),
      );
      return res.appeal ?? null;
    } catch {
      return null;
    }
  }
}
