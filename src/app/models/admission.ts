export type PreviousEducation = 'qaidah' | 'quran' | 'other_books' | 'none';
export type ClassSlot = 'class1' | 'class2' | 'class3';

export interface AdmissionSubmitPayload {
  student: {
    fullName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    previousEducation: PreviousEducation;
    previousEducationDetail?: string;
  };
  primaryParent: {
    fullName: string;
    phone: string;
    fatherPhone?: string;
    motherPhone?: string;
    email: string;
    fatherEmail?: string;
    motherEmail?: string;
  };
  secondaryParent?: {
    fullName: string;
    relationship: string;
    phone?: string;
    email?: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  medical: {
    hasCondition: boolean;
    details?: string;
  };
  emergencyContact: {
    name: string;
    address: string;
    phone: string;
    relationship?: string;
  };
  preferences: { classSlot: ClassSlot };
  consents: {
    gdpr: true;
    media: boolean;
    medicalFirstAid: true;
    termsAgreed: true;
  };
  declaration: {
    signedBy: string;
    signedAt: string;
  };
}

export interface SubmitAdmissionResponse {
  ok: boolean;
  applicationId: string;
}

export type ApplicationPublicStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'NEEDS_INFO';

export interface ApplicationStatusResponse {
  ok: boolean;
  applicationId: string;
  status: ApplicationPublicStatus;
  studentName?: string;
  submittedAt?: string;
  updatedAt?: string;
  note?: string;
}

export const CLASS_SLOT_OPTIONS: readonly {
  value: ClassSlot;
  label: string;
}[] = [
  { value: 'class1', label: 'Class 1: 16:00 to 17:00' },
  { value: 'class2', label: 'Class 2: 17:00 to 18:00' },
  { value: 'class3', label: 'Class 3: 18:00 to 19:00' },
] as const;

export const PREVIOUS_EDUCATION_OPTIONS: readonly {
  value: PreviousEducation;
  labelKey: string;
}[] = [
  { value: 'qaidah', labelKey: 'apply.prev.qaidah' },
  { value: 'quran', labelKey: 'apply.prev.quran' },
  { value: 'other_books', labelKey: 'apply.prev.other' },
  { value: 'none', labelKey: 'apply.prev.none' },
] as const;
