import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  ASSISTANT_COLLECTION,
  ASSISTANT_META_COLLECTION,
  detectQuestionLanguage,
  embedText,
  generateAnswer,
  generateHybridAnswer,
  type AssistantCitation,
  type AssistantHistoryTurn,
  type RawAssistantChunk,
  type StoredAssistantChunk,
  cosineSimilarity,
} from './assistantShared';
import {
  classifyQuestion,
  filterChunksForScope,
  generalGuidanceDisclaimer,
  gentleScopeReply,
  isBooksRelatedQuery,
  scopeRetrievalBoost,
  standardDisclaimer,
} from './assistantScope';
import { assessRetrievalConfidence, hasMeaningfulLexicalOverlap } from './assistantRetrieval';

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

let cacheUntil = 0;
let cachedChunks: StoredAssistantChunk[] = [];

export interface AskNaginaResult {
  readonly answer: string;
  readonly disclaimer: string;
  readonly citations: readonly AssistantCitation[];
  readonly sourceMode: 'published' | 'general' | 'scope';
  readonly language: 'en' | 'ur';
  readonly error?: 'unavailable';
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u0600-\u06FF]+/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1);
}

async function loadChunks(): Promise<StoredAssistantChunk[]> {
  if (cacheUntil > Date.now() && cachedChunks.length) {
    return cachedChunks;
  }
  const snapshot = await db.collection(ASSISTANT_COLLECTION).get();
  cachedChunks = snapshot.docs.map((doc) => doc.data() as StoredAssistantChunk);
  cacheUntil = Date.now() + 5 * 60_000;
  return cachedChunks;
}

function toCitation(chunk: RawAssistantChunk): AssistantCitation {
  return {
    title: chunk.title,
    path: chunk.path,
    sourceType: chunk.sourceType,
  };
}

function selectCitations(chunks: readonly StoredAssistantChunk[], query: string): AssistantCitation[] {
  const queryLower = query.toLowerCase();
  const booksQuery = isBooksRelatedQuery(query);
  const navigational =
    /donate|contact|namaz|prayer|assistant|portal|pay|email|phone|sumup|paypal|natwest|apply|about|admission/i.test(
      queryLower,
    ) || /رابط|عط|نماز|مدد|رابطہ|داخلہ/.test(query);

  if (navigational && !booksQuery) {
    const faqMatches = chunks.filter((chunk) => chunk.sourceType === 'faq');
    if (faqMatches.length) {
      return faqMatches.slice(0, 2).map(toCitation);
    }
  }

  if (booksQuery) {
    const bookMatches = chunks.filter(
      (chunk) => chunk.sourceType === 'book' || chunk.path === '/books',
    );
    if (bookMatches.length) {
      return bookMatches.slice(0, 3).map(toCitation);
    }
  }

  const prioritized = chunks.filter((chunk) => {
    if (booksQuery) {
      return true;
    }
    return chunk.sourceType !== 'book' && chunk.path !== '/books';
  });

  const unique: AssistantCitation[] = [];
  const seen = new Set<string>();
  for (const chunk of prioritized) {
    const key = `${chunk.path}:${chunk.title}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(toCitation(chunk));
    if (unique.length === 3) {
      break;
    }
  }

  return unique;
}

export async function answerNaginaQuestion(
  query: string,
  history: readonly AssistantHistoryTurn[] = [],
): Promise<AskNaginaResult> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const meta = await db.collection(ASSISTANT_META_COLLECTION).doc('current').get();
  if (!meta.exists) {
    return {
      answer: '',
      disclaimer: '',
      citations: [],
      sourceMode: 'published',
      language: detectQuestionLanguage(query),
      error: 'unavailable',
    };
  }

  const scope = classifyQuestion(query);
  const scopeReply = gentleScopeReply(scope, query);
  if (scopeReply) {
    return {
      answer: scopeReply,
      disclaimer: standardDisclaimer(query),
      citations: [],
      sourceMode: 'scope',
      language: detectQuestionLanguage(query),
    };
  }

  const allChunks = await loadChunks();
  if (!allChunks.length) {
    return {
      answer: '',
      disclaimer: '',
      citations: [],
      sourceMode: 'published',
      language: detectQuestionLanguage(query),
      error: 'unavailable',
    };
  }

  const chunks = filterChunksForScope(allChunks, scope, query);
  const queryEmbedding = await embedText(apiKey, query, 'RETRIEVAL_QUERY');
  const queryTokens = tokenize(query);
  const ranked = chunks
    .map((chunk) => {
      const semantic = cosineSimilarity(queryEmbedding, chunk.embedding);
      const haystack = `${chunk.title} ${chunk.path} ${(chunk.tags ?? []).join(' ')}`.toLowerCase();
      const lexicalHits = queryTokens.filter((token) => haystack.includes(token)).length;
      const lexicalBoost = lexicalHits * 0.08;
      const faqBoost = chunk.sourceType === 'faq' && lexicalHits > 0 ? 0.18 : 0;
      const scopeBoost = scopeRetrievalBoost(chunk, scope, query);
      return { chunk, score: semantic + lexicalBoost + faqBoost + scopeBoost };
    })
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0.2);

  const selected: StoredAssistantChunk[] = [];
  const seenPaths = new Set<string>();
  for (const item of ranked) {
    const key = `${item.chunk.path}:${item.chunk.title}`;
    if (seenPaths.has(key)) {
      continue;
    }
    selected.push(item.chunk);
    seenPaths.add(key);
    if (selected.length === 6) {
      break;
    }
  }

  const fallback = chunks.filter((chunk) => chunk.sourceType === 'faq').slice(0, 4);
  const sourceMode = assessRetrievalConfidence(ranked, selected.length, scope, queryTokens);
  let answer: string;
  let responseContext: StoredAssistantChunk[];
  let citations: AssistantCitation[];

  if (sourceMode === 'published') {
    responseContext = selected.length ? selected : fallback;
    answer = await generateAnswer(apiKey, query, history, responseContext, scope);
    citations = selectCitations(responseContext, query);
  } else {
    const optionalContext = selected.length
      ? selected.slice(0, 3)
      : ranked.slice(0, 2).map((item) => item.chunk);
    responseContext = optionalContext;
    answer = await generateHybridAnswer(apiKey, query, history, optionalContext, scope);
    const topScore = ranked[0]?.score ?? 0;
    const relevantOptional = optionalContext.filter((chunk) =>
      hasMeaningfulLexicalOverlap(chunk, queryTokens),
    );
    citations =
      relevantOptional.length && topScore >= 0.24
        ? selectCitations(relevantOptional.slice(0, 2), query)
        : [];
  }

  return {
    answer,
    disclaimer:
      sourceMode === 'general' ? generalGuidanceDisclaimer(query) : standardDisclaimer(query),
    citations,
    sourceMode,
    language: detectQuestionLanguage(query),
  };
}
