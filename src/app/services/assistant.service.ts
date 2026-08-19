import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ASK_NAGINA_ASSISTANT_URL } from '../config/assistant-api.config';

export interface AssistantCitation {
  readonly title: string;
  readonly path: string;
  readonly sourceType: string;
}

export interface AssistantTurn {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export interface AskAssistantResponse {
  readonly answer: string;
  readonly disclaimer: string;
  readonly citations: readonly AssistantCitation[];
  readonly language: 'en' | 'ur';
  readonly sourceMode?: 'published' | 'general';
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private readonly http = inject(HttpClient);

  async ask(
    query: string,
    history: readonly AssistantTurn[],
  ): Promise<AskAssistantResponse> {
    try {
      return await firstValueFrom(
        this.http.post<AskAssistantResponse>(ASK_NAGINA_ASSISTANT_URL, {
          query,
          history,
        }),
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        const message =
          typeof err.error?.error === 'string'
            ? err.error.error
            : 'Assistant is unavailable right now. Please try again shortly.';
        throw new Error(message);
      }
      throw new Error('Assistant is unavailable right now. Please try again shortly.');
    }
  }
}
