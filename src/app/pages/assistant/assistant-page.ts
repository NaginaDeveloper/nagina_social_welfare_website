import { Component } from '@angular/core';
import { Assistant } from '../../components/assistant/assistant';
import { PageShell } from '../page-shell';

@Component({
  selector: 'app-assistant-page',
  imports: [PageShell, Assistant],
  template: `
    <app-page-shell title="Assistant">
      <app-assistant mode="page" />
    </app-page-shell>
  `,
})
export class AssistantPage {}
