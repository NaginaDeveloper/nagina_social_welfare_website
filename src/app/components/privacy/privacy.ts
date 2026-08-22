import { Component, inject } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { PRIVACY_NOTICE_UPDATED_LABEL } from '../../config/privacy-notice.config';

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

  protected readonly updated = PRIVACY_NOTICE_UPDATED_LABEL;

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
        'Browsing this site creates standard server and hosting logs (such as IP address, browser type, and pages requested) needed to deliver the site securely. If you email, call, or open WhatsApp from this website, the draft is sent in your own phone or email app — we do not store that unsent WhatsApp/email draft on our servers. Messages you actually send to our WhatsApp number are processed as described under “WhatsApp messages” below. Online madrasa admission applications submitted via /apply are stored in our Firebase/Google Cloud Firestore and processed by our staff; acknowledgement and decision emails are sent from info@naginasocialwelfare.co.uk. Bank donation details and the NatWest PayIt / PayPal QR and payment links shown on this site are for you to use with your own bank, banking app, or PayPal. Online card or wallet donations via SumUp are started on this site (donation amount and chosen fund only) and completed on SumUp’s secure payment page; we do not collect or store card numbers on this website. SumUp, NatWest and PayPal process those payments under their own privacy notices. Questions sent to the Nagina Assistant may be processed by our server and Google Gemini so the assistant can answer from our published site content.',
    },
    {
      title: 'Online admissions',
      body:
        'When you submit the Markaz Deen-e-Islam online admission form, we collect student and parent/guardian contact details, address, medical and emergency information, class preference, and your consents/declaration. We use this to review enrolment, create school records if accepted, and contact you. Access is limited to authorised staff. You may email info@naginasocialwelfare.co.uk to exercise UK GDPR rights relating to an application we hold.',
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
      title: 'Quran & Hadith text',
      body:
        'The Blessed Quran Majeed is loaded from the AlQuran Cloud API (Arabic text, Kanzul Iman translations, and audio). The Kutub al-Sittah Hadith reader loads Arabic, Urdu, and English chapter text from an open-source Hadith JSON dataset served via the jsDelivr CDN. Your browser contacts those providers to download the text; we do not store your reading history on our servers.',
    },
    {
      title: 'Books & files',
      body:
        'Book covers, PDFs, and event images are loaded from Google Firebase Storage so we can publish our library and gatherings. Your browser contacts Google’s servers to download those files.',
    },
    {
      title: 'Nagina Assistant',
      body:
        'Nagina Assistant is a chat-style helper trained on our published website content, guidance summaries, creed pages, and book-library extracts. Messages may be temporarily processed and logged on our Firebase infrastructure and sent to Google Gemini to generate a reply. The assistant is informational only and must not be relied on for binding fatwas, legal decisions, medical advice, or personal religious rulings.',
    },
    {
      title: 'WhatsApp messages',
      body:
        'Our published WhatsApp number may send automated replies for common questions (about us, contact details, how to apply, and how to donate). Those replies are generated on our Firebase server, using the same Nagina Assistant knowledge and, when needed, Google Gemini. We may store recent chat turns so the bot can keep context and so staff can continue the conversation from the WhatsApp Business app. Do not send children’s admission details on WhatsApp — use the online form at /apply. Reply STAFF (or ask for a person) if you want a team member instead of the bot. Meta/WhatsApp also process the message under their own terms.',
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
