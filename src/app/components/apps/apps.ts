import { Component } from '@angular/core';

interface AppLink {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description: string;
  readonly url: string;
  readonly icon: 'parent' | 'teacher' | 'charity';
}

@Component({
  selector: 'app-apps',
  templateUrl: './apps.html',
})
export class Apps {
  protected readonly apps: readonly AppLink[] = [
    {
      id: 'mdi-parent',
      name: 'MDI Parent Portal',
      role: 'For Parents',
      description:
        "Stay informed in real time — view your child's daily attendance and fee records. Login credentials are issued by the institution.",
      url: 'https://play.google.com/store/apps/details?id=com.learning.mdi_parent_app',
      icon: 'parent',
    },
    {
      id: 'mdi',
      name: 'Markaz-e Deen-e Islam',
      role: 'For Admins & Teachers',
      description:
        'Digitally manage classes, students, teachers, attendance and fees with secure, role-based access for the educational institution.',
      url: 'https://play.google.com/store/apps/details?id=com.education.markaz_e_deen_islam',
      icon: 'teacher',
    },
    {
      id: 'charity',
      name: 'Nagina Social Welfare UK',
      role: 'For Admins & Collectors',
      description:
        'Submit and monitor daily charity collection reports with transparent, secure record-keeping between admins and collectors.',
      url: 'https://play.google.com/store/apps/details?id=com.naginaorganization.charity_collection_app',
      icon: 'charity',
    },
  ];
}
