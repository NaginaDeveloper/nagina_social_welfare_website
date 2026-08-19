import type { QuestionScope } from './assistantScope';
import type { StoredAssistantChunk } from './assistantShared';

export type AnswerSourceMode = 'published' | 'general';

const SITE_HELP_TOP_SCORE = 0.28;

const GENERIC_QUERY_TOKENS = new Set([
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
