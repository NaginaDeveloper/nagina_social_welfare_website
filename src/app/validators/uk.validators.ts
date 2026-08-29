import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidUkPhone(raw: string): boolean {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return false;
  const phone = parsePhoneNumberFromString(trimmed, 'GB');
  return phone?.isValid() === true && phone.country === 'GB';
}

/** Store as E.164 (+447831684738) for Twilio SMS and consistent lookups. */
export function formatUkPhoneE164(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  const phone = parsePhoneNumberFromString(trimmed, 'GB');
  if (!phone?.isValid() || phone.country !== 'GB') {
    throw new Error('Invalid UK phone number.');
  }
  return phone.format('E.164');
}

/** Show 07831 684738 in forms when Firestore has +447831684738. */
export function formatUkPhoneForDisplay(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) return '';
  const phone = parsePhoneNumberFromString(trimmed, 'GB');
  if (phone?.isValid() && phone.country === 'GB') {
    return phone.formatNational();
  }
  return trimmed;
}

/** UK mobile or landline; accepts 07…, 01…, 02…, +44… */
export function ukPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) return null;
    return isValidUkPhone(raw) ? null : { ukPhone: true };
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
