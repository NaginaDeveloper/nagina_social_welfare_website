export type MembershipApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_INFO'
  | 'WITHDRAWN';

export type VolunteerInterest =
  | 'events'
  | 'fundraising'
  | 'outreach'
  | 'admin'
  | 'teaching_support'
  | 'other';

export interface MembershipSubmitPayload {
  applicant: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  interests?: {
    volunteerInterests?: VolunteerInterest[];
    skills?: string;
    languages?: string;
    heardAbout?: string;
  };
  consents: {
    privacyNoticeRead: true;
    privacyNoticeVersion: string;
    codeOfConductAgreed: true;
    ageConfirmed18Plus: true;
    marketingOptIn: boolean;
  };
  declaration: {
    signedBy: string;
    signedAt: string;
  };
}

export interface SubmitMembershipResponse {
  ok: boolean;
  applicationId: string;
}

export interface MembershipStatusResponse {
  ok: boolean;
  applicationId: string;
  status: MembershipApplicationStatus;
  applicantName?: string;
  submittedAt?: string;
  updatedAt?: string;
  membershipNumber?: string;
  note?: string;
}

export type DonationFund = 'zakat' | 'sadaqah' | 'lillah' | 'fitrana';

export interface MemberInterests {
  volunteerInterests?: VolunteerInterest[];
  skills?: string;
  languages?: string;
  heardAbout?: string;
}

export interface MemberProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membershipNumber: string;
  membershipClass: string;
  status: string;
  marketingOptIn: boolean;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    postcode?: string;
  };
  interests?: MemberInterests;
  joinedAt?: unknown;
}

export const VOLUNTEER_INTEREST_OPTIONS: readonly {
  value: VolunteerInterest;
  labelKey: string;
}[] = [
  { value: 'events', labelKey: 'membership.interest.events' },
  { value: 'fundraising', labelKey: 'membership.interest.fundraising' },
  { value: 'outreach', labelKey: 'membership.interest.outreach' },
  { value: 'admin', labelKey: 'membership.interest.admin' },
  { value: 'teaching_support', labelKey: 'membership.interest.teaching' },
  { value: 'other', labelKey: 'membership.interest.other' },
] as const;

export const MEMBERSHIP_CODE_OF_CONDUCT = [
  'Community membership is voluntary and free. Donations remain separate on our donate page.',
  'Members treat staff, volunteers, and other community members with respect and good adab.',
  'Membership does not grant voting rights in company or charity governance unless trustees confirm otherwise in writing.',
  'Volunteer interest on this form is not a DBS-checked role — safer recruitment follows separately if you are invited to serve.',
  'Nagina Social Welfare UK may suspend or end membership if conduct brings the charity into disrepute.',
] as const;
