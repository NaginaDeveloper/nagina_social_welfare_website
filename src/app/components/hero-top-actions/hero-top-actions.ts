import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-hero-top-actions',
  imports: [RouterLink, Icon],
  templateUrl: './hero-top-actions.html',
})
export class HeroTopActions {
  protected readonly org = ORGANIZATION;
  protected readonly i18n = inject(LanguageService);
  private readonly launcher = inject(AssistantLauncherService);
  private readonly router = inject(Router);

  protected readonly currentPath = signal('/');

  constructor() {
    this.syncPath(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncPath(e.urlAfterRedirects));
  }

  protected openAssistant(): void {
    if (this.currentPath() === '/assistant') {
      return;
    }
    this.launcher.open();
  }

  private syncPath(url: string): void {
    const path = url.split('?')[0].split('#')[0] || '/';
    this.currentPath.set(path === '' ? '/' : path);
  }
}
