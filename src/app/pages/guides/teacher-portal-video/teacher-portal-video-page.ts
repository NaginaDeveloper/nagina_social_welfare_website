import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { PageShell } from '../../page-shell';

/** Chapter start times (seconds) in the order they appear in the template. */
const CHAPTERS = [
  0, 20, 30, 43, 54, 79, 91, 114, 134, 151, 167, 183, 197, 211, 231, 251, 262, 288, 301, 316, 329, 351,
];

/** Template and styles are generated from the standalone video page by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-teacher-portal-video-page',
  imports: [PageShell],
  templateUrl: './teacher-portal-video-page.html',
  styleUrl: './teacher-portal-video-page.css',
})
export class TeacherPortalVideoPage {
  protected readonly title = 'Teacher Portal Video Guide';
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
