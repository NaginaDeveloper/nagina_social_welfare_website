import { Routes } from '@angular/router';
import {
  BOOKS_SEO,
  DONATE_THANKS_SEO,
  HOME_SEO,
  NAMAZ_SEO,
  QURAN_SEO,
  SERMONS_SEO,
} from './seo/seo.config';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: HOME_SEO.title,
    data: { seo: HOME_SEO },
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
    path: 'donate/thanks',
    loadComponent: () =>
      import('./pages/donate-thanks/donate-thanks-page').then((m) => m.DonateThanksPage),
    title: DONATE_THANKS_SEO.title,
    data: { seo: DONATE_THANKS_SEO },
  },
  { path: '**', redirectTo: '' },
];
