import { Component } from '@angular/core';
import { PageShell } from '../page-shell';
import { DeathCommittee } from '../../components/death-committee/death-committee';

@Component({
  selector: 'app-death-committee-page',
  imports: [PageShell, DeathCommittee],
  template: `
    <app-page-shell title="Death Committee">
      <app-death-committee />
    </app-page-shell>
  `,
})
export class DeathCommitteePage {}
