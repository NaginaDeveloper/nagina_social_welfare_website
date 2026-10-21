import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../page-shell';
import { BlogService } from '../../services/blog.service';
import { formatBlogDate, readingMinutes } from '../../models/blog';

@Component({
  selector: 'app-blog-page',
  imports: [PageShell, RouterLink],
  template: `
    <app-page-shell title="Blog">
      <section class="relative overflow-hidden bg-cream py-20 sm:py-28">
        <div class="geo-pattern absolute inset-0 opacity-15" aria-hidden="true"></div>
        <div class="relative site-wrap">
          <div class="mx-auto max-w-3xl text-center">
            <span class="mb-4 inline-block eyebrow">Blog</span>
            <h1 class="page-title">Articles on Zakat, Sadaqah and Islamic education</h1>
            <p class="page-lead mx-auto">
              Guidance and reflections from Nagina Social Welfare UK, a registered charity with
              Madrasas in Peterborough and Manchester.
            </p>
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
                        <time [attr.datetime]="post.publishedAt">{{ date(post.publishedAt) }}</time>
                      </p>
                      <h2 class="mt-2 font-display text-xl font-bold leading-snug text-forest">
                        <a [routerLink]="['/blog', post.slug]" class="hover:underline">{{ post.title }}</a>
                      </h2>
                      <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-warm">{{ post.excerpt }}</p>
                      <p class="mt-4 flex items-center justify-between text-sm">
                        <a
                          [routerLink]="['/blog', post.slug]"
                          class="font-semibold text-forest underline decoration-gold/50 underline-offset-2"
                        >
                          Read article
                        </a>
                        <span class="text-slate-warm/80">{{ minutes(post.contentHtml) }} min read</span>
                      </p>
                    </div>
                  </article>
                </li>
              }
            </ul>
          } @else if (blog.loaded()) {
            <p class="mx-auto mt-14 max-w-xl text-center text-slate-warm">
              @if (blog.failed()) {
                We could not load the articles just now. Please try again in a moment.
              } @else {
                New articles are on their way. In the meantime, you can read about
                <a routerLink="/zakat/what-is-zakat" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2">what Zakat is</a>
                or see <a routerLink="/work" class="font-semibold text-forest underline decoration-gold/50 underline-offset-2">our work</a>.
              }
            </p>
          }

          <div class="mx-auto mt-16 max-w-3xl rounded-2xl border border-mist bg-sand/40 px-6 py-8 text-center sm:px-10">
            <h2 class="font-display text-xl font-bold text-forest sm:text-2xl">Support our work</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-warm sm:text-base">
              Your Zakat and Sadaqah fund Islamic education at our Madrasas and community welfare across the UK.
            </p>
            <a
              routerLink="/donate"
              class="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-gold px-6 py-2.5 text-sm font-semibold text-forest"
            >
              Donate
            </a>
          </div>
        </div>
      </section>
    </app-page-shell>
  `,
})
export class BlogPage implements OnInit {
  protected readonly blog = inject(BlogService);
  protected readonly date = formatBlogDate;
  protected readonly minutes = readingMinutes;

  ngOnInit(): void {
    void this.blog.load();
  }
}
