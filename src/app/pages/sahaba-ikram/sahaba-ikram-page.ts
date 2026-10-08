import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SahabaIkram } from '../../components/sahaba-ikram/sahaba-ikram';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-sahaba-ikram-page',
  imports: [NextSteps, PageShell, SahabaIkram],
  template: `
    <app-page-shell title="Companions of the Prophet ﷺ">
      <app-sahaba-ikram />
      <app-next-steps page="/sahaba-ikram" />
    </app-page-shell>
  `,
})
export class SahabaIkramPage {}
