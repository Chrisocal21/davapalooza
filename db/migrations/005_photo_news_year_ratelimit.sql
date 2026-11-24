-- Migration 005
--  * photo submissions and news posts get an event_year (for the per-year archive)
--  * rate_limits table for spam protection on the public forms
-- Existing rows were all for the 2026 event, so they are backfilled to 2026.
-- (Run once. SQLite has no "ADD COLUMN IF NOT EXISTS".)

ALTER TABLE submissions ADD COLUMN event_year INTEGER;
ALTER TABLE news ADD COLUMN event_year INTEGER;

UPDATE submissions SET event_year = 2026 WHERE event_year IS NULL;
UPDATE news SET event_year = 2026 WHERE event_year IS NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_year ON submissions(event_year);
CREATE INDEX IF NOT EXISTS idx_news_year ON news(event_year);

-- One row per (scope, hashed visitor): a fixed window counter. No raw IPs stored.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start INTEGER NOT NULL
);
