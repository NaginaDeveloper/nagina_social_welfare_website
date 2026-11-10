import { describe, expect, it } from 'vitest';
import { LOCATION_PAGES, locationPage } from './location-pages.config';
import { buildNavGroups } from './navigation.config';
import { ORGANIZATION } from './organization.config';
import { LOCATION_MANCHESTER_SEO, LOCATION_PETERBOROUGH_SEO, PUBLIC_SEO_PAGES } from '../seo/seo.config';

describe('location donation pages', () => {
  it('keeps the headings the office wrote', () => {
    expect(locationPage('peterborough')?.h1).toBe('Donate to an Islamic Charity in Peterborough');
    expect(locationPage('manchester')?.h1).toBe('Donate to an Islamic Charity in Manchester');
    expect(locationPage('peterborough')?.centreHeading).toBe('Our Peterborough Centre: Markaz Deen-e-Islam');
    expect(locationPage('manchester')?.centreHeading).toBe('Our Manchester Centre: Quran Academy in Partington');
    expect(locationPage('nowhere')).toBeNull();
  });

  it('uses the SEO titles, descriptions and paths from the ticket', () => {
    expect(LOCATION_PETERBOROUGH_SEO.title).toBe('Islamic Charity Peterborough | Donate Zakat & Sadaqah');
    expect(LOCATION_MANCHESTER_SEO.title).toBe('Islamic Charity Manchester | Donate Zakat & Sadaqah');
    expect(LOCATION_PETERBOROUGH_SEO.path).toBe('/locations/peterborough/');
    expect(LOCATION_MANCHESTER_SEO.path).toBe('/locations/manchester/');
    for (const seo of [LOCATION_PETERBOROUGH_SEO, LOCATION_MANCHESTER_SEO]) {
      expect(seo.description.length).toBeLessThanOrEqual(160);
      expect(PUBLIC_SEO_PAGES).toContain(seo);
    }
  });

  it('matches the organisation details published elsewhere on the site', () => {
    expect(ORGANIZATION.charityNumber).toBe('1196514');
    expect(locationPage('peterborough')?.addressLines.join(' ')).toContain(ORGANIZATION.postalCode);
    expect(locationPage('manchester')?.addressLines.join(' ')).toContain('M31 4FL');
    expect(locationPage('peterborough')?.phone).toBe(true);
    expect(locationPage('manchester')?.phone).toBe(false);
  });

  it('adds a Locations menu with both pages for the header and the mobile menu', () => {
    const group = buildNavGroups([]).find((g) => g.id === 'locations');
    expect(group?.items.map((i) => i.path)).toEqual(Object.values(LOCATION_PAGES).map((p) => p.path));
  });
});
