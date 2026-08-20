import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

export interface ShajraSaint {
  readonly name: string;
  readonly nameUr: string;
  readonly title?: string;
  readonly titleUr?: string;
  /** رضی اللہ تعالیٰ عنہ / عنہم — all except Rasool Allah ﷺ. */
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
      { name: 'Muhammad Rasool Allah ﷺ', nameUr: 'حضور محمد رسول اللہ ﷺ',
        title: 'Sayyid of the two worlds, King of the Messengers',
        titleUr: 'سید العالمین، سلطان الانبیاء' },
      { name: 'The Ahl-e-Bait', nameUr: 'اہل بیت',
        title: 'The blessed family of Mustafa ﷺ',
        titleUr: 'آلِ مصطفیٰ ﷺ',
        honorific: 'رضی اللہ تعالیٰ عنہم' },
      { name: 'The noble Companions', nameUr: 'صحابہ کرام',
        title: 'All the Sahaba',
        titleUr: 'تمام صحابہ',
        honorific: 'رضی اللہ تعالیٰ عنہم' },
      { name: 'Abu Bakr Siddiq', nameUr: 'ابو بکر صدیق',
        title: 'as-Siddiq al-Akbar',
        titleUr: 'الصدیق الاکبر',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Salman Farsi', nameUr: 'سلمان فارسی',
        title: 'Pride of the holy ones',
        titleUr: 'فخر الاصفیاء',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Imam Qasim bin Abu Bakr Siddiq', nameUr: 'امام قاسم بن ابو بکر صدیق',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
    ],
  },
  {
    id: 'page-2',
    src: 'gallery/shajra/02.jpg',
    alt: 'Page 2 of the Shajra Sharif: verses from Imam Jafar Sadiq through Darwish Muhammad in the Naqshbandi chain',
    caption: 'Imam Jafar Sadiq to Darwish Muhammad',
    captionUr: 'امام جعفر صادق تا خواجہ درویش',
    saints: [
      { name: 'Imam Jafar Sadiq', nameUr: 'امام جعفر صادق',
        title: 'Imam of the truthful',
        titleUr: 'امام الصادقین',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Bayazid Bastami', nameUr: 'بایزید بسطامی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Abul Hasan Kharqani', nameUr: 'ابو الحسن خرقانی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Abu Ali Farmadi', nameUr: 'ابو علی فارمدی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Yusuf Hamdani', nameUr: 'یوسف ہمدانی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Abdul Khaliq Ghajadwani', nameUr: 'عبد الخالق غجدوانی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Arif Riwgari', nameUr: 'محمد عارف ریوگری',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Mahmood Anjir Faghnawi', nameUr: 'محمود انجیر فغنوی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Azizan Ali Ramitani', nameUr: 'عزیزان علی رامیتنی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Baba Samasi', nameUr: 'محمد بابا سماسی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Sayyid Amir Kulal', nameUr: 'سید امیر کلال',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Bahauddin Naqshbandi', nameUr: 'بہاؤ الدین نقشبند',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Yaqub Charkhi', nameUr: 'محمد یعقوب چرخی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Ubaidullah Ahrar', nameUr: 'عبید اللہ احرار',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Zahid', nameUr: 'محمد زاہد',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Darwish Muhammad', nameUr: 'درویش محمد',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
    ],
  },
  {
    id: 'page-3',
    src: 'gallery/shajra/03.jpg',
    alt: 'Page 3 of the Shajra Sharif: verses for Muhammad Amkanagi, Muhammad Baqi Billah, Ahmad Faruqi Sirhindi, and Noor Muhammad Chorahi',
    caption: 'Mujaddid Alf Thani to Noor Muhammad Chorahi',
    captionUr: 'مجدد الف ثانی تا نور محمد چوراہی',
    saints: [
      { name: 'Muhammad Amkanagi', nameUr: 'محمد امکنگی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Baqi Billah', nameUr: 'محمد باقی باللہ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Ahmad Faruqi Sirhindi', nameUr: 'احمد فاروقی سرہندی',
        title: 'Imam Rabbani Mujaddid Alf Thani',
        titleUr: 'امام ربانی مجدد الف ثانی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Masoom', nameUr: 'محمد معصوم',
        title: 'Qayyum of the age',
        titleUr: 'قیومِ زمانہ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Hujjatullah', nameUr: 'حجت اللہ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Muhammad Zubair', nameUr: 'محمد زبیر',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Qutb-ud-Din', nameUr: 'قطب الدین',
        title: 'Qutb of the gnostics',
        titleUr: 'قطب العارفین',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Jamalullah', nameUr: 'جمال اللہ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Shah Isa', nameUr: 'شاہ عیسیٰ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Noor Muhammad Chorahi', nameUr: 'نور محمد چوراہی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Bawa Ji Khwaja Faqir', nameUr: 'باوا جی خواجہ فقیر',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'The saints of Chora Sharif', nameUr: 'چورا شریف کے اولیاء',
        title: 'Khak-e-Chora, like stars of the galaxy',
        titleUr: 'خاکِ چورا، کہکشاں کے ستاروں کی مانند',
        honorific: 'رضی اللہ تعالیٰ عنہم' },
    ],
  },
  {
    id: 'page-4',
    src: 'gallery/shajra/04.jpg',
    alt: 'Page 4 of the Shajra Sharif: later mashayikh of the Yusufi Nagina chain',
    caption: 'The later mashayikh',
    captionUr: 'بعد کے مشائخ',
    saints: [
      { name: 'Shah La-Sani', nameUr: 'شاہ لاثانی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Ali Akbar', nameUr: 'علی اکبر',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Ali Asghar', nameUr: 'علی اصغر',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Shah Jamaat Ali', nameUr: 'شاہ جماعت علی',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Shah Muhammad Hussain', nameUr: 'شاہ محمد حسین',
        title: 'Pir of the perfect ones',
        titleUr: 'پیرِ کاملین',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Amir-e-Millat', nameUr: 'امیرِ ملت',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Hafiz', nameUr: 'حافظ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
      { name: 'Murshid Haji Muhammad Yusuf Ali Nagina', nameUr: 'مرشد حاجی محمد یوسف علی نگینہ',
        title: 'eloquent guide',
        titleUr: 'فصیح رہنما',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
    ],
  },
  {
    id: 'nagina',
    src: 'gallery/shajra/05-haji-muhammad-yusuf-ali-nagina.jpg',
    alt: 'Commemorative poster of Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
    caption: 'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina',
    captionUr: 'پیر طریقت رہبر شریعت حضرت حاجی محمد یوسف علی نگینہ رضی اللہ تعالیٰ عنہ',
    honour: true,
    saints: [
      { name: 'Pir-e-Tariqat, Rehbar-e-Shariat Haji Muhammad Yusuf Ali Nagina', nameUr: 'پیر طریقت رہبر شریعت حضرت حاجی محمد یوسف علی نگینہ',
        honorific: 'رضی اللہ تعالیٰ عنہ' },
    ],
  },
];

@Component({
  selector: 'app-shajra-sharif',
  templateUrl: './shajra-sharif.html',
})
export class ShajraSharif {
  protected readonly i18n = inject(LanguageService);
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
