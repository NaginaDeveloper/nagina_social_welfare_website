import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../../page-shell';

/** Template and styles are generated from the standalone manual by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-student-portal-manual-page',
  imports: [PageShell, RouterLink],
  templateUrl: './student-portal-manual-page.html',
  styleUrl: './student-portal-manual-page.css',
})
export class StudentPortalManualPage {
  protected readonly title = 'Student Portal User Manual';
  protected readonly crumb = { path: '/guides', labelKey: 'nav.guides' };
}
