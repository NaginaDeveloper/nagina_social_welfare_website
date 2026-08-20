import { createHash } from 'node:crypto';
import { GoogleAuth } from 'google-auth-library';
import { defineSecret } from 'firebase-functions/params';

export const assistantSyncToken = defineSecret('ASSISTANT_SYNC_TOKEN');

export const ASSISTANT_COLLECTION = 'assistant_chunks';
export const ASSISTANT_META_COLLECTION = 'assistant_meta';
export const EMBEDDING_MODEL = 'gemini-embedding-001';
export const GENERATION_MODEL = 'gemini-2.5-flash';
export const GENERATION_MAX_OUTPUT_TOKENS = 4096;
export const EMBEDDING_DIMENSIONS = 128;
export const AI_REGION = 'us-central1';

const ROMAN_URDU_HINT =
  /\b(namaz|niyyah|dua|salah|salaat|wuzu|wudu|roza|ramzan|ramadan|quran|hadees|hadith|batao|bata|kya|kaise|kyun|hai|hain|allah|islam|masjid|imam|fatwa|halal|haram|fraez|faraiz|fard|sunna|sunnah|zakat|hajj|umrah|sawab|gunah|taubah|sabr|shukr|dil|dil\s*se)\b/i;

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export type AssistantMaslak = 'hanafi_barelvi' | 'site';

export interface RawAssistantChunk {
  readonly id: string;
  readonly title: string;
  readonly sourceType: 'faq' | 'creed' | 'guidance' | 'book';
  readonly path: string;
  readonly text: string;
  readonly language: 'en' | 'ur' | 'mixed';
  readonly tags: readonly string[];
  readonly maslak?: AssistantMaslak;
  readonly approved?: boolean;
}

export interface StoredAssistantChunk extends RawAssistantChunk {
  readonly embedding: readonly number[];
  readonly hash: string;
}

export interface AssistantCitation {
  readonly title: string;
  readonly path: string;
  readonly sourceType: string;
}

export interface AssistantHistoryTurn {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export function stableHash(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function cosineSimilarity(a: readonly number[], b: readonly number[]): number {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < length; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }
  if (!magA || !magB) {
    return 0;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function detectQuestionLanguage(value: string): 'en' | 'ur' {
  if (/[\u0600-\u06FF]/.test(value)) {
    return 'ur';
  }
  return ROMAN_URDU_HINT.test(value) ? 'ur' : 'en';
}

interface GeminiPart {
  readonly text?: string;
  readonly thought?: boolean;
}

interface GeminiCandidate {
  readonly content?: { readonly parts?: readonly GeminiPart[] };
  readonly finishReason?: string;
}

interface GeminiGenerateResponse {
  readonly candidates?: readonly GeminiCandidate[];
  readonly error?: { readonly message?: string };
}

function extractVisibleCandidateText(candidate: GeminiCandidate | undefined): string {
  const parts = candidate?.content?.parts ?? [];
  return parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text ?? '')
    .join('')
    .trim();
}

function looksTruncated(text: string, finishReason?: string): boolean {
  if (finishReason === 'MAX_TOKENS') {
    return true;
  }
  const trimmed = text.trim();
  if (trimmed.length < 100) {
    return false;
  }
  return !/[.!?۔…)\]"']\s*$/.test(trimmed);
}

function buildGenerationConfig(temperature: number, maxOutputTokens: number) {
  return {
    temperature,
    maxOutputTokens,
    // Gemini 2.5 spends most of the output budget on hidden "thinking" unless disabled.
    thinkingConfig: { thinkingBudget: 0 },
  };
}

function projectId(): string {
  return process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || 'nagina-social-welfare-uk';
}

async function vertexRequest<T>(url: string, data: object): Promise<T> {
  const client = await auth.getClient();
  const response = await client.request<T>({
    url,
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

export async function embedText(
  apiKey: string,
  text: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY',
): Promise<number[]> {
  if (!apiKey) {
    const url = `https://${AI_REGION}-aiplatform.googleapis.com/v1/projects/${projectId()}/locations/${AI_REGION}/publishers/google/models/${EMBEDDING_MODEL}:predict`;
    const data = await vertexRequest<{
      predictions?: { embeddings?: { values?: number[] } }[];
    }>(url, {
      instances: [{ content: text, task_type: taskType }],
      parameters: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        autoTruncate: true,
      },
    });
    const values = data.predictions?.[0]?.embeddings?.values;
    if (!values?.length) {
      throw new Error('Could not generate embedding.');
    }
    return values;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: EMBEDDING_DIMENSIONS,
      }),
    },
  );

  const data = (await response.json()) as {
    embedding?: { values?: number[] };
    error?: { message?: string };
  };

  if (!response.ok || !data.embedding?.values?.length) {
    throw new Error(data.error?.message || 'Could not generate embedding.');
  }

  return data.embedding.values;
}

function cleanGeneratedAnswer(value: string): string {
  return value
    .replace(/\[Source\s+\d+\]/gi, '')
    .replace(/^\s*Sources?\s*:\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function buildFallbackAnswer(
  question: string,
  contextChunks: readonly RawAssistantChunk[],
): string {
  const language = detectQuestionLanguage(question);
  const top =
    contextChunks.find((chunk) => chunk.sourceType !== 'book') ?? contextChunks[0];
  if (!top) {
    return language === 'ur'
      ? 'میں اس سوال کے لیے مناسب معلومات نہیں ڈھونڈ سکا۔ براہِ کرم Contact صفحہ دیکھیں یا Markaz سے رابطہ کریں۔'
      : 'I could not find enough information for that question. Please visit our Contact page or speak to Markaz directly.';
  }

  const excerpt = top.text.length > 520 ? `${top.text.slice(0, 520).trim()}…` : top.text;
  if (language === 'ur') {
    return `یہ جواب ہماری شائع شدہ معلومات پر مبنی ہے:\n\n${excerpt}\n\nمزید تفصیل کے لیے ${top.path} دیکھیں۔`;
  }
  return `Based on our published content:\n\n${excerpt}\n\nYou can read more on ${top.path}.`;
}

type AnswerScope = 'islamic' | 'site_help' | 'personal_fatwa' | 'off_topic';

async function callGeminiGeneration(
  apiKey: string,
  systemInstruction: string,
  prompt: string,
  temperature: number,
  maxOutputTokens: number,
): Promise<{ answer: string; finishReason?: string }> {
  const generationConfig = buildGenerationConfig(temperature, maxOutputTokens);

  if (!apiKey) {
    const url = `https://${AI_REGION}-aiplatform.googleapis.com/v1/projects/${projectId()}/locations/${AI_REGION}/publishers/google/models/${GENERATION_MODEL}:generateContent`;
    const data = await vertexRequest<GeminiGenerateResponse>(url, {
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    const candidate = data.candidates?.[0];
    return {
      answer: cleanGeneratedAnswer(extractVisibleCandidateText(candidate)),
      finishReason: candidate?.finishReason,
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      }),
    },
  );

  const data = (await response.json()) as GeminiGenerateResponse;
  const candidate = data.candidates?.[0];
  const answer = cleanGeneratedAnswer(extractVisibleCandidateText(candidate));
  if (!response.ok || !answer) {
    throw new Error(data.error?.message || 'Could not generate an answer right now.');
  }
  return { answer, finishReason: candidate?.finishReason };
}

async function runGeminiGeneration(
  apiKey: string,
  systemInstruction: string,
  prompt: string,
  temperature: number,
): Promise<string> {
  const attempts = [
    { maxOutputTokens: GENERATION_MAX_OUTPUT_TOKENS, temperature },
    { maxOutputTokens: 8192, temperature: Math.min(temperature + 0.05, 0.45) },
  ];

  let bestAnswer = '';
  for (const attempt of attempts) {
    const { answer, finishReason } = await callGeminiGeneration(
      apiKey,
      systemInstruction,
      prompt,
      attempt.temperature,
      attempt.maxOutputTokens,
    );
    if (answer.length > bestAnswer.length) {
      bestAnswer = answer;
    }
    if (answer && answer.length >= 48 && !looksTruncated(answer, finishReason)) {
      return answer;
    }
  }

  return bestAnswer;
}

function buildHybridFallback(question: string): string {
  const language = detectQuestionLanguage(question);
  return language === 'ur'
    ? 'جزاک اللہ۔ میں اس سوال کا مکمل جواب ابھی یقینی طور پر نہیں دے سکتا۔ براہِ کرم Markaz Deen-e-Islam سے رابطہ کریں، یا ہماری Guidance اور Contact صفحات دیکھیں۔'
    : 'JazakAllah. I cannot answer that with full confidence right now. Please contact Markaz Deen-e-Islam, or visit our Guidance and Contact pages for help.';
}

export async function generateHybridAnswer(
  apiKey: string,
  question: string,
  history: readonly AssistantHistoryTurn[],
  optionalChunks: readonly RawAssistantChunk[],
  scope: AnswerScope = 'islamic',
): Promise<string> {
  const language = detectQuestionLanguage(question);
  const historyText = history
    .slice(-6)
    .map((turn) => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.content}`)
    .join('\n');

  const optionalContext = optionalChunks.length
    ? optionalChunks
        .map(
          (chunk, index) =>
            `[Optional Nagina reference ${index + 1}] ${chunk.title} (${chunk.sourceType}, ${chunk.path})\n${chunk.text}`,
        )
        .join('\n\n')
    : '';

  const prompt = [
    'You are Nagina Assistant for Nagina Social Welfare UK and Markaz Deen-e-Islam.',
    'The user asked a question that was not fully covered by our published Nagina pages, so answer using your broader Islamic knowledge.',
    'Write a warm, respectful, complete answer in plain language — not just a list of sources.',
    'Always finish the full answer. Never stop mid-sentence. Use bullet points when listing obligations or steps.',
    'Stay aligned with Hanafi fiqh and Ahl al-Sunnah wa’l-Jama‘ah / Hanafi Barelvi teachings.',
    'Love for the Prophet ﷺ, Khatme Nabuwwat, respect for Ahle Bait, Sahaba, and Awliya (Aulia Karam), and Markaz-style spiritual guidance are important.',
    'Do not present Salafi, Deobandi, Shia, Ahmadi, or secular views as equally valid for Nagina.',
    'Do not mention Seedha Rasta or the books library unless the question is clearly about books.',
    'Do not issue binding fatwas or personal rulings. Gently suggest Markaz for personal matters.',
    scope === 'site_help'
      ? 'This is a website help question. Give practical Nagina website guidance when you can.'
      : 'This is an Islamic guidance question. Give helpful general Hanafi Barelvi guidance.',
    optionalContext
      ? 'Optional Nagina references are provided below. Use them if helpful, but you may go beyond them when needed.'
      : 'No strong Nagina reference was found. Answer from general Hanafi Barelvi guidance.',
    language === 'ur'
      ? 'User wrote in Urdu or Roman Urdu. Reply in clear, complete Urdu script (not Roman Urdu). For contact details: put email, phone, WhatsApp and address each on their own line; keep phone digits and Latin addresses in normal left-to-right order (for example +44 7831 684738 and 103 Burmer Road, Peterborough PE1 3HT) — never reverse digit order.'
      : 'Reply in clear English unless the user clearly wrote in Urdu.',
    historyText ? `Recent conversation:\n${historyText}` : '',
    `Question: ${question}`,
    optionalContext ? `Optional Nagina references:\n${optionalContext}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const systemInstruction =
    'Be warm, gentle, and trustworthy. Provide fuller Islamic guidance when published Nagina references are weak, while staying within Hanafi Barelvi / Ahl al-Sunnah wa’l-Jama‘ah teaching. Never be harsh. This is general guidance, not a personal fatwa. Always complete your answer.';

  const answer = await runGeminiGeneration(apiKey, systemInstruction, prompt, 0.35);
  if (!answer || answer.length < 48) {
    return buildHybridFallback(question);
  }
  return answer;
}

export async function generateAnswer(
  apiKey: string,
  question: string,
  history: readonly AssistantHistoryTurn[],
  contextChunks: readonly RawAssistantChunk[],
  scope: AnswerScope = 'islamic',
): Promise<string> {
  const language = detectQuestionLanguage(question);
  const historyText = history
    .slice(-6)
    .map((turn) => `${turn.role === 'user' ? 'User' : 'Assistant'}: ${turn.content}`)
    .join('\n');
  const contextText = contextChunks
    .map(
      (chunk, index) =>
        `[Reference ${index + 1}] ${chunk.title} (${chunk.sourceType}, ${chunk.path})\n${chunk.text}`,
    )
    .join('\n\n');

  const prompt = [
    'You are Nagina Assistant for Nagina Social Welfare UK and Markaz Deen-e-Islam.',
    'Write a warm, respectful, helpful natural-language answer first. Use the references only as background knowledge.',
    'Do NOT reply with only source titles, page paths, or "[Reference N]" labels.',
    'Do NOT tell the user to "see the sources below" instead of answering.',
    'Give a complete answer in 2 to 5 short paragraphs or bullet points when helpful.',
    'Always finish the full answer. Never stop mid-sentence.',
    'Answer only from the provided references when possible.',
    'Stay within published Ahl al-Sunnah wa’l-Jama‘ah / Hanafi Barelvi teachings on this site. Do not present other masalik as equally valid for Nagina.',
    'For general Islamic questions, prefer the Basic Beliefs FAQ (/basic-beliefs), creed pages, guidance, and published Nagina material. Do not mention the Seedha Rasta book library unless the question is clearly about books, PDFs, or a specific library title.',
    'Do not answer non-Islamic general knowledge, coding, entertainment, politics, or unrelated worldly topics unless the question is clearly about this website.',
    'If the references are weak or missing, gently say you are not fully certain and direct the user to Contact, the relevant page, or Markaz.',
    'Do not issue binding fatwas or personal rulings. For personal religious rulings, kindly direct the user to speak to Markaz directly.',
    scope === 'site_help'
      ? 'This is a website help question. Answer practically from site references. Mention books or Seedha Rasta only if the user asked about books.'
      : 'This is an Islamic guidance question. Answer from the Basic Beliefs FAQ, creed, guidance, and approved Hanafi Barelvi references. Mention Seedha Rasta or the books library only if the references or question are clearly book-related.',
    language === 'ur'
      ? 'User wrote in Urdu or mixed Urdu. Reply in clear, complete Urdu script. For contact details in Urdu: put email, phone, WhatsApp and address each on their own line; keep phone digits and Latin addresses in normal left-to-right order (for example +44 7831 684738 and 103 Burmer Road, Peterborough PE1 3HT) — never reverse digit order.'
      : 'Reply in clear English unless the user clearly wrote in Urdu.',
    historyText ? `Recent conversation:\n${historyText}` : '',
    `Question: ${question}`,
    `References:\n${contextText}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const systemInstruction =
    'Be warm, gentle, concise, and trustworthy. Always write the full answer in plain language. Stay within Hanafi Barelvi / Ahl al-Sunnah wa’l-Jama‘ah material from the references. Never be harsh when declining. Source links are shown separately in the UI, so never answer with only a bibliography.';

  const answer = await runGeminiGeneration(apiKey, systemInstruction, prompt, 0.25);
  if (!answer || answer.length < 48) {
    return buildFallbackAnswer(question, contextChunks);
  }
  return answer;
}
