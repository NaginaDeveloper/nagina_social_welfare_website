import { Component, HostListener, signal } from '@angular/core';

interface GuidancePoster {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
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
  protected readonly activePoster = signal<GuidancePoster | null>(null);

  protected readonly posters: readonly GuidancePoster[] = [
    {
      id: 'preacher',
      title: 'Characteristics of a Successful Preacher',
      subtitle: 'Farman-e-Qibla Baba Jee Sarkar (R.A.)',
      alt: 'Infographic titled Characteristics of a Successful Islamic Preacher, listing Sweet Manner, Soft-Spoken Tongue, Utmost Sabr, High Tolerance, and Clean & Pure Sight',
      src: 'media/successful-preacher.png',
      width: 1024,
      height: 1024,
    },
    {
      id: 'knowledge',
      title: 'The Virtue of Knowledge in Islam',
      subtitle: 'The path of ilm & charity',
      alt: 'Poster on the virtue of knowledge in Islam with a classroom photo of students at Markaz, charity call to action, and prophetic narrations from Sahih Muslim',
      src: 'media/virtue-of-knowledge.png',
      width: 764,
      height: 1024,
    },
    {
      id: 'smile',
      title: 'Smiling Is Charity',
      subtitle: 'Kindness that lights a child’s heart',
      alt: 'Allama Munir Ahmed Yusufi sharing a playful moment with young students using a string telephone, with a quote that smiling at a fellow Muslim is charity',
      src: 'media/smiling-is-charity.jpg',
      width: 736,
      height: 812,
    },
    {
      id: 'langar',
      title: 'Feeding the Community',
      subtitle: 'Shared meals · Markaz Deen-e-Islam',
      alt: 'Students and teachers seated around a communal meal of rice, bread and fruit at Markaz Deen-e-Islam',
      src: 'media/community-langar.jpg',
      width: 736,
      height: 944,
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
