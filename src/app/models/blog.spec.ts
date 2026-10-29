import { describe, expect, it } from 'vitest';
import {
  blogFaqEntries,
  blogWordCount,
  formatBlogDate,
  parseBlogCatalog,
  readingMinutes,
  relatedPosts,
  type BlogPost,
} from './blog';

const post = (over: Partial<BlogPost>): BlogPost => ({
  id: 'x',
  slug: 'x',
  title: 'T',
  excerpt: 'E',
  contentHtml: '<p>hi</p>',
  topic: 'Zakat',
  author: 'A',
  publishedAt: '2026-10-01',
  image: { url: 'https://example.com/i.jpg', alt: 'alt' },
  ...over,
});

describe('blog model', () => {
  it('keeps only complete articles, newest first, ties by slug', () => {
    const list = parseBlogCatalog({
      posts: [
        post({ slug: 'b', publishedAt: '2026-10-02' }),
        post({ slug: 'a', publishedAt: '2026-10-02' }),
        post({ slug: 'old', publishedAt: '2026-09-01' }),
        post({ slug: '', publishedAt: '2026-10-05' }),
        post({ slug: 'noimg', image: { url: '', alt: '' } }),
      ],
    });
    expect(list.map((p) => p.slug)).toEqual(['a', 'b', 'old']);
    expect(parseBlogCatalog(null)).toEqual([]);
    expect(parseBlogCatalog({})).toEqual([]);
  });

  it('formats the publish date without time zone drift', () => {
    expect(formatBlogDate('2026-10-21')).toBe('21 October 2026');
    expect(formatBlogDate('2026-01-01')).toBe('1 January 2026');
    expect(formatBlogDate('not-a-date')).toBe('not-a-date');
  });

  it('counts words and estimates reading time', () => {
    expect(blogWordCount('<p>Give <strong>zakat</strong>&nbsp;today</p>')).toBe(3);
    expect(blogWordCount('')).toBe(0);
    expect(readingMinutes('<p>short</p>')).toBe(1);
    expect(readingMinutes(`<p>${'word '.repeat(600)}</p>`)).toBe(3);
  });

  it('suggests same-topic articles first and never the current one', () => {
    const current = post({ slug: 'cur', topic: 'Zakat' });
    const posts = [
      current,
      post({ slug: 'new-other', topic: 'Sadaqah', publishedAt: '2026-10-09' }),
      post({ slug: 'same', topic: 'Zakat', publishedAt: '2026-08-01' }),
      post({ slug: 'older', topic: 'Community', publishedAt: '2026-07-01' }),
    ];
    expect(relatedPosts(posts, current, 3).map((p) => p.slug)).toEqual(['same', 'new-other', 'older']);
    expect(relatedPosts(posts, current, 1).map((p) => p.slug)).toEqual(['same']);
  });
});

describe('blogFaqEntries', () => {
  it('reads question and answer pairs from the FAQ section only', () => {
    const html =
      '<h2>Intro</h2><h3>Not a question</h3><p>x</p><h2>Frequently Asked Questions</h2>' +
      '<h3>What is Zakat?</h3><p>An <a href="/zakat/">obligation</a> &amp; a pillar.</p><p>Paid yearly.</p>' +
      '<h3>Who gives?</h3><p>Every eligible Muslim.</p><h2>Join Us</h2><h3>Later</h3><p>y</p>';
    expect(blogFaqEntries(html)).toEqual([
      { question: 'What is Zakat?', answer: 'An obligation & a pillar. Paid yearly.' },
      { question: 'Who gives?', answer: 'Every eligible Muslim.' },
    ]);
  });

  it('returns nothing when there is no FAQ section', () => {
    expect(blogFaqEntries('<h2>A</h2><h3>B</h3><p>c</p>')).toEqual([]);
  });
});
