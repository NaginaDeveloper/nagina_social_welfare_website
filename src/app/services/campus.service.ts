import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CAMPUSES_FALLBACK_URL, CAMPUSES_URL } from '../config/admission-api.config';
import { joinTowns, parseCampusCatalog, type Campus } from '../models/campus';

/**
 * Madrasa campuses from the admissions API, so office edits in Control Center
 * reach the website without a release. Falls back to the build-time snapshot.
 */
@Injectable({ providedIn: 'root' })
export class CampusService {
  private readonly http = inject(HttpClient);
  private readonly campusesSignal = signal<Campus[]>([]);
  private readonly loadedSignal = signal(false);
  private loadPromise: Promise<void> | null = null;

  readonly campuses = this.campusesSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly towns = computed(() => joinTowns(this.campusesSignal()));

  byId(id: string | null | undefined): Campus | null {
    const key = String(id ?? '').trim().toLowerCase();
    return this.campusesSignal().find((c) => c.id === key) ?? null;
  }

  load(): Promise<void> {
    this.loadPromise ??= this.fetch();
    return this.loadPromise;
  }

  private async fetch(): Promise<void> {
    for (const url of [CAMPUSES_URL, CAMPUSES_FALLBACK_URL]) {
      try {
        const list = parseCampusCatalog(await firstValueFrom(this.http.get(url)));
        if (list.length > 0) {
          this.campusesSignal.set(list);
          break;
        }
      } catch (err) {
        console.warn('Campus list unavailable from', url, err);
      }
    }
    this.loadedSignal.set(true);
  }
}
