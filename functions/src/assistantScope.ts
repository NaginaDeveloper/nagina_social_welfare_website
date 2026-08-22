import {
  detectQuestionLanguage,
  type RawAssistantChunk,
  type StoredAssistantChunk,
} from './assistantShared';

export type QuestionScope = 'islamic' | 'site_help' | 'personal_fatwa' | 'off_topic';

const SITE_HELP =
  /\b(donate|donation|contact|namaz|prayer|qibla|books?|library|sermon|event|app|assistant|portal|login|member|sumup|paypal|natwest|payit|email|phone|address|privacy|website|site|apply|admission|madrasa|enrol|enroll|about)\b/i;
const SITE_HELP_UR =
  /رابط|عط|عطی|نماز|قبل|کتاب|لائب|بیان|ایونٹ|ایپ|مدد|رابطہ|پتہ|فون|ای میل|ویب|سائٹ|عطیہ|داخلہ|درخواست|مدرسہ|فارم|تعارف/;

const PERSONAL_FATWA =
  /\b(fatwa|mufti|ruling for me|in my case|my wife|my husband|my marriage|should i divorce|can i skip|is it halal for me|personal ruling|legal advice|medical advice)\b/i;
const PERSONAL_FATWA_UR =
  /فتوی|میرے لیے|میرے لئے|میرا نکاح|میری بیوی|میرے شوہر|طلاق|کیا مجھے|کیا میں|ذاتی|میرے معامل|میرے کیس/;

const OFF_TOPIC =
  /\b(python|javascript|typescript|code|programming|recipe|weather|football|cricket|movie|netflix|bitcoin|stock|crypto|homework|essay|write me a letter unrelated)\b/i;
const OFF_TOPIC_UR =
  /کوڈ|پروگرام|کھانا بن|موسم|فٹبال|کرکٹ|فلم|بٹ کوئ|شئیر|اسائنمنٹ|انگریزی مضمون/;

const ISLAMIC =
  /\b(islam|muslim|quran|hadith|prophet|nabi|nabuwwat|khatme|ahle|bait|sahaba|guidance|namaz|salah|dua|mawlid|milad|urs|naat|hanafi|barelvi|sunni|sunnah|markaz|baba ji|spiritual|creed|iman|faith|worship|fasting|ramadan|zakat|hajj|umrah)\b/i;
const ISLAMIC_UR =
  /اسلام|مسلم|قرآ|حدیث|نبی|نبوت|ختم|اہل|بیت|صحاب|رہنم|نماز|دعا|میلاد|milad|نعت|حنفی|بریل|سنی|سنت|مرکز|بابا|عقید|ایمان|روز|زکو|حج|عمر/;

const BOOKS_QUERY =
  /\b(books?|library|seedha\s*rasta|pdfs?|download|catalog|which books?|available books?|book list)\b/i;
const BOOKS_QUERY_UR =
  /سیدھا\s*راست|لائبری|کتابیں|کون\s*سی\s*کتاب|کتاب\s*نام|پی\s*ڈی\s*اف|ڈاؤنلوڈ|لائب/;

export function isBooksRelatedQuery(query: string): boolean {
  return BOOKS_QUERY.test(query) || BOOKS_QUERY_UR.test(query);
}

export function classifyQuestion(query: string): QuestionScope {
  const text = query.trim();
  if (!text) {
    return 'off_topic';
  }

  if (PERSONAL_FATWA.test(text) || PERSONAL_FATWA_UR.test(text)) {
    return 'personal_fatwa';
  }

  const site = SITE_HELP.test(text) || SITE_HELP_UR.test(text);
  const islamic = ISLAMIC.test(text) || ISLAMIC_UR.test(text);
  const offTopic = OFF_TOPIC.test(text) || OFF_TOPIC_UR.test(text);

  if (offTopic && !site && !islamic) {
    return 'off_topic';
  }

  if (site && !islamic) {
    return 'site_help';
  }

  if (islamic || site) {
    return 'islamic';
  }

  // Short greetings or unclear questions: treat as Islamic/site welcome, not harsh refusal.
  if (/^(hi|hello|salam|assalam|السلام|سلام|aoa|asalamu)\b/i.test(text)) {
    return 'islamic';
  }

  return 'islamic';
}

export function isApprovedChunk(chunk: RawAssistantChunk): boolean {
  if (chunk.approved === false) {
    return false;
  }
  if (!chunk.maslak || chunk.maslak === 'hanafi_barelvi' || chunk.maslak === 'site') {
    return true;
  }
  return false;
}

export function filterChunksForScope(
  chunks: readonly StoredAssistantChunk[],
  scope: QuestionScope,
  query = '',
): StoredAssistantChunk[] {
  const approved = chunks.filter(isApprovedChunk);
  const booksQuery = isBooksRelatedQuery(query);

  if (scope === 'site_help') {
    const siteChunks = approved.filter((chunk) => {
      if (!booksQuery && (chunk.sourceType === 'book' || /books library|seedha rasta/i.test(chunk.text))) {
        return false;
      }
      return (
        chunk.maslak === 'site' ||
        chunk.sourceType === 'faq' ||
        /donate|contact|namaz|assistant|event|app|privacy|sermon|apply|about|admission/i.test(
          `${chunk.title} ${chunk.path} ${(chunk.tags ?? []).join(' ')}`,
        ) ||
        (booksQuery && /books|book|seedha/i.test(`${chunk.title} ${chunk.path} ${(chunk.tags ?? []).join(' ')}`))
      );
    });
    return siteChunks.length ? siteChunks : approved.filter((chunk) => chunk.sourceType !== 'book');
  }

  // Islamic questions: creed and guidance first; books only when the question is book-related.
  const islamicChunks = approved.filter((chunk) => {
    if (!booksQuery && chunk.sourceType === 'book') {
      return false;
    }
    if (
      !booksQuery &&
      chunk.sourceType === 'faq' &&
      /books library|seedha rasta/i.test(`${chunk.title} ${chunk.text}`)
    ) {
      return false;
    }
    return (
      chunk.maslak === 'hanafi_barelvi' ||
      chunk.sourceType === 'creed' ||
      chunk.sourceType === 'guidance' ||
      (booksQuery && chunk.sourceType === 'book') ||
      (chunk.sourceType === 'faq' &&
        !/donate|contact|namaz|payments|sumup|paypal|natwest|books library|seedha rasta/i.test(
          `${chunk.title} ${chunk.text} ${(chunk.tags ?? []).join(' ')}`,
        ))
    );
  });

  return islamicChunks.length ? islamicChunks : approved.filter((chunk) => chunk.sourceType !== 'book');
}

export function scopeRetrievalBoost(
  chunk: StoredAssistantChunk,
  scope: QuestionScope,
  query = '',
): number {
  const booksQuery = isBooksRelatedQuery(query);

  if (scope === 'site_help') {
    if (chunk.sourceType === 'faq') return 0.12;
    if (chunk.maslak === 'site') return 0.1;
    if (booksQuery && chunk.sourceType === 'book') return 0.08;
    return 0;
  }

  if (chunk.sourceType === 'creed') return 0.12;
  if (chunk.sourceType === 'guidance') return 0.1;
  if (chunk.maslak === 'hanafi_barelvi' && chunk.sourceType !== 'book') return 0.08;
  if (booksQuery && chunk.sourceType === 'book') return 0.06;
  return 0;
}

export function gentleScopeReply(scope: QuestionScope, query: string): string | null {
  const language = detectQuestionLanguage(query);

  if (scope === 'off_topic') {
    return language === 'ur'
      ? 'جزاک اللہ! میں Nagina Assistant ہوں اور نرمی سے اسلامی رہنمائی (حنفی بریلوی / اہلِ سنت والجماعت کے مطابق) اور Nagina Social Welfare کی ویب سائٹ سے متعلق معلومات میں مدد کر سکتا ہوں — جیسے عقائد، رہنمائی، عطیات، رابطہ اور نماز کے اوقات۔\n\nاگر آپ کو کتابوں یا Seedha Rasta library سے متعلق سوال ہو تو براہِ کرم واضح طور پر پوچھیں۔ ذاتی شرعی فیصلے کے لیے Markaz سے رابطہ کریں۔'
      : 'JazakAllah. I am here gently to help with Islamic guidance from our published Hanafi Barelvi / Ahl al-Sunnah wa’l-Jama‘ah creed and guidance pages, and with Nagina Social Welfare website information such as donations, contact, and namaz times.\n\nIf your question is about the Seedha Rasta book library specifically, please ask about books directly. For personal religious rulings, please contact Markaz — I am not a mufti.';
  }

  if (scope === 'personal_fatwa') {
    return language === 'ur'
      ? 'جزاک اللہ، آپ کا سوال سمجھ میں آ گیا۔ ذاتی یا پیچیدہ شرعی معاملات — جیسے طلاق، نکاح، طبی یا خاندانی فیصلے — کے لیے میں یہاں مفتی کی جگہ نہیں لے سکتا۔\n\nبراہِ کرم Markaz Deen-e-Islam سے براہِ راست رابطہ کریں تاکہ آپ کو مناسب رہنمائی مل سکے۔ میں عام اسلامی معلومات اور ویب سائٹ سے متعلق سوالات میں مدد کر سکتا ہوں۔'
      : 'JazakAllah — I understand your question. For personal or sensitive religious matters such as marriage, divorce, or individual rulings, I cannot replace speaking with a scholar at Markaz.\n\nPlease contact Markaz Deen-e-Islam directly for proper guidance. I can still help with general Islamic information from our published Hanafi Barelvi material and with website questions.';
  }

  return null;
}

export function standardDisclaimer(query: string): string {
  return detectQuestionLanguage(query) === 'ur'
    ? 'یہ معاون مفتی نہیں ہے۔ ہماری شائع شدہ اہلِ سنت والجماعت / حنفی بریلوی معلومات اور ویب سائٹ کے مطابق عام رہنمائی دیتا ہے۔ ذاتی شرعی فیصلوں کے لیے براہِ راست Markaz سے رابطہ کریں۔'
    : 'This assistant is not a mufti. It offers gentle general guidance from our published Ahl al-Sunnah wa’l-Jama‘ah / Hanafi Barelvi material and website information. For personal religious rulings, please contact Markaz directly.';
}

export function generalGuidanceDisclaimer(query: string): string {
  return detectQuestionLanguage(query) === 'ur'
    ? 'یہ معاون مفتی نہیں ہے۔ یہ جواب عمومی حنفی بریلوی / اہلِ سنت والجماعت رہنمائی پر مبنی ہے، نہ کہ ذاتی فتوی۔ مزید یقین یا تفصیل کے لیے Markaz سے رابطہ کریں۔'
    : 'This assistant is not a mufti. This answer offers gentle general Hanafi Barelvi / Ahl al-Sunnah guidance rather than a personal ruling. Please contact Markaz for certainty or personal matters.';
}
