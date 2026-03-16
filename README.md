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

### Colors
- **Primary:** #f5c842 (Golden Yellow)
- **Secondary:** #e84c2b (Red-Orange)
- **Background:** #0e0e0e (Near Black)
- **Surface:** #1a1a1a (Card/Panel)
- **Success:** #4caf7d (Green)
- **Warning:** #f5a623 (Orange)
- **Danger:** #e84c2b (Red)

### Typography
- **Display:** Bebas Neue (Headers)
- **Body:** DM Sans (Main text)
- **Mono:** Space Mono (Metadata, handles)

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
