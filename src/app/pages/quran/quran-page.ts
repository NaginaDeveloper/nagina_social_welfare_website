import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Quran } from '../../components/quran/quran';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-quran-page',
  imports: [NextSteps, PageShell, Quran],
  template: `
    <app-page-shell title="Quran Majeed">
      <app-quran />
      <app-next-steps page="/quran" />
    </app-page-shell>
  `,
})
export class QuranPage {}
