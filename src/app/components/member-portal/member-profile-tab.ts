import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../i18n/language.service';
import {
  VOLUNTEER_INTEREST_OPTIONS,
  type MemberInterests,
  type MemberProfile,
  type VolunteerInterest,
} from '../../models/membership';
import { formatUkPhoneForDisplay } from '../../validators/uk.validators';
import { Icon } from '../ui/icon';

export interface MemberProfileSavePayload {
  phone: string;
  marketingOptIn: boolean;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
  };
  interests: MemberInterests;
}

/**
 * Profile: Contact, Address, Volunteering and Email preferences cards with one sticky
 * save bar. Name and email are read-only (trustees change those). `marketingOptIn` is the
 * single email preference: appeals and news emails.
 */
@Component({
  selector: 'app-member-profile-tab',
  imports: [FormsModule, Icon],
  templateUrl: './member-profile-tab.html',
})
export class MemberProfileTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly interestOptions = VOLUNTEER_INTEREST_OPTIONS;

  readonly member = input.required<MemberProfile>();
  readonly saving = input(false);
  readonly saved = input(false);
  readonly phoneError = input<string | null>(null);

  readonly save = output<MemberProfileSavePayload>();

  protected phone = '';
  protected readonly marketingOptIn = signal(false);
  protected addressLine1 = '';
  protected addressLine2 = '';
  protected addressCity = '';
  protected addressPostcode = '';
  protected readonly volunteerInterests = signal<VolunteerInterest[]>([]);
  protected skills = '';
  protected languages = '';
  protected heardAbout = '';
  /** True once the member edits anything after the last load or save. */
  protected readonly dirty = signal(false);

  constructor() {
    effect(() => {
      const m = this.member();
      this.phone = formatUkPhoneForDisplay(m.phone ?? '');
      this.marketingOptIn.set(m.marketingOptIn === true);
      this.addressLine1 = m.address?.line1 ?? '';
      this.addressLine2 = m.address?.line2 ?? '';
      this.addressCity = m.address?.city ?? '';
      this.addressPostcode = m.address?.postcode ?? '';
      this.volunteerInterests.set(m.interests?.volunteerInterests ?? []);
      this.skills = m.interests?.skills ?? '';
      this.languages = m.interests?.languages ?? '';
      this.heardAbout = m.interests?.heardAbout ?? '';
      this.dirty.set(false);
    });
    effect(() => {
      if (this.saved()) this.dirty.set(false);
    });
  }

  protected markDirty(): void {
    this.dirty.set(true);
  }

  protected interestChecked(value: VolunteerInterest): boolean {
    return this.volunteerInterests().includes(value);
  }

  protected toggleInterest(value: VolunteerInterest, checked: boolean): void {
    const set = new Set(this.volunteerInterests());
    if (checked) set.add(value);
    else set.delete(value);
    this.volunteerInterests.set([...set]);
    this.markDirty();
  }

  protected toggleMarketing(): void {
    this.marketingOptIn.update((v) => !v);
    this.markDirty();
  }

  protected submitProfile(event: Event): void {
    event.preventDefault();
    const interests: MemberInterests = {
      volunteerInterests: this.volunteerInterests(),
      ...(this.skills.trim() ? { skills: this.skills.trim() } : {}),
      ...(this.languages.trim() ? { languages: this.languages.trim() } : {}),
      ...(this.heardAbout.trim() ? { heardAbout: this.heardAbout.trim() } : {}),
    };
    this.save.emit({
      phone: this.phone,
      marketingOptIn: this.marketingOptIn(),
      address: {
        line1: this.addressLine1,
        line2: this.addressLine2,
        city: this.addressCity,
        postcode: this.addressPostcode,
      },
      interests,
    });
  }
}
