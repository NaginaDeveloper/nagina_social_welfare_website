import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface PrivacyBlock {
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly i18n = inject(LanguageService);

  protected readonly updated = '20 August 2026';

  protected readonly blocks: readonly PrivacyBlock[] = [
    {
      title: 'Who we are',
      body:
        'Nagina Social Welfare UK Limited (“we”, “us”) operates this website to share our education and community welfare work. Contact: info@naginasocialwelfare.co.uk · 103 Burmer Road, Peterborough PE1 3HT, United Kingdom.',
    },
    {
      title: 'What this site does not do',
      body:
        'We do not use advertising cookies, on-site analytics trackers, or marketing pixels on this website. We do not sell your personal data. We may use Google Search Console to see how our pages appear in Google Search (search queries and clicks); that service is operated by Google and does not place advertising trackers on visitors’ browsers.',
    },
    {
      title: 'Information we process',
      body:
        'Browsing this site creates standard server and hosting logs (such as IP address, browser type, and pages requested) needed to deliver the site securely. If you email, call, or open WhatsApp from this website, the message is sent in your own phone or email app — we do not store that form on our servers. Bank donation details and the NatWest PayIt / PayPal QR and payment links shown on this site are for you to use with your own bank, banking app, or PayPal. Online card or wallet donations via SumUp are started on this site (donation amount and chosen fund only) and completed on SumUp’s secure payment page; we do not collect or store card numbers on this website. SumUp, NatWest and PayPal process those payments under their own privacy notices. Questions sent to the Nagina Assistant may be processed by our server and Google Gemini so the assistant can answer from our published site content.',
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
      title: 'Nagina Assistant',
      body:
        'Nagina Assistant is a chat-style helper trained on our published website content, guidance summaries, creed pages, and book-library extracts. Messages may be temporarily processed and logged on our Firebase infrastructure and sent to Google Gemini to generate a reply. The assistant is informational only and must not be relied on for binding fatwas, legal decisions, medical advice, or personal religious rulings.',
    },
    {
      title: 'Fonts',
      body:
        'Typefaces used on this site are self-hosted on our own domain. We do not load fonts from Google Fonts or other third-party font CDNs.',
    },
    {
      title: 'Links to other services',
      body:
        'Links to Facebook, Instagram, YouTube, WhatsApp, Google Maps, Google Play, SumUp’s payment pages, PayPal, NatWest PayIt, Google Gemini services, and our member login portal (admin.naginasocialwelfare.co.uk) take you to those providers’ sites or apps, which have their own privacy notices.',
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
