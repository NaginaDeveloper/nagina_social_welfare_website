import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { PrayerPlaceService } from '../../services/prayer-place.service';
import {
  QiblaService,
  cardinalFromBearing,
  compassHeadingFromAngles,
  smoothHeading,
} from '../../services/qibla.service';

@Component({
  selector: 'app-qibla',
  imports: [RouterLink],
  templateUrl: './qibla.html',
})
export class Qibla implements OnInit, OnDestroy {
  protected readonly i18n = inject(LanguageService);
  protected readonly qibla = inject(QiblaService);
  private readonly place = inject(PrayerPlaceService);

  protected readonly liveMode = signal(false);
  protected readonly deviceHeading = signal<number | null>(null);
  protected readonly orientationSupported = signal(false);
  protected readonly orientationError = signal<string | null>(null);

  private orientationHandler: ((event: DeviceOrientationEvent) => void) | null = null;
  private noSensorTimer: ReturnType<typeof setTimeout> | null = null;

  /** Needle angle relative to the dial (Qibla − device heading when live). */
  protected readonly needleAngle = computed(() => {
    const result = this.qibla.result();
    if (!result) return 0;
    const heading = this.deviceHeading();
    if (this.liveMode() && heading != null) {
      return normalizeDegrees(result.direction - heading);
    }
    return normalizeDegrees(result.direction);
  });

  protected readonly directionLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    const deg = result.direction.toFixed(1);
    return this.i18n.t('qibla.fromNorth').replace('{deg}', deg);
  });

  protected readonly cardinalLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    return cardinalFromBearing(result.direction);
  });

  protected readonly distanceLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    const km = Math.round(result.distanceKm).toLocaleString(
      this.i18n.isUr() ? 'ur-PK' : 'en-GB',
    );
    return this.i18n.t('qibla.distance').replace('{km}', km);
  });

  protected readonly locationLabel = computed(() => {
    const result = this.qibla.result();
    if (result?.source === 'visitor') return this.i18n.t('qibla.yourLocation');
    const town = result?.placeName || this.place.town();
    return town ? this.i18n.t('qibla.townLabel').replace('{town}', town) : '';
  });

  protected readonly resetLabel = computed(() =>
    this.i18n.t('qibla.reset').replace('{town}', this.place.town()),
  );

  constructor() {
    // Follow the madrasa picked on the prayer times page.
    effect(() => {
      this.place.campus();
      untracked(() => {
        if (this.qibla.result()?.source !== 'visitor') void this.qibla.load();
      });
    });
  }

  ngOnInit(): void {
    this.orientationSupported.set(typeof window !== 'undefined' && 'DeviceOrientationEvent' in window);
  }

  ngOnDestroy(): void {
    this.stopOrientation();
  }

  protected async useMyLocation(): Promise<void> {
    await this.qibla.loadForVisitor();
  }

  protected async useMadrasaTown(): Promise<void> {
    await this.qibla.resetToCampus();
  }

  protected async toggleLiveMode(): Promise<void> {
    if (this.liveMode()) {
      this.stopOrientation();
      this.liveMode.set(false);
      this.orientationError.set(null);
      return;
    }

    const ok = await this.startOrientation();
    if (ok) {
      this.liveMode.set(true);
      this.orientationError.set(null);
    }
  }

  private async startOrientation(): Promise<boolean> {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      this.orientationError.set(this.i18n.t('qibla.compassUnavailable'));
      return false;
    }

    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<PermissionState>;
    };

    if (typeof DOE.requestPermission === 'function') {
      try {
        const state = await DOE.requestPermission();
        if (state !== 'granted') {
          this.orientationError.set(this.i18n.t('qibla.compassDenied'));
          return false;
        }
      } catch {
        this.orientationError.set(this.i18n.t('qibla.compassError'));
        return false;
      }
    }

    this.orientationHandler = (event: DeviceOrientationEvent) => {
      const heading = readCompassHeading(event);
      if (heading == null) return;
      if (this.noSensorTimer) {
        clearTimeout(this.noSensorTimer);
        this.noSensorTimer = null;
      }
      this.orientationError.set(null);
      this.deviceHeading.set(smoothHeading(this.deviceHeading(), heading));
    };

    window.addEventListener('deviceorientationabsolute', this.orientationHandler as EventListener, true);
    window.addEventListener('deviceorientation', this.orientationHandler as EventListener, true);

    // Desktops and some browsers expose the API but never send a reading.
    this.noSensorTimer = setTimeout(() => {
      this.noSensorTimer = null;
      if (this.deviceHeading() == null) {
        this.stopOrientation();
        this.liveMode.set(false);
        this.orientationError.set(this.i18n.t('qibla.compassUnavailable'));
      }
    }, 2500);
    return true;
  }

  private stopOrientation(): void {
    if (this.noSensorTimer) {
      clearTimeout(this.noSensorTimer);
      this.noSensorTimer = null;
    }
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientationabsolute', this.orientationHandler as EventListener, true);
      window.removeEventListener('deviceorientation', this.orientationHandler as EventListener, true);
      this.orientationHandler = null;
    }
    this.deviceHeading.set(null);
  }
}

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

/**
 * Only absolute (true-north) readings are used. Chrome on Android also fires a
 * relative `deviceorientation` event whose alpha starts from wherever the page
 * loaded; mixing it in made the needle jump to a wrong direction.
 */
function readCompassHeading(event: DeviceOrientationEvent): number | null {
  const webkit = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
  if (typeof webkit.webkitCompassHeading === 'number' && !Number.isNaN(webkit.webkitCompassHeading)) {
    return webkit.webkitCompassHeading;
  }
  const isAbsolute = event.type === 'deviceorientationabsolute' || event.absolute === true;
  if (
    isAbsolute &&
    typeof event.alpha === 'number' &&
    typeof event.beta === 'number' &&
    typeof event.gamma === 'number'
  ) {
    return compassHeadingFromAngles(event.alpha, event.beta, event.gamma);
  }
  return null;
}
