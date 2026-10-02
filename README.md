# Davapalooza - South O Block Party Website

A community-driven event website featuring a moderated photo gallery, artist lineups, news, and more.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2
- **Image Processing:** Sharp
- **AI Moderation:** OpenAI Vision API

## Project Structure

```
/app                    - Next.js app directory
  /page.tsx            - Home page
  /gallery             - Photo gallery
  /submit              - Photo submission form
  /artists             - Artist lineup
  /news                - News and updates
  /donate              - Donation page
  /store               - Coming soon page
  /admin               - Admin dashboard
    /dashboard         - Main admin view
    /queue/[type]      - Moderation queues
    /gallery           - Gallery management
    /artists           - Artist management
    /news              - News management

/components
  /ui                  - Reusable UI components
  /layout              - Layout components (NavBar, Footer)

/lib                   - Utility functions and helpers
```

## Design System

A screen-printed gig poster, properly typeset: flat inks on paper, hard edges, big condensed type.

### Colors

Tokens live in `tailwind.config.js` (and as CSS variables in `app/globals.css`).

| Token | Hex | Used for |
|---|---|---|
| `sky` / `bg` | `#45BEE4` | The signature field — hero, page headers, nav |
| `cream` / `surface` | `#FDF0DA` | Paper — the reading surface for page bodies and cards |
| `ink` / `text` | `#272B2C` | All text on light fields; the dark field (lineup, footer) |
| `sun-yellow` / `secondary` | `#EFB936` | Secondary buttons, highlights, accents on ink |
| `sun-orange` | `#E78B39` | Sun mark, sunset stripe |
| `sun-red` / `primary` | `#D62D38` | Primary buttons, display accents |
| `sun-red-deep` / `danger` | `#E23548` | Sun mark, errors |
| `paper`, `cream-deep`, `red-ink`, `ink-soft`, `sky-deep` | — | Tints and shades of the above, for depth and small text |

Pairing rules (these keep everything at WCAG AA):

- On **sky**: ink text only. Red, yellow and cream appear there as shapes, never as text.
- On **cream**: ink text; `sun-red` for display-size headings; `red-ink` for small red text.
- On **ink**: cream text; `sun-yellow` for accents.

### Typography

Loaded with `next/font` in `app/layout.tsx` (self-hosted, no runtime request to Google).

- **Display:** Bebas Neue — headings, the wordmark, lineup names. Fluid sizes: `text-display-sm` → `text-display-xl`.
- **Body:** League Spartan — copy, buttons, form labels.
- **Mono:** Space Mono — metadata only: dates, handles, set times, counts (`.eyebrow`).

### Building blocks

- `components/ui/PageHeader` — the sky band at the top of every inside page (title, lede, sun, torn edge).
- `components/ui/SectionHeader` — section title with optional eyebrow, subtitle and action.
- `components/ui/Button` — `primary` / `secondary` / `ghost` / `paper` / `danger`. Pass `href` to render a real link; pass `onDark` on the ink field.
- `components/ui/Card`, `Badge`, `Field` (+ `FieldGroup`, `FormError`), `FormLayout` (`FormPage`, `Steps`, `FormSuccess`).
- `components/ui/SunMark`, `Logo`, `Marquee`, `TornEdge`, `Icon` — the brand pieces. The logo is inline SVG; there is no logo image file.
- CSS helpers in `app/globals.css`: `.shell` (page container), `.eyebrow`, `.field`, `.link`, `.halftone`, `.skeleton`, `.reveal`.

### Event dates

`lib/events.ts` drives the home hero, the lineup page and the "next year" messaging. Before the event the
hero shows a countdown; on the day it says it's happening; afterwards it points to next year. Adding next
year's entry there is all it takes to switch the site over.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

\`\`\`env
# Cloudflare (required for production)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_DATABASE_ID=
CLOUDFLARE_R2_BUCKET_NAME=southoblockparty-media
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_PUBLIC_URL=

# OpenAI (required for AI moderation)
OPENAI_API_KEY=

# Admin (required)
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

# App
NEXT_PUBLIC_SITE_URL=
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Features

### Public Site
- ✅ Home page with event info and teasers
- ✅ Photo gallery (masonry grid layout)
- ✅ Photo submission form
- ✅ Artist lineup page
- ✅ News/updates feed
- ✅ Donation page (placeholder)
- ✅ Store coming soon page

### Admin Dashboard
- ✅ Password-protected admin access
- ✅ Two-tier moderation queues:
  - "Looks Good" - Auto-triaged clean submissions
  - "Needs Review" - Flagged submissions
- ✅ Gallery management
- ✅ Artist lineup management
- ✅ News post management
- ✅ Submission statistics

### Moderation Pipeline (To Be Wired)
- Text filter for blocklisted terms
- OpenAI Vision API for image scanning
- Automatic watermarking on approval
- Two-queue sorting system

## Next Steps

### Backend Integration Required
1. **Database Setup**
   - Create Cloudflare D1 database
   - Run migration scripts (see handoff.md for schema)

2. **Storage Setup**
   - Create Cloudflare R2 bucket
   - Configure public URL access

3. **API Routes** (Not Yet Implemented)
   - `/api/submit` - Photo submission handler
   - `/api/admin/queue` - Fetch queue submissions
   - `/api/admin/approve` - Approve submission
   - `/api/admin/reject` - Reject submission
   - `/api/admin/artists` - CRUD for artists
   - `/api/admin/news` - CRUD for news posts

4. **Authentication**
   - Implement session-based admin auth
   - Add middleware to protect admin routes

5. **Moderation Logic**
   - Wire text filter using blocklist
   - Connect OpenAI Vision API
   - Implement watermarking with Sharp

6. **Deployment**
   - Deploy to Vercel
   - Configure Cloudflare bindings
   - Set environment variables

## Current Status

✅ **Completed:**
- Full UI/UX design system
- All public pages (with mock data)
- All admin pages (with mock data)
- Component library
- Responsive layouts
- Dark theme styling

🔨 **In Progress:**
- API route implementation
- Database integration
- Cloudflare R2 integration
- Authentication system
- Moderation pipeline

📋 **Planned:**
- Email notifications (Phase 7)
- Donations integration (Phase 7)
- E-commerce for store (Phase 7)
- Analytics (Phase 7)
- Social sharing (Phase 7)

## Admin Access

Default admin route: `/admin`

For development, the password is hardcoded as `admin` in the login page. 
In production, this will use the `ADMIN_PASSWORD` environment variable.

## License

All rights reserved © 2026 Davapalooza
