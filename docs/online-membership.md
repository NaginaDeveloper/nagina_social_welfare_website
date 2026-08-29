# Online Community Membership

Public adults apply at **https://www.naginasocialwelfare.co.uk/membership/**. Trustees review applications in **Nagina Social Welfare Admin → Members**.

## Architecture

| Piece | Location |
|-------|----------|
| Public form | Website Angular `/membership` |
| Submit API | Cloud Function `submitMembership` (Admin functions codebase, `europe-west2`) |
| Public status | `getMembershipStatus` (application ID + email) |
| Approve / status | `approveMembership`, `updateMembershipApplication` (admin token) |
| Member portal | `membershipApi` — login, profile, donations (+ NSW-style PDF receipts), events/RSVP, newsletters, PDF certificate, password reset |
| Member donations | SumUp via `member-donation-*` checkout refs; webhook on `sumupFeeWebhook`; receipt IDs `MD-YYYYMM-####`, PDF email on payment |
| Newsletters (admin) | `memberNewslettersApi` — NSW Admin → Members → Newsletters |
| Storage | Firestore collections listed below |
| Email | SMTP via Admin `mailer.ts` (`SMTP_PASSWORD`) |

### Firestore collections

- `membership_applications`, `charity_members`, `member_secrets`, `member_invites`
- `member_password_resets`, `member_donation_intents`, `member_donations`
- `event_rsvps`, `member_newsletters`
- `website_events` (with `visibility`, `memberUpdate` for member-only content)

## Member portal routes (website)

| Route | Purpose |
|-------|---------|
| `/membership/login` | Sign in |
| `/membership/forgot-password` | Request reset email |
| `/membership/reset-password?token=` | Set new password |
| `/membership/set-password?token=` | Initial password from approval email |
| `/membership/home` | Dashboard: overview, profile, donate, events, newsletters |

## Deploy checklist

1. Install and build Admin functions:
   ```bash
   cd Nagina_Social_Welfare_Admin/functions && npm install && npm run build
   ```
2. Deploy functions (extend list as needed):
   ```bash
   firebase deploy --only functions:submitMembership,functions:getMembershipStatus,functions:approveMembership,functions:updateMembershipApplication,functions:resendMemberInvite,functions:createManualMember,functions:updateMemberStatus,functions:membershipApi,functions:memberNewslettersApi,functions:sumupFeeWebhook --project nagina-social-welfare-uk
   ```
3. Deploy Firestore rules and indexes from the Admin repo.
4. Publish the public website (GitHub Pages).
5. Publish the Flutter admin web build so **Members** (including Newsletters tab) is live at `/nsw/members`.
6. Confirm SumUp merchant webhook / checkout `return_url` reaches Admin `sumupFeeWebhook` (required for school fees and member donations).

## Trustee UAT

- [ ] Apply → approve → set password → sign in
- [ ] Edit profile (address, interests, marketing opt-in)
- [ ] Download membership PDF
- [ ] Forgot password → reset email → new password
- [ ] Member donation checkout → appears in history after webhook; PDF receipt emailed; **Get receipt** downloads same PDF; receipt number unique (`MD-…`)
- [ ] Create members-only event with extra member text → visible in member Events tab + RSVP
- [ ] Upload newsletter PDF in admin → visible when marketing opt-in enabled
- [ ] Donate tab: confirm acknowledgement checkbox before SumUp checkout
- [ ] Events tab: RSVP notice visible; RSVP stored for planning only

## GDPR notes

- Application consents: privacy notice, conduct, age 18+, optional marketing (includes newsletter archive).
- Member donate: explicit acknowledgement before checkout that payment links to membership history.
- RSVP: notice on Events tab; legitimate interest for event planning (see `docs/gdpr/record-of-processing.md`).
- Retention: `gdprRetention` sweeps password-reset tokens, stale donation intents, old RSVPs.

## Notes

- Community membership is **not** company voting membership unless trustees confirm Articles separately.
- Volunteer interests on the form are not DBS-checked roles.
- Public `/donate` remains anonymous; only member-area checkout links donations to `memberId`.
- Do **not** deploy the website repo’s deny-all `firestore.rules` over the shared project.
