import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { Madrasa } from '../../components/madrasa/madrasa';

@Component({
  selector: 'app-madrasa-page',
  imports: [PageShell, Madrasa],
  template: `
    <app-page-shell title="Madrasa">
      <app-madrasa />
    </app-page-shell>
  `,
})
export class MadrasaPage {}
