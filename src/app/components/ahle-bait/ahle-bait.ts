import { Component } from '@angular/core';

interface Hadith {
  readonly title: string;
  readonly text: string;
  readonly source: string;
}

interface AhleBaitPhoto {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly width: number;
  readonly height: number;
}

@Component({
  selector: 'app-ahle-bait',
  templateUrl: './ahle-bait.html',
})
export class AhleBait {
  protected readonly ahadith: readonly Hadith[] = [
    {
      title: 'Hadith al-Thaqalayn',
      text: 'The Messenger of Allah ﷺ said he was leaving among us two precious things: the Book of Allah and his Ahl al-Bayt. Whoever holds firmly to both will never go astray.',
      source: 'Sahih Muslim & related collections',
    },
    {
      title: 'Hadith Sharif',
      text: 'The Messenger of Allah ﷺ said: I have left two things among you. You will never go astray as long as you hold fast to them: the Book of Allah and the Sunnah of His Prophet.',
      source: 'Authentic (Sahih)',
    },
  ];

  protected readonly photos: readonly AhleBaitPhoto[] = [
    {
      src: 'media/ahle-bait-gathering.jpg',
      alt: 'Teachers and well-wishers gathered together at Markaz Deen-e-Islam',
      caption: 'Gathering of teachers & well-wishers',
      width: 1024,
      height: 768,
    },
    {
      src: 'media/ahle-bait-students.jpg',
      alt: 'Students of Markaz Deen-e-Islam holding certificates with their teachers',
      caption: 'Students of Markaz Deen-e-Islam with certificates',
      width: 1024,
      height: 617,
    },
  ];
}
