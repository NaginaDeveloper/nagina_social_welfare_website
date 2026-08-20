import { Component, HostListener, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import {
  SPIRITUAL_GUIDE_PHOTOS,
  type SpiritualGuidePhoto,
} from './spiritual-guide-gallery-data';

@Component({
  selector: 'app-spiritual-guide-gallery',
  templateUrl: './spiritual-guide-gallery.html',
})
export class SpiritualGuideGallery {
  protected readonly i18n = inject(LanguageService);
  protected readonly featured = SPIRITUAL_GUIDE_PHOTOS.slice(0, 3);
  protected readonly photos = SPIRITUAL_GUIDE_PHOTOS.slice(3);
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
