import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PING_VISITOR_STATS_URL } from '../config/visitor-stats-api.config';

export interface VisitorStatsSnapshot {
  readonly liveVisitors: number;
  readonly todayVisitors: number;
  readonly totalVisitors: number;
}

const VISITOR_ID_KEY = 'nagina_visitor_id';
const SESSION_ID_KEY = 'nagina_visitor_session_id';
const HEARTBEAT_MS = 60_000;

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return `id${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function readOrCreateId(storage: Storage, key: string): string {
  try {
    const existing = storage.getItem(key)?.trim();
    if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) {
      return existing;
    }
    const created = randomId().slice(0, 32);
    storage.setItem(key, created);
    return created;
  } catch {
    return randomId().slice(0, 32);
  }
}

@Injectable({ providedIn: 'root' })
export class VisitorStatsService {
  private readonly http = inject(HttpClient);

  private started = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  private readonly liveVisitorsSignal = signal(0);
  private readonly todayVisitorsSignal = signal(0);
  private readonly totalVisitorsSignal = signal(0);
  private readonly readySignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly liveVisitors = this.liveVisitorsSignal.asReadonly();
  readonly todayVisitors = this.todayVisitorsSignal.asReadonly();
  readonly totalVisitors = this.totalVisitorsSignal.asReadonly();
  readonly ready = this.readySignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Start heartbeats once (safe to call from footer + contact). */
  startHeartbeat(): void {
    if (this.started || typeof window === 'undefined') {
      return;
    }
    this.started = true;
    void this.ping();
    this.timer = setInterval(() => void this.ping(), HEARTBEAT_MS);
  }

  private async ping(): Promise<void> {
    try {
      const visitorId = readOrCreateId(window.localStorage, VISITOR_ID_KEY);
      const sessionId = readOrCreateId(window.sessionStorage, SESSION_ID_KEY);
      const response = await firstValueFrom(
        this.http.post<VisitorStatsSnapshot>(PING_VISITOR_STATS_URL, {
          visitorId,
          sessionId,
        }),
      );
      this.liveVisitorsSignal.set(Math.max(0, Number(response.liveVisitors) || 0));
      this.todayVisitorsSignal.set(Math.max(0, Number(response.todayVisitors) || 0));
      this.totalVisitorsSignal.set(Math.max(0, Number(response.totalVisitors) || 0));
      this.readySignal.set(true);
      this.errorSignal.set(null);
    } catch {
      this.errorSignal.set('unavailable');
    }
  }
}
