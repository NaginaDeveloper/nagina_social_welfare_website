import { describe, expect, it } from 'vitest';
import { FormControl } from '@angular/forms';
import {
  childDobValidator,
  formatUkPhoneE164,
  isValidUkPhone,
  optionalEmailValidator,
  ukPhoneValidator,
  ukPostcodeValidator,
} from './uk.validators';

describe('uk validators', () => {
  it('accepts a typical UK mobile', () => {
    expect(ukPhoneValidator()(new FormControl('07831684738'))).toBeNull();
    expect(isValidUkPhone('+44 7831 684738')).toBe(true);
    expect(formatUkPhoneE164('07831 684738')).toBe('+447831684738');
  });

  it('rejects invalid UK phone numbers', () => {
    expect(ukPhoneValidator()(new FormControl('12345'))).toEqual({ ukPhone: true });
    expect(ukPhoneValidator()(new FormControl('not-a-phone'))).toEqual({ ukPhone: true });
    expect(isValidUkPhone('123456')).toBe(false);
  });

  it('accepts a PE postcode', () => {
    expect(ukPostcodeValidator()(new FormControl('PE1 2AB'))).toBeNull();
  });

  it('allows a blank optional email and rejects a broken one', () => {
    expect(optionalEmailValidator()(new FormControl(''))).toBeNull();
    expect(optionalEmailValidator()(new FormControl('not-an-email'))).toEqual({
      email: true,
    });
  });

  it('accepts a child aged between 3 and 18', () => {
    const now = new Date();
    const y = now.getFullYear() - 8;
    const iso = `${y}-06-15`;
    expect(childDobValidator(3, 18)(new FormControl(iso))).toBeNull();
  });

  it('rejects an adult date of birth', () => {
    expect(childDobValidator(3, 18)(new FormControl('1990-01-01'))).toEqual({
      childDobAge: true,
    });
  });
});
