import { Injectable, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from './language.service';

export interface TranslateOption {
  readonly code: string;
  readonly label: string;
}

/** Languages offered by the footer Google Translate control (from English). */
export const GOOGLE_TRANSLATE_OPTIONS: readonly TranslateOption[] = [
  { code: 'ar', label: 'العربية — Arabic' },
  { code: 'fr', label: 'Français — French' },
  { code: 'es', label: 'Español — Spanish' },
  { code: 'de', label: 'Deutsch — German' },
  { code: 'it', label: 'Italiano — Italian' },
  { code: 'tr', label: 'Türkçe — Turkish' },
  { code: 'bn', label: 'বাংলা — Bengali' },
  { code: 'ps', label: 'پښتو — Pashto' },
  { code: 'so', label: 'Soomaali — Somali' },
  { code: 'pl', label: 'Polski — Polish' },
  { code: 'ro', label: 'Română — Romanian' },
  { code: 'pt', label: 'Português — Portuguese' },
  { code: 'nl', label: 'Nederlands — Dutch' },
  { code: 'zh-CN', label: '中文 — Chinese' },
];

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
const HIDDEN_HOST_ID = 'nagina-google-translate-engine';
const LANGS = GOOGLE_TRANSLATE_OPTIONS.map((o) => o.code).join(',');

/**
 * Footer language picker drives Google Translate via the googtrans cookie.
 * A hidden Google element keeps the engine alive; our own <select> is always clickable.
 */
@Injectable({ providedIn: 'root' })
export class GoogleTranslateService {
  private readonly i18n = inject(LanguageService);
  private readonly router = inject(Router);
  private engineReady = false;

  constructor() {
    afterNextRender(() => {
      this.ensureHiddenHost();
      // If a translation cookie is already set, load the engine so Google can apply it.
      if (this.readCookieLang()) {
        this.ensureScript();
      }
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          if (this.readCookieLang()) {
            queueMicrotask(() => this.nudgeCombo());
          }
        });
    });
  }

  /** Current Google language code from cookie, or empty if none. */
  currentCode(): string {
    return this.readCookieLang() ?? '';
  }

  /**
   * Apply an international language (from English). Empty code clears translation.
   * Reloads once so Google Website Translator applies reliably.
   */
  applyLanguage(code: string): void {
    if (!code) {
      this.clearTranslation(true);
      return;
    }

    // Never machine-translate our native Urdu — switch to English first.
    if (this.i18n.isUr()) {
      this.i18n.setLang('en');
    }

    this.writeGoogTransCookie(`/en/${code}`);
    // Hash helps some browsers pick up the pair on first load.
    const hash = `#googtrans(en|${code})`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.location.reload();
  }

  /** Clear Google Translate and optionally reload. */
  clearTranslation(reload = false): void {
    this.i18n.clearGoogleTranslate();
    this.writeGoogTransCookie('');
    if (reload) {
      const url = window.location.pathname + window.location.search;
      window.location.replace(url);
    }
  }

  private ensureHiddenHost(): void {
    if (document.getElementById(HIDDEN_HOST_ID)) {
      return;
    }
    const host = document.createElement('div');
    host.id = HIDDEN_HOST_ID;
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText =
      'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
    document.body.appendChild(host);
  }

  private ensureScript(): void {
    this.ensureHiddenHost();
    if (document.getElementById(SCRIPT_ID)) {
      this.initEngine();
      return;
    }
    window.googleTranslateElementInit = () => this.initEngine();
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  private initEngine(): void {
    if (this.engineReady || !window.google?.translate?.TranslateElement) {
      return;
    }
    const host = document.getElementById(HIDDEN_HOST_ID);
    if (!host) {
      return;
    }
    host.innerHTML = '';
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: LANGS,
        autoDisplay: false,
      },
      HIDDEN_HOST_ID,
    );
    this.engineReady = true;
    queueMicrotask(() => this.nudgeCombo());
  }

  private writeGoogTransCookie(value: string): void {
    const expire = value
      ? ''
      : 'expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    const payloads = [
      `googtrans=${value};${expire}path=/`,
      `googtrans=${value};${expire}path=/;domain=${window.location.hostname}`,
    ];
    // Also try parent domain for GitHub Pages custom domains.
    const parts = window.location.hostname.split('.');
    if (parts.length > 2) {
      payloads.push(
        `googtrans=${value};${expire}path=/;domain=.${parts.slice(-2).join('.')}`,
      );
    }
    for (const p of payloads) {
      document.cookie = p;
    }
  }

  private readCookieLang(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (!match) {
      return null;
    }
    const raw = decodeURIComponent(match[1]);
    // Formats: /en/fr or en/fr
    const parts = raw.replace(/^\//, '').split('/');
    if (parts.length >= 2 && parts[1]) {
      return parts[1];
    }
    return null;
  }

  private nudgeCombo(): void {
    const code = this.readCookieLang();
    if (!code) {
      return;
    }
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!combo) {
      return;
    }
    if (combo.value !== code) {
      combo.value = code;
    }
    combo.dispatchEvent(new Event('change'));
  }
}
