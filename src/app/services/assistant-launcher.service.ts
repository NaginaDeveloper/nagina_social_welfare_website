import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssistantLauncherService {
  private readonly openRequest = signal(0);

  /** Increments when something asks to open the floating assistant. */
  readonly openTick = this.openRequest.asReadonly();

  open(): void {
    this.openRequest.update((count) => count + 1);
  }
}
