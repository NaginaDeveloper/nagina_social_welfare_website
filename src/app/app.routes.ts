import { Routes } from '@angular/router';
import {
  ABOUT_SEO,
  AHLE_BAIT_SEO,
  ASSISTANT_SEO,
  APPS_SEO,
  BOOKS_SEO,
  CONTACT_SEO,
  DONATE_SEO,
  DONATE_THANKS_SEO,
  EVENTS_SEO,
  GUIDANCE_SEO,
  HOME_SEO,
  KHATME_NABUWWAT_SEO,
  NAMAZ_SEO,
  PRIVACY_SEO,
  QURAN_SEO,
  SAHABA_IKRAM_SEO,
  AULIA_KARAM_SEO,
  SERMONS_SEO,
  SPIRITUAL_GUIDE_SEO,
  WORK_SEO,
} from './seo/seo.config';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: HOME_SEO.title,
    data: { seo: HOME_SEO },
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page').then((m) => m.AboutPage),
    title: ABOUT_SEO.title,
    data: { seo: ABOUT_SEO },
  },
  {
    path: 'work',
    loadComponent: () => import('./pages/work/work-page').then((m) => m.WorkPage),
    title: WORK_SEO.title,
    data: { seo: WORK_SEO },
  },
  {
    path: 'spiritual-guide',
    loadComponent: () =>
      import('./pages/spiritual-guide/spiritual-guide-page').then((m) => m.SpiritualGuidePage),
    title: SPIRITUAL_GUIDE_SEO.title,
    data: { seo: SPIRITUAL_GUIDE_SEO },
  },
  {
    path: 'khatme-nabuwwat',
    loadComponent: () =>
      import('./pages/khatme-nabuwwat/khatme-nabuwwat-page').then((m) => m.KhatmeNabuwwatPage),
    title: KHATME_NABUWWAT_SEO.title,
    data: { seo: KHATME_NABUWWAT_SEO },
  },
  {
    path: 'ahle-bait',
    loadComponent: () =>
      import('./pages/ahle-bait/ahle-bait-page').then((m) => m.AhleBaitPage),
    title: AHLE_BAIT_SEO.title,
    data: { seo: AHLE_BAIT_SEO },
  },
  {
    path: 'sahaba-ikram',
    loadComponent: () =>
      import('./pages/sahaba-ikram/sahaba-ikram-page').then((m) => m.SahabaIkramPage),
    title: SAHABA_IKRAM_SEO.title,
    data: { seo: SAHABA_IKRAM_SEO },
  },
  {
    path: 'aulia-karam',
    loadComponent: () =>
      import('./pages/aulia-karam/aulia-karam-page').then((m) => m.AuliaKaramPage),
    title: AULIA_KARAM_SEO.title,
    data: { seo: AULIA_KARAM_SEO },
  },
  {
    path: 'guidance',
    loadComponent: () => import('./pages/guidance/guidance-page').then((m) => m.GuidancePage),
    title: GUIDANCE_SEO.title,
    data: { seo: GUIDANCE_SEO },
  },
  {
    path: 'namaz',
    loadComponent: () => import('./pages/namaz/namaz-page').then((m) => m.NamazPage),
    title: NAMAZ_SEO.title,
    data: { seo: NAMAZ_SEO },
  },
  {
    path: 'quran',
    loadComponent: () => import('./pages/quran/quran-page').then((m) => m.QuranPage),
    title: QURAN_SEO.title,
    data: { seo: QURAN_SEO },
  },
  {
    path: 'books',
    loadComponent: () => import('./pages/books/books-page').then((m) => m.BooksPage),
    title: BOOKS_SEO.title,
    data: { seo: BOOKS_SEO },
  },
  {
    path: 'sermons',
    loadComponent: () => import('./pages/sermons/sermons-page').then((m) => m.SermonsPage),
    title: SERMONS_SEO.title,
    data: { seo: SERMONS_SEO },
  },
  {
    path: 'apps',
    loadComponent: () => import('./pages/apps/apps-page').then((m) => m.AppsPage),
    title: APPS_SEO.title,
    data: { seo: APPS_SEO },
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events-page').then((m) => m.EventsPage),
    title: EVENTS_SEO.title,
    data: { seo: EVENTS_SEO },
  },
  {
    path: 'donate',
    loadComponent: () => import('./pages/donate/donate-page').then((m) => m.DonatePage),
    title: DONATE_SEO.title,
    data: { seo: DONATE_SEO },
  },
  {
    path: 'assistant',
    loadComponent: () => import('./pages/assistant/assistant-page').then((m) => m.AssistantPage),
    title: ASSISTANT_SEO.title,
    data: { seo: ASSISTANT_SEO },
  },
  {
    path: 'donate/thanks',
    loadComponent: () =>
      import('./pages/donate-thanks/donate-thanks-page').then((m) => m.DonateThanksPage),
    title: DONATE_THANKS_SEO.title,
    data: { seo: DONATE_THANKS_SEO },
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage),
    title: CONTACT_SEO.title,
    data: { seo: CONTACT_SEO },
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy-page').then((m) => m.PrivacyPage),
    title: PRIVACY_SEO.title,
    data: { seo: PRIVACY_SEO },
  },
  { path: '**', redirectTo: '' },
];
