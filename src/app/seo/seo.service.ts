import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ORGANIZATION } from '../config/organization.config';
import { centrePath } from '../config/centre-pages.config';
import { campusLocation, campusTown, type Campus } from '../models/campus';
import { CampusService } from '../services/campus.service';
import {
  DEFAULT_OG_IMAGE,
  HOME_SEO,
  SITE_NAME,
  SITE_ORIGIN,
  pageOgImage,
  type PageSeo,
} from './seo.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly campuses = inject(CampusService);
  private started = false;

  /** Listen to route changes and apply SEO from route data (or home defaults). */
  start(): void {
    if (this.started) return;
    this.started = true;

    // Before the first navigation finishes the snapshot has no route data, and falling
    // back to the home page would briefly rewrite the prerendered canonical, title and
    // Open Graph tags (which Googlebot can capture). Leave the server-rendered head alone
    // until a route supplies its own SEO.
    this.applyCurrentRoute(false);
    void this.campuses.load().then(() => this.applyCurrentRoute(false));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.applyCurrentRoute(true));
  }

  private applyCurrentRoute(fallbackToHome: boolean): void {
    const seo = this.resolveSeo(this.router.routerState.snapshot.root);
    if (seo) this.apply(seo);
    else if (fallbackToHome) this.apply(HOME_SEO);
  }

  apply(seo: PageSeo): void {
    const url = this.absoluteUrl(seo.path);
    const image = pageOgImage(seo);
    const type = seo.type ?? 'website';

    this.title.setTitle(seo.title);

    this.upsertName('description', seo.description);
    this.upsertName('keywords', seo.keywords ?? '');
    this.upsertName('author', SITE_NAME);
    this.upsertName('robots', seo.robots ?? 'index, follow, max-image-preview:large');

    this.upsertProperty('og:type', type);
    this.upsertProperty('og:site_name', SITE_NAME);
    this.upsertProperty('og:title', seo.title);
    this.upsertProperty('og:description', seo.description);
    this.upsertProperty('og:url', url);
    this.upsertProperty('og:image', image);
    this.upsertProperty('og:locale', 'en_GB');

    this.upsertName('twitter:card', 'summary_large_image');
    this.upsertName('twitter:title', seo.title);
    this.upsertName('twitter:description', seo.description);
    this.upsertName('twitter:image', image);

    this.setCanonical(url);
    this.setJsonLd(seo, url);
  }

  private resolveSeo(root: ActivatedRouteSnapshot): PageSeo | undefined {
    let route: ActivatedRouteSnapshot | null = root;
    let seo: PageSeo | undefined;

    while (route) {
      const data = route.data['seo'] as PageSeo | undefined;
      if (data) seo = data;
      route = route.firstChild;
    }

    return seo;
  }

  private absoluteUrl(path: string): string {
    if (!path || path === '/') return `${SITE_ORIGIN}/`;
    return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private upsertName(name: string, content: string): void {
    if (!content) {
      this.meta.removeTag(`name='${name}'`);
      return;
    }
    this.meta.updateTag({ name, content });
  }

  private upsertProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private breadcrumbLabel(seo: PageSeo): string {
    if (seo.breadcrumb) return seo.breadcrumb;
    const beforePipe = seo.title.split('|')[0]?.trim();
    return beforePipe || seo.title;
  }

  private setJsonLd(seo: PageSeo, url: string): void {

    const organization = {
      '@type': 'NGO',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: SITE_NAME,
      legalName: ORGANIZATION.legalName,
      alternateName: ORGANIZATION.charityName,
      url: SITE_ORIGIN,
      logo: DEFAULT_OG_IMAGE,
      email: ORGANIZATION.email,
      telephone: ORGANIZATION.phoneTel,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ORGANIZATION.streetAddress,
        addressLocality: ORGANIZATION.addressLocality,
        postalCode: ORGANIZATION.postalCode,
        addressCountry: ORGANIZATION.addressCountry,
      },
      identifier: [
        {
          '@type': 'PropertyValue',
          name: 'Charity Number',
          value: ORGANIZATION.charityNumber,
        },
        {
          '@type': 'PropertyValue',
          name: 'Company Number',
          value: ORGANIZATION.companyNumber,
        },
      ],
      sameAs: [
        ORGANIZATION.facebookUrl,
        ORGANIZATION.instagramUrl,
        ORGANIZATION.youtubeUrl,
        ORGANIZATION.tiktokUrl,
        ORGANIZATION.charityCommissionUrl,
        ORGANIZATION.companiesHouseUrl,
      ],
    };

    const madrasas = this.campuses.campuses().map((campus) => madrasaNode(campus));
    if (madrasas.length > 0) {
      Object.assign(organization, {
        subOrganization: madrasas.map((m) => ({ '@id': m['@id'] })),
      });
    }

    const website = {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: SITE_NAME,
      description: HOME_SEO.description,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: 'en-GB',
    };

    const webpage = {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      about: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: 'en-GB',
    };

    const graph: Record<string, unknown>[] = [organization, ...madrasas, website, webpage];

    if (seo.path !== '/') {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_ORIGIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: this.breadcrumbLabel(seo),
            item: url,
          },
        ],
      });
    }

    if (seo.type === 'article') {
      graph.push({
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: seo.title,
        description: seo.description,
        image: seo.image ?? DEFAULT_OG_IMAGE,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        author: { '@id': `${SITE_ORIGIN}/#organization` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        inLanguage: 'en-GB',
      });
    }

    const payload = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    let script = this.doc.getElementById('nagina-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'nagina-jsonld';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }

  /**
   * Page-specific structured data (Event, FAQPage) kept beside the site graph.
   * Pass `null` to remove it, e.g. when the page is destroyed.
   */
  setExtraJsonLd(key: string, nodes: readonly object[] | null): void {
    const id = `nagina-jsonld-${key}`;
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!nodes || nodes.length === 0) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(nodes.length === 1 ? nodes[0] : nodes);
  }
}

/** One search-data entry per madrasa, from the office-editable campus list. */
export function madrasaNode(campus: Campus): Record<string, unknown> {
  const town = campusTown(campus);
  const parts = campus.addressLine.split(',').map((p) => p.trim()).filter(Boolean);
  const street = parts.length > 1 ? parts.slice(0, -1).join(', ') : campus.addressLine;
  const coords = campusLocation(campus);
  return {
    '@type': 'EducationalOrganization',
    '@id': `${SITE_ORIGIN}/#madrasa-${campus.id}`,
    name: campus.displayName,
    url: `${SITE_ORIGIN}${centrePath(campus.id)}/`,
    parentOrganization: { '@id': `${SITE_ORIGIN}/#organization` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: town,
      postalCode: campus.postcode,
      addressCountry: 'GB',
    },
    telephone: campus.phoneE164,
    ...(campus.email ? { email: campus.email } : {}),
    ...(coords
      ? { geo: { '@type': 'GeoCoordinates', latitude: coords.latitude, longitude: coords.longitude } }
      : {}),
  };
}
