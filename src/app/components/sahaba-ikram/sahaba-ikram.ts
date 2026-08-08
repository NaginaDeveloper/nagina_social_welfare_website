import { Component } from '@angular/core';

interface CreedPoint {
  readonly number: string;
  readonly title: string;
  readonly lead: string;
  readonly details: readonly string[];
}

@Component({
  selector: 'app-sahaba-ikram',
  templateUrl: './sahaba-ikram.html',
})
export class SahabaIkram {
  protected readonly sahabahPoints: readonly CreedPoint[] = [
    {
      number: '01',
      title: 'Universal Uprightness and Promise of Paradise',
      lead: 'Ahl al-Sunnah holds that God expressed His pleasure with the Sahabah and promised them Paradise.',
      details: [
        'Quranic foundation: The Quran praises the early migrants (Muhajirun), the helpers of Madinah (Ansar), and those who followed them in righteousness, declaring that God is pleased with them and they are pleased with Him (e.g., Surah At-Tawbah 9:100, Surah Al-Hadid 57:10).',
      ],
    },
    {
      number: '02',
      title: 'Restraint Regarding Historical Disputes',
      lead: 'Sunni doctrine dictates maintaining silence and avoiding judgment concerning the internal conflicts or disagreements that arose among the Sahabah (such as the Battles of Jamal or Siffin).',
      details: [
        'Theological principle: Ahl al-Sunnah views their differences through the lens of sincere legal reasoning (ijtihad). They hold that those whose judgment was correct receive a double reward, while those who erred in judgment still receive a reward for their sincere intention.',
        'Hadith foundation: Prophetic traditions strictly warn against harboring malice toward the Companions or making them targets of criticism.',
      ],
    },
    {
      number: '03',
      title: 'Preeminence as the Best Generation',
      lead: 'The generation of the Sahabah holds the highest spiritual status among all generations of the Ummah.',
      details: [
        'Hadith foundation: The Prophet Muhammad ﷺ explicitly stated in authentic narrations (recorded in Sahih al-Bukhari and Sahih Muslim) that the best generation is his generation, followed by the generation that succeeds them.',
      ],
    },
    {
      number: '04',
      title: 'Prohibition of Reviling or Disparaging',
      lead: 'Insulting, cursing, or impugning the motives of any Companion is strictly forbidden in Sunni orthodoxy.',
      details: [
        'Hadith foundation: Narrations caution believers against speaking ill of the Sahabah, emphasizing that even vast amounts of charity given by later generations cannot equal the spiritual weight of the Companions’ smallest deeds.',
      ],
    },
    {
      number: '05',
      title: 'Hierarchy of Virtue Among the Companions',
      lead: 'Ahl al-Sunnah recognizes degrees of merit among the Sahabah based on their early devotion and sacrifices:',
      details: [
        'The Four Rightly Guided Caliphs (Khulafa ar-Rashidun): Abu Bakr, ‘Umar, ‘Uthman, and ‘Ali (may Allah be pleased with them all), ranked in this order of merit.',
        'The Ten Promised Paradise (Al-‘Asharah al-Mubashsharun).',
        'The Veterans of the Battle of Badr (Ashab Badr).',
        'The Participants of the Pledge of the Tree (Ashab Bay‘at al-Ridwan).',
        'Early Believers who accepted Islam and fought before the Conquest of Makkah.',
      ],
    },
  ];
}
