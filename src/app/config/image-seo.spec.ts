import { describe, expect, it } from 'vitest';
import { SPIRITUAL_GUIDE_PHOTOS, SPIRITUAL_GUIDE_SAYINGS } from '../components/spiritual-guide-gallery/spiritual-guide-gallery-data';
import { SHAJRA_HONOUR, SHAJRA_SILSILAS, SHAJRA_TITLE_PAGE } from '../components/shajra-sharif/shajra-data';
import { imageTitle } from './image-seo.config';

const images = [
  ...SPIRITUAL_GUIDE_PHOTOS,
  ...SPIRITUAL_GUIDE_SAYINGS,
  SHAJRA_TITLE_PAGE,
  SHAJRA_HONOUR,
  ...SHAJRA_SILSILAS.flatMap((s) => s.pages),
];

describe('Home and Spiritual Guide image SEO', () => {
  it('gives every image a descriptive alt of at most 125 characters', () => {
    for (const img of images) {
      expect(img.alt.length, img.src).toBeGreaterThan(15);
      expect(img.alt.length, img.src).toBeLessThanOrEqual(125);
    }
  });

  it('points every image at a descriptively named file', () => {
    for (const img of images) {
      expect(img.src.split('/').pop(), img.src).not.toMatch(/^\d+(-[a-z]+)?\./);
    }
  });

  it('has a hover title for every gallery and Shajra image', () => {
    for (const img of images) expect(imageTitle(img.src), img.src).toBeTruthy();
  });
});
