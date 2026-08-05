import { Component, HostListener, signal } from '@angular/core';
import { GALLERY_ITEMS, type GalleryItem } from './gallery-data';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
})
export class Gallery {
  protected readonly facebookUrl = 'https://www.facebook.com/naginasocial.welfare.5';
  protected readonly facebookPhotosUrl = 'https://www.facebook.com/naginasocial.welfare.5/photos';
  protected readonly instagramUrl = 'https://www.instagram.com/naginasocialwelfare/';

  protected readonly activeItem = signal<GalleryItem | null>(null);
  protected readonly items = GALLERY_ITEMS;

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
