import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { IslamicCalendar } from '../../components/islamic-calendar/islamic-calendar';

@Component({
  selector: 'app-calendar-page',
  imports: [PageShell, IslamicCalendar],
  template: `
    <app-page-shell title="Islamic Calendar">
      <app-islamic-calendar />
    </app-page-shell>
  `,
})
export class CalendarPage {}
