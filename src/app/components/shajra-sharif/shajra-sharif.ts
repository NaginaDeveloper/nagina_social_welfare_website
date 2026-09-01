import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import {
  SHAJRA_HONOUR,
  SHAJRA_ORDERS,
  SHAJRA_SILSILAS,
  SHAJRA_TITLE_PAGE,
  silsilaById,
  toEasternDigits,
  type ShajraPage,
  type ShajraSilsila,
} from './shajra-data';

export type { ShajraPage, ShajraSaint, ShajraSilsila } from './shajra-data';

type Lightbox =
  | { readonly kind: 'hero' }
  | { readonly kind: 'cover' }
  | { readonly kind: 'title' }
  | { readonly kind: 'honour' }
  | { readonly kind: 'page'; readonly silsilaIndex: number; readonly pageIndex: number };

@Component({
  selector: 'app-shajra-sharif',
  templateUrl: './shajra-sharif.html',
})
export class ShajraSharif {
  protected readonly i18n = inject(LanguageService);
  protected readonly orders = SHAJRA_ORDERS;
  protected readonly silsilas = SHAJRA_SILSILAS;
  protected readonly titlePage = SHAJRA_TITLE_PAGE;
  protected readonly honour = SHAJRA_HONOUR;
  protected readonly heroSrc = 'gallery/shajra/00-hero.jpg';
  protected readonly coverSrc = 'gallery/shajra/kashkool-e-yousufi-cover.jpg';
  protected readonly lightbox = signal<Lightbox | null>(null);

  protected readonly activePage = computed((): ShajraPage | null => {
    const box = this.lightbox();
    if (!box) {
      return null;
    }
    if (box.kind === 'cover') {
      return {
        id: 'kashkool-cover',
        src: this.coverSrc,
        alt: 'Cover of Kashkool e Yousufi, the book from which these Shajra pages are shown',
        caption: 'Kashkool e Yousufi',
        captionUr: 'کشکول یوسفی',
        saints: [],
      };
    }
    if (box.kind === 'title') {
      return this.titlePage;
    }
    if (box.kind === 'honour') {
      return this.honour;
    }
    if (box.kind === 'page') {
      return this.silsilas[box.silsilaIndex]?.pages[box.pageIndex] ?? null;
    }
    return null;
  });

  protected readonly heroOpen = computed(() => this.lightbox()?.kind === 'hero');

  protected silsilasForOrder(orderId: string): readonly ShajraSilsila[] {
    const order = this.orders.find((item) => item.id === orderId);
    return (order?.silsilaIds ?? []).map((id) => silsilaById(id));
  }

  protected kashkoolLabel(page: ShajraPage): string {
    const n = page.kashkoolPage;
    if (n == null) {
      return '';
    }
    const digits = this.i18n.isUr() ? toEasternDigits(n) : String(n);
    return this.i18n.t('shajra.kashkoolPage').replace('{n}', digits);
  }

  protected rangeLabel(start: number, end: number): string {
    if (this.i18n.isUr()) {
      return `${toEasternDigits(start)}–${toEasternDigits(end)}`;
    }
    return `${start}–${end}`;
  }

  protected openHero(): void {
    this.lightbox.set({ kind: 'hero' });
    document.body.style.overflow = 'hidden';
  }

  protected openCover(): void {
    this.lightbox.set({ kind: 'cover' });
    document.body.style.overflow = 'hidden';
  }

  protected openTitle(): void {
    this.lightbox.set({ kind: 'title' });
    document.body.style.overflow = 'hidden';
  }

  protected openHonour(): void {
    this.lightbox.set({ kind: 'honour' });
    document.body.style.overflow = 'hidden';
  }

  protected openPage(silsilaIndex: number, pageIndex: number): void {
    this.lightbox.set({ kind: 'page', silsilaIndex, pageIndex });
    document.body.style.overflow = 'hidden';
  }

  protected closePage(): void {
    this.lightbox.set(null);
    document.body.style.overflow = '';
  }

  protected showPrev(): void {
    const box = this.lightbox();
    if (box?.kind !== 'page' || box.pageIndex <= 0) {
      return;
    }
    this.lightbox.set({ kind: 'page', silsilaIndex: box.silsilaIndex, pageIndex: box.pageIndex - 1 });
  }

  protected showNext(): void {
    const box = this.lightbox();
    if (box?.kind !== 'page') {
      return;
    }
    const silsila = this.silsilas[box.silsilaIndex];
    if (!silsila || box.pageIndex >= silsila.pages.length - 1) {
      return;
    }
    this.lightbox.set({ kind: 'page', silsilaIndex: box.silsilaIndex, pageIndex: box.pageIndex + 1 });
  }

  protected canPrev(): boolean {
    const box = this.lightbox();
    return box?.kind === 'page' && box.pageIndex > 0;
  }

  protected canNext(): boolean {
    const box = this.lightbox();
    if (box?.kind !== 'page') {
      return false;
    }
    const silsila = this.silsilas[box.silsilaIndex];
    return !!silsila && box.pageIndex < silsila.pages.length - 1;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.lightbox()) {
      this.closePage();
    }
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.activePage() && this.lightbox()?.kind === 'page') {
      this.showPrev();
    }
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.activePage() && this.lightbox()?.kind === 'page') {
      this.showNext();
    }
  }
}
