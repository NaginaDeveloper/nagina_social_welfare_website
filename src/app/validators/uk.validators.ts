import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

/** UK-style mobile / landline; accepts 0… or +44… */
export function ukPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    const digits = raw.replace(/[\s\-()]/g, '').replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      return { ukPhone: true };
    }
    return null;
  };
}

export function ukPostcodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    return UK_POSTCODE.test(raw) ? null : { ukPostcode: true };
  };
}
