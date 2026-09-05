import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { FormsModule } from '@angular/forms';
import { ORGANIZATION, whatsappHref } from '../../config/organization.config';
import { AssistantLauncherService } from '../../services/assistant-launcher.service';
import {
  AssistantService,
  type AssistantCitation,
  type AssistantTurn,
} from '../../services/assistant.service';
import {
  looksLikeContactAnswer,
  splitAssistantContent,
  type AssistantContentPart,
} from './assistant-content';

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
  protected readonly i18n = inject(LanguageService);
  protected readonly org = ORGANIZATION;
  protected readonly callHref = `tel:${ORGANIZATION.phoneTel}`;
  protected readonly emailHref = `mailto:${ORGANIZATION.email}`;
  protected readonly whatsappUrl = whatsappHref(
    'Assalamu alaikum, I would like to get in touch with Nagina Social Welfare.',
  );
  protected readonly mapHref = ORGANIZATION.mapsDirectionsUrl;

  private readonly assistant = inject(AssistantService);
  private readonly launcher = inject(AssistantLauncherService);

  readonly mode = input<'floating' | 'page'>('floating');

  private lastOpenTick = 0;

  constructor() {
    effect(() => {
      this.i18n.lang();
      this.syncWelcome();
    });
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
      content: '',
      disclaimer: '',
    },
  ]);

  protected readonly isFloating = computed(() => this.mode() === 'floating');

  private syncWelcome(): void {
    this.messages.update((messages) => {
      if (messages.length !== 1 || messages[0]?.role !== 'assistant') {
        return messages;
      }
      return [
        {
          role: 'assistant',
          content: this.i18n.t('assistant.welcome'),
          disclaimer: this.i18n.t('assistant.disclaimer'),
        },
      ];
    });
  }

  protected readonly prompts = [
    'What is the Finality of Prophethood?',
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

  protected contentParts(content: string): readonly AssistantContentPart[] {
    return splitAssistantContent(content);
  }

  protected showContactActions(message: RenderMessage): boolean {
    return message.role === 'assistant' && looksLikeContactAnswer(message.content);
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
