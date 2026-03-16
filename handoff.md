# Davapalooza — southoblockparty.com
## Full System Handoff Document for Claude Copilot (VS Code)

---

## Project Overview

**Event Name:** Davapalooza  
**Domain:** www.southoblockparty.com  
**Type:** Community block party event website  
**Stack:** Next.js 14 (App Router) + Vercel + Cloudflare R2 (image storage) + Cloudflare D1 (database)  
**Admin:** Single operator (Chris), no user auth system needed for public  
**Goal:** A community-driven event site centered around a photo gallery with moderated submissions, event info, artist lineups, news, donations, and a store placeholder.

---

## Phase Order

> Phases are ordered with UI/UX and visual foundations first. External integrations and enhancements are last.

1. **Phase 1 — UI/UX Design System & Visual Identity**
2. **Phase 2 — Public Site Pages (Static + Dynamic)**
3. **Phase 3 — Photo Submission Flow**
4. **Phase 4 — Moderation Pipeline (Auto-triage + AI Scan)**
5. **Phase 5 — Admin Dashboard**
6. **Phase 6 — Database & Storage Infrastructure**
7. **Phase 7 — External Integrations & Enhancements**

---

## Phase 1 — UI/UX Design System & Visual Identity

### Aesthetic Direction

Davapalooza is a community block party — outdoor, energetic, neighborhood pride, summer heat. The design should feel like a handmade flyer that went to design school. Warm, bold, alive. Not corporate. Not generic festival. Think screen-printed poster meets modern web.

**Tone:** Warm maximalism with restraint. Loud personality, clean execution.

**Color palette (CSS variables):**
```css
:root {
  --color-bg: #0e0e0e;              /* near-black base */
  --color-surface: #1a1a1a;         /* card/panel surface */
  --color-primary: #f5c842;         /* warm golden yellow — hero accent */
  --color-secondary: #e84c2b;       /* punchy red-orange */
  --color-text: #f0ede6;            /* warm off-white body text */
  --color-muted: #7a7672;           /* secondary/placeholder text */
  --color-border: #2e2e2e;          /* subtle borders */
  --color-success: #4caf7d;         /* approved / pass states */
  --color-warning: #f5a623;         /* flagged / review states */
  --color-danger: #e84c2b;          /* reject / error states */
}
```

**Typography:**
- Display / headlines: `Bebas Neue` (Google Fonts) — tall, condensed, poster energy
- Body / UI: `DM Sans` (Google Fonts) — clean, readable, modern without being sterile
- Accent / labels: `Space Mono` (Google Fonts) — monospace for metadata, handles, timestamps

**Layout principles:**
- Dark background throughout (no light mode needed for v1)
- Full-bleed photo sections — images are the hero
- Masonry/Pinterest grid for gallery (no fixed-height cards, let photos breathe)
- Generous negative space outside of the gallery
- SVG icons only — no emoji in UI
- Mobile-first, responsive at all breakpoints

**Motion:**
- Page load: staggered fade-up on sections (CSS animation-delay)
- Gallery: images load with a subtle fade-in as they enter viewport
- Hover states: slight scale + glow on gallery tiles
- Buttons: fast color transition on hover, no bouncy/springy effects

### Global Components to Build First

```
/components/ui/
  Button.tsx          — primary, secondary, ghost variants
  Badge.tsx           — status labels (Approved, Flagged, Pending)
  Input.tsx           — text, file upload, textarea
  Card.tsx            — surface container with border + shadow
  Modal.tsx           — overlay for image preview / confirm actions
  Toast.tsx           — lightweight success/error notifications
  Spinner.tsx         — loading state
  SectionHeader.tsx   — Bebas Neue display heading + optional subtext
  NavBar.tsx          — sticky top nav, mobile hamburger
  Footer.tsx          — links, hashtags, social handles
```

### NavBar Structure

```
Logo / Davapalooza wordmark (left)
Nav links: Gallery | Artists | News | Donate | Submit Photos
Store (Coming Soon — greyed, non-clickable)
```

---

## Phase 2 — Public Site Pages

### Pages & Routes

```
/                        — Home (hero + highlights)
/gallery                 — Pinterest-style photo gallery (approved photos only)
/submit                  — Photo submission form
/artists                 — Artist lineup + past year history
/news                    — News & updates feed
/donate                  — Donation section
/store                   — Coming soon placeholder
```

### Home Page (`/`)

- Full-bleed hero with event name, date/location TBD field, hashtag
- "Submit Your Photos" CTA — primary button
- Teaser gallery strip (latest 8 approved photos, horizontal scroll on mobile)
- Artist teaser section
- Latest news card
- Donate CTA banner

### Gallery Page (`/gallery`)

- Masonry grid layout (CSS columns or react-masonry-css)
- Each tile shows: photo, submitter handle watermarked on image, hover reveals caption
- Filter bar: Year (if history exists), no other filters needed in v1
- Infinite scroll or pagination (pagination preferred for simplicity in v1)
- Lightbox on click: full photo, handle, caption, date submitted

**Watermark behavior:**
- Applied server-side at approval time using Sharp
- Burned into a copy of the image stored in R2
- Format: `@handle` in Space Mono, semi-transparent white, bottom-right corner
- Original untouched file also stored in R2 (admin only accessible)

### Submit Page (`/submit`)

See Phase 3 for full submission flow detail.

### Artists Page (`/artists`)

- Current year lineup (cards with name, genre tag, social link)
- Past years section (collapsible or tabbed by year)
- Each artist card: name, photo (optional), short bio, set time (if available)
- Admin manages this content via direct D1 edits or a simple admin form (Phase 5)

### News Page (`/news`)

- Reverse-chronological list of updates
- Each post: title, date, body text (markdown rendered), optional photo
- Admin creates/edits posts via admin dashboard (Phase 5)
- No comments, no likes — read only for public

### Donate Page (`/donate`)

- Description text + donate button
- Phase 7: connects to Stripe or PayPal
- In v1: placeholder with link to external donation platform (Venmo, Cash App, etc.)

### Store Page (`/store`)

- Full-page "Coming Soon" treatment
- Event branding, hype copy, email capture field (stores to D1)
- No e-commerce logic in v1

---

## Phase 3 — Photo Submission Flow

### Submission Form Fields

```
- Photo upload (required) — image files only, max 10MB, JPG/PNG/HEIC accepted
- Social handle (required) — used for watermark, e.g. @chrisocphoto
- Platform (optional) — Instagram / TikTok / X / Other
- Caption (optional) — max 200 characters
- Name (optional) — display name, not handle
- Agreement checkbox (required) — "I confirm I took this photo and grant permission to display it on southoblockparty.com"
```

### Submission UX

- Single-page form, mobile-optimized
- Photo preview after selection before submit
- Submit button disabled until required fields complete
- On submit: friendly confirmation screen ("Thanks! Your photo is in review.")
- No account, no login, no email required

### Submission Backend (API Route)

```
POST /api/submit
```

1. Validate file type and size
2. Generate unique submission ID
3. Upload original file to Cloudflare R2 → `submissions/pending/{id}.jpg`
4. Save submission record to D1 `submissions` table with status `pending`
5. Trigger moderation pipeline (Phase 4)
6. Return success response to client

---

## Phase 4 — Moderation Pipeline

### Overview

Every submission runs through two automated checks immediately on upload. Based on results, it is routed to one of two admin queues. Nothing goes live without admin approval.

```
Submission received
       ↓
[Check 1] Text filter — scan handle + caption for flagged words/phrases
       ↓
[Check 2] OpenAI Vision API — scan image for inappropriate content
       ↓
Both pass → Queue 1: "Looks Good"
Either flags → Queue 2: "Needs Review"
       ↓
Admin approves or rejects from dashboard
       ↓
On approve → Sharp applies watermark → watermarked copy saved to R2 → status set to `approved` → appears in gallery
On reject → status set to `rejected` → original file deleted from R2
```

### Text Filter

- Maintained blocklist stored in a config file: `/lib/moderation/blocklist.ts`
- Checks: submission handle + caption combined
- Case-insensitive, partial match
- If any match found → flag as `needs_review`
- Blocklist is editable by Chris directly in the codebase (simple string array)

```typescript
// /lib/moderation/blocklist.ts
export const BLOCKED_TERMS: string[] = [
  // Add terms here
  "example_bad_word",
];
```

### OpenAI Vision Scan

```typescript
// /lib/moderation/imageScan.ts
// Sends image to OpenAI Vision API
// Prompt: "Does this image contain nudity, violence, graphic content, 
//          or any content inappropriate for a public community event? 
//          Respond with only: PASS or FLAG"
// Model: gpt-4o (vision capable)
// If response === "FLAG" → route to needs_review queue
// If API call fails → default to needs_review (fail safe)
```

### D1 Submissions Table Schema

```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  platform TEXT,
  caption TEXT,
  name TEXT,
  original_r2_key TEXT NOT NULL,
  watermarked_r2_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  -- status values: 'pending' | 'looks_good' | 'needs_review' | 'approved' | 'rejected'
  queue TEXT,
  -- queue values: 'looks_good' | 'needs_review'
  text_filter_result TEXT,
  -- 'pass' | 'flag'
  image_scan_result TEXT,
  -- 'pass' | 'flag' | 'error'
  submitted_at TEXT NOT NULL,
  reviewed_at TEXT,
  approved_at TEXT
);
```

### Watermark Application (Sharp)

```typescript
// /lib/watermark.ts
// On admin approval:
// 1. Fetch original from R2
// 2. Use Sharp to composite "@handle" text overlay bottom-right
// 3. Font: Space Mono style, semi-transparent white, 18px
// 4. Save watermarked version to R2 → `gallery/{id}.jpg`
// 5. Update D1 record: watermarked_r2_key, status = 'approved', approved_at
```

---

## Phase 5 — Admin Dashboard

### Access

- Single protected route: `/admin`
- Simple password gate — environment variable `ADMIN_PASSWORD`
- Session stored in a cookie (24hr expiry)
- No user accounts, no OAuth — just one password Chris controls

### Admin Routes

```
/admin                   — Dashboard home (queue overview)
/admin/queue/looks-good  — Queue 1: auto-triaged clean submissions
/admin/queue/needs-review — Queue 2: flagged submissions
/admin/gallery           — Manage approved photos (reorder, remove)
/admin/artists           — Add/edit artist lineup
/admin/news              — Create/edit news posts
/admin/store-emails      — View coming-soon email captures
```

### Dashboard Home (`/admin`)

**Mobile view (pull-to-refresh):**
- Two large queue count cards: "Looks Good [N]" and "Needs Review [N]"
- Recent activity feed (last 10 actions)
- Tap queue card → goes to that queue
- Pull down to refresh counts

**Desktop view:**
- Same queue cards + expanded stats
- Recent submissions table
- Quick approve/reject from table row

### Queue Views (`/admin/queue/looks-good` and `/admin/queue/needs-review`)

Each submission card shows:
- Photo thumbnail
- Handle + platform
- Caption
- Submitted at timestamp
- Text filter result badge
- Image scan result badge
- **Approve** button (green) — triggers watermark + publishes to gallery
- **Reject** button (red) — deletes from R2, marks rejected

**Mobile:** Full-width stacked cards, large tap targets  
**Desktop:** Grid of cards, batch select + bulk approve/reject

### Admin API Routes

```
GET  /api/admin/queue?type=looks_good|needs_review
POST /api/admin/approve   { id }
POST /api/admin/reject    { id }
POST /api/admin/artists   — create/update artist
POST /api/admin/news      — create/update news post
```

---

## Phase 6 — Database & Storage Infrastructure

### Cloudflare D1 Tables

```sql
-- Submissions (defined in Phase 4)

-- Gallery (approved, public-facing)
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  caption TEXT,
  watermarked_r2_key TEXT NOT NULL,
  approved_at TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Artists
CREATE TABLE artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  bio TEXT,
  social_url TEXT,
  photo_r2_key TEXT,
  year INTEGER NOT NULL,
  set_time TEXT,
  sort_order INTEGER DEFAULT 0
);

-- News posts
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  photo_r2_key TEXT,
  published_at TEXT NOT NULL,
  updated_at TEXT
);

-- Store email captures
CREATE TABLE store_emails (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  captured_at TEXT NOT NULL
);
```

### Cloudflare R2 Bucket Structure

```
southoblockparty-media/
  submissions/
    pending/          ← original uploads, pre-review
      {id}.jpg
  gallery/            ← watermarked, approved, public
      {id}.jpg
  artists/            ← artist photos (admin uploaded)
      {id}.jpg
  news/               ← news post images (admin uploaded)
      {id}.jpg
```

### Environment Variables

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_DATABASE_ID=
CLOUDFLARE_R2_BUCKET_NAME=southoblockparty-media
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_PUBLIC_URL=https://media.southoblockparty.com

# OpenAI
OPENAI_API_KEY=

# Admin
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://www.southoblockparty.com
```

---

## Phase 7 — External Integrations & Enhancements

> These are all post-v1. Build and ship the core site first. Come back to these.

### 7.1 — Donations Integration
- Connect Stripe or PayPal to the `/donate` page
- Display a donation goal/progress bar (optional)
- Webhook to log donations to D1

### 7.2 — Store (E-commerce)
- Shopify Buy Button embed OR custom product + Stripe Checkout
- T-shirts, stickers, event merch
- Fulfillment TBD

### 7.3 — Email Notifications for Admin
- Use Resend to email Chris when:
  - New submission lands in Needs Review queue
  - Daily digest of Looks Good queue count
- Simple transactional templates, no marketing

### 7.4 — Submitter Confirmation Email
- Optional: collect email on submission form
- Send "Your photo was approved!" email via Resend when admin approves

### 7.5 — Gallery Enhancements
- Year filtering (once multi-year data exists)
- Search by handle
- Download original option (watermarked version only)

### 7.6 — Social Sharing
- Each gallery photo gets a shareable URL: `/gallery/{id}`
- OG image meta tags generated server-side for link previews

### 7.7 — Analytics
- Vercel Analytics (already built into Vercel, just enable)
- Track: gallery views, submission form starts, submission completions

### 7.8 — Sponsor Page
- Logo grid with links
- Tiered sponsor levels (Gold / Silver / Community)
- Admin-managed via dashboard

---

## File Structure Overview

```
/app
  /page.tsx                   — Home
  /gallery/page.tsx
  /submit/page.tsx
  /artists/page.tsx
  /news/page.tsx
  /donate/page.tsx
  /store/page.tsx
  /admin/page.tsx
  /admin/queue/[type]/page.tsx
  /admin/gallery/page.tsx
  /admin/artists/page.tsx
  /admin/news/page.tsx
  /api/submit/route.ts
  /api/admin/queue/route.ts
  /api/admin/approve/route.ts
  /api/admin/reject/route.ts
  /api/admin/artists/route.ts
  /api/admin/news/route.ts

/components
  /ui/                        — Global UI primitives (Phase 1)
  /gallery/                   — GalleryGrid, GalleryTile, Lightbox
  /submit/                    — SubmitForm, PhotoPreview
  /admin/                     — QueueCard, SubmissionCard, StatsBar
  /layout/                    — NavBar, Footer, AdminNav

/lib
  /db.ts                      — D1 client setup
  /r2.ts                      — R2 client setup
  /moderation/
    blocklist.ts              — Flagged word list
    textFilter.ts             — Text filter logic
    imageScan.ts              — OpenAI Vision scan
  /watermark.ts               — Sharp watermark logic
  /auth.ts                    — Admin session/cookie logic

/public
  /fonts/                     — Self-hosted fallbacks if needed

next.config.js
tailwind.config.js
.env.local
```

---

## Key Decisions & Constraints

| Decision | Choice | Reason |
|---|---|---|
| Auth for admin | Single password + cookie | Simple, no user management needed |
| Auto-approve | No | Chris approves everything, automation only sorts priority |
| Watermark timing | On approval, server-side | Never watermark before review |
| Watermark storage | Separate R2 key from original | Preserve original always |
| Image scan failure | Default to needs_review | Fail safe, never auto-approve on error |
| Notification method | None in v1 | Pull-to-refresh is enough for now |
| Store | Coming soon placeholder only | Not in scope for v1 |
| Comments/likes | None | Read-only gallery, community not moderation burden |
| Light mode | Not in v1 | Dark only, cleaner launch |

---

## Copilot Build Order

Build in this exact order to avoid dependency issues:

1. Project scaffold (Next.js 14, Tailwind, Cloudflare bindings)
2. Design system + global CSS variables + font imports
3. Global components (NavBar, Footer, Button, Card, Badge)
4. D1 schema migration + R2 bucket setup
5. Home page (static layout, no data yet)
6. Gallery page (static mock data first, wire to D1 after)
7. Submit form (UI only, then wire to API)
8. Submission API route + R2 upload
9. Text filter + image scan pipeline
10. Admin password gate + session
11. Admin dashboard home (queue counts)
12. Queue views (Looks Good + Needs Review)
13. Approve/reject API routes + watermark logic
14. Artists page + admin artists management
15. News page + admin news management
16. Store coming soon page + email capture
17. Donate page placeholder
18. Polish: animations, mobile QA, responsive fixes
19. Deploy to Vercel + configure Cloudflare bindings
20. Phase 7 integrations (post-launch)