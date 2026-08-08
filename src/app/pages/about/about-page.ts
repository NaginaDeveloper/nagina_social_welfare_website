import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { About } from '../../components/about/about';

@Component({
  selector: 'app-about-page',
  imports: [PageShell, About],
  template: `
    <app-page-shell title="About">
      <app-about />
    </app-page-shell>
  `,
})
export class AboutPage {}
