import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface BeliefFaq {
  readonly question: string;
  readonly answer: string;
  readonly relatedPath?: string;
  readonly relatedLabel?: string;
}

interface BeliefCategory {
  readonly title: string;
  readonly lead?: string;
  readonly faqs: readonly BeliefFaq[];
}

@Component({
  selector: 'app-basic-beliefs',
  imports: [RouterLink],
  templateUrl: './basic-beliefs.html',
})
export class BasicBeliefs {
  protected readonly intro =
    'These questions summarise the basic aqeedah (beliefs) of Ahl al-Sunnah wa\'l-Jama\'ah as understood at Nagina Social Welfare and Markaz Deen-e-Islam — Hanafi fiqh with love for the Prophet ﷺ, the Ahle Bait, the Sahaba, and the Awliya, always upon the Quran and authentic Sunnah.';

  protected readonly disclaimer =
    'This page offers gentle general creed guidance, not personal fatwas. For individual religious rulings, please speak to Markaz Deen-e-Islam directly.';

  protected readonly closing =
    'In summary, our beliefs unite sincere faith in Allah, love and obedience to the Prophet Muhammad ﷺ, honour for the Ahle Bait and Sahaba Ikram, respect for the Awliya Allah, and steadfastness upon Hanafi fiqh — without exaggeration, without shirk, and without departing from the balanced path of Ahl al-Sunnah wa\'l-Jama\'ah.';

  protected readonly beliefCategories: readonly BeliefCategory[] = [
    {
      title: 'Who we are — Ahl al-Sunnah / Hanafi Barelvi',
      lead: 'The starting point of our creed is belonging to the mainstream Sunni Ummah with the spiritual emphasis taught at Markaz.',
      faqs: [
        {
          question: 'What is Ahl al-Sunnah wa\'l-Jama\'ah?',
          answer:
            'Ahl al-Sunnah wa\'l-Jama\'ah are the Muslims who follow the Quran, the authentic Sunnah of the Prophet Muhammad ﷺ, and the understanding of the righteous early generations (Salaf al-Salihin). They hold balanced creed, love for the Prophet ﷺ, and unity upon the fundamentals of Islam.',
        },
        {
          question: 'What does Hanafi Barelvi mean at Nagina Social Welfare?',
          answer:
            'Hanafi means we follow the fiqh of Imam Abu Hanifah (may Allah have mercy on him) in worship and daily Islamic practice. Barelvi refers to the spiritual emphasis of love for the Prophet ﷺ, Khatme Nabuwwat, respect for Ahle Bait, Sahaba, and Awliya, and Markaz-style guidance rooted in Ahl al-Sunnah — not a separate religion, but a recognised Sunni spiritual tradition.',
        },
        {
          question: 'What are the six pillars of iman (faith)?',
          answer:
            'The six pillars of iman are: belief in Allah; His angels; His revealed books; His messengers; the Last Day; and divine decree (qadar) — good and difficult — from Allah. These are the foundations every Muslim must hold with the heart.',
        },
      ],
    },
    {
      title: 'Foundations of faith',
      lead: 'The pillars of belief rest upon Tawhid, the finality of prophethood, and following the Quran and Sunnah.',
      faqs: [
        {
          question: 'What is Tawhid?',
          answer:
            'Tawhid is the oneness of Allah — that He alone is worthy of worship, Lordship, and ultimate reliance. We reject shirk (associating partners with Allah) in all its forms. All help, mercy, and wilayah belong to Allah alone.',
        },
        {
          question: 'What is our belief about the Holy Quran?',
          answer:
            'The Quran is the final, preserved, and unaltered Word of Allah revealed to the Prophet Muhammad ﷺ. It is the primary source of guidance together with the authentic Sunnah. No new revelation comes after the Quran.',
        },
        {
          question: 'What is Khatme Nabuwwat (the finality of Prophethood)?',
          answer:
            'Khatme Nabuwwat is the belief that Prophet Muhammad ﷺ is Khatam-un-Nabiyyin — the Seal and last of all prophets. Allah perfected the religion through him ﷺ, and no prophet will come after him. This is a cornerstone of Islamic faith.',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Read more: Khatme Nabuwwat',
        },
        {
          question: 'Do Muslims accept any prophet after Muhammad ﷺ?',
          answer:
            'No. Ahl al-Sunnah firmly rejects any claim of prophethood, messengership, or divine revelation after the Prophet Muhammad ﷺ. Whoever claims otherwise has departed from the consensus of the Ummah on Khatme Nabuwwat.',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Read more: Khatme Nabuwwat',
        },
        {
          question: 'What is the Sunnah and why must we follow it?',
          answer:
            'The Sunnah is the teaching, example, and approved way of the Prophet Muhammad ﷺ preserved in authentic hadith. The Quran commands obedience to the Messenger ﷺ. A Muslim cannot understand or practise Islam correctly without the Sunnah alongside the Quran.',
        },
      ],
    },
    {
      title: 'Love, reverence, and balanced creed',
      lead: 'Sunni spirituality includes deep love for the Prophet ﷺ and those Allah and His Messenger ﷺ honoured — always within the bounds of Tawhid.',
      faqs: [
        {
          question: 'Why is love for the Prophet Muhammad ﷺ essential?',
          answer:
            'Love for the Prophet ﷺ is part of iman. The Quran and Sunnah teach that faith is incomplete without honouring him ﷺ. Muslims express this love through obedience, sending durood (salawat), and following his noble character.',
        },
        {
          question: 'What is our belief regarding the Ahle Bait?',
          answer:
            'We love, honour, and respect the Ahl al-Bayt — the blessed family of the Prophet ﷺ — as taught in the Quran and authentic Sunnah. This love is a religious duty, held in balance with love for the Sahaba and without theological exaggeration (ghuluw).',
          relatedPath: '/ahle-bait',
          relatedLabel: 'Read more: Ahle Bait',
        },
        {
          question: 'What is our belief regarding the Sahaba Ikram?',
          answer:
            'All the Companions (Sahaba) of the Prophet Muhammad ﷺ are honoured as the best generation of the Ummah. Loving and respecting them is part of faith. Insulting or reviling any Companion is forbidden in Sunni orthodoxy.',
          relatedPath: '/sahaba-ikram',
          relatedLabel: 'Read more: Sahaba Ikram',
        },
        {
          question: 'What is our belief regarding the Awliya Allah (Aulia Karam)?',
          answer:
            'The Awliya are the righteous friends of Allah — believers honoured through faith, taqwa, and sincere obedience. Allah declares in Surah Yunus (10:62) that His Awliya shall know no fear nor grief. We love and respect them without treating them as partners with Allah.',
          relatedPath: '/aulia-karam',
          relatedLabel: 'Read more: Aulia Karam',
        },
        {
          question: 'What is ghuluw and why do we avoid it?',
          answer:
            'Ghuluw means exaggeration in reverence — giving a created being rights that belong to Allah alone. Ahl al-Sunnah honours the Prophet ﷺ, Ahle Bait, Sahaba, and Awliya deeply, but never ascribes divine powers to them. All worship and ultimate reliance belong to Allah alone.',
        },
      ],
    },
    {
      title: 'Hanafi Barelvi worship and spirituality',
      lead: 'Daily practice and spiritual life follow Hanafi fiqh and the gentle Sunni tradition taught at Markaz.',
      faqs: [
        {
          question: 'Why do we follow Hanafi fiqh in worship?',
          answer:
            'Imam Abu Hanifah\'s school is followed by the majority of Muslims in South Asia and many parts of the world. At Nagina, salah, fasting, and related rulings are understood according to Hanafi fiqh — for example, Hanafi Asr time on our Namaz page.',
          relatedPath: '/namaz',
          relatedLabel: 'Namaz times (Hanafi Asr)',
        },
        {
          question: 'Is visiting the graves of the righteous permitted?',
          answer:
            'Yes, when done within Shari\'ah bounds. The Prophet ﷺ permitted visiting graves so they remind us of the Hereafter. We may remember the virtues of the pious and seek inspiration from their lives — not worship graves or treat the deceased as independent sources of help.',
          relatedPath: '/aulia-karam',
          relatedLabel: 'Read more: Aulia Karam',
        },
        {
          question: 'What is our belief about shafa\'at (intercession)?',
          answer:
            'Shafa\'at is intercession on the Day of Judgment by Allah\'s permission. The Prophet Muhammad ﷺ and the righteous may intercede only as Allah allows. This is authentic Sunni belief. Intercession is not independent power — it belongs entirely to Allah\'s mercy and decree.',
        },
        {
          question: 'What is tawassul and how is it understood?',
          answer:
            'Tawassul means seeking nearness to Allah through permissible means — such as His beautiful names, good deeds, or by the rank of the Prophet ﷺ or the pious. Ahl al-Sunnah permits tawassul when it does not involve shirk. We never call upon anyone as if they share in Allah\'s divinity.',
        },
        {
          question: 'What is our view on Milad and expressing joy at the birth of the Prophet ﷺ?',
          answer:
            'Many scholars of Ahl al-Sunnah, including the Barelvi tradition, permit expressing joy and gratitude for the birth of the Prophet Muhammad ﷺ when the gathering remains within Shari\'ah — with durood, praise of the Prophet ﷺ, and without forbidden mixing or innovations that contradict clear Islamic law. Markaz encourages love and remembrance rooted in authentic teaching.',
        },
      ],
    },
    {
      title: 'What this page does not replace',
      lead: 'Firm creed, gentle tone — and knowing the limits of general guidance.',
      faqs: [
        {
          question: 'Is this website or assistant a mufti?',
          answer:
            'No. This page, and the Nagina Assistant, offer general creed and site information — not binding personal fatwas. For marriage, divorce, inheritance, or any individual ruling, please contact Markaz Deen-e-Islam directly.',
          relatedPath: '/contact',
          relatedLabel: 'Contact Markaz',
        },
        {
          question: 'Does Nagina present all Islamic groups as equally valid?',
          answer:
            'Nagina Social Welfare teaches and publishes from the Hanafi Barelvi / Ahl al-Sunnah wa\'l-Jama\'ah perspective. We explain our beliefs with respect and without harsh sectarian language, but we do not treat every maslak or modern claim as equally valid for our community.',
        },
        {
          question: 'Where can I read the detailed creed pages?',
          answer:
            'This FAQ is an overview. For fuller treatment, visit our dedicated creed pages on Khatme Nabuwwat, Ahle Bait, Sahaba Ikram, and Aulia Karam — each with Quran, Hadith, and detailed points of belief.',
          relatedPath: '/khatme-nabuwwat',
          relatedLabel: 'Start with Khatme Nabuwwat',
        },
      ],
    },
  ];
}
