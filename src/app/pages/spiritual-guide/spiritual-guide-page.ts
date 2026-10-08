import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { ShajraSharif } from '../../components/shajra-sharif/shajra-sharif';
import { SpiritualGuide } from '../../components/spiritual-guide/spiritual-guide';
import { SpiritualGuideGallery } from '../../components/spiritual-guide-gallery/spiritual-guide-gallery';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-spiritual-guide-page',
  imports: [NextSteps, PageShell, SpiritualGuide, ShajraSharif, SpiritualGuideGallery],
  template: `
    <app-page-shell title="Spiritual Guide">
      <app-spiritual-guide />
      <app-shajra-sharif />
      <app-spiritual-guide-gallery />
      <app-next-steps page="/spiritual-guide" />
    </app-page-shell>
  `,
})
export class SpiritualGuidePage {}
