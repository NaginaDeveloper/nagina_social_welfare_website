import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SpiritualGuide } from '../../components/spiritual-guide/spiritual-guide';

@Component({
  selector: 'app-spiritual-guide-page',
  imports: [PageShell, SpiritualGuide],
  template: `
    <app-page-shell title="Spiritual Guide">
      <app-spiritual-guide />
    </app-page-shell>
  `,
})
export class SpiritualGuidePage {}
