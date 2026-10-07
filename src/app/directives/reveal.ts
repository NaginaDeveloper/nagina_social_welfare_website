import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Fades an element up the first time it scrolls into view. Pure CSS does the
 * motion (see `.reveal` in styles.css); this only flips `is-visible`. Without
 * IntersectionObserver, or when the user prefers reduced motion, the element
 * is simply shown.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.transition-delay.ms]': 'delay()' },
})
export class Reveal implements OnDestroy {
  /** Stagger in milliseconds. */
  readonly delay = input(0, { alias: 'appReveal', transform: (v: number | string | undefined) => Number(v) || 0 });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => this.observe());
  }

  private observe(): void {
    const node = this.el.nativeElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
            this.observer = null;
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
