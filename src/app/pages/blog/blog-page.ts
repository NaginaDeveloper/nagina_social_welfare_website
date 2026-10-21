import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../page-shell';
import { BlogService } from '../../services/blog.service';
import { LanguageService } from '../../i18n/language.service';
import { formatBlogDate, hasUrdu, readingMinutes, type BlogPost } from '../../models/blog';

@Component({
  selector: 'app-blog-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell [title]="i18n.t('blog.eyebrow')">
      <section class="relative overflow-hidden bg-cream py-20 sm:py-28">
        <div class="geo-pattern absolute inset-0 opacity-15" aria-hidden="true"></div>
        <div class="relative site-wrap">
          <div class="mx-auto max-w-3xl text-center">
            <span class="mb-4 inline-block eyebrow">{{ i18n.t('blog.eyebrow') }}</span>
            <h1 class="page-title">{{ i18n.t('blog.title') }}</h1>
            <p class="page-lead mx-auto">{{ i18n.t('blog.lead') }}</p>
          </div>

          @if (blog.posts().length > 0) {
            <ul class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              @for (post of blog.posts(); track post.slug) {
                <li class="flex">
                  <article
                    class="group flex w-full flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-soft transition-shadow hover:shadow-portal"
                  >
                    <a [routerLink]="['/blog', post.slug]" class="block" tabindex="-1" aria-hidden="true">
                      <img
                        [src]="post.image.url"
                        [alt]="post.image.alt"
                        width="800"
                        height="500"
                        loading="lazy"
                        decoding="async"
                        class="aspect-[16/10] w-full object-cover"
                      />
                    </a>
                    <div class="flex flex-1 flex-col p-6">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                        @if (post.topic) {
                          <span>{{ post.topic }}</span>
                          <span aria-hidden="true"> · </span>
                        }
                        <time [attr.datetime]="post.publishedAt">{{ date(post.publishedAt, i18n.isUr()) }}</time>
                      </p>
                      <h2 class="mt-2 font-display text-xl font-bold leading-snug text-forest">
                        <a [routerLink]="['/blog', post.slug]" class="hover:underline" [attr.lang]="showUrdu(post) ? null : 'en'" [attr.dir]="showUrdu(post) ? null : 'ltr'">{{ title(post) }}</a>
                      </h2>
                      <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-warm" [attr.lang]="showUrdu(post) ? null : 'en'" [attr.dir]="showUrdu(post) ? null : 'ltr'">{{ excerpt(post) }}</p>
                      <p class="mt-4 flex items-center justify-between text-sm">
                        <a
                          [routerLink]="['/blog', post.slug]"
                          class="font-semibold text-forest underline decoration-gold/50 underline-offset-2"
                        >
                          {{ i18n.t('blog.read') }}
                        </a>
                        <span class="text-slate-warm/80">{{ minutes(showUrdu(post) ? post.contentHtmlUr! : post.contentHtml) }} {{ i18n.t('blog.minRead') }}</span>
                      </p>
                    </div>
                  </article>
                </li>
              }
            </ul>
          } @else if (blog.loaded()) {
            <p class="mx-auto mt-14 max-w-xl text-center text-slate-warm">
              @if (blog.failed()) {
                {{ i18n.t('blog.failed') }}
              } @else {
                {{ i18n.t('blog.empty') }}
                <a routerLink="/zakat/what-is-zakat" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2">{{ i18n.t('blog.whatIsZakat') }}</a>
                {{ i18n.t('blog.orSee') }} <a routerLink="/work" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2">{{ i18n.t('blog.ourWork') }}</a>.
              }
            </p>
          }

          <div class="mx-auto mt-16 max-w-3xl rounded-2xl border border-mist bg-sand/40 px-6 py-8 text-center sm:px-10">
            <h2 class="font-display text-xl font-bold text-forest sm:text-2xl">{{ i18n.t('blog.support') }}</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-warm sm:text-base">
              {{ i18n.t('blog.supportText') }}
            </p>
            <a
              routerLink="/donate"
              class="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-6 py-2.5 text-sm font-semibold text-forest"
            >
              {{ i18n.t('blog.donate') }}
            </a>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class BlogPage implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly blog = inject(BlogService);
  protected readonly date = formatBlogDate;
  protected readonly minutes = readingMinutes;

  /** Urdu text is shown when Urdu is active and the article has it; otherwise the English text. */
  protected showUrdu(post: BlogPost): boolean {
    return this.i18n.isUr() && hasUrdu(post);
  }

  protected title(post: BlogPost): string {
    return this.showUrdu(post) ? post.titleUr! : post.title;
  }

  protected excerpt(post: BlogPost): string {
    return this.showUrdu(post) ? post.excerptUr! : post.excerpt;
  }

  ngOnInit(): void {
    void this.blog.load();
  }
}
