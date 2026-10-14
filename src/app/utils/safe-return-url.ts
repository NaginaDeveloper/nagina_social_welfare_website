/**
 * Guards the `returnUrl` query parameter on the sign-in and set-password pages.
 *
 * Only relative paths inside the member area are allowed (`/membership/...`), so a crafted
 * link can never bounce a member to another site after they sign in. Anything else, including
 * protocol-relative (`//evil`), backslash tricks, schemes and dot segments, returns null and the
 * caller falls back to the member home.
 */
export const MEMBER_AREA_PREFIX = '/membership';

export function safeReturnUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (!raw || raw.length > 2048) return null;

  // Must be a plain relative path: one leading slash, no scheme, no host, no control characters.
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  if (/^\/[^/?#]*:/.test(raw)) return null; // "/javascript:..." style tricks

  const pathEnd = raw.search(/[?#]/);
  const path = pathEnd === -1 ? raw : raw.slice(0, pathEnd);
  const rest = pathEnd === -1 ? '' : raw.slice(pathEnd);

  let decoded: string;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    return null;
  }
  if (/[\\\u0000-\u001f\u007f]/.test(decoded) || decoded.startsWith('//')) return null;
  if (decoded.split('/').some((seg) => seg === '..' || seg === '.')) return null;
  if (decoded !== MEMBER_AREA_PREFIX && !decoded.startsWith(`${MEMBER_AREA_PREFIX}/`)) return null;

  // Never loop back into the auth pages themselves.
  const normalised = decoded.replace(/\/+$/, '');
  if (/^\/membership\/(login|set-password|forgot-password|reset-password)$/.test(normalised)) {
    return null;
  }

  return path + rest;
}

/** The URL to sign in at, remembering where to come back to. */
export function loginUrlFor(returnUrl: string | null | undefined): { path: string; queryParams: Record<string, string> } {
  const safe = safeReturnUrl(returnUrl);
  return { path: '/membership/login', queryParams: safe ? { returnUrl: safe } : {} };
}
