import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BLOG_CATALOG_URL } from '../config/blog.config';
import { parseBlogCatalog, type BlogCatalog, type BlogPost } from '../models/blog';

/** Articles rendered into the prerendered page, so hydration starts with them. */
const BLOG_STATE = makeStateKey<BlogPost[]>('nagina-blog');

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly transfer = inject(TransferState);
  private readonly postsSignal = signal<BlogPost[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly failedSignal = signal(false);
  private readonly freshSignal = signal(false);
  private loadPromise: Promise<void> | null = null;

  readonly posts = this.postsSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly failed = this.failedSignal.asReadonly();
  /** True once the live catalog has been read (or has failed), as opposed to only the prerendered copy. */
  readonly fresh = this.freshSignal.asReadonly();

  constructor() {
    const saved = this.transfer.get(BLOG_STATE, null);
    if (saved) {
      this.postsSignal.set(saved);
      this.loadedSignal.set(true);
    }
  }

  bySlug(slug: string | null | undefined): BlogPost | null {
    const key = String(slug ?? '').trim().toLowerCase();
    return this.postsSignal().find((p) => p.slug === key) ?? null;
  }

  /**
   * Loads the catalog once. In the browser an already-rendered list is refreshed in the
   * background, so an article published after the last website release still appears.
   */
  load(): Promise<void> {
    this.loadPromise ??= this.fetch();
    return this.loadPromise;
  }

  /** Resolves at once when the prerendered list is already here (refreshing it in the background). */
  ready(): Promise<void> {
    if (this.loadedSignal()) {
      void this.load();
      return Promise.resolve();
    }
    return this.load();
  }

  /** An article by slug, waiting for the live catalog when the prerendered list does not have it. */
  async find(slug: string | null | undefined): Promise<BlogPost | null> {
    await this.ready();
    return this.bySlug(slug) ?? (await this.load().then(() => this.bySlug(slug)));
  }

  private async fetch(): Promise<void> {
    const hadPrerendered = this.loadedSignal();
    try {
      // transferCache off: Angular would otherwise replay the prerender-time response in the browser,
      // and the point of this request is to pick up articles published since the last release.
      const catalog = await firstValueFrom(
        this.http.get<BlogCatalog>(BLOG_CATALOG_URL, { transferCache: false }),
      );
      const posts = parseBlogCatalog(catalog);
      this.postsSignal.set(posts);
      this.failedSignal.set(false);
      if (!this.browser) this.transfer.set(BLOG_STATE, posts);
    } catch (err) {
      // Keep what the prerendered page already showed. A failure is only shown to a visitor's browser;
      // the prerendered page falls back to the neutral "on their way" text.
      if (!hadPrerendered && this.browser) {
        this.failedSignal.set(true);
        console.error(err);
      }
    } finally {
      this.loadedSignal.set(true);
      this.freshSignal.set(true);
    }
  }
}
