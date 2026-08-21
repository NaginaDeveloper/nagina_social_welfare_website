import { describe, expect, it } from 'vitest';
import { FormControl } from '@angular/forms';
import {
  childDobValidator,
  optionalEmailValidator,
  ukPhoneValidator,
  ukPostcodeValidator,
} from './uk.validators';

describe('uk validators', () => {
  it('accepts a typical UK mobile', () => {
    expect(ukPhoneValidator()(new FormControl('07700900123'))).toBeNull();
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
