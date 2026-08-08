import { Component } from '@angular/core';

interface DefinitionItem {
  readonly title: string;
  readonly text: string;
}

interface SacredQuote {
  readonly label: string;
  readonly text: string;
  readonly source: string;
}

interface CreedSection {
  readonly number: string;
  readonly title: string;
  readonly lead?: string;
  readonly details?: readonly string[];
  readonly definitions?: readonly DefinitionItem[];
  readonly quotes?: readonly SacredQuote[];
  readonly note?: string;
  readonly subsections?: readonly {
    readonly title: string;
    readonly lead?: string;
    readonly quotes?: readonly SacredQuote[];
    readonly note?: string;
  }[];
}

@Component({
  selector: 'app-ahle-bait',
  templateUrl: './ahle-bait.html',
})
export class AhleBait {
  protected readonly sections: readonly CreedSection[] = [
    {
      number: '01',
      title: 'Defining the Ahl al-Bayt in Sunni Creed',
      lead: 'According to the consensus of the scholars of Ahl al-Sunnah wa’l-Jamā‘ah, the term Ahl al-Bayt encompasses:',
      definitions: [
        {
          title: 'The Noble Wives (Ummahāt al-Mu’minīn)',
          text: 'Led by Sayyidah Khadījah al-Kubrā and Sayyidah ‘Ā’ishah al-Siddīqah (may Allah be pleased with them all).',
        },
        {
          title: 'The Blessed Cloak (Ahl al-Kisā’)',
          text: 'Sayyidatunā Fāṭimah al-Zahrā’, Sayyidunā ‘Alī al-Murtaḍā, Sayyidunā al-Ḥasan, and Sayyidunā al-Ḥusayn (may Allah be pleased with them all).',
        },
        {
          title: 'The Pious Lineage (Banū Hāshim)',
          text: 'The believers among the progeny of Sayyidunā ‘Abbās, Sayyidunā Ja‘far, Sayyidunā ‘Aqīl, and their descendants.',
        },
      ],
      note: 'Sunni doctrine beautifully harmonizes deep love for the Prophet’s Household with immense respect for all his illustrious Companions (Ṣaḥābah), viewing no contradiction between the two.',
    },
    {
      number: '02',
      title: 'Status of Ahl al-Bayt in the Holy Quran',
      lead: 'The Holy Quran explicitly mentions the elevated standing and spiritual purity of the Prophet’s Household across several verses.',
      subsections: [
        {
          title: 'A. The Verse of Purification (Āyat al-Taṭhīr)',
          quotes: [
            {
              label: 'Quran 33:33',
              text: 'Allah only intends to remove all uncleanliness from you, O members of the Household [of the Prophet], and to purify you thoroughly.',
              source: 'Surah Al-Ahzāb 33:33',
            },
          ],
          note: 'Scholars emphasize that this verse establishes both the divine purification granted to the wives of the Prophet (as mentioned in the preceding and succeeding verses) and to the Ahl al-Kisā’ whom the Prophet ﷺ wrapped under his cloak.',
        },
        {
          title: 'B. The Verse of Affection (Āyat al-Mawaddah)',
          lead: 'Allah commands His Messenger ﷺ to state:',
          quotes: [
            {
              label: 'Quran 42:23',
              text: 'Say [O Prophet], “I do not ask you for any reward for this [message] except affection for [my] close relatives.”',
              source: 'Surah Ash-Shūrā 42:23',
            },
          ],
          note: 'Commentators of the Quran note that loving the noble family of the Holy Prophet ﷺ is a religious duty bound upon every believer as a gesture of gratitude for the guidance brought by the Prophet ﷺ.',
        },
      ],
    },
    {
      number: '03',
      title: 'Virtues of Ahl al-Bayt in Hadith Literature',
      lead: 'The authentic traditions (Aḥādīth) recorded in primary Sunni canonical texts detail the immense rank of the Household of the Prophet ﷺ.',
      subsections: [
        {
          title: 'A. Hadith al-Thaqalayn (The Instruction of Revering Ahl al-Bayt)',
          lead: 'In Ṣaḥīḥ Muslim, Sayyidunā Zayd ibn Arqam (may Allah be pleased with him) reported that the Messenger of Allah ﷺ delivered a sermon at the pool of Khumm, stating:',
          quotes: [
            {
              label: 'Hadith Sharif',
              text: 'O people! I am only a human being. Soon a messenger (of death) from my Lord will come, and I will respond. I am leaving among you two weighty things: the first is the Book of Allah, containing guidance and light… and the members of my Household. I remind you, in the name of Allah, regarding my Household! I remind you, in the name of Allah, regarding my Household!',
              source: 'Ṣaḥīḥ Muslim, Hadith 2408',
            },
          ],
        },
        {
          title: 'B. Hadith al-Kisā’ (The Event of the Cloak)',
          lead: 'Sayyidah ‘Ā’ishah (may Allah be pleased with her) narrated:',
          quotes: [
            {
              label: 'Hadith Sharif',
              text: 'The Prophet ﷺ went out one morning wearing a striped cloak of black camel hair. Then al-Ḥasan ibn ‘Alī came and he covered him under it; then al-Ḥusayn came and entered with him; then Fāṭimah came and he took her in; then ‘Alī came and he took him in. He then recited: “Allah only intends to remove all uncleanliness from you, O members of the Household, and to purify you thoroughly.”',
              source: 'Ṣaḥīḥ Muslim, Hadith 2424',
            },
          ],
        },
        {
          title: 'C. The Supreme Rank of Sayyidah Fāṭimah',
          lead: 'The Prophet ﷺ explicitly highlighted the lofty status of his beloved daughter:',
          quotes: [
            {
              label: 'Hadith Sharif',
              text: 'Fāṭimah is a part of me; whoever angers her angers me.',
              source: 'Ṣaḥīḥ al-Bukhārī, Hadith 3714',
            },
            {
              label: 'Hadith Sharif',
              text: 'Fāṭimah is the leader of the women of Paradise.',
              source: 'Ṣaḥīḥ al-Bukhārī, Hadith 3624',
            },
          ],
        },
        {
          title: 'D. The Masters of the Youths of Paradise',
          lead: 'Regarding his blessed grandsons, Sayyidunā al-Ḥasan and Sayyidunā al-Ḥusayn, the Holy Prophet ﷺ declared:',
          quotes: [
            {
              label: 'Hadith Sharif',
              text: 'Al-Ḥasan and al-Ḥusayn are the leaders of the youth of Paradise.',
              source: 'Jāmi‘ at-Tirmidhī, Hadith 3768',
            },
          ],
        },
      ],
    },
    {
      number: '04',
      title: 'Love for Ahl al-Bayt in Daily Worship',
      lead: 'The love for the Prophet’s family is intertwined with daily Islamic practice. In every formal prayer (Ṣalāt), Muslims recite the Durood-e-Ibrahimi (Salutations upon Abrahamic lineage):',
      quotes: [
        {
          label: 'Durood-e-Ibrahimi',
          text: 'O Allah, send peace upon Muhammad and upon the Family of Muhammad, as You sent peace upon Abraham and upon the family of Abraham…',
          source: 'Recited in every Ṣalāt',
        },
      ],
      note: 'Without invoking blessings upon the Āl (Family) of the Prophet ﷺ, the daily supplications remain incomplete, emphasizing their enduring spiritual importance.',
    },
    {
      number: '05',
      title: 'Summary of the Sunni Creed (Ahl al-Sunnah)',
      lead: 'The stance of Ahl al-Sunnah wa’l-Jamā‘ah regarding the Ahl al-Bayt is balanced, authentic, and rooted in the Sunnah:',
      details: [
        'Affection and Loyalty (Mawaddah & Wilāyah): Loving the family of the Prophet ﷺ is an obligation (Farḍ) upon every Muslim.',
        'Balanced Reverence: Sunni Islam maintains deep veneration for the Ahl al-Bayt while avoiding any theological exaggeration (Ghuluw) that contradicts basic Islamic monotheism (Tawḥīd).',
        'Unity of Love: Sunni doctrine holds that genuine love for the Prophet ﷺ necessitates loving both his holy family (Ahl al-Bayt) and his noble companions (Ṣaḥābah), viewing them as complementary pillars of the Islamic legacy.',
      ],
    },
  ];
}
