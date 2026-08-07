export interface Sermon {
  readonly id: number;
  readonly title: string;
  readonly youtubeIds: readonly string[];
  readonly sourceUrl: string;
}

export interface SermonCatalog {
  readonly generatedAt: string;
  readonly source: string;
  readonly speaker: string;
  readonly channel: string;
  readonly count: number;
  readonly withYoutube: number;
  readonly sermons: Sermon[];
}
