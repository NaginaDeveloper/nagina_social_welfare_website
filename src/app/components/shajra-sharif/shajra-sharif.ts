import { Component, HostListener, computed, signal } from '@angular/core';

export interface ShajraSaint {
  readonly name: string;
  readonly title?: string;
  /** رحمۃ اللہ علیہ / علیہم — mashayikh only, never Huzoor ﷺ, Ahl-e-Bait, or Sahaba. */
  readonly honorific?: string;
}

export interface ShajraPage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  readonly captionUr: string;
  readonly saints: readonly ShajraSaint[];
  readonly honour?: boolean;
}

/** Pages follow the screenshot timestamps, then the Nagina honour poster. */
export const SHAJRA_PAGES: readonly ShajraPage[] = [
  {
    id: 'page-1',
    src: 'gallery/shajra/01.jpg',
    alt: 'Page 1 of the Shajra Sharif: opening hamd, title Naqshbandiya Mujaddidiya Yusufiya, and verses for the Prophet, Ahl-e-Bait, Sahaba, Abu Bakr Siddiq, Salman Farsi and Imam Qasim',
    caption: 'Opening — the Prophet ﷺ, Ahl-e-Bait and Sahaba',
    captionUr: 'آغاز — حضور ﷺ، اہل بیت اور صحابہ',
    saints: [
      { name: 'Muhammad Rasool Allah ﷺ', title: 'Sayyid of the two worlds, King of the Messengers' },
      { name: 'The Ahl-e-Bait', title: 'The blessed family of Mustafa ﷺ' },
      { name: 'The noble Companions', title: 'All the Sahaba, may Allah be pleased with them' },
      { name: 'Abu Bakr Siddiq', title: 'as-Siddiq al-Akbar, may Allah be pleased with him' },
      { name: 'Salman Farsi', title: 'Pride of the holy ones, may Allah be pleased with him' },
      { name: 'Imam Qasim bin Abu Bakr Siddiq', honorific: 'رحمۃ اللہ علیہ' },
    ],
  },
  {
    id: 'page-2',
    src: 'gallery/shajra/02.jpg',
    alt: 'Page 2 of the Shajra Sharif: verses from Imam Jafar Sadiq through Darwish Muhammad in the Naqshbandi chain',
    caption: 'Imam Jafar Sadiq to Darwish Muhammad',
    captionUr: 'امام جعفر صادق تا خواجہ درویش',
    saints: [
      { name: 'Imam Jafar Sadiq', title: 'Imam of the truthful, may Allah be pleased with him' },
      { name: 'Bayazid Bastami', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Abul Hasan Kharqani', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Abu Ali Farmadi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Yusuf Hamdani', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Abdul Khaliq Ghajadwani', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Arif Riwgari', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Mahmood Anjir Faghnawi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Azizan Ali Ramitani', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Baba Samasi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Sayyid Amir Kulal', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Bahauddin Naqshbandi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Yaqub Charkhi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Ubaidullah Ahrar', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Zahid', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Darwish Muhammad', honorific: 'رحمۃ اللہ علیہ' },
    ],
  },
  {
    id: 'page-3',
    src: 'gallery/shajra/03.jpg',
    alt: 'Page 3 of the Shajra Sharif: verses for Muhammad Amkanagi, Muhammad Baqi Billah, Ahmad Faruqi Sirhindi, and Noor Muhammad Chorahi',
    caption: 'Mujaddid Alf Thani to Noor Muhammad Chorahi',
    captionUr: 'مجدد الف ثانی تا نور محمد چوراہی',
    saints: [
      { name: 'Muhammad Amkanagi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Baqi Billah', honorific: 'رحمۃ اللہ علیہ' },
      {
        name: 'Ahmad Faruqi Sirhindi',
        title: 'Imam Rabbani Mujaddid Alf Thani',
        honorific: 'رحمۃ اللہ علیہ',
      },
      { name: 'Muhammad Masoom', title: 'Qayyum of the age', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Hujjatullah', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Muhammad Zubair', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Qutb-ud-Din', title: 'Qutb of the gnostics', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Jamalullah', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Shah Isa', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Noor Muhammad Chorahi', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Bawa Ji Khwaja Faqir', honorific: 'رحمۃ اللہ علیہ' },
      {
        name: 'The saints of Chora Sharif',
        title: 'Khak-e-Chora, like stars of the galaxy',
        honorific: 'رحمۃ اللہ علیہم',
      },
    ],
  },
  {
    id: 'page-4',
    src: 'gallery/shajra/04.jpg',
    alt: 'Page 4 of the Shajra Sharif: later mashayikh of the Yusufi Nagina chain',
    caption: 'The later mashayikh',
    captionUr: 'بعد کے مشائخ',
    saints: [
      { name: 'Shah La-Sani', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Ali Akbar', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Ali Asghar', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Shah Jamaat Ali', honorific: 'رحمۃ اللہ علیہ' },
      {
        name: 'Shah Muhammad Hussain',
        title: 'Pir of the perfect ones',
        honorific: 'رحمۃ اللہ علیہ',
      },
      { name: 'Amir-e-Millat', honorific: 'رحمۃ اللہ علیہ' },
      { name: 'Hafiz', honorific: 'رحمۃ اللہ علیہ' },
      {
        name: 'Murshid Haji Muhammad Yusuf Ali Nagina',
        title: 'eloquent guide',
        honorific: 'رحمۃ اللہ علیہ',
      },
    ],
  },
  {
    id: 'nagina',
    src: 'gallery/shajra/05-haji-muhammad-yusuf-ali-nagina.jpg',
    alt: 'Commemorative poster of Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
    caption: 'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
    captionUr: 'پیر طریقت رہبر شریعت حضرت حاجی محمد یوسف علی نگینہ رحمۃ اللہ علیہ',
    honour: true,
    saints: [
      {
        name: 'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
        honorific: 'رحمۃ اللہ علیہ',
      },
    ],
  },
];

@Component({
  selector: 'app-shajra-sharif',
  templateUrl: './shajra-sharif.html',
})
export class ShajraSharif {
  protected readonly pages = SHAJRA_PAGES;
  protected readonly heroSrc = 'gallery/shajra/00-hero.jpg';
  protected readonly heroOpen = signal(false);
  protected readonly activeIndex = signal<number | null>(null);
  protected readonly activePage = computed(() => {
    const index = this.activeIndex();
    return index === null ? null : this.pages[index] ?? null;
  });

  protected openPage(index: number): void {
    this.heroOpen.set(false);
    this.activeIndex.set(index);
    document.body.style.overflow = 'hidden';
  }

  protected openHero(): void {
    this.activeIndex.set(null);
    this.heroOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closePage(): void {
    this.activeIndex.set(null);
    this.heroOpen.set(false);
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
    if (this.activePage() || this.heroOpen()) {
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
