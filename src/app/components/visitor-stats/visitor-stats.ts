import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { VisitorStatsService } from '../../services/visitor-stats.service';

@Component({
  selector: 'app-visitor-stats',
  imports: [DecimalPipe],
  templateUrl: './visitor-stats.html',
})
export class VisitorStats implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly stats = inject(VisitorStatsService);

  /** compact = footer strip; card = contact page presence panel */
  readonly variant = input<'compact' | 'card'>('compact');

  /** When true, this instance owns the heartbeat (footer only). */
  readonly heartbeat = input(false);

  ngOnInit(): void {
    if (this.heartbeat()) {
      this.stats.startHeartbeat();
    }
  }
}
