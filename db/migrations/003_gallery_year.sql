-- Migration 003: Add year column to gallery table
-- Allows admins to tag a photo to a specific event year, even if it was submitted later.
-- Defaults to NULL (will be treated as the year the photo was approved).

ALTER TABLE gallery ADD COLUMN year INTEGER DEFAULT NULL;
