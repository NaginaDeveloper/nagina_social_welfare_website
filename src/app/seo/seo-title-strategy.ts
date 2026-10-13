import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

/**
 * SeoService sets the title for every page that carries `seo` route data, in Urdu on the
 * /ur/ pages. The router's own title would put the English title back, so it only
 * handles routes that have no `seo` data.
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    if (hasSeoData(snapshot.root)) return;
    const title = this.buildTitle(snapshot);
    if (title !== undefined) this.title.setTitle(title);
  }
}

function hasSeoData(route: ActivatedRouteSnapshot | null): boolean {
  while (route) {
    if (route.data['seo']) return true;
    route = route.firstChild;
  }
  return false;
}
