# Community membership — note for trustees and stakeholders

**Nagina Social Welfare UK**  
**Website:** https://www.naginasocialwelfare.co.uk  
**Prepared for:** trustees and client review  
**Last updated:** August 2026

---

## What this is

The **online community membership** service lets adults apply to join Nagina Social Welfare UK as **community members**, sign in to a private **member area**, and use member-only features such as card donations with receipts, events, and newsletters.

This is **separate from**:

- **Public donations** on the main Donate page (anonymous; no member account)
- **Company or charity voting membership** (unless trustees confirm otherwise in writing under the Articles)
- **Madrasa admission** (school applications use a different online form)

Community membership is **voluntary and free**. Donations are always optional and handled separately.

---

## For applicants and members

### 1. Apply online

Anyone aged **18 or over** can apply at:

**https://www.naginasocialwelfare.co.uk/membership/**

The form collects:

- Contact details and UK address  
- Optional volunteering interests (events, fundraising, outreach, admin, madrasa support, etc.)  
- Required consents: privacy notice, code of conduct, age confirmation  
- Optional marketing consent (needed to receive the member newsletter archive)

After submitting, the applicant receives an **application reference** and can **track status** at:

**https://www.naginasocialwelfare.co.uk/membership/track/**

Statuses include under review, approved, or rejected (with a reason where applicable).

### 2. Approval and first sign-in

When trustees **approve** an application in the admin system:

- The member receives a **membership number**
- An email invites them to **set a password** (one-time secure link)
- After setting a password, they sign in at **https://www.naginasocialwelfare.co.uk/membership/login/**

Members can also use **Forgot password** if they lose access.

### 3. Member area (dashboard)

Signed-in members use **https://www.naginasocialwelfare.co.uk/membership/home** with five sections:

| Section | What members can do |
|--------|---------------------|
| **Overview** | See membership number, welcome summary, download a **membership confirmation PDF**, quick links |
| **Profile** | Update address, phone, languages, volunteering interests, and marketing preferences |
| **Donate** | Make **card donations** (Zakat, Sadaqah, Lillah, Fitrana) via secure SumUp checkout; view donation history |
| **Events** | See **members-only** event details and RSVP (for planning; not a ticket system) |
| **Newsletters** | Read published newsletters (when marketing opt-in is enabled) |

The member area is available in **English and Urdu**.

---

## Member donations and receipts

Members who donate by card through the member area (not the public Donate page) get:

1. **Donation linked to their membership** — appears in their history after payment completes  
2. **A unique receipt number** — format `MD-YYYYMM-####` (e.g. `MD-202608-0001`)  
3. **An automatic email** with an **NSW-style PDF receipt** attached (same branding as cash receipts in admin)  
4. **Download again anytime** — **Get receipt** on each row in donation history  

Receipts show charity name, registration number, address, donor name, membership number (if assigned), fund type, amount, date, and payment method **Card (SumUp)**. They state that **Gift Aid is not claimed** on these donations unless separately confirmed in writing.

Before checkout, members must tick an acknowledgement that the payment will be linked to their membership record.

**Minimum donation:** £5 (via member checkout).

---

## For trustees (admin)

Trustees manage membership in **Nagina Social Welfare Admin → Members** (admin web app).

Typical workflow:

1. **Review new applications** — approve, reject, or request more information  
2. **Resend invite** if the set-password email was missed  
3. **Create manual members** when needed (e.g. legacy records)  
4. **Update member status** (e.g. suspend if required)  
5. **Publish member newsletters** (Members → Newsletters tab)  
6. **Configure website events** with member-only text where appropriate  

Approved members appear in the charity member list with their membership number and contact details.

---

## Privacy and safeguarding (summary)

- Application and profile data are processed under the charity **privacy notice** (linked on the form and member area).  
- Card donations in the member area are stored against the member account for history and receipts — not anonymous.  
- Event RSVPs are used for **planning only**; members are told this on the Events tab.  
- Marketing/newsletters require **explicit opt-in**.  
- Password reset links expire after **one hour**.  
- Old reset tokens and stale payment intents are cleaned up automatically under the charity retention schedule.

Full GDPR detail is in the charity’s record of processing and privacy pages on the website.

---

## Useful links (quick reference)

| Purpose | URL |
|--------|-----|
| Apply for membership | https://www.naginasocialwelfare.co.uk/membership/ |
| Track application | https://www.naginasocialwelfare.co.uk/membership/track/ |
| Member sign in | https://www.naginasocialwelfare.co.uk/membership/login/ |
| Member area (after sign-in) | https://www.naginasocialwelfare.co.uk/membership/home |
| Public donate (anonymous) | https://www.naginasocialwelfare.co.uk/donate/ |
| Privacy notice | https://www.naginasocialwelfare.co.uk/privacy/ |

---

## Suggested trustee checks (UAT)

Before telling members the system is fully live, trustees may wish to confirm:

- [ ] Test application → approve → set password → sign in  
- [ ] Edit profile and save  
- [ ] Download membership confirmation PDF  
- [ ] Member donation: acknowledge → pay → history updates → email receipt arrives → **Get receipt** downloads PDF  
- [ ] Members-only event visible in Events tab; RSVP saves  
- [ ] Newsletter visible when marketing opt-in is on  
- [ ] Forgot password flow works  

---

## Support

For member-facing questions, the website continues to offer **WhatsApp contact** and the general contact page. Technical or admin access issues should be raised with whoever maintains the Nagina Social Welfare Admin and website deployments.

---

*This note describes the live membership functionality on the public website and linked admin systems. Internal technical deployment detail is in `docs/online-membership.md` for developers and operators.*
