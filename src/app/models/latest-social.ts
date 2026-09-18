export interface LatestVideoItem {
  readonly id: string;
  readonly title?: string;
  readonly publishedAt?: string | null;
  readonly thumbnail?: string;
}

export interface LatestYoutubeChannel {
  readonly channelId: string;
  readonly channelUrl: string;
  readonly videos: readonly LatestVideoItem[];
}

export interface LatestSocialCatalog {
  readonly generatedAt: string;
  readonly youtube: LatestYoutubeChannel;
  readonly naginaTv: LatestYoutubeChannel;
  readonly tiktok: {
    readonly handle: string;
    readonly profileUrl: string;
    readonly videos: readonly LatestVideoItem[];
  };
}
