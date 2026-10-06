import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SafeDropOff } from '../../components/safe-drop-off/safe-drop-off';

@Component({
  selector: 'app-safe-drop-off-page',
  imports: [PageShell, SafeDropOff],
  template: `
    <app-page-shell title="Safe drop-off & collection">
      <app-safe-drop-off />
    </app-page-shell>
  `,
})
export class SafeDropOffPage {}
