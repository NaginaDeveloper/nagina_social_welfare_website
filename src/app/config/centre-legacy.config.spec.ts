import { describe, expect, it } from 'vitest';
import { CHAIN_NODES, centreLegacy, duaText } from './centre-legacy.config';
import { quranAcademyAbout } from './centre-about.config';

describe('centre legacy copy', () => {
  it('has framing for both centres and none for others', () => {
    expect(centreLegacy('peterborough')?.centreName).toBe('Markaz Deen-e-Islam');
    expect(centreLegacy('manchester')?.centreName).toBe('Quran Academy Partington');
    expect(centreLegacy('leeds')).toBeNull();
  });

  it('chains Pakistan to both UK centres, each linking to its page', () => {
    expect(CHAIN_NODES.map((n) => n.id)).toEqual(['pakistan', 'peterborough', 'manchester']);
    expect(CHAIN_NODES.filter((n) => n.path).map((n) => n.path)).toEqual(['/peterborough', '/manchester']);
  });

  it('names the centre in its du’a', () => {
    expect(duaText('Quran Academy Partington')[0]).toContain('Quran Academy Partington');
  });

  it('gives Manchester its own page opening', () => {
    expect(quranAcademyAbout('manchester')?.name).toBe('Quran Academy');
    expect(quranAcademyAbout('peterborough')).toBeNull();
  });
});
