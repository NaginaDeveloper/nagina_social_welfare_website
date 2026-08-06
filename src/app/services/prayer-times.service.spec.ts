import { describe, expect, it } from 'vitest';
import { formatDuration, parseHm, stripTimezoneSuffix } from './prayer-times.service';

describe('prayer time helpers', () => {
  it('strips timezone suffixes from AlAdhan times', () => {
    expect(stripTimezoneSuffix('03:48 (BST)')).toBe('03:48');
    expect(stripTimezoneSuffix('22:55 (GMT)')).toBe('22:55');
    expect(stripTimezoneSuffix('13:07')).toBe('13:07');
  });

  it('parses HH:mm into minutes', () => {
    expect(parseHm('00:00')).toBe(0);
    expect(parseHm('13:07')).toBe(13 * 60 + 7);
    expect(parseHm('23:13 (BST)')).toBe(23 * 60 + 13);
  });

  it('formats countdown durations', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(72)).toBe('1h 12m');
  });
});
