import { Injectable, Injector, inject } from '@angular/core';
import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { LanguageService } from '../i18n/language.service';
import { isUrduPage, splitUrduPrefix, toUrduPath } from '../i18n/urdu-routes';

/**
 * GitHub Pages serves every route as a folder, so `/about` is a 301 to `/about/`.
 * Serialising router URLs with a trailing slash makes every link, and the address
 * bar after navigation, match the canonical URL and skips that redirect for crawlers.
 *
 * It also maps the Urdu twins: `/ur/about/` is parsed as the `/about/` route with the
 * language set to Urdu, and while Urdu is active the links to pages that have an Urdu
 * twin are written as `/ur/…`, so Urdu pages link to Urdu pages.
 */
@Injectable()
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  // Resolved lazily: LanguageService needs the Router, which needs this serializer.
  private readonly injector = inject(Injector);
  private language?: LanguageService;

  private get lang(): LanguageService {
    return (this.language ??= this.injector.get(LanguageService));
  }

  override parse(url: string): UrlTree {
    const end = url.search(/[?#]/);
    const path = end === -1 ? url : url.slice(0, end);
    const rest = end === -1 ? '' : url.slice(end);
    const split = splitUrduPrefix(path);
    // Pure: the language itself is set from the NavigationStart event (LanguageService.followNavigation).
    if (!split.ur || !isUrduPage(split.path)) return super.parse(url);
    // Hand the router the plain path without a trailing slash, as Location does for English URLs.
    const plain = split.path === '/' ? '/' : split.path.slice(0, -1);
    return super.parse(plain + rest);
  }

  override serialize(tree: UrlTree): string {
    const url = super.serialize(tree);
    const end = url.search(/[?#]/);
    const rest = end === -1 ? '' : url.slice(end);
    let path = end === -1 ? url : url.slice(0, end);
    if (!path.endsWith('/')) path = `${path}/`;
    if (this.lang.isUr() && isUrduPage(path)) path = toUrduPath(path);
    return path + rest;
  }
}
