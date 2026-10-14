import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTAL_GUIDES } from '../../config/portal-guides.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

/**
 * Home page "Video guides": the Parent, Teacher and Student portal videos, playable in
 * place, with links to each manual and to the video page's step list. Families and staff
 * land on the home page first, so the videos sit where they will see them.
 */
@Component({
  selector: 'app-home-guides',
  imports: [Icon, Reveal, RouterLink],
  templateUrl: './home-guides.html',
})
export class HomeGuides {
  protected readonly i18n = inject(LanguageService);
  protected readonly guides = PORTAL_GUIDES.filter((g) => g.videoFile && g.videoPoster);
}
