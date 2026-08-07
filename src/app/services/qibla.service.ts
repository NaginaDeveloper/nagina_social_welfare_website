import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  PETERBOROUGH_LAT,
  PETERBOROUGH_LNG,
} from './prayer-times.service';
import type { AlAdhanQiblaResponse, QiblaResult, QiblaSource } from '../models/qibla';

/** Kaaba (Masjid al-Haram), Makkah. */
export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

@Injectable({ providedIn: 'root' })
export class QiblaService {
  private readonly resultSignal = signal<QiblaResult | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly locatingSignal = signal(false);

  readonly result = this.resultSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly locating = this.locatingSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  /** Fetch Qibla for Peterborough (default, no permissions). */
  async load(): Promise<void> {
    if (this.resultSignal()?.source === 'peterborough' && !this.errorSignal()) {
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const result = await this.fetchFor(
        PETERBOROUGH_LAT,
        PETERBOROUGH_LNG,
        'peterborough',
      );
      this.resultSignal.set(result);
    } catch (err) {
      this.errorSignal.set('Unable to load Qibla direction right now.');
      console.error(err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Request visitor geolocation and re-fetch Qibla.
   * On denial/unavailable, keep the existing Peterborough result and set an error.
   */
  async loadForVisitor(): Promise<void> {
    if (!navigator.geolocation) {
      this.errorSignal.set('Location is not available in this browser.');
      return;
    }

    this.locatingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const coords = await this.requestPosition();
      const result = await this.fetchFor(coords.latitude, coords.longitude, 'visitor');
      this.resultSignal.set(result);
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? geolocationMessage(err)
          : err instanceof Error
            ? err.message
            : 'Unable to use your location.';
      this.errorSignal.set(message);
      console.error(err);
      // Keep Peterborough result if we already have one
      if (!this.resultSignal()) {
        await this.load();
      }
    } finally {
      this.locatingSignal.set(false);
    }
  }

  /** Reset to Peterborough bearing. */
  async resetToPeterborough(): Promise<void> {
    this.errorSignal.set(null);
    this.loadingSignal.set(true);
    try {
      const result = await this.fetchFor(
        PETERBOROUGH_LAT,
        PETERBOROUGH_LNG,
        'peterborough',
      );
      this.resultSignal.set(result);
    } catch (err) {
      this.errorSignal.set('Unable to load Qibla direction right now.');
      console.error(err);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async fetchFor(
    latitude: number,
    longitude: number,
    source: QiblaSource,
  ): Promise<QiblaResult> {
    const url = `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`;
    const res = await firstValueFrom(this.http.get<AlAdhanQiblaResponse>(url));
    return normalizeQibla(res, source);
  }

  private requestPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
      );
    });
  }
}

export function normalizeQibla(
  res: AlAdhanQiblaResponse,
  source: QiblaSource,
): QiblaResult {
  const { latitude, longitude, direction } = res.data;
  return {
    latitude,
    longitude,
    direction,
    distanceKm: haversineKm(latitude, longitude, KAABA_LAT, KAABA_LNG),
    source,
  };
}

/** Great-circle distance in kilometres (Earth radius ≈ 6371 km). */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Human-readable cardinal band for a bearing (0–360). */
export function cardinalFromBearing(degrees: number): string {
  const names = [
    'North',
    'North–northeast',
    'Northeast',
    'East–northeast',
    'East',
    'East–southeast',
    'Southeast',
    'South–southeast',
    'South',
    'South–southwest',
    'Southwest',
    'West–southwest',
    'West',
    'West–northwest',
    'Northwest',
    'North–northwest',
  ] as const;
  const idx = Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16;
  return names[idx];
}

function geolocationMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Location permission denied. Showing Peterborough instead.';
    case err.POSITION_UNAVAILABLE:
      return 'Location unavailable. Showing Peterborough instead.';
    case err.TIMEOUT:
      return 'Location request timed out. Showing Peterborough instead.';
    default:
      return 'Unable to use your location. Showing Peterborough instead.';
  }
}
