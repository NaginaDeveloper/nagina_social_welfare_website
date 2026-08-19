import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import {
  AssistantService,
  type AssistantCitation,
  type AssistantTurn,
} from '../../services/assistant.service';

interface RenderMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly citations?: readonly AssistantCitation[];
  readonly disclaimer?: string;
}

@Component({
  selector: 'app-assistant',
  imports: [FormsModule, NgClass],
  templateUrl: './assistant.html',
})
export class Assistant {
  private readonly assistant = inject(AssistantService);
  private readonly launcher = inject(AssistantLauncherService);

  readonly mode = input<'floating' | 'page'>('floating');

  private lastOpenTick = 0;

  constructor() {
    effect(() => {
      const tick = this.launcher.openTick();
      if (tick === this.lastOpenTick) {
        return;
      }
      this.lastOpenTick = tick;
      if (this.isFloating()) {
        this.open.set(true);
        this.error.set(null);
      }
    });
  }

  protected readonly composer = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly open = signal(false);
  protected readonly messages = signal<readonly RenderMessage[]>([
    {
      role: 'assistant',
      content:
        'Assalamu alaikum. I can gently help with Hanafi Barelvi / Ahl al-Sunnah creed and guidance — first from our published Nagina pages, and when needed from broader Gemini Islamic knowledge within the same maslak — plus website questions such as donations, contact, and namaz times, in English or Urdu.',
      disclaimer:
        'I am not a mufti. For personal religious rulings, please contact Markaz directly.',
    },
  ]);

  protected readonly isFloating = computed(() => this.mode() === 'floating');

  protected readonly prompts = [
    'What is Khatme Nabuwwat?',
    'How can I donate?',
    'Peterborough namaz times',
    'Which books are available?',
    'اہلِ بیت کے بارے میں بتائیں',
    'رابطہ کیسے کریں؟',
  ] as const;

  protected toggle(): void {
    if (!this.isFloating()) {
      return;
    }
    this.open.update((current) => !current);
    this.error.set(null);
  }

  protected choosePrompt(prompt: string): void {
    this.composer.set(prompt);
  }

  protected async submit(): Promise<void> {
    if (this.loading()) {
      return;
    }
    const query = this.composer().trim();
    if (!query) {
      return;
    }

    const nextUser: RenderMessage = { role: 'user', content: query };
    this.messages.update((messages) => [...messages, nextUser]);
    this.composer.set('');
    this.loading.set(true);
    this.error.set(null);
    if (this.isFloating()) {
      this.open.set(true);
    }

    const history: AssistantTurn[] = this.messages()
      .filter((message) => message.role === 'user' || message.role === 'assistant')
      .slice(-10)
      .map((message) => ({ role: message.role, content: message.content }));

    try {
      const response = await this.assistant.ask(query, history);
      this.messages.update((messages) => [
        ...messages,
        {
          role: 'assistant',
          content: response.answer,
          citations: response.citations,
          disclaimer: response.disclaimer,
        },
      ]);
    } catch (err) {
      this.error.set(
        err instanceof Error
          ? err.message
          : 'Assistant is unavailable right now. Please try again shortly.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
