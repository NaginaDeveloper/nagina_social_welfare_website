import { Injectable, PLATFORM_ID, TransferState, computed, inject, makeStateKey, signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  CAMPUSES_FALLBACK_URL,
  CAMPUSES_URL,
  POSTCODE_LOOKUP_URL,
} from '../config/admission-api.config';
import {
  campusStoredCoords,
  joinTowns,
  parseCampusCatalog,
  parsePostcodeLookup,
  type Campus,
  type CampusCoords,
} from '../models/campus';

/**
 * Madrasa campuses from the admissions API, so office edits in Control Center
 * reach the website without a release. Falls back to the build-time snapshot.
 */
/** Campus list rendered into the prerendered page, so hydration starts with it instead of a loading state. */
const CAMPUSES_STATE = makeStateKey<Campus[]>('nagina-campuses');

@Injectable({ providedIn: 'root' })
export class CampusService {
  private readonly http = inject(HttpClient);
  private readonly server = isPlatformServer(inject(PLATFORM_ID));
  private readonly transfer = inject(TransferState);
  private readonly campusesSignal = signal<Campus[]>([]);
  private readonly loadedSignal = signal(false);
  private loadPromise: Promise<void> | null = null;
  private readonly coordsCache = new Map<string, Promise<CampusCoords | null>>();

  constructor() {
    const saved = this.transfer.get(CAMPUSES_STATE, null);
    if (saved?.length) {
      this.campusesSignal.set(saved);
      this.loadedSignal.set(true);
    }
  }

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

  /**
   * Coordinates for the campus postcode, so an office address edit moves prayer
   * times and Qibla with it. Uses the snapshot's stored point if the lookup fails.
   */
  coordinates(campus: Campus): Promise<CampusCoords | null> {
    const stored = campusStoredCoords(campus);
    if (stored) return Promise.resolve(stored);
    const key = `${campus.id}|${campus.postcode.trim().toUpperCase()}`;
    let pending = this.coordsCache.get(key);
    if (!pending) {
      pending = this.lookupCoordinates(campus).then((coords) => {
        if (!coords) this.coordsCache.delete(key);
        return coords;
      });
      this.coordsCache.set(key, pending);
    }
    return pending;
  }

  private async lookupCoordinates(campus: Campus): Promise<CampusCoords | null> {
    const postcode = campus.postcode.trim();
    if (postcode) {
      try {
        const body = await firstValueFrom(
          this.http.get(`${POSTCODE_LOOKUP_URL}${encodeURIComponent(postcode)}`),
        );
        const coords = parsePostcodeLookup(body);
        if (coords) return coords;
      } catch (err) {
        console.warn('Postcode lookup failed for', postcode, err);
      }
    }
    try {
      const snapshot = parseCampusCatalog(await firstValueFrom(this.http.get(CAMPUSES_FALLBACK_URL)));
      const match = snapshot.find(
        (c) => c.id === campus.id && c.postcode.trim().toUpperCase() === postcode.toUpperCase(),
      );
      return match ? campusStoredCoords(match) : null;
    } catch {
      return null;
    }
  }

  private async fetch(): Promise<void> {
    // The admissions API only answers browser origins; prerender uses the build snapshot.
    const sources = this.server ? [CAMPUSES_FALLBACK_URL] : [CAMPUSES_URL, CAMPUSES_FALLBACK_URL];
    for (const url of sources) {
      try {
        const list = parseCampusCatalog(await firstValueFrom(this.http.get(url)));
        if (list.length > 0) {
          this.campusesSignal.set(list);
          if (this.server) this.transfer.set(CAMPUSES_STATE, list);
          break;
        }
      } catch (err) {
        console.warn('Campus list unavailable from', url, err);
      }
    }
    this.loadedSignal.set(true);
  }
}
