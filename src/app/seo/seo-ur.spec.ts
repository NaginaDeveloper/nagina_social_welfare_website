import { describe, expect, it } from 'vitest';
import { URDU_PAGE_PATHS } from '../i18n/urdu-routes';
import { PUBLIC_SEO_PAGES } from './seo.config';
import { URDU_SEO } from './seo-ur';

describe('Urdu SEO text', () => {
  it('covers every Urdu twin and nothing else', () => {
    expect(Object.keys(URDU_SEO).sort()).toEqual([...URDU_PAGE_PATHS].sort());
  });

  it('only lists indexable English pages', () => {
    for (const path of URDU_PAGE_PATHS) {
      const page = PUBLIC_SEO_PAGES.find((p) => p.path === path);
      expect(page, path).toBeDefined();
      expect((page?.robots ?? '').toLowerCase(), path).not.toContain('noindex');
    }
  });

  it('keeps titles and descriptions a search result can show, written in Urdu', () => {
    const urdu = /[؀-ۿ]/;
    const titles = new Set<string>();
    for (const [path, seo] of Object.entries(URDU_SEO)) {
      expect(seo.title.length, `${path} title`).toBeLessThanOrEqual(60);
      expect(seo.description.length, `${path} description`).toBeGreaterThanOrEqual(70);
      expect(seo.description.length, `${path} description`).toBeLessThanOrEqual(160);
      expect(urdu.test(seo.title), `${path} title`).toBe(true);
      expect(urdu.test(seo.description), `${path} description`).toBe(true);
      titles.add(seo.title);
    }
    expect(titles.size).toBe(Object.keys(URDU_SEO).length);
  });
});
