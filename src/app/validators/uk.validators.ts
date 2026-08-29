import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Allows blank; otherwise a simple email. */
export function optionalEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    return EMAIL_RE.test(raw) ? null : { email: true };
  };
}

export function childDobValidator(minAge = 3, maxAge = 18): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    if (!ISO_DATE.test(raw)) return { childDob: true };
    const [y, m, d] = raw.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      return { childDob: true };
    }
    const now = new Date();
    if (dt.getTime() > now.getTime()) return { childDobFuture: true };
    let age = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) {
      age -= 1;
    }
    if (age < minAge || age > maxAge) return { childDobAge: true };
    return null;
  };
}

/** Adult membership — must be at least minAge (default 18). */
export function adultDobValidator(minAge = 18, maxAge = 120): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    if (!ISO_DATE.test(raw)) return { adultDob: true };
    const [y, m, d] = raw.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
      return { adultDob: true };
    }
    const now = new Date();
    if (dt.getTime() > now.getTime()) return { adultDobFuture: true };
    let age = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) {
      age -= 1;
    }
    if (age < minAge) return { adultDobAge: true };
    if (age > maxAge) return { adultDobAge: true };
    return null;
  };
}
