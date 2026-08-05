import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GALLERY_ITEMS, type GalleryItem } from './gallery-data';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
})
export class Gallery {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly pageSize = 24;

  protected readonly facebookUrl = 'https://www.facebook.com/naginasocial.welfare.5';
  protected readonly facebookPhotosUrl = 'https://www.facebook.com/naginasocial.welfare.5/photos';

  protected readonly facebookEmbedUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnaginasocial.welfare.5&tabs=timeline&width=500&height=640&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true',
    );

  protected readonly activeItem = signal<GalleryItem | null>(null);
  protected readonly visibleCount = signal(this.pageSize);

  protected readonly allItems = GALLERY_ITEMS;
  protected readonly totalCount = GALLERY_ITEMS.length;

  protected readonly items = computed(() => this.allItems.slice(0, this.visibleCount()));

  protected readonly hasMore = computed(() => this.visibleCount() < this.totalCount);

  protected showMore(): void {
    this.visibleCount.update((n) => Math.min(n + this.pageSize, this.totalCount));
  }

  protected openItem(item: GalleryItem): void {
    this.activeItem.set(item);
    document.body.style.overflow = 'hidden';
  }

  protected closeItem(): void {
    this.activeItem.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activeItem()) {
      this.closeItem();
    }
  }
}
