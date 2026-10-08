import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SeedhaRastah } from '../../components/seedha-rastah/seedha-rastah';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-seedha-rastah-page',
  imports: [NextSteps, PageShell, SeedhaRastah],
  template: `
    <app-page-shell title="Seedha Rastah">
      <app-seedha-rastah />
      <app-next-steps page="/seedha-rastah" />
    </app-page-shell>
  `,
})
export class SeedhaRastahPage {}

