import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import type { Auth, User } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { FIREBASE_WEB_CONFIG } from '../config/firebase.config';
import {
  MEMBER_HINT_KEY,
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
  private firebaseAuth: Promise<Auth> | null = null;

  readonly member = signal<MemberProfile | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Firebase Auth is a large download, so it loads on first use (membership pages, sign-in,
   * or restoring a returning member), not for every visitor on every page.
   */
  private ensureFirebase(): Promise<Auth> {
    this.firebaseAuth ??= Promise.all([import('firebase/app'), import('firebase/auth')]).then(
      ([{ initializeApp }, { getAuth }]) => getAuth(initializeApp(FIREBASE_WEB_CONFIG, 'nagina-member')),
    );
    return this.firebaseAuth;
  }

  /**
   * Restores a signed-in member. The header calls this on every page, so without `force` it
   * only loads Firebase when this browser has signed a member in before; the membership
   * pages pass `force` because they need the answer either way.
   */
  async restoreSession(force = false): Promise<void> {
    if (!force && !hasSessionHint()) return;
    this.loading.set(true);
    try {
      const auth = await this.ensureFirebase();
      await new Promise<void>((resolve) => {
        const unsub = auth.onAuthStateChanged(async (user) => {
          unsub();
          if (!user) {
            this.member.set(null);
            setSessionHint(false);
            resolve();
            return;
          }
          await this.loadProfile(user);
          resolve();
        });
      });
    } catch {
      this.member.set(null);
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
      const [auth, { signInWithCustomToken }] = await Promise.all([
        this.ensureFirebase(),
        import('firebase/auth'),
      ]);
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
      const [auth, { signInWithCustomToken }] = await Promise.all([
        this.ensureFirebase(),
        import('firebase/auth'),
      ]);
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
    const auth = await this.ensureFirebase();
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
    const token = await (await this.ensureFirebase()).currentUser?.getIdToken();
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
    const auth = await this.ensureFirebase();
    return (await auth.currentUser?.getIdToken()) ?? null;
  }

  async logout(): Promise<void> {
    const [auth, { signOut }] = await Promise.all([this.ensureFirebase(), import('firebase/auth')]);
    await signOut(auth);
    this.member.set(null);
    setSessionHint(false);
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
    setSessionHint(true);
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

/** True when this browser has signed a member in and not signed out since. */
function hasSessionHint(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(MEMBER_HINT_KEY) === '1';
  } catch {
    return false;
  }
}

function setSessionHint(signedIn: boolean): void {
  try {
    if (signedIn) localStorage.setItem(MEMBER_HINT_KEY, '1');
    else localStorage.removeItem(MEMBER_HINT_KEY);
  } catch {
    // Storage may be blocked; the membership pages still force a restore.
  }
}
