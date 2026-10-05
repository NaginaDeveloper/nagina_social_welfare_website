import { Injectable, computed, inject, signal } from '@angular/core';
import { campusTown, type Campus, type CampusCoords } from '../models/campus';
import { CampusService } from './campus.service';

const STORAGE_KEY = 'nagina-prayer-campus';

export interface PrayerPlace extends CampusCoords {
  readonly campusId: string;
  readonly town: string;
}

/**
 * Which madrasa's town prayer times and Qibla are shown for. Defaults to the
 * first campus the API lists; the visitor's choice is remembered on the device.
 */
@Injectable({ providedIn: 'root' })
export class PrayerPlaceService {
  private readonly campusService = inject(CampusService);
  private readonly chosenId = signal<string | null>(readStoredId());

  readonly options = this.campusService.campuses;
  readonly campus = computed<Campus | null>(() => {
    const list = this.campusService.campuses();
    return list.find((c) => c.id === this.chosenId()) ?? list[0] ?? null;
  });
  readonly town = computed(() => {
    const campus = this.campus();
    return campus ? campusTown(campus) : '';
  });

  select(campusId: string): void {
    this.chosenId.set(campusId);
    try {
      localStorage.setItem(STORAGE_KEY, campusId);
    } catch {
      // Private mode: the choice lasts for this visit only.
    }
  }

  async resolve(): Promise<PrayerPlace> {
    await this.campusService.load();
    const campus = this.campus();
    if (!campus) throw new Error('No Madrasa list available for prayer times.');
    const coords = await this.campusService.coordinates(campus);
    if (!coords) throw new Error(`No coordinates for ${campus.postcode || campus.id}.`);
    return { ...coords, campusId: campus.id, town: campusTown(campus) };
  }
}

function readStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
