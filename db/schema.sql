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
  approved_at TEXT
);

-- Gallery table (approved, public-facing photos)
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  handle TEXT NOT NULL,
  caption TEXT,
  watermarked_r2_key TEXT NOT NULL,
  approved_at TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
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

-- News posts table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  photo_r2_key TEXT,
  published_at TEXT NOT NULL,
  updated_at TEXT
);

-- Store email captures table
CREATE TABLE IF NOT EXISTS store_emails (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  captured_at TEXT NOT NULL
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_queue ON submissions(queue);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_approved_at ON gallery(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_artists_year ON artists(year);
CREATE INDEX IF NOT EXISTS idx_artists_sort_order ON artists(sort_order);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
