import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TRANSLATIONS_EN, type UiLang } from './translations';
import { isUrduPage, normalisePath, splitUrduPrefix, toUrduPath } from './urdu-routes';

const STORAGE_KEY = 'nagina-ui-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<UiLang>('en');
  readonly isUr = computed(() => this.lang() === 'ur');

  /** Urdu text, fetched the first time Urdu is chosen (or hinted at) and kept for the session. */
  private readonly urdu = signal<Record<string, string> | null>(null);
  private urduLoad: Promise<void> | null = null;

  constructor() {
    afterNextRender(() => {
      this.stripLeftoverMachineTranslate();
      const stored = this.readStored();
      if (this.isUr()) {
        // Opened on an Urdu page (/ur/…): the address wins over any saved choice.
        this.applyDocument(this.lang());
      } else if (stored === 'ur') {
        this.setLang('ur');
      } else {
        this.applyDocument(this.lang());
      }
    });
  }

  t(key: string): string {
    if (this.lang() === 'ur') {
      return this.urdu()?.[key] ?? TRANSLATIONS_EN[key] ?? key;
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

  /**
   * Runs before the first render (also during prerender): on a `/ur/…` address the Urdu
   * text is loaded and the language set first, so the page is drawn in Urdu from the start.
   */
  async initFromPath(pathname: string): Promise<void> {
    const split = splitUrduPrefix(pathname);
    if (!split.ur || !isUrduPage(split.path)) return;
    await this.loadUrdu();
    if (this.urdu()) {
      this.lang.set('ur');
      this.applyDocument('ur');
    }
  }

  /**
   * The address decides the language on every navigation: `/ur/…` shows Urdu, and an English
   * address of a page that has an Urdu twin shows English. Pages without a twin keep the
   * language the visitor chose. Called once from the root component.
   */
  followNavigation(router: Router): void {
    router.events.subscribe((event) => {
      if (!(event instanceof NavigationStart)) return;
      const split = splitUrduPrefix(event.url.split(/[?#]/)[0]);
      if (!isUrduPage(split.path)) return;
      this.setLangFromUrl(split.ur ? 'ur' : 'en');
    });
  }

  private setLangFromUrl(lang: UiLang): void {
    if (this.lang() === lang) return;
    if (lang === 'ur') void this.loadUrdu();
    this.lang.set(lang);
    this.applyDocument(lang);
  }

  /** The visitor chose a language (header toggle): load it, remember it and move the address bar to match. */
  setLang(lang: UiLang): void {
    if (lang === 'ur' && !this.urdu()) {
      // Switch once the text is here, so the page never shows raw keys.
      void this.loadUrdu().then(() => {
        if (this.urdu()) this.applyLang('ur');
      });
      return;
    }
    this.applyLang(lang);
  }

  private loadUrdu(): Promise<void> {
    this.urduLoad ??= import('./translations.ur')
      .then((m) => {
        this.urdu.set(m.TRANSLATIONS_UR);
      })
      .catch(() => {
        this.urduLoad = null;
      });
    return this.urduLoad;
  }

  private applyLang(lang: UiLang): void {
    this.lang.set(lang);
    this.applyDocument(lang);
    this.writeStored(lang);
    this.syncAddress(lang);
  }

  toggle(): void {
    this.setLang(this.lang() === 'en' ? 'ur' : 'en');
  }

  /** Moves between `/x/` and `/ur/x/` without a navigation, so the URL always matches the language. */
  private syncAddress(lang: UiLang): void {
    const win = this.doc.defaultView;
    if (!win) return;
    const { pathname, search, hash } = win.location;
    const split = splitUrduPrefix(pathname);
    if (!isUrduPage(split.path)) return;
    const target = lang === 'ur' ? toUrduPath(split.path) : split.path;
    if (target === normalisePath(pathname)) return;
    win.history.replaceState(win.history.state, '', target + search + hash);
  }

  private readStored(): UiLang | null {
    try {
      const stored = this.doc.defaultView?.localStorage.getItem(STORAGE_KEY);
      return stored === 'en' || stored === 'ur' ? stored : null;
    } catch {
      return null;
    }
  }

  private writeStored(lang: UiLang): void {
    try {
      this.doc.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage may be blocked.
    }
  }

  /** Clear leftover Google Translate cookies from older site versions. */
  private stripLeftoverMachineTranslate(): void {
    const win = this.doc.defaultView;
    if (!win) return;
    this.doc.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    this.doc.cookie =
      'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + win.location.hostname;
    this.doc.documentElement.classList.remove('translated-ltr', 'translated-rtl');
    if (win.location.hash.startsWith('#googtrans')) {
      win.history.replaceState(null, '', win.location.pathname + win.location.search);
    }
  }

  private applyDocument(lang: UiLang): void {
    const root = this.doc.documentElement;
    root.lang = lang === 'ur' ? 'ur' : 'en-GB';
    root.dir = lang === 'ur' ? 'rtl' : 'ltr';
    root.classList.toggle('urdu', lang === 'ur');
  }
}
