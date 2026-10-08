import { Component } from '@angular/core';
import { Assistant } from '../../components/assistant/assistant';
import { PageShell } from '../page-shell';
import { NextSteps } from '../../components/next-steps/next-steps';

@Component({
  selector: 'app-assistant-page',
  imports: [NextSteps, PageShell, Assistant],
  template: `
    <app-page-shell title="Assistant">
      <app-assistant mode="page" />
      <app-next-steps page="/assistant" />
    </app-page-shell>
  `,
})
export class AssistantPage {}
