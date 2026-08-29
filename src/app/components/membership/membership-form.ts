import { Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LanguageService } from '../../i18n/language.service';
import { MembershipService } from '../../services/membership.service';
import {
  MEMBERSHIP_CODE_OF_CONDUCT,
  VOLUNTEER_INTEREST_OPTIONS,
  type MembershipSubmitPayload,
  type VolunteerInterest,
} from '../../models/membership';
import {
  adultDobValidator,
  ukPhoneValidator,
  ukPostcodeValidator,
  formatUkPhoneE164,
} from '../../validators/uk.validators';
import {
  LAST_MEMBERSHIP_EMAIL_KEY,
  LAST_MEMBERSHIP_ID_KEY,
} from '../../config/membership-api.config';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { PRIVACY_NOTICE_VERSION } from '../../config/privacy-notice.config';

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

@Component({
  selector: 'app-membership-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './membership-form.html',
  styleUrl: './membership-form.css',
})
export class MembershipForm {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly whatsappAsk = whatsappHref(
    'Assalamu alaikum, I have a question about Nagina Social Welfare UK community membership.',
  );
  protected readonly interests = VOLUNTEER_INTEREST_OPTIONS;
  protected readonly conduct = MEMBERSHIP_CODE_OF_CONDUCT;
  protected readonly months = MONTHS;
  protected readonly years: readonly string[];
  protected readonly minDob: string;
  protected readonly maxDob: string;

  private readonly fb = inject(FormBuilder);
  private readonly membership = inject(MembershipService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly step = signal(0);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly attempted = signal(false);
  protected readonly dobY = signal('');
  protected readonly dobM = signal('');
  protected readonly dobD = signal('');

  protected readonly stepMeta = [
    { key: 'membership.step1', hint: 'membership.step1Hint' },
    { key: 'membership.step2', hint: 'membership.step2Hint' },
    { key: 'membership.step3', hint: 'membership.step3Hint' },
  ] as const;

  protected readonly form = this.fb.nonNullable.group({
    applicant: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, ukPhoneValidator()]],
      dateOfBirth: ['', [Validators.required, adultDobValidator()]],
    }),
    address: this.fb.nonNullable.group({
      line1: ['', [Validators.required, Validators.maxLength(120)]],
      line2: ['', Validators.maxLength(120)],
      city: ['', [Validators.required, Validators.maxLength(80)]],
      postcode: ['', [Validators.required, ukPostcodeValidator()]],
    }),
    interests: this.fb.nonNullable.group({
      volunteerInterests: this.fb.nonNullable.control<VolunteerInterest[]>([]),
      skills: ['', Validators.maxLength(500)],
      languages: ['', Validators.maxLength(200)],
      heardAbout: ['', Validators.maxLength(200)],
    }),
    consents: this.fb.nonNullable.group({
      privacyNoticeRead: [false, Validators.requiredTrue],
      codeOfConductAgreed: [false, Validators.requiredTrue],
      ageConfirmed18Plus: [false, Validators.requiredTrue],
      marketingOptIn: [false],
    }),
    declaration: this.fb.nonNullable.group({
      signedBy: ['', [Validators.required, Validators.maxLength(120)]],
    }),
  });

  constructor() {
    const now = new Date();
    const oldest = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
    const youngestAdult = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    this.maxDob = this.toIso(youngestAdult);
    this.minDob = this.toIso(oldest);
    const years: string[] = [];
    for (let y = youngestAdult.getFullYear(); y >= oldest.getFullYear(); y--) {
      years.push(String(y));
    }
    this.years = years;

    this.form.controls.applicant.controls.fullName.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((name) => {
        const signed = this.form.controls.declaration.controls.signedBy;
        if (!signed.dirty && !signed.value.trim()) {
          signed.setValue(name.trim());
        }
      });
  }

  protected daysInMonth(): readonly string[] {
    const y = Number(this.dobY());
    const m = Number(this.dobM());
    const count = y && m ? new Date(y, m, 0).getDate() : 31;
    return Array.from({ length: count }, (_, i) => String(i + 1).padStart(2, '0'));
  }

  protected setDobPart(part: 'y' | 'm' | 'd', value: string): void {
    if (part === 'y') this.dobY.set(value);
    if (part === 'm') this.dobM.set(value);
    if (part === 'd') this.dobD.set(value);
    this.syncDobFromParts();
  }

  protected toggleInterest(value: VolunteerInterest, checked: boolean): void {
    const ctrl = this.form.controls.interests.controls.volunteerInterests;
    const current = [...ctrl.value];
    const next = checked
      ? current.includes(value)
        ? current
        : [...current, value]
      : current.filter((v) => v !== value);
    ctrl.setValue(next);
    ctrl.markAsDirty();
  }

  protected hasInterest(value: VolunteerInterest): boolean {
    return this.form.controls.interests.controls.volunteerInterests.value.includes(value);
  }

  protected invalid(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.attempted());
  }

  protected message(ctrl: AbstractControl | null): string {
    if (!ctrl || !this.invalid(ctrl)) return '';
    const e = ctrl.errors ?? {};
    if (e['required'] || e['requiredTrue']) return this.i18n.t('membership.err.required');
    if (e['email']) return this.i18n.t('membership.err.email');
    if (e['ukPhone']) return this.i18n.t('membership.err.phone');
    if (e['ukPostcode']) return this.i18n.t('membership.err.postcode');
    if (e['adultDobFuture']) return this.i18n.t('membership.err.dobFuture');
    if (e['adultDobAge'] || e['adultDob']) return this.i18n.t('membership.err.dobAge');
    return this.i18n.t('membership.err.required');
  }

  protected inputClass(ctrl: AbstractControl | null): string {
    const base =
      'mt-1.5 w-full min-h-12 rounded-2xl border bg-sand/40 px-4 py-3 text-base text-forest outline-none transition-colors placeholder:text-slate-warm/45 focus:bg-white';
    return this.invalid(ctrl)
      ? `${base} border-red-400 focus:border-red-500`
      : `${base} border-mist focus:border-gold/60`;
  }

  protected onFormSubmit(): void {
    if (this.step() < 2) {
      this.next();
      return;
    }
    void this.submit();
  }

  protected next(): void {
    this.attempted.set(true);
    if (!this.validateCurrentStep()) {
      this.error.set(this.i18n.t('membership.error.incomplete'));
      this.scrollToError();
      return;
    }
    this.error.set(null);
    this.attempted.set(false);
    this.step.update((s) => Math.min(s + 1, 2));
    this.host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected back(): void {
    this.error.set(null);
    this.attempted.set(false);
    this.step.update((s) => Math.max(s - 1, 0));
  }

  private validateCurrentStep(): boolean {
    const s = this.step();
    if (s === 0) {
      return this.markValid(this.form.controls.applicant) && this.markValid(this.form.controls.address);
    }
    if (s === 1) return true;
    return (
      this.markValid(this.form.controls.consents) && this.markValid(this.form.controls.declaration)
    );
  }

  private markValid(group: AbstractControl): boolean {
    group.markAllAsTouched();
    return group.valid;
  }

  private async submit(): Promise<void> {
    this.attempted.set(true);
    if (!this.form.valid) {
      this.error.set(this.i18n.t('membership.error.incomplete'));
      this.scrollToError();
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    try {
      const raw = this.form.getRawValue();
      const today = new Date();
      const signedAt = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const interests = raw.interests;
      const payload: MembershipSubmitPayload = {
        applicant: {
          ...raw.applicant,
          fullName: raw.applicant.fullName.trim(),
          email: raw.applicant.email.trim().toLowerCase(),
          phone: formatUkPhoneE164(raw.applicant.phone),
          dateOfBirth: raw.applicant.dateOfBirth,
        },
        address: {
          line1: raw.address.line1,
          ...(raw.address.line2.trim() ? { line2: raw.address.line2.trim() } : {}),
          city: raw.address.city,
          postcode: raw.address.postcode,
        },
        ...(interests.volunteerInterests.length ||
        interests.skills.trim() ||
        interests.languages.trim() ||
        interests.heardAbout.trim()
          ? {
              interests: {
                ...(interests.volunteerInterests.length
                  ? { volunteerInterests: interests.volunteerInterests }
                  : {}),
                ...(interests.skills.trim() ? { skills: interests.skills.trim() } : {}),
                ...(interests.languages.trim()
                  ? { languages: interests.languages.trim() }
                  : {}),
                ...(interests.heardAbout.trim()
                  ? { heardAbout: interests.heardAbout.trim() }
                  : {}),
              },
            }
          : {}),
        consents: {
          privacyNoticeRead: true,
          privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
          codeOfConductAgreed: true,
          ageConfirmed18Plus: true,
          marketingOptIn: raw.consents.marketingOptIn,
        },
        declaration: {
          signedBy: raw.declaration.signedBy.trim(),
          signedAt,
        },
      };
      const res = await this.membership.submit(payload);
      try {
        sessionStorage.setItem(LAST_MEMBERSHIP_ID_KEY, res.applicationId);
        sessionStorage.setItem(LAST_MEMBERSHIP_EMAIL_KEY, raw.applicant.email.toLowerCase());
      } catch {
        // ignore
      }
      await this.router.navigate(['/membership/success'], {
        queryParams: { id: res.applicationId },
      });
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : this.i18n.t('membership.error.submit'),
      );
      this.scrollToError();
    } finally {
      this.submitting.set(false);
    }
  }

  private syncDobFromParts(): void {
    const y = this.dobY();
    const m = this.dobM();
    const d = this.dobD();
    if (!y || !m || !d) return;
    const iso = `${y}-${m}-${d}`;
    const ctrl = this.form.controls.applicant.controls.dateOfBirth;
    ctrl.setValue(iso);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }

  private scrollToError(): void {
    queueMicrotask(() => {
      this.host.nativeElement
        .querySelector('[data-error]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  private toIso(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
