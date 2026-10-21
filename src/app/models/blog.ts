/** One published article, as written in the admin panel's Website Blog (blog/catalog.json). */
export interface BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  /** Sanitised HTML from the admin editor (paragraphs, headings, lists, links). */
  readonly contentHtml: string;
  readonly topic: string;
  readonly author: string;
  /** Publish date, YYYY-MM-DD. */
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly image: { readonly url: string; readonly alt: string };
}

export interface BlogCatalog {
  readonly version?: number;
  readonly generatedAt?: string;
  readonly posts?: readonly BlogPost[];
}

/** Keeps only complete articles, newest first. */
export function parseBlogCatalog(catalog: BlogCatalog | null | undefined): BlogPost[] {
  const posts = (catalog?.posts ?? []).filter(
    (p) => !!p?.slug && !!p.title && !!p.image?.url && !!p.publishedAt,
  );
  return [...posts].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

/** "2026-10-21" -> "21 October 2026" (no time zone surprises). */
export function formatBlogDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Words in the article body (tags and entities removed). */
export function blogWordCount(html: string): number {
  const text = String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

/** Reading time at about 200 words a minute, never less than one minute. */
export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(blogWordCount(html) / 200));
}

/** Other articles worth reading next: same topic first, then the newest. */
export function relatedPosts(posts: readonly BlogPost[], current: BlogPost, limit = 3): BlogPost[] {
  const others = posts.filter((p) => p.slug !== current.slug);
  const sameTopic = others.filter((p) => !!current.topic && p.topic === current.topic);
  const rest = others.filter((p) => !sameTopic.includes(p));
  return [...sameTopic, ...rest].slice(0, limit);
}
