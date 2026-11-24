-- Migration 006
--  * store waitlist: a private unsubscribe token per address, and when we last emailed them
-- (Run once. SQLite has no "ADD COLUMN IF NOT EXISTS".)

ALTER TABLE store_emails ADD COLUMN unsubscribe_token TEXT;
ALTER TABLE store_emails ADD COLUMN last_emailed_at TEXT;

UPDATE store_emails SET unsubscribe_token = lower(hex(randomblob(16))) WHERE unsubscribe_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_store_emails_token ON store_emails(unsubscribe_token);
