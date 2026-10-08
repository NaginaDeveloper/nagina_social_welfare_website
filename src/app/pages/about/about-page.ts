import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { About } from '../../components/about/about';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-about-page',
  imports: [NextSteps, PageShell, About],
  template: `
    <app-page-shell title="About">
      <app-about />
      <app-next-steps page="/about" />
    </app-page-shell>
  `,
})
export class AboutPage {}
