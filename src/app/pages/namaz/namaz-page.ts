import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { PrayerTimes } from '../../components/prayer-times/prayer-times';

@Component({
  selector: 'app-namaz-page',
  imports: [PageShell, PrayerTimes],
  template: `
    <app-page-shell title="Prayer Times (Salah)">
      <app-prayer-times />
    </app-page-shell>
  `,
})
export class NamazPage {}
