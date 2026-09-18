/**
 * Fetches latest YouTube (org + Nagina TV RSS) and TikTok (profile embed) videos.
 * Writes public/videos/latest.json for the Sermons page.
 *
 * Usage: node scripts/fetch-latest-videos.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'videos', 'latest.json');

const ORG_YOUTUBE = {
  channelId: 'UCXYDl2oloZFQ51zTmjvPm2A',
  channelUrl: 'https://www.youtube.com/@naginasocialwelfareuk7419',
  label: 'org',
};
const NAGINA_TV = {
  channelId: 'UCvPVENp4K1PRSP8BvDFLlhQ',
  channelUrl: 'https://www.youtube.com/user/92nagina/',
  label: 'naginaTv',
};
const TIKTOK_HANDLE = 'nagina.social.wel';
const TIKTOK_PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;
const TIKTOK_EMBED_URL = `https://www.tiktok.com/embed/@${TIKTOK_HANDLE}`;
const LIMIT = 6;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function fetchYoutubeLatest(channelId) {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/atom+xml' } });
  if (!res.ok) {
    throw new Error(`YouTube RSS HTTP ${res.status} for ${channelId}`);
  }
  const xml = await res.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const videos = [];
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
    if (videos.length >= LIMIT) break;
  }
  return videos;
}

async function fetchTiktokLatest() {
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
  const fromPaths = [...html.matchAll(/\/video\/(\d{15,})/g)].map((m) => m[1]);
  const ids = [...new Set(fromPaths)];
  return ids.slice(0, LIMIT).map((id) => ({ id }));
}

async function main() {
  const [youtube, naginaTv, tiktok] = await Promise.all([
    fetchYoutubeLatest(ORG_YOUTUBE.channelId),
    fetchYoutubeLatest(NAGINA_TV.channelId),
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

  const catalog = {
    generatedAt: new Date().toISOString(),
    youtube: {
      channelId: ORG_YOUTUBE.channelId,
      channelUrl: ORG_YOUTUBE.channelUrl,
      videos: youtube,
    },
    naginaTv: {
      channelId: NAGINA_TV.channelId,
      channelUrl: NAGINA_TV.channelUrl,
      videos: naginaTv,
    },
    tiktok: {
      handle: `@${TIKTOK_HANDLE}`,
      profileUrl: TIKTOK_PROFILE_URL,
      videos: tiktok,
    },
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  console.log(
    `Wrote ${OUT} (youtube=${youtube.length}, naginaTv=${naginaTv.length}, tiktok=${tiktok.length})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
