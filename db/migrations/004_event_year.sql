-- Migration 004: tag every sign-up with the event year it is for.
--
-- Lets the admin keep each year's bands, vendors, volunteers, sponsors and
-- supporters in its own archive while new sign-ups go to the upcoming year.
-- Existing rows were all collected for the 2026 event, so they are backfilled to 2026.
-- (Run once. SQLite has no "ADD COLUMN IF NOT EXISTS".)

ALTER TABLE band_inquiries ADD COLUMN event_year INTEGER;
ALTER TABLE vendor_registrations ADD COLUMN event_year INTEGER;
ALTER TABLE volunteers ADD COLUMN event_year INTEGER;
ALTER TABLE sponsor_inquiries ADD COLUMN event_year INTEGER;
ALTER TABLE supporter_submissions ADD COLUMN event_year INTEGER;

UPDATE band_inquiries SET event_year = 2026 WHERE event_year IS NULL;
UPDATE vendor_registrations SET event_year = 2026 WHERE event_year IS NULL;
UPDATE volunteers SET event_year = 2026 WHERE event_year IS NULL;
UPDATE sponsor_inquiries SET event_year = 2026 WHERE event_year IS NULL;
UPDATE supporter_submissions SET event_year = 2026 WHERE event_year IS NULL;

CREATE INDEX IF NOT EXISTS idx_band_inquiries_year ON band_inquiries(event_year);
CREATE INDEX IF NOT EXISTS idx_vendor_registrations_year ON vendor_registrations(event_year);
CREATE INDEX IF NOT EXISTS idx_volunteers_year ON volunteers(event_year);
CREATE INDEX IF NOT EXISTS idx_sponsor_inquiries_year ON sponsor_inquiries(event_year);
CREATE INDEX IF NOT EXISTS idx_supporter_submissions_year ON supporter_submissions(event_year);
