import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../../page-shell';

/** Template and styles are generated from the standalone manual by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-teacher-portal-manual-page',
  imports: [PageShell, RouterLink],
  templateUrl: './teacher-portal-manual-page.html',
  styleUrl: './teacher-portal-manual-page.css',
})
export class TeacherPortalManualPage {
  protected readonly title = 'Teacher Portal User Manual';
  protected readonly crumb = { path: '/guides', labelKey: 'nav.guides' };
}
