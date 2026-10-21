import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { BLOG_ARTICLE_SEO, blogArticleSeo, type PageSeo } from './seo.config';

/**
 * Gives an article's route its own title, description, canonical and schema before the page is
 * shown, so the head never passes through the generic "Article" defaults (which are noindex).
 */
export const blogArticleSeoResolver: ResolveFn<PageSeo> = async (route) => {
  const post = await inject(BlogService).find(route.paramMap.get('slug'));
  return post
    ? blogArticleSeo(post)
    : { ...BLOG_ARTICLE_SEO, title: 'Article not found | Nagina Social Welfare UK' };
};
