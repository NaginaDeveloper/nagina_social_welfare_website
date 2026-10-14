import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShell } from '../../page-shell';

/** Template and styles are generated from the standalone manual by scripts/import-guide-pages.mjs. */
@Component({
  selector: 'app-collector-portal-manual-page',
  imports: [PageShell, RouterLink],
  templateUrl: './collector-portal-manual-page.html',
  styleUrl: './collector-portal-manual-page.css',
})
export class CollectorPortalManualPage {
  protected readonly title = 'Collector Portal User Manual';
  protected readonly crumb = { path: '/guides', labelKey: 'nav.guides' };
}
