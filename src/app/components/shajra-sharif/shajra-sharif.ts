import { Component, HostListener, computed, signal } from '@angular/core';

export interface ShajraPage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly captionUr: string;
}

/** Pages follow the screenshot timestamps: 4:34:25, 4:34:45, 4:35:27, 4:35:46. */
export const SHAJRA_PAGES: readonly ShajraPage[] = [
  {
    id: 'page-1',
    src: 'gallery/shajra/01.jpg',
    alt: 'Page 1 of the Shajra Sharif: opening hamd, title Naqshbandiya Mujaddidiya Yusufiya, and verses for the Prophet, Ahl-e-Bait, Sahaba, Abu Bakr Siddiq, Salman Farsi and Hazrat Qasim',
    caption: 'Opening — the Prophet ﷺ, Ahl-e-Bait and Sahaba',
    captionUr: 'آغاز — حضور ﷺ، اہل بیت اور صحابہ',
  },
  {
    id: 'page-2',
    src: 'gallery/shajra/02.jpg',
    alt: 'Page 2 of the Shajra Sharif: verses from Imam Jaʿfar al-Sadiq through Khwaja Darwish in the Naqshbandi chain',
    caption: 'Imam Jaʿfar al-Sadiq to Khwaja Darwish',
    captionUr: 'امام جعفر صادق تا خواجہ درویش',
  },
  {
    id: 'page-3',
    src: 'gallery/shajra/03.jpg',
    alt: 'Page 3 of the Shajra Sharif: verses for Khwaja Amkanagi, Baqi Billah, Mujaddid Alf Thani, and the mashayikh of Chora Sharif',
    caption: 'Mujaddid Alf Thani to Chora Sharif',
    captionUr: 'مجدد الف ثانی تا چورہ شریف',
  },
  {
    id: 'page-4',
    src: 'gallery/shajra/04.jpg',
    alt: 'Page 4 of the Shajra Sharif: closing verses including Murshid Yusuf Nagina',
    caption: 'Closing — Murshid Yusuf Nagina',
    captionUr: 'اختتام — مرشد یوسف نگینہ',
  },
];

@Component({
  selector: 'app-shajra-sharif',
  templateUrl: './shajra-sharif.html',
})
export class ShajraSharif {
  protected readonly pages = SHAJRA_PAGES;
  protected readonly activeIndex = signal<number | null>(null);
  protected readonly activePage = computed(() => {
    const index = this.activeIndex();
    return index === null ? null : this.pages[index] ?? null;
  });

  protected openPage(index: number): void {
    this.activeIndex.set(index);
    document.body.style.overflow = 'hidden';
  }

  protected closePage(): void {
    this.activeIndex.set(null);
    document.body.style.overflow = '';
  }

  protected showPrev(): void {
    const index = this.activeIndex();
    if (index !== null && index > 0) {
      this.activeIndex.set(index - 1);
    }
  }

  protected showNext(): void {
    const index = this.activeIndex();
    if (index !== null && index < this.pages.length - 1) {
      this.activeIndex.set(index + 1);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activePage()) {
      this.closePage();
    }
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.activePage()) {
      this.showPrev();
    }
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.activePage()) {
      this.showNext();
    }
  }
}
