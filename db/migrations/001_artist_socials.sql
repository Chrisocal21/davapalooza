-- Migration: Add social media fields to artists table
-- Run with: wrangler d1 execute davapalooza-db --remote --file=./db/migrations/001_artist_socials.sql

ALTER TABLE artists ADD COLUMN instagram TEXT;
ALTER TABLE artists ADD COLUMN tiktok TEXT;
ALTER TABLE artists ADD COLUMN spotify TEXT;
ALTER TABLE artists ADD COLUMN website TEXT;
