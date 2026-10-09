import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * GitHub Pages serves every route as a folder, so `/about` is a 301 to `/about/`.
 * Serialising router URLs with a trailing slash makes every link, and the address
 * bar after navigation, match the canonical URL and skips that redirect for crawlers.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const end = url.search(/[?#]/);
    const path = end === -1 ? url : url.slice(0, end);
    if (path.endsWith('/')) return url;
    return `${path}/${end === -1 ? '' : url.slice(end)}`;
  }
}
