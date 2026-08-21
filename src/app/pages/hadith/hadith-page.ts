import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Hadith } from '../../components/hadith/hadith';

@Component({
  selector: 'app-hadith-page',
  imports: [PageShell, Hadith],
  template: `
    <app-page-shell title="Hadith">
      <app-hadith />
    </app-page-shell>
  `,
})
export class HadithPage {}
