import { Component } from '@angular/core';

interface PrivacyBlock {
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly updated = '8 August 2026';

  protected readonly blocks: readonly PrivacyBlock[] = [
    {
      title: 'Who we are',
      body:
        'Nagina Social Welfare UK Limited (“we”, “us”) operates this website to share our education and community welfare work. Contact: info@naginasocialwelfare.co.uk · 103 Burmer Road, Peterborough PE1 3HT, United Kingdom.',
    },
    {
      title: 'What this site does not do',
      body:
        'We do not use advertising cookies, analytics trackers, or marketing pixels on this website. We do not sell your personal data.',
    },
    {
      title: 'Information we process',
      body:
        'Browsing this site creates standard server and hosting logs (such as IP address, browser type, and pages requested) needed to deliver the site securely. If you email or call us, we process the details you choose to send so we can respond. Bank donation details and the NatWest PayIt / PayPal QR and payment links shown on this site are for you to use with your own bank, banking app, or PayPal. Online card or wallet donations via SumUp are started on this site (donation amount only) and completed on SumUp’s secure payment page; we do not collect or store card numbers on this website. SumUp, NatWest and PayPal process those payments under their own privacy notices.',
    },
    {
      title: 'Donations via SumUp, PayPal & NatWest PayIt',
      body:
        'When you choose “Donate securely with SumUp”, your browser contacts our payment server to create a checkout session, then you are redirected to SumUp (sumup.com) to pay. Payment status may also be confirmed via encrypted server-to-server messages from SumUp. PayPal donations use PayPal’s secure link or QR code (paypal.com); that payment is completed on PayPal’s systems. NatWest PayIt donations use NatWest’s secure payment link or QR code (paymentrequest.natwestpayit.com). Bank transfer details remain available if you prefer to pay from your own bank.',
    },
    {
      title: 'Prayer times & Qibla',
      body:
        'Prayer times are calculated for Peterborough using the AlAdhan service with fixed city coordinates (not your device location). The Qibla compass defaults to Peterborough. If you tap “Use my location”, your browser may share precise coordinates with us only long enough to request a Qibla bearing from AlAdhan; we do not store that location on our servers. Device compass (“Point to Qibla”) runs on your device and does not send heading data to us.',
    },
    {
      title: 'Books & files',
      body:
        'Book covers and PDFs are loaded from Google Firebase Storage so we can publish our library. Your browser contacts Google’s servers to download those files.',
    },
    {
      title: 'Fonts',
      body:
        'Typefaces used on this site are self-hosted on our own domain. We do not load fonts from Google Fonts or other third-party font CDNs.',
    },
    {
      title: 'Links to other services',
      body:
        'Links to Facebook, Instagram, YouTube, Google Play, SumUp’s payment pages, PayPal, NatWest PayIt, and our member login portal (admin.naginasocialwelfare.co.uk) take you to those providers’ sites or apps, which have their own privacy notices.',
    },
    {
      title: 'Your rights (UK GDPR)',
      body:
        'Depending on the context, you may have rights to access, correct, erase, restrict, or object to certain processing, and to complain to the UK Information Commissioner’s Office (ico.org.uk). To exercise rights relating to data we hold about you, email info@naginasocialwelfare.co.uk.',
    },
    {
      title: 'Changes',
      body:
        'We may update this notice when our practices change. The “Last updated” date at the top of this section will be revised accordingly.',
    },
  ];
}
