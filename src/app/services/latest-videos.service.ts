import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import {
  LATEST_SOCIAL_VIDEOS_URL,
  LATEST_VIDEOS_FALLBACK_URL,
} from '../config/latest-videos-api.config';
import type { LatestSocialCatalog } from '../models/latest-social';
import { ORGANIZATION } from '../config/organization.config';

@Injectable({ providedIn: 'root' })
export class LatestVideosService {
  private readonly http = inject(HttpClient);

  private readonly catalogSignal = signal<LatestSocialCatalog | null>(null);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly catalog = this.catalogSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(): Promise<void> {
    if (this.loadedSignal()) {
      return;
    }
    try {
      const catalog = await this.fetchPreferringLive();
      this.catalogSignal.set(catalog);
      this.errorSignal.set(null);
    } catch {
      this.errorSignal.set('Unable to load latest videos right now.');
    } finally {
      this.loadedSignal.set(true);
    }
  }

  youtubeEmbedUrl(id: string): string {
    return `https://www.youtube.com/embed/${id}`;
  }

  youtubeWatchUrl(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
  }

  tiktokEmbedUrl(id: string): string {
    return `https://www.tiktok.com/embed/v2/${id}`;
  }

  tiktokWatchUrl(
    id: string,
    handle = ORGANIZATION.tiktokUrl.split('@').pop() || 'nagina.social.wel',
  ): string {
    const clean = handle.replace(/^@/, '');
    return `https://www.tiktok.com/@${clean}/video/${id}`;
  }

  private async fetchPreferringLive(): Promise<LatestSocialCatalog> {
    try {
      const live = await firstValueFrom(
        this.http.get<LatestSocialCatalog>(LATEST_SOCIAL_VIDEOS_URL).pipe(timeout(2500)),
      );
      return this.normalize(live);
    } catch {
      const fallback = await firstValueFrom(
        this.http.get<LatestSocialCatalog>(LATEST_VIDEOS_FALLBACK_URL),
      );
      return this.normalize(fallback);
    }
  }

  private normalize(catalog: LatestSocialCatalog): LatestSocialCatalog {
    return {
      ...catalog,
      youtube: {
        channelId: catalog.youtube?.channelId ?? '',
        channelUrl: catalog.youtube?.channelUrl ?? ORGANIZATION.youtubeUrl,
        videos: catalog.youtube?.videos ?? [],
      },
      naginaTv: {
        channelId: catalog.naginaTv?.channelId ?? 'UCvPVENp4K1PRSP8BvDFLlhQ',
        channelUrl:
          catalog.naginaTv?.channelUrl ?? 'https://www.youtube.com/user/92nagina/',
        videos: catalog.naginaTv?.videos ?? [],
      },
      tiktok: {
        handle: catalog.tiktok?.handle ?? '@nagina.social.wel',
        profileUrl: catalog.tiktok?.profileUrl ?? ORGANIZATION.tiktokUrl,
        videos: catalog.tiktok?.videos ?? [],
      },
    };
  }
}
