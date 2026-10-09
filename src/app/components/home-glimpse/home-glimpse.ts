import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { Reveal } from '../../directives/reveal';
import { Icon } from '../ui/icon';
import type { UiIconName } from '../ui/icon';

interface GlimpseTile {
  readonly id: string;
  readonly path: string;
  readonly image: string;
  /** Focal point for object-position so the subject survives the crop. */
  readonly focus: string;
  readonly titleKey: string;
  readonly hintKey: string;
  readonly icon: UiIconName;
  /** Wide tile on larger screens. */
  readonly wide?: boolean;
}

/** Three photos from our own archive, each a doorway to a section of the site. */
@Component({
  selector: 'app-home-glimpse',
  imports: [RouterLink, Icon, Reveal],
  templateUrl: './home-glimpse.html',
})
export class HomeGlimpse {
  protected readonly i18n = inject(LanguageService);

  protected readonly tiles: readonly GlimpseTile[] = [
    {
      id: 'sermons',
      path: '/sermons',
      image: '/gallery/munir/07-minbar.webp',
      focus: 'object-[50%_30%]',
      titleKey: 'home.glimpse.sermons',
      hintKey: 'home.glimpse.sermonsHint',
      icon: 'sermon',
      wide: true,
    },
    {
      id: 'madrasa',
      path: '/madrasa',
      image: '/media/ahle-bait-students-720.webp',
      focus: 'object-[50%_35%]',
      titleKey: 'home.glimpse.madrasa',
      hintKey: 'home.glimpse.madrasaHint',
      icon: 'learn',
    },
    {
      id: 'welfare',
      path: '/work',
      image: '/media/community-langar-560.webp',
      focus: 'object-[50%_60%]',
      titleKey: 'home.glimpse.welfare',
      hintKey: 'home.glimpse.welfareHint',
      icon: 'connect',
    },
  ];
}
