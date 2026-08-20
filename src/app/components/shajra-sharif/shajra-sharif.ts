import { Component, HostListener, computed, signal } from '@angular/core';

export interface ShajraSaint {
  readonly name: string;
  readonly title?: string;
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
      { name: 'Prophet Muhammad ﷺ', title: 'Sayyid of the two worlds, King of the Messengers' },
      { name: 'The Ahl-e-Bait', title: 'The blessed family of Mustafa ﷺ' },
      { name: 'The noble Companions', title: 'All the Sahaba, may Allah be pleased with them' },
      { name: 'Sayyiduna Abu Bakr as-Siddiq', title: 'as-Siddiq al-Akbar, may Allah be pleased with him' },
      { name: 'Sayyiduna Salman al-Farsi', title: 'Pride of the holy ones, may Allah be pleased with him' },
      { name: 'Imam Qasim ibn Muhammad', title: 'may Allah be pleased with him' },
    ],
  },
  {
    id: 'page-2',
    src: 'gallery/shajra/02.jpg',
    alt: 'Page 2 of the Shajra Sharif: verses from Imam Jaʿfar as-Sadiq through Khwaja Darwish Muhammad in the Naqshbandi chain',
    caption: 'Imam Jaʿfar as-Sadiq to Khwaja Darwish',
    captionUr: 'امام جعفر صادق تا خواجہ درویش',
    saints: [
      { name: 'Imam Jaʿfar as-Sadiq', title: 'Imam of the truthful, may Allah be pleased with him' },
      { name: 'Khwaja Bayazid Bastami', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Abul Hasan al-Kharaqani', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Abu Ali al-Farmadi', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Yusuf al-Hamadani', title: 'Murshid Yusuf, may Allah be pleased with him' },
      { name: 'Khwaja Abdul Khaliq Ghajdawani', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Arif ar-Riwgari', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Mahmood Anjir Faghnawi', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Ali ar-Ramitani', title: 'Azizan, may Allah be pleased with him' },
      { name: 'Muhammad Baba as-Samasi', title: 'may Allah be pleased with him' },
      { name: 'Sayyid Amir Kulal', title: 'may Allah be pleased with him' },
      { name: 'Shah Baha-ud-Din Naqshband', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Yaʿqub Charkhi', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Ubaydullah Ahrar', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Muhammad Zahid', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Darwish Muhammad', title: 'may Allah be pleased with him' },
    ],
  },
  {
    id: 'page-3',
    src: 'gallery/shajra/03.jpg',
    alt: 'Page 3 of the Shajra Sharif: verses for Khwaja Amkanagi, Baqi Billah, Mujaddid Alf Thani, and the mashayikh of Chora Sharif',
    caption: 'Mujaddid Alf Thani to Chora Sharif',
    captionUr: 'مجدد الف ثانی تا چورہ شریف',
    saints: [
      { name: 'Khwaja Muhammad Amkanagi', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Baqi Billah', title: 'may Allah be pleased with him' },
      {
        name: 'Imam Rabbani Mujaddid Alf Thani',
        title: 'Shaykh Ahmad Sirhindi, may Allah be pleased with him',
      },
      { name: 'Khwaja Muhammad Maʿsum', title: 'Qayyum of the age, may Allah be pleased with him' },
      { name: 'Khwaja Hujjatullah', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Muhammad Zubair', title: 'may Allah be pleased with him' },
      { name: 'Khwaja Qutb-ud-Din', title: 'Qutb of the gnostics, may Allah be pleased with him' },
      { name: 'Shah Jamalullah', title: 'pride of the moon and rank, may Allah be pleased with him' },
      { name: 'Sayyid Isa', title: 'refuge of the helpless, may Allah be pleased with him' },
      { name: 'Hazrat Nur Muhammad', title: 'light of the world, may Allah be pleased with him' },
      { name: 'Bawa Ji Khwaja Faqir', title: 'may Allah be pleased with him' },
      { name: 'The saints of Chora Sharif', title: 'Khak-e-Chora, like stars of the galaxy' },
    ],
  },
  {
    id: 'page-4',
    src: 'gallery/shajra/04.jpg',
    alt: 'Page 4 of the Shajra Sharif: later mashayikh of the Yusufi Nagina chain',
    caption: 'The later mashayikh',
    captionUr: 'بعد کے مشائخ',
    saints: [
      { name: 'Shah La-Sani', title: 'may Allah be pleased with him' },
      { name: 'Ali Akbar', title: 'may Allah be pleased with him' },
      { name: 'Ali Asghar', title: 'may Allah be pleased with him' },
      { name: 'Shah Jamaat Ali', title: 'may Allah be pleased with him' },
      {
        name: 'Shah Muhammad Hussain',
        title: 'Pir of the perfect ones, may Allah be pleased with him',
      },
      { name: 'Amir-e-Millat', title: 'may Allah be pleased with him' },
      { name: 'Hafiz', title: 'may Allah be pleased with him' },
      {
        name: 'Murshid Haji Muhammad Yusuf Ali Nagina',
        title: 'eloquent guide, may Allah have mercy on him',
      },
    ],
  },
  {
    id: 'nagina',
    src: 'gallery/shajra/05-haji-muhammad-yusuf-ali-nagina.jpg',
    alt: 'Commemorative poster of Haji Muhammad Yusuf Ali Nagina, Pir-e-Tariqat of Astana Aliya Peelay Gujran Sharif, Faisalabad, and Jamia Masjid Nagina',
    caption: 'Pir-e-Tariqat · Rehbar-e-Shariat · Jamia Masjid Nagina',
    captionUr: 'حضرت حاجی محمد یوسف علی نگینہ',
    honour: true,
    saints: [
      {
        name: 'Haji Muhammad Yusuf Ali Nagina',
        title: 'Hazrat Qibla Allama Maulana',
      },
      { name: 'Pir-e-Tariqat, Rehbar-e-Shariat', title: 'spiritual guide and leader of Shariah' },
      {
        name: 'Distinguished man of letters and poet of Ahl-e-Sunnat',
        title: 'preacher of Islam, servant of Deen-e-Islam',
      },
      {
        name: 'Astana Aliya Peelay Gujran Sharif',
        title: 'Chak 176 GB, Tehsil Samundri, District Faisalabad',
      },
      { name: 'Jamia Masjid Nagina', title: 'the house of gathering named in his honour' },
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
