import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../i18n/language.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ORGANIZATION } from '../../config/organization.config';
import { LatestVideosService } from '../../services/latest-videos.service';
import { SermonsService } from '../../services/sermons.service';
import type { Sermon } from '../../models/sermon';
import type { LatestVideoItem } from '../../models/latest-social';

type VideoSource = 'naginaTv' | 'orgYoutube' | 'archive';

interface SearchHit {
  readonly key: string;
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string | null;
  readonly source: VideoSource;
  readonly sourceLabelKey: string;
  readonly watchUrl: string;
  readonly sermon?: Sermon;
  readonly latest?: LatestVideoItem;
}

@Component({
  selector: 'app-sermons',
  imports: [FormsModule],
  templateUrl: './sermons.html',
})
export class Sermons implements OnInit {
  protected readonly i18n = inject(LanguageService);
  protected readonly sermons = inject(SermonsService);
  protected readonly latest = inject(LatestVideosService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly youtubeUrl = ORGANIZATION.youtubeUrl;
  protected readonly tiktokUrl = ORGANIZATION.tiktokUrl;
  protected readonly naginaTvUrl = 'https://www.youtube.com/user/92nagina/';

  protected search = '';
  private readonly querySignal = signal('');
  protected readonly active = signal<Sermon | null>(null);
  protected readonly embedUrl = signal<SafeResourceUrl | null>(null);
  protected readonly activeYoutube = signal<LatestVideoItem | null>(null);
  protected readonly youtubeEmbed = signal<SafeResourceUrl | null>(null);

  protected readonly hasQuery = computed(() => this.querySignal().trim().length > 0);

  protected readonly tiktokCards = computed(() => {
    const videos = this.latest.catalog()?.tiktok.videos ?? [];
    return videos.map((video) => ({
      id: video.id,
      watchUrl: this.tiktokWatch(video.id),
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        this.latest.tiktokEmbedUrl(video.id),
      ),
    }));
  });

  protected readonly searchHits = computed((): SearchHit[] => {
    const q = this.querySignal().trim().toLowerCase();
    if (!q) {
      return [];
    }

    const catalog = this.latest.catalog();
    const hits: SearchHit[] = [];
    const seenYoutube = new Set<string>();

    const pushLatest = (
      videos: readonly LatestVideoItem[],
      source: VideoSource,
      labelKey: string,
    ) => {
      for (const video of videos) {
        const title = video.title || video.id;
        if (!title.toLowerCase().includes(q) && !video.id.toLowerCase().includes(q)) {
          continue;
        }
        if (seenYoutube.has(video.id)) {
          continue;
        }
        seenYoutube.add(video.id);
        hits.push({
          key: `${source}-${video.id}`,
          id: video.id,
          title,
          thumbnail: video.thumbnail ?? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
          source,
          sourceLabelKey: labelKey,
          watchUrl: this.latest.youtubeWatchUrl(video.id),
          latest: video,
        });
      }
    };

    pushLatest(catalog?.naginaTv.videos ?? [], 'naginaTv', 'sermons.sourceNaginaTv');
    pushLatest(catalog?.youtube.videos ?? [], 'orgYoutube', 'sermons.sourceOrgYoutube');

    for (const sermon of this.sermons.sermons()) {
      const ytId = sermon.youtubeIds[0];
      const matches =
        sermon.title.toLowerCase().includes(q) ||
        String(sermon.id).includes(q) ||
        (ytId ? ytId.toLowerCase().includes(q) : false);
      if (!matches) {
        continue;
      }
      if (ytId && seenYoutube.has(ytId)) {
        continue;
      }
      if (ytId) {
        seenYoutube.add(ytId);
      }
      hits.push({
        key: `archive-${sermon.id}`,
        id: ytId || String(sermon.id),
        title: sermon.title,
        thumbnail: this.sermons.thumbnailUrl(sermon),
        source: 'archive',
        sourceLabelKey: 'sermons.sourceArchive',
        watchUrl: this.sermons.openUrl(sermon),
        sermon,
      });
    }

    return hits;
  });

  ngOnInit(): void {
    void this.sermons.load();
    void this.latest.load();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closePlayer();
    this.closeYoutube();
  }

  protected onSearch(value: string): void {
    this.search = value;
    this.querySignal.set(value);
    this.sermons.setQuery(value);
  }

  protected thumbnail(sermon: Sermon): string | null {
    return this.sermons.thumbnailUrl(sermon);
  }

  protected openHit(hit: SearchHit): void {
    if (hit.latest) {
      this.openYoutube(hit.latest);
      return;
    }
    if (hit.sermon) {
      this.open(hit.sermon);
    }
  }

  protected open(sermon: Sermon): void {
    const embed = this.sermons.youtubeEmbedUrl(sermon);
    if (embed) {
      this.closeYoutube();
      this.active.set(sermon);
      this.embedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embed));
      return;
    }
    window.open(sermon.sourceUrl, '_blank', 'noopener,noreferrer');
  }

  protected closePlayer(): void {
    this.active.set(null);
    this.embedUrl.set(null);
  }

  protected openYoutube(video: LatestVideoItem): void {
    this.closePlayer();
    this.activeYoutube.set(video);
    this.youtubeEmbed.set(
      this.sanitizer.bypassSecurityTrustResourceUrl(this.latest.youtubeEmbedUrl(video.id)),
    );
  }

  protected closeYoutube(): void {
    this.activeYoutube.set(null);
    this.youtubeEmbed.set(null);
  }

  protected watchOnYoutube(sermon: Sermon): string {
    return this.sermons.openUrl(sermon);
  }

  protected tiktokWatch(id: string): string {
    const handle = this.latest.catalog()?.tiktok.handle ?? '@nagina.social.wel';
    return this.latest.tiktokWatchUrl(id, handle);
  }

  protected onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
