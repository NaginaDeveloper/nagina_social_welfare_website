import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { FIREBASE_WEB_CONFIG } from '../config/firebase.config';
import {
  MEMBER_SESSION_KEY,
  MEMBERSHIP_API_BASE,
} from '../config/membership-api.config';
import type { MemberInterests, MemberProfile } from '../models/membership';

interface AuthResponse {
  ok: boolean;
  customToken: string;
  member: MemberProfile;
}

@Injectable({ providedIn: 'root' })
export class MemberAuthService {
  private readonly http = inject(HttpClient);
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  readonly member = signal<MemberProfile | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private ensureFirebase(): Auth {
    if (!this.app) {
      this.app = initializeApp(FIREBASE_WEB_CONFIG, 'nagina-member');
      this.auth = getAuth(this.app);
    }
    return this.auth!;
  }

  async restoreSession(): Promise<void> {
    this.loading.set(true);
    try {
      const auth = this.ensureFirebase();
      await new Promise<void>((resolve) => {
        const unsub = auth.onAuthStateChanged(async (user) => {
          unsub();
          if (!user) {
            this.member.set(null);
            resolve();
            return;
          }
          await this.loadProfile(user);
          resolve();
        });
      });
    } finally {
      this.loading.set(false);
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${MEMBERSHIP_API_BASE}/api/membership/login`, {
          email: email.trim().toLowerCase(),
          password,
        }),
      );
      const auth = this.ensureFirebase();
      await signInWithCustomToken(auth, res.customToken);
      this.member.set(res.member);
      this.persistSession(res.member);
    } catch (err) {
      this.error.set(messageFromHttp(err));
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async setPassword(token: string, password: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${MEMBERSHIP_API_BASE}/api/membership/set-password`, {
          token: token.trim(),
          password,
        }),
      );
      const auth = this.ensureFirebase();
      await signInWithCustomToken(auth, res.customToken);
      this.member.set(res.member);
      this.persistSession(res.member);
    } catch (err) {
      this.error.set(messageFromHttp(err));
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async refreshProfile(): Promise<void> {
    const auth = this.ensureFirebase();
    const user = auth.currentUser;
    if (!user) return;
    await this.loadProfile(user);
  }

  async updateProfile(patch: {
    phone?: string;
    marketingOptIn?: boolean;
    address?: MemberProfile['address'];
    interests?: MemberInterests;
  }): Promise<void> {
    const token = await this.ensureFirebase().currentUser?.getIdToken();
    if (!token) throw new Error('Sign in required.');
    const res = await firstValueFrom(
      this.http.patch<{ ok: boolean; member: MemberProfile }>(
        `${MEMBERSHIP_API_BASE}/api/membership/profile`,
        patch,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    this.member.set(res.member);
    this.persistSession(res.member);
  }

  async getIdToken(): Promise<string | null> {
    const auth = this.ensureFirebase();
    return (await auth.currentUser?.getIdToken()) ?? null;
  }

  async logout(): Promise<void> {
    const auth = this.ensureFirebase();
    await signOut(auth);
    this.member.set(null);
    try {
      sessionStorage.removeItem(MEMBER_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  private async loadProfile(user: User): Promise<void> {
    const token = await user.getIdToken();
    const res = await firstValueFrom(
      this.http.get<{ ok: boolean; member: MemberProfile }>(
        `${MEMBERSHIP_API_BASE}/api/membership/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    this.member.set(res.member);
    this.persistSession(res.member);
  }

  private persistSession(member: MemberProfile): void {
    try {
      sessionStorage.setItem(MEMBER_SESSION_KEY, member.id);
    } catch {
      // ignore
    }
  }
}

function messageFromHttp(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    const body = err.error;
    if (body && typeof body === 'object' && typeof body.error === 'string') {
      return body.error;
    }
    if (err.status === 401) return 'Invalid email or password.';
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Could not sign in. Please try again.';
}
