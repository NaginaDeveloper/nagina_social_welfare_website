import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Quran } from '../../components/quran/quran';

@Component({
  selector: 'app-quran-page',
  imports: [PageShell, Quran],
  template: `
    <app-page-shell title="Quran Majeed">
      <app-quran />
    </app-page-shell>
  `,
})
export class QuranPage {}
