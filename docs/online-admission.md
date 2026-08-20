# Online Admission System

Public parents apply at **https://www.naginasocialwelfare.co.uk/apply/**. Staff review applications in **Markaz e Deen e Islam Admin → Applications**.

## Architecture

| Piece | Location |
|-------|----------|
| Public form | Website Angular `/apply` |
| Submit API | Cloud Function `submitAdmission` (Admin functions codebase, `europe-west2`) |
| Accept / status | `acceptApplication`, `updateApplicationStatus` (admin token) |
| Storage | Firestore `applications` |
| Directory on accept | Existing `students` + `parents` (legacy flat shape) |
| Email | SMTP via Admin `mailer.ts` (`SMTP_PASSWORD`) |

## Deploy checklist

1. Deploy Admin functions (includes admission endpoints):
   ```bash
   cd Nagina_Social_Welfare_Admin/functions && npm run build
   firebase deploy --only functions:submitAdmission,functions:acceptApplication,functions:updateApplicationStatus --project nagina-social-welfare-uk
   ```
2. Deploy / publish the public website (GitHub Pages or your usual pipeline).
3. Deploy / publish the Flutter admin web build so the **Applications** tab is live.

## Smoke test

```bash
curl -sS -X POST \
  'https://europe-west2-nagina-social-welfare-uk.cloudfunctions.net/submitAdmission' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://www.naginasocialwelfare.co.uk' \
  -d '{ ...valid payload... }'
```

## Retiring the Google Form

The previous manual form:

https://docs.google.com/forms/d/e/1FAIpQLSfRKg4Aa54VI0N7YYFhXsnvLmhkXtCqgJg92Rns3gi4gHYXqw/viewform

After staff UAT of `/apply` + Applications tab:

1. Close responses on the Google Form (or unpublish the link).
2. Keep a short redirect note in any printed leaflets: use the website **Apply online** button / `/apply`.
3. WhatsApp remains available for questions only (madrasa page secondary CTA).

Do **not** deploy the website repo’s deny-all `firestore.rules` over the shared project without a coordinated rules ownership plan — admission writes go through Cloud Functions only.
