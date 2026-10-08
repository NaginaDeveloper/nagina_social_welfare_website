import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { NavIcon } from '../../config/navigation.config';

/** Extra stroke icons used on the home page, on top of the nav set. */
export type UiIconName = NavIcon | 'pin' | 'phone' | 'mail' | 'arrow' | 'external' | 'shield' | 'sparkle';

/**
 * One shared set of stroke icons (24×24 viewBox, currentColor). Size with the
 * `size` input (Tailwind classes); the header, hub tiles and centre cards all
 * draw from here so an icon looks the same wherever it appears.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [class]="size()"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('about') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        }
        @case ('work') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 21V12h6v9" />
        }
        @case ('guide') {
          <circle cx="12" cy="8" r="3.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 20a5.5 5.5 0 0 1 11 0" />
        }
        @case ('seal') {
          <path stroke-linecap="round" stroke-linejoin="round" d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7L12 13.8 7.8 16l.8-4.7L5.2 8l4.7-.7L12 3Z" />
        }
        @case ('family') {
          <circle cx="9" cy="7" r="2.5" />
          <circle cx="15" cy="7" r="2.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 19c0-2.8 2.2-5 5-5h1c1.2 0 2.3.4 3.2 1.1A5 5 0 0 1 20 19" />
        }
        @case ('companions') {
          <circle cx="8" cy="8" r="2.5" />
          <circle cx="16" cy="8" r="2.5" />
          <circle cx="12" cy="15" r="2.5" />
          <path stroke-linecap="round" d="M3.5 19a4.5 4.5 0 0 1 5-3M15.5 16a4.5 4.5 0 0 1 5 3" />
        }
        @case ('counsel') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 5h16v10H8l-4 4V5Z" />
        }
        @case ('worship') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 20V10l8-5 8 5v10" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20v-6h6v6" />
          <path stroke-linecap="round" d="M12 5V3" />
        }
        @case ('mosque') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 20V11l8-6 8 6v9" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20v-5h6v5M12 5V3.5" />
        }
        @case ('zakat') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M8 8h5.5a2.5 2.5 0 0 1 0 5H9m0 0h5.5a2.5 2.5 0 0 1 0 5H8" />
        }
        @case ('quran') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5V5.5Z" />
        }
        @case ('hadith') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 4h9a2 2 0 0 1 2 2v14l-4-2-4 2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 8h5M9 12h4" />
        }
        @case ('learn') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
        }
        @case ('book') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" />
        }
        @case ('quiz') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 9h.01M15 9h.01M9.5 13a3.5 3.5 0 0 0 5 0" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        }
        @case ('barcode') {
          <path stroke-linecap="round" d="M4 7v10M7 7v10M9 7v10M12 7v10M14 7v10M17 7v10M20 7v10" />
        }
        @case ('seedha') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 7v5c0 4.5 3.2 8.2 8 9 4.8-.8 8-4.5 8-9V7l-8-4Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6M12 9v6" />
        }
        @case ('sermon') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 18V6l11-2v12" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="16" r="2" />
        }
        @case ('apps') {
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        }
        @case ('guides') {
          <rect x="3.5" y="5" width="17" height="12" rx="2" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 8.8 4 2.2-4 2.2V8.8ZM8 20h8" />
        }
        @case ('assistant') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4l-4 3v-3H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        }
        @case ('connect') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364Z" />
        }
        @case ('events') {
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path stroke-linecap="round" d="M8 3v4M16 3v4M3.5 10h17" />
        }
        @case ('donate') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 0 1 6.364 0L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 0 1 0-6.364Z" />
        }
        @case ('contact') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16v12H4z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m4 7 8 6 8-6" />
        }
        @case ('privacy') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3 5 6v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
        }
        @case ('shield') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3 5 6v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
        }
        @case ('pin') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-6-5.3-6-10.5a6 6 0 1 1 12 0C18 15.7 12 21 12 21Z" />
          <circle cx="12" cy="10.5" r="2.2" />
        }
        @case ('phone') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L16 14l4 1.5V19a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        }
        @case ('mail') {
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m4 7 8 6 8-6" />
        }
        @case ('arrow') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        }
        @case ('external') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M9 7h8v8" />
        }
        @case ('sparkle') {
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M6.5 17.5 9 15M15 9l2.5-2.5" />
        }
        @default {
          <circle cx="12" cy="12" r="7" />
        }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<UiIconName>();
  /** Tailwind size classes, e.g. `h-4 w-4`. */
  readonly size = input('h-4 w-4');
  readonly strokeWidth = input(1.8);
}
