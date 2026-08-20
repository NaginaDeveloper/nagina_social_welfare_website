import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Offering {
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-madrasa',
  imports: [RouterLink],
  templateUrl: './madrasa.html',
})
export class Madrasa {
  protected readonly offerings: readonly Offering[] = [
    {
      title: 'Quran classes for children',
      text: 'Structured Qur’an reading and understanding for young learners, with caring teachers and clear progress.',
    },
    {
      title: 'Islamic studies & character',
      text: 'Age-appropriate Islamic education — belief, manners, and love for the Prophet ﷺ in a Hanafi Barelvi / Ahl al-Sunnah setting.',
    },
    {
      title: 'Namaz & practical worship',
      text: 'Help children learn salah with confidence, alongside everyday guidance for a practising Muslim life.',
    },
    {
      title: 'Evening & weekend learning',
      text: 'Classes arranged so families can balance school, work, and Islamic education in Peterborough.',
    },
  ];
}
