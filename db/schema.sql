-- Davapalooza Database Schema for Cloudflare D1
-- Run with: wrangler d1 execute davapalooza-db --file=./db/schema.sql

-- Submissions table (all photo submissions, pre-approval)
CREATE TABLE IF NOT EXISTS submissions (
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
  approved_at TEXT,
  event_year INTEGER
);

-- New sign-ups/photos waiting to be included in the next phone notification summary
CREATE TABLE IF NOT EXISTS pending_notifications (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);

-- Gallery table (approved, public-facing photos)
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  caption TEXT,
  watermarked_r2_key TEXT NOT NULL,
  approved_at TEXT NOT NULL,
  trashed_at TEXT,
  sort_order INTEGER DEFAULT 0,
  year INTEGER DEFAULT NULL,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  bio TEXT,
  social_url TEXT,
  instagram TEXT,
  tiktok TEXT,
  spotify TEXT,
  website TEXT,
  photo_r2_key TEXT,
  year INTEGER NOT NULL,
  set_time TEXT,
  sort_order INTEGER DEFAULT 0
);

-- News posts table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  photo_r2_key TEXT,
  published_at TEXT NOT NULL,
  updated_at TEXT,
  event_year INTEGER
);

-- Store email captures table
CREATE TABLE IF NOT EXISTS store_emails (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  unsubscribe_token TEXT,
  last_emailed_at TEXT
);

-- Band/artist interest form
CREATE TABLE IF NOT EXISTS band_inquiries (
  id TEXT PRIMARY KEY,
  band_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  genres TEXT,
  instagram TEXT,
  tiktok TEXT,
  spotify TEXT,
  website TEXT,
  other_info TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  event_year INTEGER
);

-- Vendor / market stall registration
CREATE TABLE IF NOT EXISTS vendor_registrations (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  product_description TEXT NOT NULL,
  space_needs TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  event_year INTEGER
);

-- Volunteer sign-ups
CREATE TABLE IF NOT EXISTS volunteers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  availability TEXT,
  skills TEXT,
  other_info TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  event_year INTEGER
);

-- Sponsor inquiries
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  interest_level TEXT,
  message TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  event_year INTEGER
);

-- Supporter submissions (photographers / videographers)
CREATE TABLE IF NOT EXISTS supporter_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  instagram TEXT,
  website TEXT,
  portfolio_url TEXT,
  other_info TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  event_year INTEGER
);

-- event_year = which Davapalooza the sign-up is for (see migrations/004_event_year.sql)

-- Spam protection: fixed-window counters per hashed visitor (see lib/spam.ts)
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_queue ON submissions(queue);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_approved_at ON gallery(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_artists_year ON artists(year);
CREATE INDEX IF NOT EXISTS idx_submissions_year ON submissions(event_year);
CREATE INDEX IF NOT EXISTS idx_news_year ON news(event_year);
CREATE INDEX IF NOT EXISTS idx_band_inquiries_year ON band_inquiries(event_year);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_year ON vendor_registrations(event_year);
CREATE INDEX IF NOT EXISTS idx_volunteers_year ON volunteers(event_year);
CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_year ON sponsor_inquiries(event_year);
CREATE INDEX IF NOT EXISTS idx_supporter_submissions_year ON supporter_submissions(event_year);
CREATE INDEX IF NOT EXISTS idx_artists_sort_order ON artists(sort_order);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_band_inquiries_status ON band_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_band_inquiries_submitted_at ON band_inquiries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_status ON vendor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_submitted_at ON vendor_registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_submitted_at ON volunteers(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_status ON sponsor_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_supporter_submissions_status ON supporter_submissions(status);
