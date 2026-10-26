import { describe, expect, it } from 'vitest';
import { BLOG_SEO, PUBLIC_SEO_PAGES, TERMS_SEO, blogArticleSeo, blogArticleTitle } from './seo.config';

describe('blog and terms SEO', () => {
  it('lists the blog and terms pages as indexable', () => {
    for (const page of [BLOG_SEO, TERMS_SEO]) {
      expect(PUBLIC_SEO_PAGES).toContain(page);
      expect(page.robots ?? '').not.toContain('noindex');
      expect(page.title.length).toBeLessThanOrEqual(60);
      expect(page.description.length).toBeLessThanOrEqual(160);
      expect(page.path.endsWith('/')).toBe(true);
    }
  });

  it('keeps the site name in an article title only when it fits', () => {
    expect(blogArticleTitle('Zakat guide')).toBe('Zakat guide | Nagina Social Welfare UK');
    const long = 'A very long article title that cannot also carry the site name';
    expect(blogArticleTitle(long)).toBe(long);
  });

  it('builds article details with dates, topic and author', () => {
    const seo = blogArticleSeo({
      slug: 'zakat-guide',
      title: 'Zakat guide',
      excerpt: 'A short guide.',
      topic: 'Zakat',
      author: 'Nagina Social Welfare UK',
      publishedAt: '2026-10-20',
      image: { url: 'https://example.com/a.jpg' },
    });
    expect(seo.path).toBe('/blog/zakat-guide/');
    expect(seo.type).toBe('article');
    expect(seo.modifiedTime).toBe('2026-10-20');
    expect(seo.image).toBe('https://example.com/a.jpg');
    expect(seo.section).toBe('Zakat');
    expect(seo.robots).toBeUndefined();
  });

  it('adds Urdu details only when the article has a full Urdu version', () => {
    const base = {
      slug: 'zakat-guide',
      title: 'Zakat guide',
      excerpt: 'A short guide.',
      topic: 'Zakat',
      author: 'Nagina Social Welfare UK',
      publishedAt: '2026-10-20',
      image: { url: 'https://example.com/a.jpg' },
    };
    expect(blogArticleSeo(base).ur).toBeUndefined();
    expect(blogArticleSeo({ ...base, titleUr: 'زکوٰۃ' }).ur).toBeUndefined();
    const seo = blogArticleSeo({ ...base, titleUr: 'زکوٰۃ کی رہنمائی', excerptUr: 'مختصر رہنمائی۔', contentHtmlUr: '<p>متن</p>' });
    expect(seo.ur?.title).toBe('زکوٰۃ کی رہنمائی | نگینہ');
    expect(seo.ur?.description).toBe('مختصر رہنمائی۔');
  });

  it('uses the SEO title and keywords set for an article, else the default title', () => {
    const base = {
      slug: 'a-guide',
      title: 'A very long article heading that would not fit in a search result title',
      excerpt: 'A short guide.',
      topic: '',
      author: 'Nagina Social Welfare UK',
      publishedAt: '2026-10-26',
      image: { url: 'https://example.com/a.jpg' },
    };
    const plain = blogArticleSeo(base);
    expect(plain.title).toBe(base.title);
    expect(plain.keywords).toBeUndefined();
    const set = blogArticleSeo({ ...base, seoTitle: 'Short title | Nagina', seoKeywords: 'quran classes, madrasa' });
    expect(set.title).toBe('Short title | Nagina');
    expect(set.keywords).toBe('quran classes, madrasa');
  });
});
