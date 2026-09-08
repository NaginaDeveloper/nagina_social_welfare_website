import type { QuestionScope } from './assistantScope';
import type { StoredAssistantChunk } from './assistantShared';

export type AnswerSourceMode = 'published' | 'general';
export type RetrievalTier = 'deen_learn' | 'nagina' | 'general';

export interface RankedAssistantChunk {
  readonly score: number;
  readonly chunk: StoredAssistantChunk;
}

const SITE_HELP_TOP_SCORE = 0.28;

export const GENERIC_QUERY_TOKENS = new Set([
  'islam',
  'muslim',
  'islamic',
  'what',
  'are',
  'the',
  'is',
  'how',
  'who',
  'when',
  'where',
  'why',
  'tell',
  'about',
  'please',
  'explain',
  'pillar',
  'pillars',
]);

export function assessRetrievalConfidence(
  ranked: readonly { readonly score: number; readonly chunk: StoredAssistantChunk }[],
  selectedCount: number,
  scope: QuestionScope,
  queryTokens: readonly string[] = [],
): AnswerSourceMode {
  if (!selectedCount) {
    return 'general';
  }

  const top = ranked[0];
  const topScore = top?.score ?? 0;

  if (scope === 'site_help') {
    return topScore >= SITE_HELP_TOP_SCORE ? 'published' : 'general';
  }

  if (!top) {
    return 'general';
  }

  const haystack = `${top.chunk.title} ${top.chunk.path} ${(top.chunk.tags ?? []).join(' ')}`.toLowerCase();
  const meaningfulTokens = queryTokens.filter(
    (token) => token.length > 2 && !GENERIC_QUERY_TOKENS.has(token),
  );
  const lexicalHits = meaningfulTokens.filter((token) => haystack.includes(token)).length;
  const relevantPublished =
    top.chunk.sourceType === 'creed' ||
    top.chunk.sourceType === 'guidance' ||
    top.chunk.sourceType === 'faq';

  if (top.chunk.sourceType === 'book' || !relevantPublished) {
    return 'general';
  }

  if (top.chunk.sourceType === 'faq') {
    return topScore >= 0.28 && lexicalHits >= 1 ? 'published' : 'general';
  }

  if (lexicalHits >= 1 && topScore >= 0.3) {
    return 'published';
  }

  return 'general';
}

export function hasMeaningfulLexicalOverlap(
  chunk: StoredAssistantChunk,
  queryTokens: readonly string[],
): boolean {
  const haystack =
    `${chunk.title} ${chunk.path} ${chunk.text.slice(0, 500)} ${(chunk.tags ?? []).join(' ')}`.toLowerCase();
  const meaningfulTokens = queryTokens.filter(
    (token) => token.length > 2 && !GENERIC_QUERY_TOKENS.has(token),
  );
  return meaningfulTokens.some((token) => haystack.includes(token));
}

export function hasStrongDeenLearnMatch(
  ranked: readonly RankedAssistantChunk[],
  queryTokens: readonly string[],
): boolean {
  const top = ranked.find((item) => item.chunk.sourceType === 'deen_learn');
  if (!top) {
    return false;
  }
  // Direct bilingual Q&A usually has both strong semantic similarity and a
  // meaningful word overlap. The high-score path supports cross-language
  // matches where English and Urdu tokens cannot overlap.
  return (
    (top.score >= 0.4 && hasMeaningfulLexicalOverlap(top.chunk, queryTokens)) ||
    top.score >= 0.68
  );
}

export function chooseRetrievalTier(params: {
  readonly scope: QuestionScope;
  readonly deenLearnRanked: readonly RankedAssistantChunk[];
  readonly naginaMode: AnswerSourceMode;
  readonly queryTokens: readonly string[];
}): RetrievalTier {
  if (
    params.scope === 'islamic' &&
    hasStrongDeenLearnMatch(params.deenLearnRanked, params.queryTokens)
  ) {
    return 'deen_learn';
  }
  return params.naginaMode === 'published' ? 'nagina' : 'general';
}
