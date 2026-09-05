import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { AuliaKaram } from '../../components/aulia-karam/aulia-karam';

@Component({
  selector: 'app-aulia-karam-page',
  imports: [PageShell, AuliaKaram],
  template: `
    <app-page-shell title="Awliya Allah">
      <app-aulia-karam />
    </app-page-shell>
  `,
})
export class AuliaKaramPage {}
