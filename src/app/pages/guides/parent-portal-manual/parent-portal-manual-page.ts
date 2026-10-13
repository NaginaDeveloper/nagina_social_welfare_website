import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../../page-shell';

/** Template and styles are generated from the standalone manual by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-parent-portal-manual-page',
  imports: [PageShell, RouterLink],
  templateUrl: './parent-portal-manual-page.html',
  styleUrl: './parent-portal-manual-page.css',
})
export class ParentPortalManualPage {
  protected readonly title = 'Parent Portal User Manual';
  protected readonly crumb = { path: '/guides', labelKey: 'nav.guides' };
}
