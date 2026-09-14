import { Component, inject, input } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ORGANIZATION } from '../../config/organization.config';
import { PUBLIC_TRUSTEES } from '../../config/content-review.config';
import { LanguageService } from '../../i18n/language.service';

interface Pillar {
  readonly titleKey: string;
  readonly textKey: string;
  readonly icon: 'crescent' | 'hands' | 'globe';
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  /** Use h2 when embedded on the homepage so only one H1 remains. */
  readonly headingLevel = input<'h1' | 'h2'>('h1');

  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly trustees = PUBLIC_TRUSTEES;
  protected readonly presentationEmbedUrl: SafeResourceUrl;

  protected readonly pillars: readonly Pillar[] = [
    { titleKey: 'about.pillar1Title', textKey: 'about.pillar1Text', icon: 'crescent' },
    { titleKey: 'about.pillar2Title', textKey: 'about.pillar2Text', icon: 'hands' },
    { titleKey: 'about.pillar3Title', textKey: 'about.pillar3Text', icon: 'globe' },
  ];

  constructor(sanitizer: DomSanitizer) {
    this.presentationEmbedUrl = sanitizer.bypassSecurityTrustResourceUrl(
      ORGANIZATION.presentationVideoEmbedUrl,
    );
  }
}
