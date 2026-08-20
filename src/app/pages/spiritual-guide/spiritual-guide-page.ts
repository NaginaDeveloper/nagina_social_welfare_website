import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SpiritualGuide } from '../../components/spiritual-guide/spiritual-guide';
import { SpiritualGuideGallery } from '../../components/spiritual-guide-gallery/spiritual-guide-gallery';

@Component({
  selector: 'app-spiritual-guide-page',
  imports: [PageShell, SpiritualGuide, SpiritualGuideGallery],
  template: `
    <app-page-shell title="Spiritual Guide">
      <app-spiritual-guide />
      <app-spiritual-guide-gallery />
    </app-page-shell>
  `,
})
export class SpiritualGuidePage {}
