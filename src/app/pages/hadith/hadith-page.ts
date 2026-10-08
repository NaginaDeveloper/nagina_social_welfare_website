import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Hadith } from '../../components/hadith/hadith';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-hadith-page',
  imports: [NextSteps, PageShell, Hadith],
  template: `
    <app-page-shell title="Hadith">
      <app-hadith />
      <app-next-steps page="/hadith" />
    </app-page-shell>
  `,
})
export class HadithPage {}
