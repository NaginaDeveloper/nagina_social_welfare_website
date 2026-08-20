import { Component, HostListener, signal } from '@angular/core';
import {
  SPIRITUAL_GUIDE_PHOTOS,
  type SpiritualGuidePhoto,
} from './spiritual-guide-gallery-data';

@Component({
  selector: 'app-spiritual-guide-gallery',
  templateUrl: './spiritual-guide-gallery.html',
})
export class SpiritualGuideGallery {
  protected readonly photos = SPIRITUAL_GUIDE_PHOTOS;
  protected readonly activePhoto = signal<SpiritualGuidePhoto | null>(null);
  protected readonly naginaTvUrl = 'https://www.youtube.com/user/92nagina';

  protected openPhoto(photo: SpiritualGuidePhoto): void {
    this.activePhoto.set(photo);
    document.body.style.overflow = 'hidden';
  }

  protected closePhoto(): void {
    this.activePhoto.set(null);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.activePhoto()) {
      this.closePhoto();
    }
  }
}
