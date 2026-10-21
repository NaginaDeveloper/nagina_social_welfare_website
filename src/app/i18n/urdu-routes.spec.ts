import { describe, expect, it } from 'vitest';
import {
  URDU_PAGE_PATHS,
  isUrduPage,
  normalisePath,
  splitUrduPrefix,
  toUrduPath,
  withoutUrduPrefix,
} from './urdu-routes';

describe('urdu-routes', () => {
  it('normalises paths to a leading and trailing slash', () => {
    expect(normalisePath('about')).toBe('/about/');
    expect(normalisePath('/about')).toBe('/about/');
    expect(normalisePath('/about/')).toBe('/about/');
    expect(normalisePath('')).toBe('/');
    expect(normalisePath('/')).toBe('/');
  });

  it('maps English paths to their Urdu twin and back', () => {
    expect(toUrduPath('/')).toBe('/ur/');
    expect(toUrduPath('/zakat/rules')).toBe('/ur/zakat/rules/');
    for (const path of URDU_PAGE_PATHS) {
      expect(splitUrduPrefix(toUrduPath(path))).toEqual({ ur: true, path });
    }
  });

  it('only treats listed pages as having an Urdu twin', () => {
    expect(isUrduPage('/donate/')).toBe(true);
    expect(isUrduPage('/donate')).toBe(true);
    expect(isUrduPage('/apply/')).toBe(false);
    expect(isUrduPage('/peterborough/')).toBe(false);
    expect(isUrduPage('/ur/donate/')).toBe(false);
  });

  it('treats every blog article address as a possible Urdu twin', () => {
    expect(isUrduPage('/blog/')).toBe(true);
    expect(isUrduPage('/blog/zakat-in-the-uk')).toBe(true);
    expect(isUrduPage('/blog/a/b/')).toBe(false);
    expect(toUrduPath('/blog/zakat-in-the-uk/')).toBe('/ur/blog/zakat-in-the-uk/');
    expect(withoutUrduPrefix('/ur/blog/zakat-in-the-uk/')).toBe('/blog/zakat-in-the-uk/');
  });

  it('strips the prefix only from real Urdu twins, keeping query and hash', () => {
    expect(withoutUrduPrefix('/ur/donate/?x=1#top')).toBe('/donate/?x=1#top');
    expect(withoutUrduPrefix('/ur/')).toBe('/');
    expect(withoutUrduPrefix('/donate/')).toBe('/donate/');
    expect(withoutUrduPrefix('/ur/apply/')).toBe('/ur/apply/');
  });

  it('lists every page once, with a trailing slash', () => {
    expect(new Set(URDU_PAGE_PATHS).size).toBe(URDU_PAGE_PATHS.length);
    for (const path of URDU_PAGE_PATHS) expect(path).toBe(normalisePath(path));
  });
});
