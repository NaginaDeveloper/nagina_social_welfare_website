import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { PageShell } from '../../page-shell';

/** Chapter start times (seconds) in the order they appear in the template. */
const CHAPTERS = [0, 21, 33, 48, 60, 85, 100, 120, 144, 161, 174, 195, 217, 231, 244, 257, 272, 287, 306];

/** Template and styles are generated from the standalone video page by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-parent-portal-video-page',
  imports: [PageShell],
  templateUrl: './parent-portal-video-page.html',
  styleUrl: './parent-portal-video-page.css',
})
export class ParentPortalVideoPage {
  protected readonly title = 'Parent Portal Video Guide';
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
