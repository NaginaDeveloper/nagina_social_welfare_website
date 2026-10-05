import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ORGANIZATION } from '../../config/organization.config';
import { campusMapsEmbedUrl, type Campus } from '../../models/campus';

@Component({
  selector: 'app-venue-map',
  template: `
    <iframe
      [src]="embedUrl()"
      class="h-64 w-full rounded-2xl border-0 shadow-soft ring-1 ring-mist sm:h-80"
      [title]="title()"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  `,
})
export class VenueMap {
  /** Madrasa to show; the organisation address when omitted. */
  readonly campus = input<Campus | null>(null);

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly embedUrl = computed<SafeResourceUrl>(() => {
    const campus = this.campus();
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      campus ? campusMapsEmbedUrl(campus) : ORGANIZATION.mapsEmbedUrl,
    );
  });

  protected readonly title = computed(
    () => `Map of ${this.campus()?.addressLine ?? ORGANIZATION.addressFull}`,
  );
}
