import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ORGANIZATION } from '../../config/organization.config';
import { LanguageService } from '../../i18n/language.service';
import { memberJoinedDate, type MemberProfile } from '../../models/membership';
import { Icon } from '../ui/icon';
import { formatPortalDate } from './member-portal.types';

/** The member's "card": number, centre, joined date, status and the certificate download. */
@Component({
  selector: 'app-member-card',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-dark">
      <div class="geo-pattern-dense absolute inset-0 opacity-60" aria-hidden="true"></div>
      <div
        class="absolute -top-16 -end-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl"
        aria-hidden="true"
      ></div>
      <div class="relative">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="eyebrow-on-dark">{{ i18n.t('memberHome.card.number') }}</p>
            <p class="mt-2 font-mono text-2xl font-bold tracking-[0.12em] text-white sm:text-3xl" dir="ltr">
              {{ member().membershipNumber || '—' }}
            </p>
          </div>
          <img
            src="/brand/nagina-128.webp"
            alt=""
            width="44"
            height="44"
            class="h-11 w-11 shrink-0 rounded-full bg-white/90 object-contain p-1"
            decoding="async"
          />
        </div>

        <p class="mt-5 font-display text-xl font-bold text-white sm:text-2xl">{{ member().fullName }}</p>

        <dl class="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt class="text-xs uppercase tracking-[0.16em] text-sand/60">{{ i18n.t('memberHome.card.centre') }}</dt>
            <dd class="mt-1 font-semibold text-cream">{{ member().campusName || org.charityName }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.16em] text-sand/60">{{ i18n.t('memberHome.card.joined') }}</dt>
            <dd class="mt-1 font-semibold text-cream">{{ joined() }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.16em] text-sand/60">{{ i18n.t('memberHome.card.status') }}</dt>
            <dd class="mt-1">
              <span class="pill bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-300/40">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true"></span>
                {{ statusLabel() }}
              </span>
            </dd>
          </div>
        </dl>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            class="btn btn-primary"
            [disabled]="certificateLoading()"
            (click)="downloadCertificate.emit()"
          >
            <app-icon name="download" size="h-4 w-4" />
            {{ certificateLoading() ? i18n.t('memberHome.downloading') : i18n.t('memberHome.card.certificate') }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MemberCard {
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;

  readonly member = input.required<MemberProfile>();
  readonly certificateLoading = input(false);
  readonly downloadCertificate = output<void>();

  protected readonly joined = computed(() => {
    const date = memberJoinedDate(this.member());
    return date ? formatPortalDate(date.toISOString(), this.i18n.lang()) : '—';
  });

  protected readonly statusLabel = computed(() => {
    const status = (this.member().status || '').toUpperCase();
    return status === 'ACTIVE' || !status ? this.i18n.t('memberHome.card.statusActive') : status;
  });
}
