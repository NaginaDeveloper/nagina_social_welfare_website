import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  QiblaService,
  cardinalFromBearing,
} from '../../services/qibla.service';

@Component({
  selector: 'app-qibla',
  imports: [RouterLink],
  templateUrl: './qibla.html',
})
export class Qibla implements OnInit, OnDestroy {
  protected readonly qibla = inject(QiblaService);

  protected readonly liveMode = signal(false);
  protected readonly deviceHeading = signal<number | null>(null);
  protected readonly orientationSupported = signal(false);
  protected readonly orientationError = signal<string | null>(null);

  private orientationHandler: ((event: DeviceOrientationEvent) => void) | null = null;

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
    return `${result.direction.toFixed(1)}° from North`;
  });

  protected readonly cardinalLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    return cardinalFromBearing(result.direction);
  });

  protected readonly distanceLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    return `~${Math.round(result.distanceKm).toLocaleString('en-GB')} km to Makkah`;
  });

  protected readonly locationLabel = computed(() => {
    const result = this.qibla.result();
    if (!result) return '';
    return result.source === 'visitor' ? 'Your location' : 'Peterborough, UK';
  });

  ngOnInit(): void {
    this.orientationSupported.set(typeof window !== 'undefined' && 'DeviceOrientationEvent' in window);
    void this.qibla.load();
  }

  ngOnDestroy(): void {
    this.stopOrientation();
  }

  protected async useMyLocation(): Promise<void> {
    await this.qibla.loadForVisitor();
  }

  protected async usePeterborough(): Promise<void> {
    await this.qibla.resetToPeterborough();
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
      this.orientationError.set('Device compass is not available on this device.');
      return false;
    }

    const DOE = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<PermissionState>;
    };

    if (typeof DOE.requestPermission === 'function') {
      try {
        const state = await DOE.requestPermission();
        if (state !== 'granted') {
          this.orientationError.set('Compass permission was not granted.');
          return false;
        }
      } catch {
        this.orientationError.set('Unable to access the device compass.');
        return false;
      }
    }

    this.orientationHandler = (event: DeviceOrientationEvent) => {
      const heading = readCompassHeading(event);
      if (heading != null) {
        this.deviceHeading.set(heading);
      }
    };

    // Absolute events preferred when available (Android); iOS uses webkitCompassHeading on orientation.
    window.addEventListener('deviceorientationabsolute', this.orientationHandler as EventListener, true);
    window.addEventListener('deviceorientation', this.orientationHandler as EventListener, true);
    return true;
  }

  private stopOrientation(): void {
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

function readCompassHeading(event: DeviceOrientationEvent): number | null {
  const webkit = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
  if (typeof webkit.webkitCompassHeading === 'number' && !Number.isNaN(webkit.webkitCompassHeading)) {
    return webkit.webkitCompassHeading;
  }
  // Absolute alpha: 0 = North when absolute is true; convert to compass heading.
  if (event.absolute && typeof event.alpha === 'number' && !Number.isNaN(event.alpha)) {
    return normalizeDegrees(360 - event.alpha);
  }
  if (typeof event.alpha === 'number' && !Number.isNaN(event.alpha)) {
    return normalizeDegrees(360 - event.alpha);
  }
  return null;
}
