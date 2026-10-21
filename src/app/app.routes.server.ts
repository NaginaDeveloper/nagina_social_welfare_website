import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_CATALOG_URL } from './config/blog.config';
import { hasUrdu, parseBlogCatalog, type BlogCatalog } from './models/blog';

/** Slugs of the published articles, read from the live catalog at build time (only those with Urdu text when `urdu`). */
async function blogSlugs(urdu = false): Promise<Record<string, string>[]> {
  try {
    const res = await fetch(BLOG_CATALOG_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = parseBlogCatalog((await res.json()) as BlogCatalog);
    return posts.filter((p) => !urdu || hasUrdu(p)).map((p) => ({ slug: p.slug }));
  } catch (err) {
    // No catalog at build time: articles still load in the browser, they just are not prerendered.
    console.warn('blog: could not read the article catalog for prerendering', err);
    return [];
  }
}

/**
 * Public, content-heavy pages are prerendered at build time so crawlers and link
 * previews get real HTML. Member/applicant flows and the catch-all stay client-only.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'apply/success', renderMode: RenderMode.Client },
  { path: 'apply/track', renderMode: RenderMode.Client },
  { path: 'membership/success', renderMode: RenderMode.Client },
  { path: 'membership/track', renderMode: RenderMode.Client },
  { path: 'membership/login', renderMode: RenderMode.Client },
  { path: 'membership/set-password', renderMode: RenderMode.Client },
  { path: 'membership/home', renderMode: RenderMode.Client },
  { path: 'membership/forgot-password', renderMode: RenderMode.Client },
  { path: 'membership/reset-password', renderMode: RenderMode.Client },
  { path: 'membership/preferences', renderMode: RenderMode.Client },
  { path: 'appeals/:id', renderMode: RenderMode.Client },
  { path: 'donate/thanks', renderMode: RenderMode.Client },
  { path: 'centre/:campusId', renderMode: RenderMode.Client },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => blogSlugs(),
    fallback: PrerenderFallback.Client,
  },
  {
    path: 'ur/blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => blogSlugs(true),
    fallback: PrerenderFallback.Client,
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
