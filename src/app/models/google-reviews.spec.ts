import { describe, expect, it } from 'vitest';
import { authorInitial, parseGoogleReviews, reviewAge, starString } from './google-reviews';

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
    expect(data?.reviews[1]?.reply).toBeNull();
  });

  it('keeps the publish time and the centre reply', () => {
    const data = parseGoogleReviews({
      reviews: [
        { rating: 5, text: 'Great', publishTime: '2026-10-02T12:00:00Z', reply: { text: ' JazakAllah khair ' } },
        { rating: 5, text: 'x', publishTime: 'not a date', reply: { text: '' } },
      ],
    });
    expect(data?.reviews[0]).toMatchObject({ publishTime: '2026-10-02T12:00:00Z', reply: 'JazakAllah khair' });
    expect(data?.reviews[1]).toMatchObject({ publishTime: null, reply: null });
  });

  it('drops non-https links and rejects bodies that are not a reviews payload', () => {
    expect(parseGoogleReviews({ reviews: [], mapsUri: 'http://insecure' })?.mapsUri).toBeNull();
    expect(parseGoogleReviews({ error: 'Unable to load Google reviews right now.' })).toBeNull();
    expect(parseGoogleReviews(null)).toBeNull();
    expect(parseGoogleReviews('x')).toBeNull();
  });
});

describe('reviewAge', () => {
  const now = new Date('2026-10-16T12:00:00Z');
  it('formats in the page language and falls back to the server text', () => {
    expect(reviewAge('2026-09-25T12:00:00Z', 'x', 'en', now)).toBe('3 weeks ago');
    expect(reviewAge('2026-10-16T08:00:00Z', 'x', 'en', now)).toBe('today');
    expect(reviewAge('2024-10-01T00:00:00Z', 'x', 'en', now)).toBe('2 years ago');
    expect(reviewAge('2026-09-25T12:00:00Z', 'x', 'ur', now)).not.toBe('x');
    expect(reviewAge(null, '4 weeks ago', 'en', now)).toBe('4 weeks ago');
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
