import { Component, DestroyRef, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { PageShell } from '../page-shell';
import { BlogService } from '../../services/blog.service';
import { LanguageService } from '../../i18n/language.service';
import { SeoService } from '../../seo/seo.service';
import { SITE_ORIGIN } from '../../seo/seo.config';
import { faqPageJsonLd } from '../../seo/structured-data';
import { blogFaqEntries, formatBlogDate, hasUrdu, readingMinutes, relatedPosts, type BlogPost } from '../../models/blog';

@Component({
  selector: 'app-blog-article-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell [title]="post() ? title(post()!) : i18n.t('blog.articleFallback')">
      <article class="relative overflow-hidden bg-cream py-20 sm:py-28">
        <div class="geo-pattern absolute inset-0 opacity-15" aria-hidden="true"></div>
        <div class="relative mx-auto max-w-3xl px-5 sm:px-8">
          @if (post(); as p) {
            <header class="text-center">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                @if (p.topic) {
                  <span>{{ p.topic }}</span>
                  <span aria-hidden="true"> · </span>
                }
                <time [attr.datetime]="p.publishedAt">{{ date(p.publishedAt, i18n.isUr()) }}</time>
              </p>
              <h1 class="mt-3 font-display text-3xl font-bold leading-tight text-forest sm:text-5xl" [attr.lang]="english(p) ? 'en' : null" [attr.dir]="english(p) ? 'ltr' : null">{{ title(p) }}</h1>
              <p class="mt-4 text-sm text-slate-warm/90">
                {{ i18n.t('blog.by') }} {{ p.author }} · {{ minutes(body(p)) }} {{ i18n.t('blog.minRead') }}
              </p>
              @if (english(p)) {
                <p class="mt-2 text-sm font-semibold text-gold-600">{{ i18n.t('blog.onlyEnglish') }}</p>
              }
            </header>

            <img
              [src]="p.image.url"
              [alt]="p.image.alt"
              width="1200"
              height="750"
              decoding="async"
              fetchpriority="high"
              class="mt-10 aspect-[16/10] w-full rounded-2xl border border-mist object-cover shadow-soft"
            />

            <div
              class="mt-10 text-base leading-relaxed text-slate-warm sm:text-lg [&_a]:font-semibold [&_a]:text-forest [&_a]:underline [&_a]:decoration-gold/50 [&_a]:underline-offset-2 [&_blockquote]:my-6 [&_blockquote]:border-s-4 [&_blockquote]:border-gold/60 [&_blockquote]:ps-5 [&_blockquote]:italic [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-forest [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-forest [&_li]:mb-1.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:mb-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:ps-6"
              [innerHTML]="body(p)"
              [attr.lang]="english(p) ? 'en' : null"
              [attr.dir]="english(p) ? 'ltr' : null"
              (click)="onBodyClick($event)"
            ></div>

            <div class="mt-14 rounded-2xl border border-mist bg-sand/40 px-6 py-8 text-center sm:px-10">
              <h2 class="font-display text-xl font-bold text-forest sm:text-2xl">{{ i18n.t('blog.support') }}</h2>
              <p class="mt-3 text-sm leading-relaxed text-slate-warm sm:text-base">
                {{ i18n.t('blog.supportText') }}
              </p>
              <div class="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  routerLink="/donate"
                  class="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-6 py-2.5 text-sm font-semibold text-forest"
                >
                  {{ i18n.t('blog.donate') }}
                </a>
                <a
                  routerLink="/zakat"
                  class="inline-flex min-h-11 items-center justify-center rounded-full border border-mist bg-white px-6 py-2.5 text-sm font-semibold text-forest shadow-soft"
                >
                  {{ i18n.t('blog.zakatCalc') }}
                </a>
              </div>
            </div>

            @if (more().length > 0) {
              <section class="mt-14" aria-labelledby="more-articles">
                <h2 id="more-articles" class="font-display text-2xl font-bold text-forest">{{ i18n.t('blog.more') }}</h2>
                <ul class="mt-5 space-y-4">
                  @for (other of more(); track other.slug) {
                    <li>
                      <a [routerLink]="['/blog', other.slug]" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2" [attr.lang]="english(other) ? 'en' : null" [attr.dir]="english(other) ? 'ltr' : null">{{ title(other) }}</a>
                      <p class="mt-1 text-sm text-slate-warm" [attr.lang]="english(other) ? 'en' : null" [attr.dir]="english(other) ? 'ltr' : null">{{ excerpt(other) }}</p>
                    </li>
                  }
                </ul>
              </section>
            }

            <p class="mt-12 text-center text-sm">
              <a routerLink="/blog" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2">{{ i18n.t('blog.all') }}</a>
            </p>
          } @else if (blog.fresh()) {
            <div class="text-center">
              <h1 class="page-title">{{ i18n.t('blog.notFoundTitle') }}</h1>
              <p class="page-lead mx-auto">
                {{ i18n.t('blog.notFound') }}
              </p>
              <a
                routerLink="/blog"
                class="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-6 py-2.5 text-sm font-semibold text-forest"
              >
                {{ i18n.t('blog.seeAll') }}
              </a>
            </div>
          }
        </div>
      </article>
    </app-page-shell>
  `,
})
export class BlogArticlePage {
  protected readonly i18n = inject(LanguageService);
  protected readonly blog = inject(BlogService);
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('slug') ?? '')),
    { initialValue: '' },
  );

  private readonly router = inject(Router);

  protected readonly date = formatBlogDate;
  protected readonly minutes = readingMinutes;

  /** True when the page is in Urdu but this article has no Urdu text yet, so the English text is shown. */
  protected english(post: BlogPost): boolean {
    return this.i18n.isUr() && !hasUrdu(post);
  }

  private urdu(post: BlogPost): boolean {
    return this.i18n.isUr() && hasUrdu(post);
  }

  protected title(post: BlogPost): string {
    return this.urdu(post) ? post.titleUr! : post.title;
  }

  protected excerpt(post: BlogPost): string {
    return this.urdu(post) ? post.excerptUr! : post.excerpt;
  }

  protected body(post: BlogPost): string {
    return this.urdu(post) ? post.contentHtmlUr! : post.contentHtml;
  }

  protected post(): BlogPost | null {
    return this.blog.bySlug(this.slug());
  }

  /** Links written inside an article ("/zakat", "/donate") move within the app instead of reloading the page. */
  protected onBodyClick(event: MouseEvent): void {
    const anchor = (event.target as HTMLElement | null)?.closest('a');
    const href = anchor?.getAttribute('href') ?? '';
    const plainClick = event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
    if (!anchor || !plainClick || !href.startsWith('/') || href.startsWith('//')) return;
    event.preventDefault();
    void this.router.navigateByUrl(href);
  }

  protected more(): BlogPost[] {
    const current = this.post();
    return current ? relatedPosts(this.blog.posts(), current) : [];
  }

  constructor() {
    void this.blog.ready();
    // FAQ structured data mirrors the visible "Frequently Asked Questions" section of the article.
    const seo = inject(SeoService);
    effect(() => {
      const p = this.post();
      const prefix = this.i18n.isUr() ? '/ur' : '';
      const node = p ? faqPageJsonLd(blogFaqEntries(this.body(p)), `${SITE_ORIGIN}${prefix}/blog/${p.slug}/`) : null;
      seo.setExtraJsonLd('faq', node ? [node] : null);
    });
    inject(DestroyRef).onDestroy(() => seo.setExtraJsonLd('faq', null));
  }
}
