import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SeedhaRastah } from '../../components/seedha-rastah/seedha-rastah';

@Component({
  selector: 'app-seedha-rastah-page',
  imports: [PageShell, SeedhaRastah],
  template: `
    <app-page-shell title="Seedha Rastah">
      <app-seedha-rastah />
    </app-page-shell>
  `,
})
export class SeedhaRastahPage {}

