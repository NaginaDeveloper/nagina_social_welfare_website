import { madrasaSessions, type MadrasaSession } from '../config/madrasa-timetable.config';

export type PreviousEducation = 'qaidah' | 'quran' | 'other_books' | 'none';
/** Peterborough's three evening classes, or Manchester's single weekday class. */
export type ClassSlot = 'class1' | 'class2' | 'class3' | 'weekday';

export interface AdmissionSubmitPayload {
  /** Campus profile id from the admissions API. */
  campusId?: string;
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
    privacyNoticeRead: true;
    privacyNoticeVersion: string;
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

/** The classes a parent can pick for a centre, from the published timetable. */
export function classSlotOptions(campusId: string | null | undefined): readonly MadrasaSession[] {
  return madrasaSessions(campusId);
}

/** Class 1 and 2: under 10. Class 3: 10+. The weekday class takes all ages. */
export function classSlotFitsAge(slot: ClassSlot, age: number): boolean {
  if (slot === 'weekday') return true;
  if (slot === 'class1' || slot === 'class2') return age < 10;
  return age >= 10;
}

export const PREVIOUS_EDUCATION_OPTIONS: readonly {
  value: PreviousEducation;
  labelKey: string;
}[] = [
  { value: 'qaidah', labelKey: 'apply.prev.qaidah' },
  { value: 'quran', labelKey: 'apply.prev.quran' },
  { value: 'other_books', labelKey: 'apply.prev.other' },
  { value: 'none', labelKey: 'apply.prev.none' },
] as const;
