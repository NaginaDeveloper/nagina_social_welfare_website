import { Component } from '@angular/core';

interface Hadith {
  readonly title: string;
  readonly text: string;
  readonly source: string;
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
}
