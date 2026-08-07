import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  DEFAULT_OG_IMAGE,
  HOME_SEO,
  SITE_NAME,
  SITE_ORIGIN,
  type PageSeo,
} from './seo.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private started = false;

  /** Listen to route changes and apply SEO from route data (or home defaults). */
  start(): void {
    if (this.started) return;
    this.started = true;

    this.apply(this.resolveSeo(this.router.routerState.snapshot.root));

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.apply(this.resolveSeo(this.router.routerState.snapshot.root));
      });
  }

  apply(seo: PageSeo): void {
    const url = this.absoluteUrl(seo.path);
    const image = seo.image ?? DEFAULT_OG_IMAGE;
    const type = seo.type ?? 'website';

    this.title.setTitle(seo.title);

    this.upsertName('description', seo.description);
    this.upsertName('keywords', seo.keywords ?? '');
    this.upsertName('author', SITE_NAME);
    this.upsertName('robots', 'index, follow, max-image-preview:large');

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

  private resolveSeo(root: ActivatedRouteSnapshot): PageSeo {
    let route: ActivatedRouteSnapshot | null = root;
    let seo: PageSeo | undefined;

    while (route) {
      const data = route.data['seo'] as PageSeo | undefined;
      if (data) seo = data;
      route = route.firstChild;
    }

    return seo ?? HOME_SEO;
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
    if (typeof document === 'undefined') return;
    let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(seo: PageSeo, url: string): void {
    if (typeof document === 'undefined') return;

    const organization = {
      '@type': 'NGO',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: SITE_NAME,
      alternateName: 'Nagina Social Welfare UK',
      url: SITE_ORIGIN,
      logo: DEFAULT_OG_IMAGE,
      email: 'info@naginasocialwelfare.co.uk',
      telephone: '+44-7831-684738',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '103 Burmer Road',
        addressLocality: 'Peterborough',
        postalCode: 'PE1 3HT',
        addressCountry: 'GB',
      },
      sameAs: [
        'https://www.facebook.com/naginasocial.welfare.5',
        'https://www.instagram.com/naginasocialwelfare/',
        'https://www.youtube.com/@naginasocialwelfareuk7419',
      ],
    };

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

    const payload = {
      '@context': 'https://schema.org',
      '@graph': [organization, website, webpage],
    };

    let script = document.getElementById('nagina-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'nagina-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }
}
