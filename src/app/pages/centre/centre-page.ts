import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PageShell } from '../page-shell';
import { Centre } from '../../components/centre/centre';
import { campusTown } from '../../models/campus';
import { CampusService } from '../../services/campus.service';

/** `/peterborough`, `/manchester` (campus id in route data) or `/centre/:campusId`. */
@Component({
  selector: 'app-centre-page',
  imports: [PageShell, Centre],
  template: `
    <app-page-shell [title]="title()" [parent]="{ path: '/madrasa', labelKey: 'nav.madrasa' }">
      <app-centre [campusId]="campusId()" />
    </app-page-shell>
  `,
})
export class CentrePage {
  private readonly route = inject(ActivatedRoute);
  private readonly campusService = inject(CampusService);

  protected readonly campusId = toSignal(
    this.route.paramMap.pipe(
      map((params) =>
        String(params.get('campusId') ?? this.route.snapshot.data['campusId'] ?? '')
          .trim()
          .toLowerCase(),
      ),
    ),
    { initialValue: '' },
  );

  protected readonly title = computed(() => {
    const campus = this.campusService.byId(this.campusId());
    return campus ? campusTown(campus) : this.route.snapshot.data['breadcrumb'] ?? '';
  });
}
