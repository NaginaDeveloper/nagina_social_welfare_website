import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-member-portal-loading',
  template: `
    <div class="animate-pulse space-y-4" [class.mt-8]="offsetTop()" aria-hidden="true">
      @for (row of rowIndexes(); track row) {
        <div class="h-24 rounded-[1.5rem] bg-mist/60"></div>
      }
    </div>
  `,
})
export class MemberPortalLoading {
  readonly rows = input(3);
  readonly offsetTop = input(true);

  protected readonly rowIndexes = computed(() =>
    Array.from({ length: Math.max(1, this.rows()) }, (_, i) => i),
  );
}
