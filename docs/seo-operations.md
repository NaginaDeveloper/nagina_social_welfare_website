# SEO operations checklist (90-day plan)

Companion to the 14 September 2026 SEO action plan. Website changes are implemented in code; this document covers **owners**, **outreach**, and **Search Console** routines.

## Named owners (fill in)

| Role | Name | Responsibility |
|------|------|----------------|
| Search priorities | _TBD_ | Keywords, Search Console review, what to improve next |
| Website changes | _TBD_ | Publish pages, internal links, titles, speed |
| Religious reviewer | _TBD_ | Approve duas, Zakat guidance, creed content; name appears on pages once set in `content-review.config.ts` |
| Local facts | _TBD_ | Address, class times, events, prayer-time notes |
| Impact approver | _TBD_ | Approve numbers/dates before `/impact/` shows them |

Until the religious reviewer and impact approver are named, those blocks stay hidden or in “awaiting approval” state. Do **not** invent rulings, trustee names, or statistics.

## NAP (keep consistent everywhere)

Use the same details on the site, directories, and partner mentions:

- **Name:** Nagina Social Welfare UK (charity **1196514**)
- **Address:** 103 Burmer Road, Peterborough PE1 3HT, United Kingdom
- **Phone:** 07831 684738
- **Email:** info@naginasocialwelfare.co.uk
- **Venue:** Markaz Deen-e-Islam (same address)

Source in code: `src/app/config/organization.config.ts` (also JSON-LD / footer / Peterborough hub).

## Outreach targets (Days 45–80)

Aim for **5–10 genuine, relevant** websites. Count only **live** links.

Suggested contacts:

1. Local Peterborough mosques and Islamic centres
2. Markaz / community partner organisations
3. Local event listing sites and council community pages
4. Local media (faith or community desks)
5. Existing charity / education partners who already know Nagina

**Do not:** buy backlink packages, spam directories, or publish near-identical city doorway pages.

## Weekly routine

| Day | Work |
|-----|------|
| Monday | Search Console: queries, indexed pages, coverage issues |
| Tue–Wed | Write and expert-check one important page |
| Thursday | Publish, add related links, test the next action (apply / WhatsApp / donate) |
| Friday | Contact a few relevant organisations; record live links |
| Month end | Report what changed, what visitors did, which pages need work |

## Search Console (existing setup)

See [google-search-console.md](./google-search-console.md).

**90-day good direction (not a guarantee):**

- More pages indexed; more **non-brand** searches show Nagina
- First movement into top 20 / top 10 for realistic Peterborough queries (e.g. prayer times)
- Five to ten relevant live inbound links targeted
- Reliable counts for resource use, event clicks, enquiries, donations

Re-submit `https://www.naginasocialwelfare.co.uk/sitemap.xml` after major URL additions (`/peterborough/`, Zakat guides, `/duas/`, `/calendar/`, `/ramadan/`, `/impact/`).

## Filling reviewer / trustees / impact in code

1. **Reviewer:** edit `src/app/config/content-review.config.ts` — set `reviewer.name`, `credentials`, `reviewedOn` on the relevant `pageId`.
2. **Trustees on About:** add entries to `PUBLIC_TRUSTEES` in the same file (empty = section hidden).
3. **Impact facts:** add only approved rows to `APPROVED_IMPACT_FACTS` (empty = awaiting-approval message on `/impact/`).

## Avoid

- AI-written religious articles without expert review
- Expanding the Zakat calculator until rules and ownership are agreed
- Treating an AI/llms file as the main SEO solution
- Competing first for huge national keywords (Ramadan, Quran) instead of local usefulness
