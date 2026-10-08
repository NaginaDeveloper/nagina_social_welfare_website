import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { SafeDropOff } from '../../components/safe-drop-off/safe-drop-off';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-safe-drop-off-page',
  imports: [NextSteps, PageShell, SafeDropOff],
  template: `
    <app-page-shell title="Safe drop-off & collection" [parent]="{ path: '/madrasa', labelKey: 'nav.madrasa' }">
      <app-safe-drop-off />
      <app-next-steps page="/safe-drop-off" />
    </app-page-shell>
  `,
})
export class SafeDropOffPage {}
