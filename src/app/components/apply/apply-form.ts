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
import { AdmissionService } from '../../services/admission.service';
import {
  CLASS_SLOT_OPTIONS,
  PREVIOUS_EDUCATION_OPTIONS,
  classSlotFitsAge,
  type AdmissionSubmitPayload,
  type ClassSlot,
  type PreviousEducation,
} from '../../models/admission';
import {
  childAgeYears,
  childDobValidator,
  optionalEmailValidator,
  ukPhoneValidator,
  ukPostcodeValidator,
  formatUkPhoneE164,
} from '../../validators/uk.validators';
import {
  LAST_APPLICATION_EMAIL_KEY,
  LAST_APPLICATION_ID_KEY,
} from '../../config/admission-api.config';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { PRIVACY_NOTICE_VERSION } from '../../config/privacy-notice.config';

const TERMS = [
  'Vehicles parked on the double yellow lines outside the madrasa will result in the child losing their place (city council risk).',
  'Negative behaviour is not tolerated. A first warning may be given; repeated incidents can lead to removal.',
  'Uniform: white jooba for boys and black abaya for girls (provided by the madrasa). Children not in uniform cannot enter.',
  'Unnecessary absences can lead to removal. Please inform us if your child will be away.',
  'Pupils must follow appearance and dress rules and must not cause nuisance to local residents.',
  'Homework that is given must be signed by a parent.',
  'Fees are £5 every Monday, or paid in advance.',
  'Please collect your child promptly at the end of class.',
  'Do not play games in or outside the premises.',
  'Nagina Social Welfare UK is not responsible for children’s safety outside the premises.',
] as const;

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
  selector: 'app-apply-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './apply-form.html',
  styleUrl: './apply-form.css',
})
export class ApplyForm {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly whatsappAsk = whatsappHref(
    'Assalamu alaikum, I have a question about Markaz Deen-e-Islam enrolment.',
  );
  protected readonly classSlots = CLASS_SLOT_OPTIONS;
  protected readonly prevEduOptions = PREVIOUS_EDUCATION_OPTIONS;
  protected readonly terms = TERMS;
  protected readonly months = MONTHS;
  protected readonly years: readonly string[];
  protected readonly minDob: string;
  protected readonly maxDob: string;

  private readonly fb = inject(FormBuilder);
  private readonly admission = inject(AdmissionService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly step = signal(0);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly includeSecondary = signal(false);
  protected readonly attempted = signal(false);
  protected readonly dobY = signal('');
  protected readonly dobM = signal('');
  protected readonly dobD = signal('');

  protected readonly stepMeta = [
    { key: 'apply.step1', hint: 'apply.step1Hint' },
    { key: 'apply.step2', hint: 'apply.step2Hint' },
    { key: 'apply.step3', hint: 'apply.step3Hint' },
    { key: 'apply.step4', hint: 'apply.step4Hint' },
  ] as const;

  protected readonly form = this.fb.nonNullable.group({
    student: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      dateOfBirth: ['', [Validators.required, childDobValidator(3, 18)]],
      gender: ['Male' as 'Male' | 'Female', Validators.required],
      previousEducation: ['none' as PreviousEducation, Validators.required],
      previousEducationDetail: [''],
    }),
    primaryParent: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      phone: ['', [Validators.required, ukPhoneValidator()]],
      fatherPhone: ['', ukPhoneValidator()],
      motherPhone: ['', ukPhoneValidator()],
      email: ['', [Validators.required, Validators.email]],
      fatherEmail: ['', optionalEmailValidator()],
      motherEmail: ['', optionalEmailValidator()],
    }),
    address: this.fb.nonNullable.group({
      line1: ['', [Validators.required, Validators.maxLength(120)]],
      line2: ['', Validators.maxLength(120)],
      city: ['', [Validators.required, Validators.maxLength(80)]],
      postcode: ['', [Validators.required, ukPostcodeValidator()]],
    }),
    secondaryParent: this.fb.nonNullable.group({
      fullName: ['', Validators.maxLength(120)],
      relationship: ['', Validators.maxLength(80)],
      phone: ['', ukPhoneValidator()],
      email: ['', optionalEmailValidator()],
    }),
    medical: this.fb.nonNullable.group({
      hasCondition: ['no' as 'yes' | 'no', Validators.required],
      details: [''],
    }),
    emergencyContact: this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      address: ['', [Validators.required, Validators.maxLength(300)]],
      phone: ['', [Validators.required, ukPhoneValidator()]],
      relationship: ['', Validators.maxLength(80)],
    }),
    preferences: this.fb.nonNullable.group({
      classSlot: [null as ClassSlot | null, Validators.required],
    }),
    consents: this.fb.nonNullable.group({
      privacyNoticeRead: [false, Validators.requiredTrue],
      media: [false],
      medicalFirstAid: [false, Validators.requiredTrue],
      termsAgreed: [false, Validators.requiredTrue],
    }),
    declaration: this.fb.nonNullable.group({
      signedBy: ['', [Validators.required, Validators.maxLength(120)]],
    }),
  });

  constructor() {
    const now = new Date();
    const youngest = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
    const oldest = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    this.maxDob = this.toIso(youngest);
    this.minDob = this.toIso(oldest);
    const years: string[] = [];
    for (let y = youngest.getFullYear(); y >= oldest.getFullYear(); y--) {
      years.push(String(y));
    }
    this.years = years;

    const student = this.form.controls.student;
    student.controls.previousEducation.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => {
        const detail = student.controls.previousEducationDetail;
        if (v === 'qaidah' || v === 'quran' || v === 'other_books') {
          detail.setValidators([Validators.required, Validators.maxLength(2000)]);
        } else {
          detail.clearValidators();
          detail.setValue('');
        }
        detail.updateValueAndValidity();
      });

    const medical = this.form.controls.medical;
    medical.controls.hasCondition.valueChanges.pipe(takeUntilDestroyed()).subscribe((v) => {
      const details = medical.controls.details;
      if (v === 'yes') {
        details.setValidators([Validators.required, Validators.maxLength(2000)]);
      } else {
        details.clearValidators();
        details.setValue('');
      }
      details.updateValueAndValidity();
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
    const max = this.daysInMonth().length;
    if (this.dobD() && Number(this.dobD()) > max) {
      this.dobD.set(String(max).padStart(2, '0'));
    }
    this.syncDobFromParts();
  }

  protected onCalendarDob(value: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const [y, m, d] = value.split('-');
    this.dobY.set(y);
    this.dobM.set(m);
    this.dobD.set(d);
    const ctrl = this.form.controls.student.controls.dateOfBirth;
    ctrl.setValue(value);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }

  protected needsPrevDetail(): boolean {
    const v = this.form.controls.student.controls.previousEducation.value;
    return v === 'qaidah' || v === 'quran' || v === 'other_books';
  }

  protected invalid(ctrl: AbstractControl | null): boolean {
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.attempted());
  }

  protected message(ctrl: AbstractControl | null): string {
    if (!ctrl || !this.invalid(ctrl)) return '';
    const e = ctrl.errors ?? {};
    if (e['required'] || e['requiredTrue']) return this.i18n.t('apply.err.required');
    if (e['email']) return this.i18n.t('apply.err.email');
    if (e['ukPhone']) return this.i18n.t('apply.err.phone');
    if (e['ukPostcode']) return this.i18n.t('apply.err.postcode');
    if (e['childDobFuture']) return this.i18n.t('apply.err.dobFuture');
    if (e['childDobAge'] || e['childDob']) return this.i18n.t('apply.err.dobAge');
    if (e['maxlength']) return this.i18n.t('apply.err.tooLong');
    return this.i18n.t('apply.err.required');
  }

  protected inputClass(ctrl: AbstractControl | null): string {
    const base =
      'mt-1.5 w-full min-h-12 rounded-2xl border bg-sand/40 px-4 py-3 text-base text-forest outline-none transition-colors placeholder:text-slate-warm/45 focus:bg-white';
    return this.invalid(ctrl)
      ? `${base} border-red-400 focus:border-red-500`
      : `${base} border-mist focus:border-gold/60`;
  }

  protected selectClass(ctrl: AbstractControl | null): string {
    return this.inputClass(ctrl).replace('px-4', 'pl-4 pr-10');
  }

  protected choiceClass(selected: boolean, centered = false, disabled = false): string {
    const base = `flex min-h-14 items-center ${centered ? 'justify-center' : ''} rounded-2xl border-2 px-4 py-3.5 text-sm font-semibold transition-colors`;
    if (disabled) {
      return `${base} cursor-not-allowed border-mist bg-sand/50 text-slate-warm`;
    }
    return selected
      ? `${base} cursor-pointer border-forest bg-forest text-cream shadow-soft`
      : `${base} cursor-pointer border-mist bg-white text-forest hover:border-gold/55`;
  }

  protected classAgeMismatch(): boolean {
    const dob = this.form.controls.student.controls.dateOfBirth.value;
    const slot = this.form.controls.preferences.controls.classSlot.value;
    if (!dob || !slot) return false;
    const age = childAgeYears(dob);
    if (age == null) return false;
    return !classSlotFitsAge(slot, age);
  }

  protected onFormSubmit(): void {
    if (this.step() < 3) {
      this.next();
      return;
    }
    void this.submit();
  }

  protected next(): void {
    this.attempted.set(true);
    if (!this.validateCurrentStep()) {
      this.error.set(
        this.step() === 3 && this.classAgeMismatch()
          ? this.i18n.t('apply.err.classAge')
          : this.i18n.t('apply.error.incomplete'),
      );
      this.scrollToError();
      return;
    }
    this.error.set(null);
    this.attempted.set(false);
    this.step.update((s) => Math.min(3, s + 1));
    this.scrollTop();
  }

  protected back(): void {
    this.error.set(null);
    this.attempted.set(false);
    this.step.update((s) => Math.max(0, s - 1));
    this.scrollTop();
  }

  protected goTo(index: number): void {
    if (index < this.step()) {
      this.step.set(index);
      this.error.set(null);
      this.attempted.set(false);
      this.scrollTop();
    }
  }

  protected toggleSecondary(checked: boolean): void {
    this.includeSecondary.set(checked);
    const sec = this.form.controls.secondaryParent;
    if (checked) {
      sec.controls.fullName.setValidators([
        Validators.required,
        Validators.maxLength(120),
      ]);
      sec.controls.relationship.setValidators([
        Validators.required,
        Validators.maxLength(80),
      ]);
    } else {
      sec.controls.fullName.setValidators([Validators.maxLength(120)]);
      sec.controls.relationship.setValidators([Validators.maxLength(80)]);
      sec.reset({
        fullName: '',
        relationship: '',
        phone: '',
        email: '',
      });
    }
    sec.controls.fullName.updateValueAndValidity();
    sec.controls.relationship.updateValueAndValidity();
  }

  protected async submit(): Promise<void> {
    this.attempted.set(true);
    this.error.set(null);
    if (!this.validateCurrentStep()) {
      this.error.set(
        this.classAgeMismatch()
          ? this.i18n.t('apply.err.classAge')
          : this.i18n.t('apply.error.incomplete'),
      );
      this.scrollToError();
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);
    try {
      const result = await this.admission.submit(payload);
      try {
        sessionStorage.setItem(LAST_APPLICATION_ID_KEY, result.applicationId);
        sessionStorage.setItem(
          LAST_APPLICATION_EMAIL_KEY,
          payload.primaryParent.email.trim().toLowerCase(),
        );
      } catch {
        // Private mode may block storage.
      }
      await this.router.navigate(['/apply/success'], {
        queryParams: { id: result.applicationId },
      });
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : this.i18n.t('apply.error.submit'),
      );
      this.scrollTop();
    } finally {
      this.submitting.set(false);
    }
  }

  private syncDobFromParts(): void {
    const y = this.dobY();
    const m = this.dobM();
    const d = this.dobD();
    const ctrl = this.form.controls.student.controls.dateOfBirth;
    if (y && m && d) {
      ctrl.setValue(`${y}-${m}-${d}`);
    } else {
      ctrl.setValue('');
    }
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }

  private validateCurrentStep(): boolean {
    const s = this.step();
    if (s === 0) {
      this.form.controls.student.markAllAsTouched();
      return this.form.controls.student.valid;
    }
    if (s === 1) {
      this.form.controls.primaryParent.markAllAsTouched();
      this.form.controls.address.markAllAsTouched();
      let ok =
        this.form.controls.primaryParent.valid &&
        this.form.controls.address.valid;
      if (this.includeSecondary()) {
        this.form.controls.secondaryParent.markAllAsTouched();
        if (this.form.controls.secondaryParent.invalid) ok = false;
      }
      return ok;
    }
    if (s === 2) {
      this.form.controls.medical.markAllAsTouched();
      this.form.controls.emergencyContact.markAllAsTouched();
      return (
        this.form.controls.medical.valid &&
        this.form.controls.emergencyContact.valid
      );
    }
    this.form.controls.preferences.markAllAsTouched();
    this.form.controls.consents.markAllAsTouched();
    this.form.controls.declaration.markAllAsTouched();
    return (
      this.form.controls.preferences.valid &&
      this.form.controls.consents.valid &&
      this.form.controls.declaration.valid &&
      !this.classAgeMismatch()
    );
  }

  private buildPayload(): AdmissionSubmitPayload {
    const v = this.form.getRawValue();
    const opt = (s: string) => {
      const t = s.trim();
      return t ? t : undefined;
    };
    const optPhone = (s: string) => {
      const t = s.trim();
      return t ? formatUkPhoneE164(t) : undefined;
    };

    const payload: AdmissionSubmitPayload = {
      student: {
        fullName: v.student.fullName.trim(),
        dateOfBirth: v.student.dateOfBirth,
        gender: v.student.gender,
        previousEducation: v.student.previousEducation,
        previousEducationDetail:
          v.student.previousEducation === 'none'
            ? undefined
            : opt(v.student.previousEducationDetail),
      },
      primaryParent: {
        fullName: v.primaryParent.fullName.trim(),
        phone: formatUkPhoneE164(v.primaryParent.phone),
        fatherPhone: optPhone(v.primaryParent.fatherPhone),
        motherPhone: optPhone(v.primaryParent.motherPhone),
        email: v.primaryParent.email.trim().toLowerCase(),
        fatherEmail: opt(v.primaryParent.fatherEmail)?.toLowerCase(),
        motherEmail: opt(v.primaryParent.motherEmail)?.toLowerCase(),
      },
      address: {
        line1: v.address.line1.trim(),
        line2: opt(v.address.line2),
        city: v.address.city.trim(),
        postcode: v.address.postcode.trim().toUpperCase(),
      },
      medical: {
        hasCondition: v.medical.hasCondition === 'yes',
        details:
          v.medical.hasCondition === 'yes' ? opt(v.medical.details) : undefined,
      },
      emergencyContact: {
        name: v.emergencyContact.name.trim(),
        address: v.emergencyContact.address.trim(),
        phone: formatUkPhoneE164(v.emergencyContact.phone),
        relationship: opt(v.emergencyContact.relationship),
      },
      preferences: { classSlot: v.preferences.classSlot as ClassSlot },
      consents: {
        privacyNoticeRead: true,
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
        media: v.consents.media === true,
        medicalFirstAid: true,
        termsAgreed: true,
      },
      declaration: {
        signedBy: v.declaration.signedBy.trim(),
        signedAt: this.toIso(new Date()),
      },
    };

    if (this.includeSecondary()) {
      const sec = v.secondaryParent;
      const name = sec.fullName.trim();
      if (name) {
        payload.secondaryParent = {
          fullName: name,
          relationship: sec.relationship.trim() || 'Guardian',
          phone: optPhone(sec.phone),
          email: opt(sec.email)?.toLowerCase(),
        };
      }
    }

    return payload;
  }

  private toIso(n: Date): string {
    const m = String(n.getMonth() + 1).padStart(2, '0');
    const d = String(n.getDate()).padStart(2, '0');
    return `${n.getFullYear()}-${m}-${d}`;
  }

  private scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private scrollToError(): void {
    setTimeout(() => {
      const el = this.host.nativeElement.querySelector('[data-error]');
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 30);
  }
}
