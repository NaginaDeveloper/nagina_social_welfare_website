import { Component, HostListener, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';

interface GuidancePoster {
  readonly id: string;
  readonly title: string;
  readonly titleUr: string;
  readonly subtitle: string;
  readonly subtitleUr: string;
  readonly alt: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

@Component({
  selector: 'app-guidance',
  templateUrl: './guidance.html',
})
export class Guidance {
  protected readonly i18n = inject(LanguageService);
  protected readonly activePoster = signal<GuidancePoster | null>(null);

  protected readonly posters: readonly GuidancePoster[] = [
    {
      id: 'preacher',
      title: 'Characteristics of a Successful Preacher',
      titleUr: 'کامیاب مبلغ کی صفات',
      subtitle: 'Farman-e-Qibla Baba Jee Sarkar (R.A.)',
      subtitleUr: 'فرمانِ قبلہ بابا جی سرکار رضی اللہ تعالیٰ عنہ',
      alt: 'Infographic titled Characteristics of a Successful Islamic Preacher, listing Sweet Manner, Soft-Spoken Tongue, Utmost Sabr, High Tolerance, and Clean & Pure Sight',
      src: 'media/successful-preacher.png',
      width: 1024,
      height: 1024,
    },
    {
      id: 'knowledge',
      title: 'The Virtue of Knowledge in Islam',
      titleUr: 'اسلام میں علم کی فضیلت',
      subtitle: 'The path of ilm & charity',
      subtitleUr: 'علم اور خیرات کا راستہ',
      alt: 'Poster on the virtue of knowledge in Islam with a classroom photo of students at Markaz, charity call to action, and prophetic narrations from Sahih Muslim',
      src: 'media/virtue-of-knowledge.png',
      width: 764,
      height: 1024,
    },
    {
      id: 'smile',
      title: 'Smiling Is Charity',
      titleUr: 'مسکراہٹ صدقہ ہے',
      subtitle: 'Kindness that lights a child’s heart',
      subtitleUr: 'نرمی جو بچے کے دل کو روشن کرے',
      alt: 'Allama Munir Ahmed Yusufi sharing a playful moment with young students using a string telephone, with a quote that smiling at a fellow Muslim is charity',
      src: 'media/smiling-is-charity.jpg',
      width: 736,
      height: 812,
    },
    {
      id: 'langar',
      title: 'Feeding the Community',
      titleUr: 'کمیونٹی کی ضیافت',
      subtitle: 'Shared meals · Markaz Deen-e-Islam',
      subtitleUr: 'مشترکہ کھانا · مرکز دینِ اسلام',
      alt: 'Students and teachers seated around a communal meal of rice, bread and fruit at Markaz Deen-e-Islam',
      src: 'media/community-langar.jpg',
      width: 736,
      height: 944,
    },
    {
      id: 'actions',
      title: 'Actions Speak Louder',
      titleUr: 'عمل زیادہ بولتے ہیں',
      subtitle: 'Generations learn from your character',
      subtitleUr: 'نسلیں آپ کے کردار سے سیکھتی ہیں',
      alt: 'Students of Markaz seated in a gathering, with the quote: Generations learn more from your actions than from your advice, in Urdu and English',
      src: 'media/actions-over-advice.jpg',
      width: 725,
      height: 761,
    },
  ];

  protected openPoster(poster: GuidancePoster): void {
    this.activePoster.set(poster);
    document.body.style.overflow = 'hidden';
  }

  protected closePoster(): void {
    this.activePoster.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activePoster()) {
      this.closePoster();
    }
  }
}
