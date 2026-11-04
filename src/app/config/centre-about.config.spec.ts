import { describe, expect, it } from 'vitest';
import { markazAbout } from './centre-about.config';
import { madrasaSessions } from './madrasa-timetable.config';
import { ORGANIZATION } from './organization.config';

describe('Peterborough madrasa FAQs', () => {
  const faqs = markazAbout('peterborough')?.faqs ?? [];

  it('answers the questions a parent searches for', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    for (const faq of faqs) {
      expect(faq.question.trim()).not.toBe('');
      expect(faq.answer.trim()).not.toBe('');
    }
  });

  it('quotes the same address, phone and class times the rest of the site publishes', () => {
    const text = faqs.map((f) => f.answer).join(' ');
    expect(text).toContain(ORGANIZATION.streetAddress);
    expect(text).toContain(ORGANIZATION.postalCode);
    expect(text).toContain(ORGANIZATION.phoneDisplay);
    expect(madrasaSessions('peterborough')).toHaveLength(3);
    expect(text).toContain('4:30 to 5:30 PM');
    expect(text).toContain('6:30 to 7:30 PM');
  });
});
