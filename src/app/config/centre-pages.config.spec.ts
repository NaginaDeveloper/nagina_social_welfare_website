import { describe, expect, it } from 'vitest';
import { centreMapsProfileUrl, centrePath, centreReviewUrl } from './centre-pages.config';

describe('Google Business Profile links', () => {
  it('gives Peterborough a review link and a Maps listing, and Manchester none yet', () => {
    expect(centreReviewUrl('peterborough')).toBe('https://g.page/r/CXdKgnGjgadjEBM/review');
    expect(centreMapsProfileUrl('peterborough')).toBe('https://maps.google.com/?cid=7180850669849561719');
    expect(centreReviewUrl('manchester')).toBeNull();
    expect(centreMapsProfileUrl('manchester')).toBeNull();
    expect(centreReviewUrl('unknown')).toBeNull();
  });

  it('keeps the page paths the review button sits on', () => {
    expect(centrePath('peterborough')).toBe('/peterborough');
  });
});
