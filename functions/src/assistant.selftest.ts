import assert from 'node:assert/strict';
import {
  buildDeenLearnChunk,
  isAssistantApprovedDeenLearnRecord,
} from './deenLearnKnowledge';
import {
  chooseRetrievalTier,
  type RankedAssistantChunk,
} from './assistantRetrieval';
import type { StoredAssistantChunk } from './assistantShared';

assert.equal(
  isAssistantApprovedDeenLearnRecord(
    'aain-deen-sekhain',
    { published: true },
  ),
  true,
);
assert.equal(
  isAssistantApprovedDeenLearnRecord(
    'aain-deen-sekhain',
    { published: false },
  ),
  false,
);
assert.equal(
  isAssistantApprovedDeenLearnRecord(
    'unreviewed-private-book',
    { published: true },
  ),
  false,
);

const curriculumChunk = buildDeenLearnChunk({
  bookId: 'aain-deen-sekhain',
  book: {
    titleEn: 'Let’s Learn Deen',
    titleUr: 'آئیں دین سیکھیں',
    published: true,
  },
  moduleId: 'prophet',
  module: {
    titleEn: 'Our Beloved Prophet',
    titleUr: 'ہمارے پیارے نبی',
    published: true,
  },
  itemId: 'item_001',
  item: {
    order: 1,
    questionEn: 'What is the blessed name of our beloved Prophet?',
    answerEn: 'His blessed name is Muhammad.',
    questionUr: 'ہمارے پیارے نبی کا نام کیا ہے؟',
    answerUr: 'آپ کا نام حضرت محمد ہے۔',
    kind: 'mcq',
    optionsEn: ['Wrong distractor', 'Muhammad'],
    optionsUr: ['غلط جواب', 'محمد'],
    explanationEn: 'This is the approved explanation.',
  },
});

assert.ok(curriculumChunk);
assert.equal(curriculumChunk.sourceType, 'deen_learn');
assert.equal(curriculumChunk.path, '/assistant');
assert.equal(curriculumChunk.language, 'mixed');
assert.match(curriculumChunk.text, /His blessed name is Muhammad/);
assert.match(curriculumChunk.text, /آپ کا نام حضرت محمد ہے/);
assert.match(curriculumChunk.text, /approved explanation/);
assert.doesNotMatch(curriculumChunk.text, /Wrong distractor|غلط جواب/);

function stored(
  sourceType: StoredAssistantChunk['sourceType'],
  title: string,
  text: string,
): StoredAssistantChunk {
  return {
    id: `${sourceType}-${title}`,
    title,
    sourceType,
    path: sourceType === 'deen_learn' ? '/assistant' : '/guidance',
    text,
    language: 'en',
    tags: [],
    maslak: 'hanafi_barelvi',
    approved: true,
    embedding: [],
    hash: 'test',
  };
}

const deenRanked: RankedAssistantChunk[] = [
  {
    score: 0.5,
    chunk: stored(
      'deen_learn',
      'Let’s Learn Islam: Prophet',
      'Question: What is the blessed name? Answer: Muhammad.',
    ),
  },
];

assert.equal(
  chooseRetrievalTier({
    scope: 'islamic',
    deenLearnRanked: deenRanked,
    naginaMode: 'published',
    queryTokens: ['blessed', 'name'],
  }),
  'deen_learn',
);
assert.equal(
  chooseRetrievalTier({
    scope: 'site_help',
    deenLearnRanked: deenRanked,
    naginaMode: 'published',
    queryTokens: ['blessed', 'name'],
  }),
  'nagina',
);
assert.equal(
  chooseRetrievalTier({
    scope: 'islamic',
    deenLearnRanked: [{ ...deenRanked[0], score: 0.3 }],
    naginaMode: 'general',
    queryTokens: ['unrelated'],
  }),
  'general',
);
assert.equal(
  chooseRetrievalTier({
    scope: 'islamic',
    deenLearnRanked: [{ ...deenRanked[0], score: 0.7 }],
    naginaMode: 'published',
    queryTokens: ['مختلف'],
  }),
  'deen_learn',
);

console.log('assistant.selftest: all passed');
