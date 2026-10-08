import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { About } from '../../components/about/about';
import { HomeCentres } from '../../components/home-centres/home-centres';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-about-page',
  imports: [NextSteps, PageShell, About, HomeCentres],
  template: `
    <app-page-shell title="About">
      <app-about />
      <!-- Both centres' cards, moved here from the home page. -->
      <app-home-centres class="block pb-12" />
      <app-next-steps page="/about" />
    </app-page-shell>
  `,
})
export class AboutPage {}
