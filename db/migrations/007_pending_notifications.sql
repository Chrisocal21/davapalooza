-- Migration 007
--  * pending_notifications: new sign-ups and photos wait here until the cron sends ONE
--    summary to the organizer's phone (daily, or every 15 minutes on event day)
-- (Safe to run more than once.)

CREATE TABLE IF NOT EXISTS pending_notifications (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pending_notifications_created ON pending_notifications(created_at);
