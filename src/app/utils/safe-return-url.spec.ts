import { describe, expect, it } from 'vitest';
import { loginUrlFor, safeReturnUrl } from './safe-return-url';

describe('safeReturnUrl', () => {
  it('keeps relative member-area paths with their query string', () => {
    expect(safeReturnUrl('/membership/home')).toBe('/membership/home');
    expect(safeReturnUrl('/membership/home/')).toBe('/membership/home/');
    expect(safeReturnUrl('/membership/home?tab=donate&appeal=apl_1&amount=40')).toBe(
      '/membership/home?tab=donate&appeal=apl_1&amount=40',
    );
    expect(safeReturnUrl('/membership')).toBe('/membership');
  });

  it('rejects anything outside the member area', () => {
    expect(safeReturnUrl('/donate')).toBeNull();
    expect(safeReturnUrl('/membershipx/home')).toBeNull();
    expect(safeReturnUrl('/')).toBeNull();
    expect(safeReturnUrl('membership/home')).toBeNull();
  });

  it('rejects absolute, protocol-relative and scheme URLs', () => {
    expect(safeReturnUrl('https://evil.example/membership/home')).toBeNull();
    expect(safeReturnUrl('//evil.example/membership/home')).toBeNull();
    expect(safeReturnUrl('/\\evil.example')).toBeNull();
    expect(safeReturnUrl('javascript:alert(1)')).toBeNull();
    expect(safeReturnUrl('/javascript:alert(1)')).toBeNull();
  });

  it('rejects dot segments, encoded tricks and control characters', () => {
    expect(safeReturnUrl('/membership/../donate')).toBeNull();
    expect(safeReturnUrl('/membership/%2e%2e/donate')).toBeNull();
    expect(safeReturnUrl('/membership/home%00')).toBeNull();
    expect(safeReturnUrl('/membership/home\n')).toBeNull();
    expect(safeReturnUrl('/%2F%2Fevil.example')).toBeNull();
  });

  it('never loops back into the auth pages', () => {
    expect(safeReturnUrl('/membership/login')).toBeNull();
    expect(safeReturnUrl('/membership/login/?returnUrl=/membership/home')).toBeNull();
    expect(safeReturnUrl('/membership/set-password?token=x')).toBeNull();
    expect(safeReturnUrl('/membership/reset-password')).toBeNull();
  });

  it('handles empty and non-string input', () => {
    expect(safeReturnUrl(null)).toBeNull();
    expect(safeReturnUrl(undefined)).toBeNull();
    expect(safeReturnUrl('')).toBeNull();
    expect(safeReturnUrl('   ')).toBeNull();
  });
});

describe('loginUrlFor', () => {
  it('adds returnUrl only when it is safe', () => {
    expect(loginUrlFor('/membership/home?tab=appeals')).toEqual({
      path: '/membership/login',
      queryParams: { returnUrl: '/membership/home?tab=appeals' },
    });
    expect(loginUrlFor('https://evil.example')).toEqual({ path: '/membership/login', queryParams: {} });
  });
});
