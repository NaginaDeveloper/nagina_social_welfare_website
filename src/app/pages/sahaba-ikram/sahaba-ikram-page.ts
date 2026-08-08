import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SahabaIkram } from '../../components/sahaba-ikram/sahaba-ikram';

@Component({
  selector: 'app-sahaba-ikram-page',
  imports: [PageShell, SahabaIkram],
  template: `
    <app-page-shell title="Sahaba Ikram">
      <app-sahaba-ikram />
    </app-page-shell>
  `,
})
export class SahabaIkramPage {}
