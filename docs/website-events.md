# Website Events (MDI Admin → public site)

Staff publish dated gatherings from **Markaz e Deen e Islam Admin → Website Events**.
Published events appear on **https://www.naginasocialwelfare.co.uk/events/** under **Latest events**, then move to **Past events** after the London calendar date.

## Architecture

| Piece | Location |
|-------|----------|
| Admin UI | Flutter `WebsiteEventsScreen` (MDI sidebar) |
| Admin API | Cloud Function `websiteEventsApi` (`europe-west2`, Admin `default` codebase) |
| Storage | Firestore `website_events`; images under `website_events/{id}/…` |
| Public catalog | Storage object `events/catalog.json` (published only) |
| Public site | Angular `EventsService` + `/events` + home spotlight |

## Deploy checklist

1. Deploy Admin functions (includes `websiteEventsApi`):
   ```bash
   cd Nagina_Social_Welfare_Admin/functions && npm run build
   firebase deploy --only functions:websiteEventsApi --project nagina-social-welfare-uk
   ```
2. Deploy / publish the Flutter admin web build so the **Website Events** tab is live.
3. Deploy / publish the public website.

On first publish (or call `POST …/rebuildCatalog` with the admin token), `events/catalog.json` is written. Until then the public site still shows standing programmes (Namaz course, Sisters gathering, Zikr & Fikr).

Storage rules must allow public read on `events/**` and `website_events/**` (same pattern as `books/**`). Deploy from Admin:

```bash
cd Nagina_Social_Welfare_Admin
firebase deploy --only storage --project nagina-social-welfare-uk
```

Keep [`storage.rules`](../Nagina_Social_Welfare_Admin/storage.rules) in sync with `seedha-rasta/storage.rules` if that repo also deploys Storage.

## Staff smoke test

1. Admin → Website Events → Add event (title, description, date, images).
2. Save draft, then Publish.
3. Open `/events` — event appears under Latest (or Past if the date is already over).
4. Unpublish — it disappears from the public catalog.
