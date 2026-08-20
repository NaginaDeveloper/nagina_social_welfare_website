import { Injectable, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from './language.service';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout?: number;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

const SCRIPT_ID = 'google-translate-script';
const HOST_IDS = [
  'nagina-google-translate-desktop',
  'nagina-google-translate-mobile',
] as const;
const LANGS = 'ar,fr,es,de,it,tr,bn,ps,so,pl,ro,pt,nl,zh-CN';

/**
 * Loads Google Website Translator once and re-applies after SPA navigations.
 * Always translates from English. Native Urdu uses LanguageService, not Google.
 */
@Injectable({ providedIn: 'root' })
export class GoogleTranslateService {
  private readonly i18n = inject(LanguageService);
  private readonly router = inject(Router);
  private mountedHostId: string | null = null;

  constructor() {
    afterNextRender(() => {
      this.ensureScript();
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          queueMicrotask(() => {
            this.mountPreferred();
            this.nudgeCombo();
          });
        });
    });
  }

  /** Switch to English first (native), then let Google translate. */
  prepareForInternational(preferredHostId?: string): void {
    if (this.i18n.isUr()) {
      this.i18n.setLang('en');
    }
    this.ensureScript();
    queueMicrotask(() => this.mountPreferred(preferredHostId));
  }

  /** Remount into a newly visible host (e.g. mobile menu opened). */
  remount(preferredHostId?: string): void {
    this.mountPreferred(preferredHostId);
  }

  private ensureScript(): void {
    if (typeof document === 'undefined') {
      return;
    }
    if (document.getElementById(SCRIPT_ID)) {
      this.mountPreferred();
      return;
    }
    window.googleTranslateElementInit = () => this.mountPreferred();
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  private mountPreferred(preferredHostId?: string): void {
    if (!window.google?.translate?.TranslateElement) {
      return;
    }
    const host = this.resolveHost(preferredHostId);
    if (!host) {
      return;
    }
    if (this.mountedHostId === host.id && host.childElementCount > 0) {
      return;
    }
    // Clear any previous widget hosts so only one combo exists.
    for (const id of HOST_IDS) {
      const el = document.getElementById(id);
      if (el && el !== host) {
        el.innerHTML = '';
      }
    }
    host.innerHTML = '';
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: LANGS,
        autoDisplay: false,
      },
      host.id,
    );
    this.mountedHostId = host.id;
  }

  private resolveHost(preferredHostId?: string): HTMLElement | null {
    if (preferredHostId) {
      const preferred = document.getElementById(preferredHostId);
      if (preferred) {
        return preferred;
      }
    }
    for (const id of HOST_IDS) {
      const el = document.getElementById(id);
      if (el && el.getClientRects().length > 0) {
        return el;
      }
    }
    for (const id of HOST_IDS) {
      const el = document.getElementById(id);
      if (el) {
        return el;
      }
    }
    return null;
  }

  private nudgeCombo(): void {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!combo || !combo.value) {
      return;
    }
    combo.dispatchEvent(new Event('change'));
  }
}
