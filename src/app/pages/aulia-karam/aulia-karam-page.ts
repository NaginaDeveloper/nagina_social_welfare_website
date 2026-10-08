import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { AuliaKaram } from '../../components/aulia-karam/aulia-karam';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-aulia-karam-page',
  imports: [NextSteps, PageShell, AuliaKaram],
  template: `
    <app-page-shell title="Awliya Allah">
      <app-aulia-karam />
      <app-next-steps page="/aulia-karam" />
    </app-page-shell>
  `,
})
export class AuliaKaramPage {}
