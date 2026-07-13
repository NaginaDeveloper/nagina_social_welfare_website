import { Component } from '@angular/core';

interface Pillar {
  readonly title: string;
  readonly text: string;
  readonly icon: 'crescent' | 'hands' | 'globe';
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  protected readonly pillars: readonly Pillar[] = [
    {
      title: 'Authentic Knowledge',
      text: 'Learning rooted in the Qur\u2019an, Sunnah and the classical scholarly tradition.',
      icon: 'crescent',
    },
    {
      title: 'Compassion in Action',
      text: 'Serving those in need through organised, transparent charity and community welfare.',
      icon: 'hands',
    },
    {
      title: 'Accessible to All',
      text: 'Removing barriers so that quality education reaches every learner, everywhere.',
      icon: 'globe',
    },
  ];
}
