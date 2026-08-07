import { Routes } from '@angular/router';
import { BOOKS_SEO, HOME_SEO, NAMAZ_SEO, QURAN_SEO } from './seo/seo.config';

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
  { path: '**', redirectTo: '' },
];
