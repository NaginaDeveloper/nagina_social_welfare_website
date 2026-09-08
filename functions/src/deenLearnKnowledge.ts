import type { Firestore } from 'firebase-admin/firestore';
import {
  stableHash,
  type RawAssistantChunk,
} from './assistantShared';

interface DeenLearnBookData {
  readonly titleEn?: unknown;
  readonly titleUr?: unknown;
  readonly published?: unknown;
}

interface DeenLearnModuleData {
  readonly titleEn?: unknown;
  readonly titleUr?: unknown;
  readonly published?: unknown;
}

const ASSISTANT_APPROVED_BOOK_IDS = ['aain-deen-sekhain'] as const;

export interface DeenLearnItemData {
  readonly order?: unknown;
  readonly questionEn?: unknown;
  readonly questionUr?: unknown;
  readonly answerEn?: unknown;
  readonly answerUr?: unknown;
  readonly explanationEn?: unknown;
  readonly explanationUr?: unknown;
  readonly kind?: unknown;
  readonly optionsEn?: unknown;
  readonly optionsUr?: unknown;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function safeTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isAssistantApprovedDeenLearnRecord(
  bookId: string,
  module: DeenLearnModuleData,
): boolean {
  return (
    ASSISTANT_APPROVED_BOOK_IDS.includes(
      bookId as (typeof ASSISTANT_APPROVED_BOOK_IDS)[number],
    ) && module.published === true
  );
}

export function buildDeenLearnChunk(params: {
  readonly bookId: string;
  readonly book: DeenLearnBookData;
  readonly moduleId: string;
  readonly module: DeenLearnModuleData;
  readonly itemId: string;
  readonly item: DeenLearnItemData;
}): RawAssistantChunk | null {
  const questionEn = text(params.item.questionEn);
  const questionUr = text(params.item.questionUr);
  const answerEn = text(params.item.answerEn);
  const answerUr = text(params.item.answerUr);
  if ((!questionEn && !questionUr) || (!answerEn && !answerUr)) {
    return null;
  }

  const bookTitleEn = text(params.book.titleEn) || 'Let’s Learn Islam';
  const bookTitleUr = text(params.book.titleUr);
  const moduleTitleEn = text(params.module.titleEn) || params.moduleId;
  const moduleTitleUr = text(params.module.titleUr);
  const explanationEn = text(params.item.explanationEn);
  const explanationUr = text(params.item.explanationUr);
  const order =
    typeof params.item.order === 'number' && Number.isFinite(params.item.order)
      ? params.item.order
      : 0;

  const parts = [
    `Let’s Learn Islam. Book: ${bookTitleEn}.`,
    bookTitleUr ? `کتاب: ${bookTitleUr}۔` : '',
    `Module: ${moduleTitleEn}.`,
    moduleTitleUr ? `سبق: ${moduleTitleUr}۔` : '',
    questionEn ? `Question: ${questionEn}` : '',
    answerEn ? `Answer: ${answerEn}` : '',
    explanationEn ? `Explanation: ${explanationEn}` : '',
    questionUr ? `سوال: ${questionUr}` : '',
    answerUr ? `جواب: ${answerUr}` : '',
    explanationUr ? `وضاحت: ${explanationUr}` : '',
  ].filter(Boolean);

  const id = stableHash(
    `deen_learn:${params.bookId}:${params.moduleId}:${params.itemId}`,
  );
  return {
    id: `deen-learn-${id}`,
    title: `Let’s Learn Islam: ${moduleTitleEn}${order > 0 ? ` — ${order}` : ''}`,
    sourceType: 'deen_learn',
    // Keep the private curriculum undiscoverable; citations return to the
    // Assistant page rather than exposing a raw corpus URL.
    path: '/assistant',
    text: parts.join(' '),
    language: questionUr || answerUr ? 'mixed' : 'en',
    tags: [
      'lets-learn-islam',
      safeTag(params.bookId),
      safeTag(params.moduleId),
      safeTag(moduleTitleEn),
      text(params.item.kind) || 'qa',
    ].filter(Boolean),
    maslak: 'hanafi_barelvi',
    approved: true,
  };
}

export async function loadPublishedDeenLearnChunks(
  db: Firestore,
): Promise<RawAssistantChunk[]> {
  const chunks: RawAssistantChunk[] = [];
  for (const bookId of ASSISTANT_APPROVED_BOOK_IDS) {
    const bookDoc = await db.collection('deen_learn_books').doc(bookId).get();
    if (!bookDoc.exists) {
      continue;
    }
    const book = bookDoc.data() as DeenLearnBookData;
    const modules = await bookDoc.ref
      .collection('modules')
      .where('published', '==', true)
      .get();

    const orderedModules = [...modules.docs].sort((a, b) => {
      const left = a.data().order;
      const right = b.data().order;
      return (typeof left === 'number' ? left : 0) -
        (typeof right === 'number' ? right : 0);
    });

    for (const moduleDoc of orderedModules) {
      const module = moduleDoc.data() as DeenLearnModuleData;
      if (!isAssistantApprovedDeenLearnRecord(bookDoc.id, module)) {
        continue;
      }
      const items = await moduleDoc.ref.collection('items').orderBy('order').get();
      for (const itemDoc of items.docs) {
        const chunk = buildDeenLearnChunk({
          bookId: bookDoc.id,
          book,
          moduleId: moduleDoc.id,
          module,
          itemId: itemDoc.id,
          item: itemDoc.data() as DeenLearnItemData,
        });
        if (chunk) {
          chunks.push(chunk);
        }
      }
    }
  }

  return chunks;
}
