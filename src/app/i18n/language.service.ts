import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { TRANSLATIONS, type UiLang } from './translations';

const STORAGE_KEY = 'nagina-ui-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<UiLang>('en');
  readonly isUr = computed(() => this.lang() === 'ur');

  constructor() {
    afterNextRender(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ur') {
        this.setLang(stored);
      }
    });
  }

  t(key: string): string {
    const lang = this.lang();
    return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
  }

  setLang(lang: UiLang): void {
    this.lang.set(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'ur' ? 'ur' : 'en-GB';
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage may be blocked.
    }
  }

  toggle(): void {
    this.setLang(this.lang() === 'en' ? 'ur' : 'en');
  }
}
