import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { Router, TitleStrategy, UrlSerializer, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { LanguageService } from './i18n/language.service';
import { SeoTitleStrategy } from './seo/seo-title-strategy';
import { TrailingSlashUrlSerializer } from './utils/trailing-slash-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    // On /ur/… addresses the Urdu text is loaded before the first render (and before prerender).
    provideAppInitializer(() => {
      const language = inject(LanguageService);
      language.followNavigation(inject(Router));
      return language.initFromPath(inject(PlatformLocation).pathname);
    }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
