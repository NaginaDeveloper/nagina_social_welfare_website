import { Component } from '@angular/core';

interface SacredQuote {
  readonly kind: 'quran' | 'hadith';
  readonly label: string;
  readonly text: string;
  readonly source: string;
}

interface Reason {
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-khatme-nabuwwat',
  templateUrl: './khatme-nabuwwat.html',
})
export class KhatmeNabuwwat {
  protected readonly quotes: readonly SacredQuote[] = [
    {
      kind: 'quran',
      label: 'Quran 33:40',
      text: 'Muhammad is not the father of any of your men, but he is the Messenger of Allah and the last of the Prophets. And Allah has full knowledge of all things.',
      source: 'Surah Al-Ahzab, Ayat 40',
    },
    {
      kind: 'quran',
      label: 'Quran 5:3',
      text: 'This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as your religion.',
      source: 'Surah Al-Ma\'idah, Ayat 3',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      text: 'The parable of me and the prophets before me is that of a man who built a house, made it complete and beautiful, except for the place of one brick… I am that brick, and I am the Seal of the Prophets.',
      source: 'Sahih al-Bukhari & Sahih Muslim',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      text: 'There will be no Prophet after me.',
      source: 'Sahih Muslim',
    },
  ];

  protected readonly reasons: readonly Reason[] = [
    {
      title: 'Complete Guidance',
      text: 'Allah’s final testament is fully preserved in the Holy Quran and the authentic Sunnah, requiring no further prophets or new revelations.',
    },
    {
      title: 'Universal Unity',
      text: 'The finality of prophethood protects the Ummah from division, anchoring us all to one divine standard and one final exemplar.',
    },
    {
      title: 'Sacred Responsibility',
      text: 'As followers of the Seal of the Prophets, the duty rests upon us to embody, preserve, and convey his timeless message of mercy, justice, and truth to the world.',
    },
  ];
}
