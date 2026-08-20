import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Programme {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly summary: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly logo: string;
}

@Component({
  selector: 'app-our-work',
  imports: [RouterLink],
  templateUrl: './our-work.html',
})
export class OurWork {
  protected readonly programmes: readonly Programme[] = [
    {
      id: 'mdi',
      name: 'Markaz Deen-e-Islam',
      tag: 'Islamic Education',
      summary: 'Our educational institution',
      description:
        'Nurturing the next generation in the knowledge and love of Islam. Through structured classes, dedicated teachers and a caring environment, we guide students of every age in the Qur\u2019an and the Islamic sciences.',
      highlights: [
        "Qur'an & Islamic Studies",
        'Structured Classes',
        'Dedicated Teachers',
        'Progress & Attendance',
      ],
      logo: 'brand/markaz.png',
    },
    {
      id: 'nsw',
      name: 'Nagina Social Welfare',
      tag: 'Charity & Welfare',
      summary: 'Our community welfare arm',
      description:
        'Serving the community through organised charity across the UK. From donation drives to transparent collections and receipts, we channel your generosity to reach those who need it most.',
      highlights: [
        'Donation Drives',
        'Community Support',
        'Transparent Receipts',
        'Monthly Summaries',
      ],
      logo: 'brand/nagina.png',
    },
  ];
}
