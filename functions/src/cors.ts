import type { Request, Response } from 'express';

const DEFAULT_ALLOWED = [
  'http://localhost:4200',
  'https://www.naginasocialwelfare.co.uk',
  'https://naginasocialwelfare.co.uk',
];

function allowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ALLOWED;
}

/** Apply CORS headers. Returns true if the request may proceed. */
export function applyCors(req: Request, res: Response): boolean {
  const origin = req.get('origin');
  const allowed = allowedOrigins();

  if (origin && allowed.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  } else if (!origin) {
    // Same-origin / server-to-server / curl — no ACAO needed.
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
