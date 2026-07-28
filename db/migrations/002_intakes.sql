-- Migration 002: Intake tables for vendor registration, band inquiries,
-- volunteer sign-ups, sponsor inquiries, and supporter submissions

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
  -- status values: 'new' | 'reviewed' | 'accepted' | 'declined' | 'archived'
  admin_notes TEXT
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
  -- status values: 'new' | 'reviewed' | 'accepted' | 'declined' | 'archived'
  admin_notes TEXT
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
  -- status values: 'new' | 'reviewed' | 'confirmed' | 'declined' | 'archived'
  admin_notes TEXT
);

-- Sponsor / "brought to you by" inquiries
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  interest_level TEXT,
  -- e.g. 'title', 'gold', 'silver', 'in-kind', 'other'
  message TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT
);

-- Supporter intake — photographers / videographers (link/credit exchange)
CREATE TABLE IF NOT EXISTS supporter_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  -- e.g. 'photographer', 'videographer', 'both'
  instagram TEXT,
  website TEXT,
  portfolio_url TEXT,
  other_info TEXT,
  submitted_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  -- status values: 'new' | 'reviewed' | 'accepted' | 'declined' | 'archived'
  admin_notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_band_inquiries_status ON band_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_band_inquiries_submitted_at ON band_inquiries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_status ON vendor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_submitted_at ON vendor_registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_submitted_at ON volunteers(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_status ON sponsor_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_supporter_submissions_status ON supporter_submissions(status);
