#!/usr/bin/env python3
"""Refresh public/sermons/catalog.json from https://seedharastah.com/audio_video.php"""

from __future__ import annotations

import json
import re
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
}
BASE = "https://seedharastah.com"
OUT = Path(__file__).resolve().parents[1] / "public" / "sermons" / "catalog.json"


def fetch(url: str, retries: int = 4) -> str:
    last: Exception | None = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.read().decode("utf-8", errors="replace")
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.2 * (i + 1))
    assert last is not None
    raise last


def main() -> None:
    entries: dict[int, str] = {}
    for page in range(1, 18):
        url = f"{BASE}/audio_video.php" if page == 1 else f"{BASE}/audio_video.php?page={page}"
        html = fetch(url)
        for m in re.finditer(
            r'href="videodetail\.php\?vid=(\d+)"[^>]*>\s*([^<]+?)\s*<', html, re.I
        ):
            vid = int(m.group(1))
            title = unescape(re.sub(r"\s+", " ", m.group(2))).strip()
            if title and vid not in entries:
                entries[vid] = title
        print(f"page {page}: {len(entries)} unique", flush=True)

    yt_re = re.compile(
        r"youtube\.com/embed/([A-Za-z0-9_-]{6,})|youtube\.com/watch\?v=([A-Za-z0-9_-]{6,})",
        re.I,
    )

    def resolve(item: tuple[int, str]) -> dict:
        vid, title = item
        html = fetch(f"{BASE}/videodetail.php?vid={vid}")
        youtube_ids: list[str] = []
        for m in yt_re.finditer(html):
            yid = m.group(1) or m.group(2)
            if yid and yid not in youtube_ids:
                youtube_ids.append(yid)
        return {
            "id": vid,
            "title": title,
            "youtubeIds": youtube_ids,
            "sourceUrl": f"{BASE}/videodetail.php?vid={vid}",
        }

    sermons: list[dict] = []
    failed: list[dict] = []
    items = sorted(entries.items(), reverse=True)
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(resolve, it): it[0] for it in items}
        done = 0
        for fut in as_completed(futs):
            done += 1
            vid = futs[fut]
            try:
                sermons.append(fut.result())
            except Exception as e:  # noqa: BLE001
                failed.append({"id": vid, "error": str(e)})
            if done % 25 == 0 or done == len(items):
                print(f"resolved {done}/{len(items)}", flush=True)

    sermons.sort(key=lambda s: s["id"], reverse=True)
    with_yt = sum(1 for s in sermons if s["youtubeIds"])
    catalog = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": f"{BASE}/audio_video.php",
        "speaker": "Baba Ji Sarkar",
        "channel": "https://www.youtube.com/user/92nagina/",
        "count": len(sermons),
        "withYoutube": with_yt,
        "sermons": sermons,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}: {len(sermons)} sermons, {with_yt} with YouTube, {len(failed)} failed")


if __name__ == "__main__":
    main()
