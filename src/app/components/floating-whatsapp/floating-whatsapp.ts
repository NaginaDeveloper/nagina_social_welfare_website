import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { campusTown, campusWhatsappHref, type Campus } from '../../models/campus';
import { CampusService } from '../../services/campus.service';
import { WhatsappIcon } from '../whatsapp-icon/whatsapp-icon';

/** Floating WhatsApp button: opens a small chooser so the message reaches the right centre. */
@Component({
  selector: 'app-floating-whatsapp',
  imports: [WhatsappIcon],
  template: `
    <div class="relative" (click)="$event.stopPropagation()">
      @if (open()) {
        <div
          class="animate-menu-in absolute bottom-full right-0 mb-3 w-64 rounded-2xl border border-mist bg-white p-2 text-forest shadow-portal"
          role="menu"
          [attr.dir]="i18n.isUr() ? 'rtl' : null"
          data-testid="floating-whatsapp-menu"
        >
          <p class="px-3 pb-1 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
            {{ i18n.t('floating.choose') }}
          </p>
          @for (campus of campusService.campuses(); track campus.id) {
            <a
              [href]="href(campus)"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sand"
              [attr.data-campus]="campus.id"
              (click)="open.set(false)"
            >
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                <app-whatsapp-icon class="h-4 w-4" [inverse]="true" />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-semibold">{{ town(campus) }}</span>
                <span class="block truncate text-xs text-slate-warm">{{ campus.displayName }}</span>
              </span>
            </a>
          } @empty {
            <a [href]="orgHref" target="_blank" rel="noopener noreferrer" role="menuitem" class="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-sand">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"><app-whatsapp-icon class="h-4 w-4" [inverse]="true" /></span>
              <span class="text-sm font-semibold">{{ org.shortName }}</span>
            </a>
          }
        </div>
      }
      <button
        type="button"
        class="inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-portal transition hover:brightness-110"
        [attr.aria-label]="i18n.t('contact.whatsapp')"
        [attr.aria-expanded]="open()"
        (click)="toggle()"
      >
        <app-whatsapp-icon class="h-6 w-6" [inverse]="true" />
      </button>
    </div>
  `,
})
export class FloatingWhatsapp implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly campusService = inject(CampusService);
  protected readonly org = ORGANIZATION;
  protected readonly orgHref = whatsappHref('Assalamu alaikum, I have a question for Nagina Social Welfare.');
  protected readonly open = signal(false);

  ngOnInit(): void {
    void this.campusService.load();
  }

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  @HostListener('document:click')
  protected closeOnOutsideClick(): void {
    this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.open.set(false);
  }

  protected town(campus: Campus): string {
    return campusTown(campus);
  }

  protected href(campus: Campus): string {
    return campusWhatsappHref(campus, `Assalamu alaikum, I have a question for ${campus.displayName} (${campusTown(campus)}).`);
  }
}
