import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../config/organization.config';
import { TERMS_UPDATED_LABEL } from '../../config/terms.config';

interface TermsBlock {
  readonly title: string;
  readonly body: readonly string[];
}

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.html',
})
export class Terms {
  protected readonly org = ORGANIZATION;
  protected readonly updated = TERMS_UPDATED_LABEL;

  protected readonly blocks: readonly TermsBlock[] = [
    {
      title: 'About these terms',
      body: [
        `These terms apply to your use of this website (www.naginasocialwelfare.co.uk), the donation options on it and the online forms and sign-in pages linked from it. The website is run by ${ORGANIZATION.legalName}, a registered charity in England and Wales (charity number ${ORGANIZATION.charityNumber}) and a company registered in England and Wales (company number ${ORGANIZATION.companyNumber}). Our registered office is ${ORGANIZATION.addressFull}.`,
        'By using the website you agree to these terms. If you do not agree, please do not use it. How we handle personal information is explained in our privacy notice.',
      ],
    },
    {
      title: 'Using the website',
      body: [
        'You may use the website for lawful, personal and community purposes. Please do not misuse it: do not try to gain unauthorised access to it or to the sign-in portals, do not interfere with its operation or security, and do not use it to send harmful, unlawful or misleading material.',
        'We may change, suspend or withdraw any part of the website at any time, for example for maintenance. We do our best to keep it available but cannot promise it will always be.',
      ],
    },
    {
      title: 'Religious and educational content',
      body: [
        'Articles, pages, books, sermons and other material on this website are shared in good faith for education and reflection, in line with the beliefs of the charity. They are general information, not a fatwa and not a substitute for advice on your own situation. For a ruling that applies to you, please ask a qualified scholar.',
        'Tools such as the Zakat calculator, prayer times and the Islamic calendar give estimates based on the figures and methods stated on those pages. Please check them against your own circumstances, and confirm congregation (jamat) times with the centre.',
      ],
    },
    {
      title: 'Donations',
      body: [
        'Donations are voluntary gifts to the charity. You can give by card or wallet through SumUp, by PayPal, by NatWest PayIt or by bank transfer, as shown on the donation page. Payments are handled by those providers under their own terms; we do not collect or store your card number on this website.',
        'When you choose a type of gift (for example Zakat, Sadaqah, Lillah or Fitrana) or a centre, we use your gift for that purpose. If that purpose can no longer be fulfilled, or has more money than it can use, the trustees may apply the gift to a similar charitable purpose of the charity. Zakat is used for eligible recipients as described on the donation page.',
        'Gift Aid is not currently claimed on donations made through this website.',
        'If you believe a payment was made in error, please contact us as soon as you can and we will look into it. Contact details are at the end of these terms.',
      ],
    },
    {
      title: 'Madrasa admissions, membership and sign-in accounts',
      body: [
        'Sending an admission application or a community membership application does not guarantee a place or membership; each is reviewed by the charity. The information you give must be accurate and you must be entitled to give it (for example, a parent or guardian applying for a child).',
        'Our parent, student, teacher, collector, member and admin portals are for the people they were created for. Keep your sign-in details private and tell us straight away if you think someone else has used them. We may suspend an account that is misused.',
      ],
    },
    {
      title: 'Links and third-party services',
      body: [
        'This website links to, and loads content from, other services, for example YouTube, TikTok, Google Maps, payment providers and sources of Quran, Hadith and prayer-time data. We do not control those services and are not responsible for their content or availability.',
      ],
    },
    {
      title: 'Ownership of content',
      body: [
        'The website, its design, text, images and the Nagina Social Welfare name and logos belong to the charity or are used with permission. Quran, Hadith and other source texts remain the property of their respective publishers and providers. You may view and share links to our pages for personal and non-commercial use. Please ask us before copying or republishing our material elsewhere.',
      ],
    },
    {
      title: 'Our responsibility to you',
      body: [
        'We take care to keep the website accurate and up to date, but we provide it “as is” and cannot guarantee that it is free from errors or interruptions. To the extent the law allows, we are not responsible for loss that arises from relying on information on the website or from being unable to use it.',
        'Nothing in these terms limits any liability that cannot be limited by law, including liability for death or personal injury caused by negligence, or for fraud.',
      ],
    },
    {
      title: 'Changes to these terms',
      body: [
        'We may update these terms from time to time. The date at the top shows when they were last changed. Using the website after a change means you accept the updated terms.',
      ],
    },
    {
      title: 'Governing law',
      body: [
        'These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction over any dispute about them.',
      ],
    },
  ];
}
