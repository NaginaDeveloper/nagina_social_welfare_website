import { Component, input } from '@angular/core';

@Component({
  selector: 'app-member-portal-empty',
  template: `
    <div
      class="mt-6 rounded-[1.5rem] border border-dashed border-mist bg-sand/40 px-6 py-10 text-center"
      [class.mt-8]="offsetTop()"
    >
      <p class="text-sm leading-relaxed text-slate-warm">{{ message() }}</p>
    </div>
  `,
})
export class MemberPortalEmpty {
  readonly message = input.required<string>();
  readonly offsetTop = input(true);
}
