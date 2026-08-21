import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LAST_APPLICATION_ID_KEY } from '../../config/admission-api.config';
import { LanguageService } from '../../i18n/language.service';
import type {
  ApplicationPublicStatus,
  ApplicationStatusResponse,
} from '../../models/admission';
import { AdmissionService } from '../../services/admission.service';

@Component({
  selector: 'app-application-status-panel',
  imports: [FormsModule],
  templateUrl: './application-status-panel.html',
})
export class ApplicationStatusPanel implements OnInit {
  /** Prefill from the success screen or ?id= */
  readonly initialId = input('');
  readonly autoLookup = input(false);

  protected readonly i18n = inject(LanguageService);
  private readonly admission = inject(AdmissionService);

  protected readonly id = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<ApplicationStatusResponse | null>(null);

  ngOnInit(): void {
    const fromInput = this.initialId().trim();
    const stored = this.readStoredId();
    const start = fromInput || stored;
    if (start) this.id.set(start);
    if (start && this.autoLookup()) {
      void this.lookup();
    }
  }

  protected async lookup(): Promise<void> {
    const applicationId = this.id().trim();
    this.error.set(null);
    this.result.set(null);
    if (!applicationId) {
      this.error.set(this.i18n.t('applyTrack.err.required'));
      return;
    }
    this.loading.set(true);
    try {
      const data = await this.admission.lookupStatus(applicationId);
      this.result.set(data);
      try {
        sessionStorage.setItem(LAST_APPLICATION_ID_KEY, data.applicationId);
      } catch {
        // ignore
      }
    } catch (err) {
      this.error.set(
        err instanceof Error ? err.message : this.i18n.t('applyTrack.err.lookup'),
      );
    } finally {
      this.loading.set(false);
    }
  }

  protected statusKey(status: ApplicationPublicStatus): string {
    return `applyTrack.status.${status}`;
  }

  protected statusHint(status: ApplicationPublicStatus): string {
    return `applyTrack.hint.${status}`;
  }

  protected tone(status: ApplicationPublicStatus): string {
    if (status === 'ACCEPTED') return 'border-emerald bg-forest text-cream';
    if (status === 'REJECTED') return 'border-red-200 bg-red-50 text-red-950';
    if (status === 'NEEDS_INFO') return 'border-amber-200 bg-amber-50 text-amber-950';
    return 'border-gold/40 bg-sand/70 text-forest';
  }

  protected formatDate(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(this.i18n.isUr() ? 'ur-PK' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private readStoredId(): string {
    try {
      return sessionStorage.getItem(LAST_APPLICATION_ID_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }
}
