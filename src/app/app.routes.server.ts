import { RenderMode, ServerRoute } from '@angular/ssr';

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
  { path: 'donate/thanks', renderMode: RenderMode.Client },
  { path: 'centre/:campusId', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
