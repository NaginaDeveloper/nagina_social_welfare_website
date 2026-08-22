export type FaqLang = 'en' | 'ur';

export type WhatsappIntent =
  | 'greeting'
  | 'about'
  | 'apply'
  | 'donate'
  | 'ask'
  | 'handoff'
  | 'safeguarding'
  | 'question';

const SITE = 'https://www.naginasocialwelfare.co.uk';
const WHATSAPP_MAX_CHARS = 4096;

const GREETING =
  /^(hi+|hello|hey|assalamu\s+alaikum|asalamu\s+alaikum|assalamu|salaam|salam|aoa|menu|help|start|hiya|السلام علیکم|السلام عليكم|السلام|سلام|مدد|مینو)[\s!.,?]*$/i;

const HANDOFF =
  /\b(human|staff|person|agent|operator|someone|speak to|talk to (a )?(person|human|staff)|live (chat|agent)|real person)\b/i;
const HANDOFF_UR = /سٹاف|انسان سے بات|کوئی انسان|منشی|براہ راست بات|شخص سے بات/;

const SAFEGUARDING =
  /\b(safeguard|nspcc|abus(?:e|ed|ive)|grooming|child at risk|at risk of harm|harm a child|emergency 999|\b999\b)\b/i;
const SAFEGUARDING_UR = /استحصال|محفوظی|بچے کو نقصان|خطرے میں بچ/;

const ABOUT =
  /\b(about( us)?|who are you|organisation|organization|charity number|company number|contact|address|email|phone|where are you|opening hours)\b/i;
const ABOUT_UR = /تعارف|کون ہو|چارٹی|ای میل|پتہ|فون|رابطہ|کہاں ہو/;

const APPLY =
  /\b(apply|application|admission|enrol|enroll|madrasa place|class place|online form)\b/i;
const APPLY_UR = /داخلہ|درخواست|فارم|مدرسہ|داخل/;

const DONATE =
  /\b(donat(?:e|ion|ions)|bank transfer|sort code|paypal|payit|sumup|give (money|zakat|sadaqah|lillah)|pay (zakat|sadaqah)|fitrana)\b/i;
const DONATE_UR = /عطیہ|زکو|صدقہ|للہ|فطرانہ|بینک|پے پال/;

export function detectFaqLanguage(text: string): FaqLang {
  return /[\u0600-\u06FF]/.test(text) ? 'ur' : 'en';
}

export function interactiveIntent(id: string | undefined): WhatsappIntent | null {
  if (!id) {
    return null;
  }
  if (id === 'about' || id === 'apply' || id === 'donate' || id === 'ask') {
    return id;
  }
  if (id === 'menu') {
    return 'greeting';
  }
  return null;
}

export function classifyWhatsappTurn(text: string, interactiveId?: string): WhatsappIntent {
  const fromButton = interactiveIntent(interactiveId);
  if (fromButton) {
    return fromButton;
  }

  const raw = text.trim();
  if (!raw) {
    return 'greeting';
  }

  if (SAFEGUARDING.test(raw) || SAFEGUARDING_UR.test(raw)) {
    return 'safeguarding';
  }
  if (HANDOFF.test(raw) || HANDOFF_UR.test(raw)) {
    return 'handoff';
  }

  const numbered = raw.replace(/[.)]/g, '').trim();
  if (numbered === '1') return 'about';
  if (numbered === '2') return 'apply';
  if (numbered === '3') return 'donate';
  if (numbered === '4') return 'ask';

  const contactReason = parseWebsitePrefill(raw);
  if (contactReason) {
    return contactReason;
  }

  if (GREETING.test(raw)) {
    return 'greeting';
  }
  if (APPLY.test(raw) || APPLY_UR.test(raw)) {
    return 'apply';
  }
  if (DONATE.test(raw) || DONATE_UR.test(raw)) {
    return 'donate';
  }
  if (ABOUT.test(raw) || ABOUT_UR.test(raw)) {
    return 'about';
  }
  return 'question';
}

/** Maps the website contact-form / CTA prefills onto bot topics. */
export function parseWebsitePrefill(text: string): WhatsappIntent | null {
  const lower = text.toLowerCase();
  if (/reason:\s*madrasa enrolment/i.test(text) || /مدرسہ داخلہ/.test(text)) {
    return 'apply';
  }
  if (/reason:\s*donation/i.test(text) || /reason:\s*عطیہ/.test(text)) {
    return 'donate';
  }
  if (/reason:\s*namaz/i.test(text) || /reason:\s*نماز/.test(text)) {
    return 'question';
  }
  if (/reason:\s*general enquiry/i.test(text) || /reason:\s*عمومی استفسار/.test(text)) {
    const parts = text.split('\n').map((line) => line.trim()).filter(Boolean);
    const last = parts.at(-1) ?? '';
    if (/^assalam|^reason:|^name:/i.test(last) || last.length < 8) {
      return 'greeting';
    }
    return 'question';
  }
  if (lower.includes('question about donating')) {
    return 'donate';
  }
  if (lower.includes('question about markaz deen-e-islam enrolment')) {
    return 'apply';
  }
  if (lower.includes('i would like to get in touch with nagina social welfare')) {
    return 'greeting';
  }
  return null;
}

export function formatWhatsappText(text: string): string {
  const cleaned = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
  if (cleaned.length <= WHATSAPP_MAX_CHARS) {
    return cleaned;
  }
  return `${cleaned.slice(0, WHATSAPP_MAX_CHARS - 24).trim()}\n\n…`;
}

export function menuBody(lang: FaqLang): string {
  return lang === 'ur'
    ? 'السلام علیکم۔ میں Nagina Social Welfare کا خودکار معاون ہوں۔ موضوع چنیں، یا اپنا سوال لکھیں۔ سٹاف سے بات کے لیے “سٹاف” لکھیں۔'
    : 'Assalamu alaikum. I am the Nagina Social Welfare automated helper. Choose a topic, or type your question. Reply STAFF if you need a person.';
}

export function menuFallbackText(lang: FaqLang): string {
  return lang === 'ur'
    ? `${menuBody(lang)}\n\n1. تعارف اور رابطہ\n2. داخلہ فارم\n3. عطیات\n4. کوئی اور سوال`
    : `${menuBody(lang)}\n\n1. About & contact\n2. Application form\n3. Donations\n4. Ask a question`;
}

export function cannedReply(intent: Exclude<WhatsappIntent, 'question'>, lang: FaqLang): string {
  if (intent === 'greeting' || intent === 'ask') {
    return intent === 'ask'
      ? lang === 'ur'
        ? 'جزاک اللہ۔ براہِ کرم اپنا سوال لکھیں — انگریزی یا اردو۔'
        : 'JazakAllah. Please type your question in English or Urdu.'
      : menuFallbackText(lang);
  }
  if (intent === 'handoff') {
    return lang === 'ur'
      ? 'جزاک اللہ۔ ایک ٹیم ممبر آپ کے پیغام کا جواب دے گا۔ خودکار جوابات اب بند ہیں۔'
      : 'JazakAllah. A team member will continue this chat. Automated replies are paused.';
  }
  if (intent === 'safeguarding') {
    return lang === 'ur'
      ? 'اگر کوئی بچہ یا بالغ خطرے میں ہو تو فوری طور پر ہمارے سٹاف کو واٹس ایپ یا info@naginasocialwelfare.co.uk پر بتائیں۔ ایمرجنسی میں 999 کال کریں۔ NSPCC: 0808 800 5000۔ خودکار بوٹ اس معاملے کا جواب نہیں دے گا۔'
      : 'If a child or adult may be at risk, tell our staff now on this WhatsApp number or email info@naginasocialwelfare.co.uk. In an emergency call 999. NSPCC: 0808 800 5000. The automated helper will not handle this.';
  }
  if (intent === 'about') {
    return lang === 'ur'
      ? [
          'السلام علیکم۔',
          'Nagina Social Welfare UK ایک رجسٹرڈ خیراتی ادارہ ہے (1196514) اور کمپنی 08342937۔ ہمارے دو بازو ہیں: مرکز دینِ اسلام (قرآن اور اسلامی تعلیم) اور Nagina Social Welfare (کمیونٹی فلاح)۔',
          '',
          'رابطہ',
          'ای میل: info@naginasocialwelfare.co.uk',
          'فون: 07831 684738',
          'پتہ: 103 Burmer Road, Peterborough PE1 3HT',
          '',
          `مزید: ${SITE}/about/`,
        ].join('\n')
      : [
          'Assalamu alaikum.',
          'Nagina Social Welfare UK is a registered charity (1196514) and company 08342937. We work through two arms: Markaz Deen-e-Islam (Qur’an and Islamic education) and Nagina Social Welfare (community welfare).',
          '',
          'Official contact',
          'Email: info@naginasocialwelfare.co.uk',
          'Phone: 07831 684738',
          'Address: 103 Burmer Road, Peterborough PE1 3HT',
          '',
          `More: ${SITE}/about/`,
        ].join('\n');
  }
  if (intent === 'apply') {
    return lang === 'ur'
      ? [
          'مدرسہ کی نئی جگہ کے لیے صرف آن لائن فارم استعمال کریں۔ بچوں کی تفصیل یہاں نہ بھیجیں۔',
          '',
          `${SITE}/apply/`,
          '',
          'چار مراحل: طالب علم، والدین، طبی نوٹس، پھر کلاس اور اقرار۔ عمر 3 سے 18 سال۔ وصولی اور فیصلے کی ای میل info@naginasocialwelfare.co.uk سے آتی ہے۔',
          `درخواست ٹریک کریں: ${SITE}/apply/track/`,
          'فیس: ہر پیر £5 (یا پیشگی)۔ سوال کے لیے یہاں لکھیں یا سٹاف لکھیں۔',
        ].join('\n')
      : [
          'To apply for a madrasa place, use the online form only. Please do not send children’s details here.',
          '',
          `${SITE}/apply/`,
          '',
          'Four short steps: student, parent, medical notes, then class and declaration. Ages 3–18. We email you from info@naginasocialwelfare.co.uk when we receive it and after review.',
          `Track your application: ${SITE}/apply/track/`,
          'Fees are £5 every Monday (or paid in advance). For other questions, type here or reply STAFF.',
        ].join('\n');
  }
  return lang === 'ur'
    ? [
        'جزاک اللہ۔ عطیہ کے لیے فنڈ چنیں، پھر اس صفحے سے ادا کریں:',
        `${SITE}/donate/`,
        '',
        'فنڈ: زکوٰۃ، صدقہ، للہ، یا فطرانہ۔',
        'طریقے: کارڈ (SumUp، کم از کم £5)، PayPal، NatWest PayIt، یا بینک ٹرانسفر۔',
        '',
        'بینک ٹرانسفر',
        'اکاؤنٹ نام: NAGINA SOCIAL WELFAR',
        'بینک: NatWest',
        'سارٹ کوڈ: 54-21-38',
        'اکاؤنٹ: 29135877',
        'حوالہ کے طور پر فنڈ لکھیں: ZAKAT، SADAQAH، LILLAH یا FITRANA۔',
        '',
        'چارٹی 1196514۔ گفٹ ایڈ فی الحال کلیم نہیں ہوتا۔',
      ].join('\n')
    : [
        'JazakAllah for wanting to give. Choose a fund, then pay on our donate page:',
        `${SITE}/donate/`,
        '',
        'Funds: Zakat, Sadaqah, Lillah, or Fitrana.',
        'Ways to give: card (SumUp, from £5), PayPal, NatWest PayIt, or UK bank transfer.',
        '',
        'Bank transfer',
        'Account name: NAGINA SOCIAL WELFAR',
        'Bank: NatWest',
        'Sort code: 54-21-38',
        'Account: 29135877',
        'Use the fund as the reference: ZAKAT, SADAQAH, LILLAH, or FITRANA.',
        '',
        'Registered charity 1196514. Gift Aid is not currently claimed.',
      ].join('\n');
}
