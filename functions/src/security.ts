import { timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';

/** Constant-time string compare for API tokens. */
export function tokensEqual(expected: string, supplied: string): boolean {
  if (!expected || !supplied) {
    return false;
  }
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(supplied, 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Basic hardening headers for JSON API responses. */
export function setSecurityHeaders(res: Response): void {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Cache-Control', 'no-store');
  res.set('X-Frame-Options', 'DENY');
}

/**
 * Browser-facing public APIs should send an allowlisted Origin.
 * Rejects missing Origin to block trivial curl/script spam.
 */
export function requireBrowserOrigin(req: Request, allowed: readonly string[]): boolean {
  const origin = req.get('origin')?.trim() ?? '';
  if (!origin) {
    return false;
  }
  return allowed.includes(origin);
}

export function clampString(value: unknown, max: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, max);
}
