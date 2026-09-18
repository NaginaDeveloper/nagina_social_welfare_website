import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { allowedOrigins } from './cors';
import { allowMemoryRateLimit, clientIp } from './rateLimit';
import { setSecurityHeaders } from './security';

const YOUTUBE_CHANNEL_ID = 'UCXYDl2oloZFQ51zTmjvPm2A';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@naginasocialwelfareuk7419';
const NAGINA_TV_CHANNEL_ID = 'UCvPVENp4K1PRSP8BvDFLlhQ';
const NAGINA_TV_CHANNEL_URL = 'https://www.youtube.com/user/92nagina/';
const TIKTOK_HANDLE = 'nagina.social.wel';
const TIKTOK_PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;
const TIKTOK_EMBED_URL = `https://www.tiktok.com/embed/@${TIKTOK_HANDLE}`;
const LIMIT = 6;
const CACHE_HOURS = 6;
const CACHE_DOC = 'social_videos/latest';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

if (getApps().length === 0) {
  initializeApp();
}

export type LatestVideo = {
  readonly id: string;
  readonly title?: string;
  readonly publishedAt?: string | null;
  readonly thumbnail?: string;
};

export type LatestYoutubeChannel = {
  readonly channelId: string;
  readonly channelUrl: string;
  readonly videos: readonly LatestVideo[];
};

export type LatestSocialCatalog = {
  readonly generatedAt: string;
  readonly youtube: LatestYoutubeChannel;
  readonly naginaTv: LatestYoutubeChannel;
  readonly tiktok: {
    readonly handle: string;
    readonly profileUrl: string;
    readonly videos: readonly LatestVideo[];
  };
};

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function fetchYoutubeLatest(
  channelId: string,
  limit = LIMIT,
): Promise<LatestVideo[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/atom+xml' },
  });
  if (!res.ok) {
    throw new Error(`YouTube RSS HTTP ${res.status} for ${channelId}`);
  }
  const xml = await res.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const videos: LatestVideo[] = [];
  for (const entry of entries) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
    if (!id) continue;
    videos.push({
      id,
      title: decodeXml(title || id),
      publishedAt: publishedAt || null,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
    if (videos.length >= limit) break;
  }
  return videos;
}

export async function fetchTiktokLatest(limit = LIMIT): Promise<LatestVideo[]> {
  const res = await fetch(TIKTOK_EMBED_URL, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-GB,en;q=0.9',
      Referer: TIKTOK_PROFILE_URL,
    },
  });
  if (!res.ok) {
    throw new Error(`TikTok embed HTTP ${res.status}`);
  }
  const html = await res.text();
  const ids = [...new Set([...html.matchAll(/\/video\/(\d{15,})/g)].map((m) => m[1]))];
  return ids.slice(0, limit).map((id) => ({ id }));
}

export async function buildLatestCatalog(): Promise<LatestSocialCatalog> {
  const [youtube, naginaTv, tiktok] = await Promise.all([
    fetchYoutubeLatest(YOUTUBE_CHANNEL_ID),
    fetchYoutubeLatest(NAGINA_TV_CHANNEL_ID),
    fetchTiktokLatest(),
  ]);
  if (!youtube.length) {
    throw new Error('No org YouTube videos found');
  }
  if (!naginaTv.length) {
    throw new Error('No Nagina TV videos found');
  }
  if (!tiktok.length) {
    throw new Error('No TikTok videos found');
  }
  return {
    generatedAt: new Date().toISOString(),
    youtube: {
      channelId: YOUTUBE_CHANNEL_ID,
      channelUrl: YOUTUBE_CHANNEL_URL,
      videos: youtube,
    },
    naginaTv: {
      channelId: NAGINA_TV_CHANNEL_ID,
      channelUrl: NAGINA_TV_CHANNEL_URL,
      videos: naginaTv,
    },
    tiktok: {
      handle: `@${TIKTOK_HANDLE}`,
      profileUrl: TIKTOK_PROFILE_URL,
      videos: tiktok,
    },
  };
}

function applyGetCors(req: { get: (name: string) => string | undefined; method?: string }, res: {
  set: (k: string, v: string) => void;
  status: (code: number) => { json: (body: unknown) => void; send: (body: string) => void };
}): boolean {
  const origin = req.get('origin');
  const allowed = allowedOrigins();
  if (origin && allowed.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  } else if (origin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return false;
  }
  return true;
}

export const latestSocialVideos = onRequest(
  {
    region: 'europe-west2',
    cors: false,
    invoker: 'public',
    timeoutSeconds: 30,
    memory: '256MiB',
  },
  async (req, res) => {
    setSecurityHeaders(res);

    if (!applyGetCors(req, res)) {
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const ip = clientIp(req);
    if (!allowMemoryRateLimit(`latest-videos:${ip}`, 40, 60_000)) {
      res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
      return;
    }

    const db = getFirestore();
    const ref = db.doc(CACHE_DOC);

    try {
      const snap = await ref.get();
      const cached = snap.data() as
        | { catalog?: LatestSocialCatalog; expiresAt?: Timestamp }
        | undefined;
      const expiresAt = cached?.expiresAt?.toMillis?.() ?? 0;
      if (cached?.catalog && expiresAt > Date.now()) {
        res.set('Cache-Control', 'public, max-age=300');
        res.status(200).json(cached.catalog);
        return;
      }

      const catalog = await buildLatestCatalog();
      const expires = Timestamp.fromMillis(Date.now() + CACHE_HOURS * 60 * 60 * 1000);
      await ref.set({ catalog, expiresAt: expires, updatedAt: Timestamp.now() });

      res.set('Cache-Control', 'public, max-age=300');
      res.status(200).json(catalog);
    } catch (err) {
      logger.error('latestSocialVideos failed', err);
      const snap = await ref.get();
      const stale = snap.data()?.catalog as LatestSocialCatalog | undefined;
      if (stale) {
        res.set('Cache-Control', 'public, max-age=60');
        res.status(200).json(stale);
        return;
      }
      res.status(502).json({ error: 'Unable to load latest videos right now.' });
    }
  },
);
