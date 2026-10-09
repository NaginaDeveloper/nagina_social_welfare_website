import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { TRANSLATIONS_EN, type UiLang } from './translations';

const STORAGE_KEY = 'nagina-ui-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<UiLang>('en');
  readonly isUr = computed(() => this.lang() === 'ur');

  /** Urdu text, fetched the first time Urdu is chosen (or hinted at) and kept for the session. */
  private urdu: Record<string, string> | null = null;
  private urduLoad: Promise<void> | null = null;

  constructor() {
    afterNextRender(() => {
      this.stripLeftoverMachineTranslate();
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ur') {
        this.setLang(stored);
      } else {
        this.applyDocument(this.lang());
      }
    });
  }

  t(key: string): string {
    if (this.lang() === 'ur') {
      return this.urdu?.[key] ?? TRANSLATIONS_EN[key] ?? key;
    }
    return TRANSLATIONS_EN[key] ?? key;
  }

  /** Pick English or Urdu text for bilingual fields. */
  pick(en: string, ur: string): string {
    return this.isUr() ? ur : en;
  }

  /** Starts fetching the Urdu text so switching to Urdu is instant (call on hover or focus of the toggle). */
  preloadUrdu(): void {
    void this.loadUrdu();
  }

  setLang(lang: UiLang): void {
    if (lang === 'ur' && !this.urdu) {
      // Switch once the text is here, so the page never shows raw keys.
      void this.loadUrdu().then(() => {
        if (this.urdu) this.applyLang('ur');
      });
      return;
    }
    this.applyLang(lang);
  }

  private loadUrdu(): Promise<void> {
    this.urduLoad ??= import('./translations.ur')
      .then((m) => {
        this.urdu = m.TRANSLATIONS_UR;
      })
      .catch(() => {
        this.urduLoad = null;
      });
    return this.urduLoad;
  }

  private applyLang(lang: UiLang): void {
    this.lang.set(lang);
    this.applyDocument(lang);
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage may be blocked.
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'en' ? 'ur' : 'en');
  }

  /** Clear leftover Google Translate cookies from older site versions. */
  private stripLeftoverMachineTranslate(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    document.cookie =
      'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' +
      window.location.hostname;
    document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
    if (window.location.hash.startsWith('#googtrans')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  private applyDocument(lang: UiLang): void {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.lang = lang === 'ur' ? 'ur' : 'en-GB';
    root.dir = lang === 'ur' ? 'rtl' : 'ltr';
    root.classList.toggle('urdu', lang === 'ur');
  }
}
