import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { PageShell } from '../../page-shell';

/** Chapter start times (seconds) in the order they appear in the template. */
const CHAPTERS = [0, 16, 26, 38, 51, 75, 85, 108, 124, 136, 147, 164, 177, 199, 212, 223, 233, 250, 264];

/** Template and styles are generated from the standalone video page by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-student-portal-video-page',
  imports: [PageShell],
  templateUrl: './student-portal-video-page.html',
  styleUrl: './student-portal-video-page.css',
})
export class StudentPortalVideoPage {
  protected readonly title = 'Student Portal Video Guide';
  protected readonly crumb = { path: '/guides', labelKey: 'nav.guides' };
  protected readonly activeChapter = signal(0);

  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('guide');

  protected seek(seconds: number): void {
    const el = this.video()?.nativeElement;
    if (!el) return;
    // With preload="metadata" the duration may not be known yet; a currentTime set before
    // that is dropped, so wait for the metadata on the first jump.
    const jump = () => {
      el.currentTime = seconds;
      void el.play();
    };
    if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      jump();
    } else {
      el.addEventListener('loadedmetadata', jump, { once: true });
      el.load();
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.activeChapter.set(seconds);
  }

  protected onTime(currentTime: number): void {
    let current = CHAPTERS[0];
    for (const t of CHAPTERS) {
      if (currentTime >= t) current = t;
    }
    this.activeChapter.set(current);
  }
}
