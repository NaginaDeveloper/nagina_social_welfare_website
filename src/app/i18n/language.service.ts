import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { TRANSLATIONS, type UiLang } from './translations';

const STORAGE_KEY = 'nagina-ui-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<UiLang>('en');
  readonly isUr = computed(() => this.lang() === 'ur');

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
    const lang = this.lang();
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
  }

  /** Pick English or Urdu text for bilingual fields. */
  pick(en: string, ur: string): string {
    return this.isUr() ? ur : en;
  }

  setLang(lang: UiLang): void {
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
