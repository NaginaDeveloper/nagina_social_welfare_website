import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LanguageService } from '../../i18n/language.service';
import { AdmissionService } from '../../services/admission.service';
import {
  CLASS_SLOT_OPTIONS,
  PREVIOUS_EDUCATION_OPTIONS,
  type AdmissionSubmitPayload,
  type PreviousEducation,
} from '../../models/admission';
import { ukPhoneValidator, ukPostcodeValidator } from '../../validators/uk.validators';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';

const TERMS_TEXT = `Terms and conditions must be read precisely.

· If there are ANY vehicles parked on the double yellow line, outside front of the madrassa, the vehicle’s owner will have their child immediately lose their space from the madrassa (we want to avoid any risks with the city council).
· We will not tolerate negative behaviour of the children; if this incident occurs, the child will be warned at first and removed.
· If the child does not dress him/herself with a WHITE jooba (boys) / black abaya (girls), then the child will not be allowed to enter the madrassa. Uniform is given by the madrassa.
· As the parent/guardian of the child at Nagina Social Welfare, you may agree for your child to be photographed during madrassah hours, field trips or activities. These photographs may be shared on the internet or printed.
· Unnecessary absences will cause removal from the madrassah; if your child is absent please inform us.
· The parent undertakes to ensure that the pupil conforms to rules of appearance and dress as issued by the madrassa, and behaves in a manner that will not cause nuisance or concern to local residents.
· If a pupil requires medical attention while at the madrassa, I consent to first aid being given and emergency services being called.
· Any homework that is given must be signed by a parent.
· Fees must be paid every Monday £5.00 or in advance.
· If collecting your child, please come promptly on time.
· Do not play any sort of games in or outside of the premises.
· Nagina Social Welfare UK is NOT responsible for the safety of your children outside the premises.

Failing to comply with any of the above may result in your child being removed from the madrassah.`;

@Component({
  selector: 'app-apply-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './apply-form.html',
})
export class ApplyForm {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly whatsappAsk = whatsappHref(
    'Assalamu alaikum, I have a question about Markaz Deen-e-Islam enrolment.',
  );
  protected readonly classSlots = CLASS_SLOT_OPTIONS;
  protected readonly prevEduOptions = PREVIOUS_EDUCATION_OPTIONS;
  protected readonly termsText = TERMS_TEXT;

  private readonly fb = inject(FormBuilder);
  private readonly admission = inject(AdmissionService);
  private readonly router = inject(Router);

  protected readonly step = signal(0);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly includeSecondary = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    student: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      dateOfBirth: ['', Validators.required],
      gender: ['Male' as 'Male' | 'Female', Validators.required],
      previousEducation: [
        'none' as PreviousEducation,
        Validators.required,
      ],
      previousEducationDetail: [''],
    }),
    primaryParent: this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.maxLength(120)]],
      phone: ['', [Validators.required, ukPhoneValidator()]],
      fatherPhone: ['', ukPhoneValidator()],
      motherPhone: ['', ukPhoneValidator()],
      email: ['', [Validators.required, Validators.email]],
      fatherEmail: ['', Validators.email],
      motherEmail: ['', Validators.email],
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
      email: ['', Validators.email],
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
      classSlot: ['class1' as const, Validators.required],
    }),
    consents: this.fb.nonNullable.group({
      gdpr: [false, Validators.requiredTrue],
      media: [false],
      medicalFirstAid: [false, Validators.requiredTrue],
      termsAgreed: [false, Validators.requiredTrue],
    }),
    declaration: this.fb.nonNullable.group({
      signedBy: ['', [Validators.required, Validators.maxLength(120)]],
      signedAt: [this.todayIso(), Validators.required],
    }),
  });

  protected needsPrevDetail(): boolean {
    const v = this.form.controls.student.controls.previousEducation.value;
    return v === 'qaidah' || v === 'quran' || v === 'other_books';
  }

  protected next(): void {
    this.error.set(null);
    if (!this.validateCurrentStep()) return;
    this.step.update((s) => Math.min(3, s + 1));
  }

  protected back(): void {
    this.error.set(null);
    this.step.update((s) => Math.max(0, s - 1));
  }

  protected toggleSecondary(checked: boolean): void {
    this.includeSecondary.set(checked);
    if (!checked) {
      this.form.controls.secondaryParent.reset({
        fullName: '',
        relationship: '',
        phone: '',
        email: '',
      });
    }
  }

  protected async submit(): Promise<void> {
    this.error.set(null);
    if (!this.validateCurrentStep()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(this.i18n.t('apply.error.incomplete'));
      return;
    }

    const payload = this.buildPayload();
    this.submitting.set(true);
    try {
      await this.admission.submit(payload);
      await this.router.navigateByUrl('/apply/success');
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : this.i18n.t('apply.error.submit'),
      );
    } finally {
      this.submitting.set(false);
    }
  }

  private validateCurrentStep(): boolean {
    const s = this.step();
    if (s === 0) {
      const student = this.form.controls.student;
      student.markAllAsTouched();
      if (this.needsPrevDetail()) {
        const detail = student.controls.previousEducationDetail;
        if (!String(detail.value ?? '').trim()) {
          detail.setErrors({ required: true });
          return false;
        }
      } else {
        student.controls.previousEducationDetail.setErrors(null);
      }
      return student.valid;
    }
    if (s === 1) {
      this.form.controls.primaryParent.markAllAsTouched();
      this.form.controls.address.markAllAsTouched();
      let ok =
        this.form.controls.primaryParent.valid &&
        this.form.controls.address.valid;
      if (this.includeSecondary()) {
        const sec = this.form.controls.secondaryParent;
        sec.markAllAsTouched();
        if (!String(sec.controls.fullName.value ?? '').trim()) {
          sec.controls.fullName.setErrors({ required: true });
          ok = false;
        }
        if (!String(sec.controls.relationship.value ?? '').trim()) {
          sec.controls.relationship.setErrors({ required: true });
          ok = false;
        }
        if (sec.invalid) ok = false;
      }
      return ok;
    }
    if (s === 2) {
      const medical = this.form.controls.medical;
      medical.markAllAsTouched();
      this.form.controls.emergencyContact.markAllAsTouched();
      if (medical.controls.hasCondition.value === 'yes') {
        if (!String(medical.controls.details.value ?? '').trim()) {
          medical.controls.details.setErrors({ required: true });
          return false;
        }
      } else {
        medical.controls.details.setErrors(null);
      }
      return medical.valid && this.form.controls.emergencyContact.valid;
    }
    this.form.controls.preferences.markAllAsTouched();
    this.form.controls.consents.markAllAsTouched();
    this.form.controls.declaration.markAllAsTouched();
    return (
      this.form.controls.preferences.valid &&
      this.form.controls.consents.valid &&
      this.form.controls.declaration.valid
    );
  }

  private buildPayload(): AdmissionSubmitPayload {
    const v = this.form.getRawValue();
    const opt = (s: string) => {
      const t = s.trim();
      return t ? t : undefined;
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
        phone: v.primaryParent.phone.trim(),
        fatherPhone: opt(v.primaryParent.fatherPhone),
        motherPhone: opt(v.primaryParent.motherPhone),
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
        phone: v.emergencyContact.phone.trim(),
        relationship: opt(v.emergencyContact.relationship),
      },
      preferences: { classSlot: v.preferences.classSlot },
      consents: {
        gdpr: true,
        media: v.consents.media === true,
        medicalFirstAid: true,
        termsAgreed: true,
      },
      declaration: {
        signedBy: v.declaration.signedBy.trim(),
        signedAt: v.declaration.signedAt,
      },
    };

    if (this.includeSecondary()) {
      const sec = v.secondaryParent;
      const name = sec.fullName.trim();
      if (name) {
        payload.secondaryParent = {
          fullName: name,
          relationship: sec.relationship.trim() || 'Guardian',
          phone: opt(sec.phone),
          email: opt(sec.email)?.toLowerCase(),
        };
      }
    }

    return payload;
  }

  private todayIso(): string {
    const n = new Date();
    const m = String(n.getMonth() + 1).padStart(2, '0');
    const d = String(n.getDate()).padStart(2, '0');
    return `${n.getFullYear()}-${m}-${d}`;
  }
}
