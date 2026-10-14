import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../i18n/language.service';
import { ORGANIZATION } from '../../config/organization.config';
import { CentreContacts } from '../centre-contacts/centre-contacts';
import { PORTAL_GUIDES, type PortalGuide } from '../../config/portal-guides.config';

@Component({
  selector: 'app-guides',
  imports: [CentreContacts, RouterLink],
  templateUrl: './guides.html',
})
export class Guides {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  protected readonly guides = PORTAL_GUIDES;

  protected hasGuide(guide: PortalGuide): boolean {
    return Boolean(guide.videoUrl || guide.manualUrl);
  }
}
