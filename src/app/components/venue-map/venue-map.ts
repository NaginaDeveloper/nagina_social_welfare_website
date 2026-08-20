import { Component } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ORGANIZATION } from '../../config/organization.config';

@Component({
  selector: 'app-venue-map',
  template: `
    <iframe
      [src]="embedUrl"
      class="h-64 w-full rounded-2xl border-0 shadow-soft ring-1 ring-mist sm:h-80"
      [title]="title"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  `,
})
export class VenueMap {
  protected readonly embedUrl: SafeResourceUrl;
  protected readonly title = `Map of ${ORGANIZATION.addressFull}`;

  constructor(sanitizer: DomSanitizer) {
    this.embedUrl = sanitizer.bypassSecurityTrustResourceUrl(ORGANIZATION.mapsEmbedUrl);
  }
}
