import { describe, expect, it } from 'vitest';
import {
  DEFAULT_OG_IMAGE,
  OG_CARD_SLUGS,
  PUBLIC_SEO_PAGES,
  SITE_ORIGIN,
  ogSlug,
  pageOgImage,
} from './seo.config';

describe('ogSlug', () => {
  it('maps paths to file-safe slugs', () => {
    expect(ogSlug('/')).toBe('home');
    expect(ogSlug('/about/')).toBe('about');
    expect(ogSlug('/zakat/rules/')).toBe('zakat-rules');
  });
});

describe('pageOgImage', () => {
  it('prefers a page image, making root-relative ones absolute', () => {
    const base = { title: 't', description: 'd', path: '/x/' };
    expect(pageOgImage({ ...base, image: '/videos/a.jpg' })).toBe(`${SITE_ORIGIN}/videos/a.jpg`);
    expect(pageOgImage({ ...base, image: 'https://cdn.example/a.jpg' })).toBe('https://cdn.example/a.jpg');
  });

  it('uses the generated card for indexed pages and the logo for unknown paths', () => {
    expect(pageOgImage({ title: 't', description: 'd', path: '/about/' })).toBe(`${SITE_ORIGIN}/og/about.png`);
    expect(pageOgImage({ title: 't', description: 'd', path: '/centre/leeds/' })).toBe(DEFAULT_OG_IMAGE);
  });

  it('has a card for every indexed page without its own image', () => {
    const missing = PUBLIC_SEO_PAGES.filter(
      (p) => !p.image && !(p.robots ?? '').toLowerCase().includes('noindex') && !OG_CARD_SLUGS.includes(ogSlug(p.path)),
    ).map((p) => p.path);
    expect(missing).toEqual([]);
  });
});
