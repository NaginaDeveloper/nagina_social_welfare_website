import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Sermon, SermonCatalog } from '../models/sermon';

export const SERMONS_CATALOG_URL = 'sermons/catalog.json';

@Injectable({ providedIn: 'root' })
export class SermonsService {
  private readonly sermonsSignal = signal<Sermon[]>([]);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly querySignal = signal('');
  private readonly speakerSignal = signal('Baba Ji Sarkar');
  private readonly sourceSignal = signal('https://seedharastah.com/audio_video.php');
  private readonly channelSignal = signal('https://www.youtube.com/user/92nagina/');

  readonly sermons = this.sermonsSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly query = this.querySignal.asReadonly();
  readonly speaker = this.speakerSignal.asReadonly();
  readonly source = this.sourceSignal.asReadonly();
  readonly channel = this.channelSignal.asReadonly();

  readonly filteredSermons = computed(() => {
    const q = this.querySignal().trim().toLowerCase();
    const all = this.sermonsSignal();
    if (!q) return all;
    return all.filter((s) => s.title.toLowerCase().includes(q) || String(s.id).includes(q));
  });

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<void> {
    if (this.loadedSignal() && !this.errorSignal()) return;
    try {
      const catalog = await firstValueFrom(this.http.get<SermonCatalog>(SERMONS_CATALOG_URL));
      const sermons = (catalog.sermons ?? [])
        .map((s) => ({
          ...s,
          youtubeIds: (s.youtubeIds ?? []).filter(Boolean),
        }))
        .sort((a, b) => b.id - a.id);
      this.sermonsSignal.set(sermons);
      this.speakerSignal.set(catalog.speaker || 'Baba Ji Sarkar');
      this.sourceSignal.set(catalog.source || this.sourceSignal());
      this.channelSignal.set(catalog.channel || this.channelSignal());
      this.loadedSignal.set(true);
      this.errorSignal.set(null);
    } catch (err) {
      this.errorSignal.set('Unable to load sermons right now.');
      this.loadedSignal.set(true);
      console.error(err);
    }
  }

  setQuery(value: string): void {
    this.querySignal.set(value);
  }

  youtubeWatchUrl(sermon: Sermon): string | null {
    const id = sermon.youtubeIds[0];
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  }

  youtubeEmbedUrl(sermon: Sermon): string | null {
    const id = sermon.youtubeIds[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  thumbnailUrl(sermon: Sermon): string | null {
    const id = sermon.youtubeIds[0];
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }

  openUrl(sermon: Sermon): string {
    return this.youtubeWatchUrl(sermon) || sermon.sourceUrl;
  }
}
