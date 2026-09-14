import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Impact } from '../../components/impact/impact';

@Component({
  selector: 'app-impact-page',
  imports: [PageShell, Impact],
  template: `
    <app-page-shell title="Impact">
      <app-impact />
    </app-page-shell>
  `,
})
export class ImpactPage {}
