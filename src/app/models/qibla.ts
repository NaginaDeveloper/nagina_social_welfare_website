/** AlAdhan /v1/qibla/{lat}/{lng} envelope. */
export interface AlAdhanQiblaResponse {
  readonly code: number;
  readonly status: string;
  readonly data: {
    readonly latitude: number;
    readonly longitude: number;
    readonly direction: number;
  };
}

export type QiblaSource = 'campus' | 'visitor';

/** Normalised Qibla bearing used by the UI. */
export interface QiblaResult {
  readonly latitude: number;
  readonly longitude: number;
  /** Degrees clockwise from true North. */
  readonly direction: number;
  /** Great-circle distance to the Kaaba in kilometres. */
  readonly distanceKm: number;
  readonly source: QiblaSource;
  /** Set when `source` is `campus`. */
  readonly campusId?: string;
  readonly placeName?: string;
}
