import { describe, expect, it } from 'vitest';
import { authorInitial, parseGoogleReviews, starString } from './google-reviews';

describe('parseGoogleReviews', () => {
  it('keeps rating, count, link and valid reviews', () => {
    const data = parseGoogleReviews({
      rating: 5,
      count: 23,
      mapsUri: 'https://maps.google.com/?cid=1',
      reviews: [
        { author: ' Noreen Akhtar ', authorUrl: 'https://www.google.com/maps/contrib/9', rating: 5, text: ' Very happy ', when: '4 weeks ago' },
        { author: '', rating: 4, text: '', when: '' },
        { author: 'Bad', rating: 9, text: 'ignored' },
        null,
      ],
    });
    expect(data?.rating).toBe(5);
    expect(data?.count).toBe(23);
    expect(data?.mapsUri).toBe('https://maps.google.com/?cid=1');
    expect(data?.reviews).toHaveLength(2);
    expect(data?.reviews[0]).toMatchObject({ author: 'Noreen Akhtar', text: 'Very happy', rating: 5 });
    expect(data?.reviews[1]?.author).toBe('Google user');
  });

  it('drops non-https links and rejects bodies that are not a reviews payload', () => {
    expect(parseGoogleReviews({ reviews: [], mapsUri: 'http://insecure' })?.mapsUri).toBeNull();
    expect(parseGoogleReviews({ error: 'Unable to load Google reviews right now.' })).toBeNull();
    expect(parseGoogleReviews(null)).toBeNull();
    expect(parseGoogleReviews('x')).toBeNull();
  });
});

describe('review display helpers', () => {
  it('draws stars and initials', () => {
    expect(starString(5)).toBe('★★★★★');
    expect(starString(4)).toBe('★★★★☆');
    expect(starString(0)).toBe('☆☆☆☆☆');
    expect(authorInitial(' muhammad musa')).toBe('M');
    expect(authorInitial('')).toBe('?');
  });
});
