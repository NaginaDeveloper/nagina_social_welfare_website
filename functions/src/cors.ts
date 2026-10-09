import type { Request, Response } from 'express';

export const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4200',
  'https://www.naginasocialwelfare.co.uk',
  'https://naginasocialwelfare.co.uk',
] as const;

export function allowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : [...DEFAULT_ALLOWED_ORIGINS];
}

export type CorsOptions = {
  /** When true, reject requests with no Origin (blocks casual curl abuse). */
  requireOrigin?: boolean;
};

/** Apply CORS headers. Returns true if the request may proceed. */
export function applyCors(
  req: Request,
  res: Response,
  options: CorsOptions = {},
): boolean {
  const origin = req.get('origin');
  const allowed = allowedOrigins();
  const requireOrigin = options.requireOrigin === true;

  if (origin && allowed.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  } else if (!origin) {
    if (requireOrigin) {
      res.status(403).json({ error: 'Browser origin required' });
      return false;
    }
    // Same-origin / server-to-server — no ACAO needed.
  } else {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }

  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return false;
  }

  return true;
}

/** CORS for public read-only GET endpoints: known browser origins only, no credentials. */
export function applyGetCors(req: Request, res: Response): boolean {
  const origin = req.get('origin');
  if (origin && allowedOrigins().includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  } else if (origin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return false;
  }
  return true;
}
