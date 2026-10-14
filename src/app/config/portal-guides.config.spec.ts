import { describe, expect, it } from 'vitest';
import { PORTAL_GUIDES } from './portal-guides.config';

describe('PORTAL_GUIDES', () => {
  it('lists the parent, teacher and student portals once each', () => {
    expect(PORTAL_GUIDES.map((g) => g.id)).toEqual(['parent', 'teacher', 'student']);
  });

  it('serves each video, poster and manual from the portal guide pages', () => {
    for (const g of PORTAL_GUIDES) {
      expect(g.videoUrl).toBe(`/guides/${g.id}-portal-video/`);
      expect(g.videoFile?.startsWith(g.videoUrl ?? '-')).toBe(true);
      expect(g.videoPoster).toBe(`${g.videoUrl}poster.jpg`);
      expect(g.manualUrl).toBe(`/guides/${g.id}-portal-manual/`);
      expect(g.videoLength).toMatch(/^\d+:\d{2}$/);
    }
  });

  it('links an app only for the parent portal, the one live on Google Play', () => {
    expect(PORTAL_GUIDES.filter((g) => g.appUrl).map((g) => g.id)).toEqual(['parent']);
  });
});
