import { Component, inject } from '@angular/core';
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
  protected readonly i18n = inject(LanguageService);

  protected readonly pillars: readonly Pillar[] = [
    { titleKey: 'about.pillar1Title', textKey: 'about.pillar1Text', icon: 'crescent' },
    { titleKey: 'about.pillar2Title', textKey: 'about.pillar2Text', icon: 'hands' },
    { titleKey: 'about.pillar3Title', textKey: 'about.pillar3Text', icon: 'globe' },
  ];
}
