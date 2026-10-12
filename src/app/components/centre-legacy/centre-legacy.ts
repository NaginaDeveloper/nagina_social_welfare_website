import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AYAH,
  CHAIN_NODES,
  COMMITMENT,
  INSPIRATION,
  LEGACY,
  PURPOSE,
  centreLegacy,
  duaText,
} from '../../config/centre-legacy.config';
import { Reveal } from '../../directives/reveal';
import { LanguageService } from '../../i18n/language.service';
import { Icon } from '../ui/icon';

/**
 * Inspiration, the Nagina Social Welfare chain, legacy and commitment, shared by the
 * Peterborough and Manchester pages. Each page frames it from its own side (English text).
 */
@Component({
  selector: 'app-centre-legacy',
  imports: [Reveal, Icon, RouterLink],
  templateUrl: './centre-legacy.html',
})
export class CentreLegacy {
  readonly centreId = input.required<string>();

  protected readonly i18n = inject(LanguageService);
  protected readonly copy = computed(() => centreLegacy(this.centreId()));
  protected readonly dua = computed(() => duaText(this.copy()?.centreName ?? ''));

  protected readonly inspiration = INSPIRATION;
  protected readonly nodes = CHAIN_NODES;
  protected readonly legacy = LEGACY;
  protected readonly purpose = PURPOSE;
  protected readonly ayah = AYAH;
  protected readonly commitment = COMMITMENT;
}
