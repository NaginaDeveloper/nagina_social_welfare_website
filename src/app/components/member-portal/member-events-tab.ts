import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { whatsappHref } from '../../config/organization.config';
import { eventDescriptionHtml } from '../../utils/event-html';
import type { MemberPortalEvent } from '../../services/member-portal.service';
import { MemberPortalEmpty } from './member-portal-empty';
import { MemberPortalLoading } from './member-portal-loading';
import { portalCardClass, portalOutlineBtnClass, portalPrimaryBtnClass } from './member-portal.shared';

@Component({
  selector: 'app-member-events-tab',
  imports: [MemberPortalLoading, MemberPortalEmpty],
  templateUrl: './member-events-tab.html',
})
export class MemberEventsTab {
  protected readonly i18n = inject(LanguageService);
  protected readonly portalCardClass = portalCardClass;
  protected readonly portalPrimaryBtnClass = portalPrimaryBtnClass;
  protected readonly portalOutlineBtnClass = portalOutlineBtnClass;

  readonly events = input<MemberPortalEvent[]>([]);
  readonly eventsLoading = input(false);
  readonly rsvpBusy = input<string | null>(null);

  readonly setRsvp = output<{ event: MemberPortalEvent; status: 'going' | 'cancelled' }>();

  protected eventImages(event: MemberPortalEvent) {
    return event.images ?? [];
  }

  protected descriptionHtml(event: MemberPortalEvent): string {
    return eventDescriptionHtml(event.description);
  }

  protected memberUpdateHtml(raw: string): string {
    return eventDescriptionHtml(raw);
  }

  protected eventWhatsapp(event: MemberPortalEvent): string {
    return whatsappHref(event.whatsappPrefill || `Question about: ${event.title}`);
  }
}
