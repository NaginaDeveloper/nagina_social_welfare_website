import { Component } from '@angular/core';

interface SacredQuote {
  readonly kind: 'quran' | 'hadith';
  readonly label: string;
  readonly text: string;
  readonly source: string;
}

interface CreedPoint {
  readonly number: string;
  readonly title: string;
  readonly lead: string;
  readonly details: readonly string[];
}

@Component({
  selector: 'app-aulia-karam',
  templateUrl: './aulia-karam.html',
})
export class AuliaKaram {
  protected readonly quotes: readonly SacredQuote[] = [
    {
      kind: 'quran',
      label: 'Quran 10:62',
      text: 'Unquestionably, for the allies of Allah there will be no fear concerning them, nor will they grieve.',
      source: 'Surah Yunus, Ayat 62 — Ala inna awliya Allahi la khawfun ‘alayhim wa la hum yahzanun',
    },
    {
      kind: 'quran',
      label: 'Quran 10:63–64',
      text: 'Those who believed and were fearing Allah. For them are good tidings in the worldly life and in the Hereafter. No change is there in the words of Allah. That is what is the great attainment.',
      source: 'Surah Yunus, Ayat 63–64',
    },
    {
      kind: 'hadith',
      label: 'Hadith Qudsi',
      text: 'My servant does not draw near to Me with anything more loved to Me than the religious duties I have enjoined upon him. My servant continues to draw near to Me with supererogatory works until I love him. When I love him, I am his hearing with which he hears, his sight with which he sees, his hand with which he strikes, and his foot with which he walks.',
      source: 'Sahih al-Bukhari, Hadith 6502',
    },
    {
      kind: 'hadith',
      label: 'Hadith Qudsi',
      text: 'Whoever shows enmity to a wali (friend) of Mine, I have declared war against him.',
      source: 'Sahih al-Bukhari, Hadith 6505',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      text: 'The scholars are the heirs of the Prophets. The Prophets did not leave behind dinars or dirhams; they left behind knowledge. Whoever takes it has taken an abundant good fortune.',
      source: 'Sunan Abu Dawud, Hadith 3641; Jami‘ at-Tirmidhi, Hadith 2682',
    },
    {
      kind: 'hadith',
      label: 'Hadith Sharif',
      text: 'I had forbidden you from visiting graves, but visit them, for they remind you of the Hereafter.',
      source: 'Sahih Muslim, Hadith 977',
    },
  ];

  protected readonly auliaPoints: readonly CreedPoint[] = [
    {
      number: '01',
      title: 'Who Are the Awliya (Aulia Karam)',
      lead: 'In the creed of Ahl al-Sunnah wal-Jama‘ah, the Awliya Allah (friends of Allah) are the righteous believers whom Allah has honoured through faith, taqwa, and sincere obedience — not those who merely claim titles for themselves.',
      details: [
        'Allah alone grants wilayah (friendship and nearness to Him). No saint, scholar, or spiritual guide shares in divine authority.',
        'The Awliya are known by their adherence to the Quran, the authentic Sunnah, and the balanced path of the Ummah.',
      ],
    },
    {
      number: '02',
      title: 'Quranic Foundation',
      lead: 'The Holy Quran declares the elevated rank and security of the Awliya in Surah Yunus.',
      details: [
        'Ayat 10:62 — “Ala inna awliya Allahi la khawfun ‘alayhim wa la hum yahzanun” — there is no fear upon them and they shall not grieve.',
        'Ayat 10:63–64 — they are the believers who possess taqwa, and for them are glad tidings in this world and the Hereafter.',
      ],
    },
    {
      number: '03',
      title: 'Marks of the Awliya',
      lead: 'The signs of the friends of Allah are spiritual excellence rooted in lawful worship and noble character.',
      details: [
        'Sincere iman (faith) and constant taqwa (God-consciousness).',
        'Obedience to Allah and following the Sunnah of the Prophet Muhammad ﷺ.',
        'Humility, truthfulness, patience, and compassion toward creation.',
        'Strict adherence to Shari‘ah — the Awliya never contradict divine law.',
      ],
    },
    {
      number: '04',
      title: 'Love and Honour for the Awliya',
      lead: 'Respecting the pious ‘ulama, righteous scholars, and Awliya is an integral part of Sunni spirituality and Markaz-style guidance.',
      details: [
        'Hadith foundation: Whoever shows enmity to a wali of Allah draws divine displeasure upon himself.',
        'The scholars are the heirs of the Prophets — loving and honouring them preserves the light of knowledge in the Ummah.',
        'Visiting the graves of the righteous, remembering their virtues, and seeking inspiration from their lives are permitted when done within Shari‘ah bounds.',
      ],
    },
    {
      number: '05',
      title: 'Balanced Creed — Without Exaggeration',
      lead: 'Ahl al-Sunnah maintains deep reverence for the Awliya while firmly rejecting ghuluw (exaggeration) that contradicts Tawhid.',
      details: [
        'All help, mercy, and wilayah belong to Allah alone. The Awliya are beloved servants, not partners in divinity.',
        'We do not attribute independent powers to saints that belong only to Allah.',
        'Love for the Awliya harmonizes with love for the Prophet ﷺ, the Ahle Bait, and the Sahaba — all pillars of the Sunni legacy.',
      ],
    },
    {
      number: '06',
      title: 'Role Models of Piety',
      lead: 'The Awliya throughout Islamic history stand as luminous examples of devotion, sacrifice, and service to the Ummah.',
      details: [
        'They remind believers that nearness to Allah is achieved through worship, good deeds, and purification of the heart.',
        'Their lives inspire us toward dhikr, fikr, charity, and steadfastness upon the Hanafi Barelvi / Ahl al-Sunnah path.',
        'When in doubt about any matter of creed or personal ruling, consult Markaz Deen-e-Islam for guidance rooted in authentic scholarship.',
      ],
    },
  ];
}
