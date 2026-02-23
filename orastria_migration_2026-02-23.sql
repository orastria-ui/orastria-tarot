-- Orastria Schema Migration
-- Date: 2026-02-23
-- Issue: Add missing columns for book-1 quiz fields
-- Auditor: JP (Master Orchestrator)
--
-- ⚠️ DO NOT RUN WITHOUT ASTERIX APPROVAL ⚠️
-- This migration adds 4 critical columns that quiz collects but DB lacks.

-- =============================================================================
-- PHASE 1: Add Missing Columns
-- =============================================================================

-- Add user_id (UUID for cross-session tracking)
ALTER TABLE orastria_submissions
  ADD COLUMN IF NOT EXISTS user_id UUID;

COMMENT ON COLUMN orastria_submissions.user_id IS 
  'Unique user tracking ID from orastriaUID system. Links sessions, page views, and conversions.';

-- Add fbclid (Facebook Click ID for ad attribution)
ALTER TABLE orastria_submissions
  ADD COLUMN IF NOT EXISTS fbclid TEXT;

COMMENT ON COLUMN orastria_submissions.fbclid IS 
  'Facebook Click ID from ad campaigns. Used for ROI tracking and attribution.';

-- Add love_language (quiz question response)
ALTER TABLE orastria_submissions
  ADD COLUMN IF NOT EXISTS love_language TEXT;

COMMENT ON COLUMN orastria_submissions.love_language IS 
  'User love language preference (words_of_affirmation, quality_time, gifts, acts_of_service, physical_touch).';

-- Add includes (book topics array)
ALTER TABLE orastria_submissions
  ADD COLUMN IF NOT EXISTS includes TEXT[];

COMMENT ON COLUMN orastria_submissions.includes IS 
  'Book topics user selected from quiz (e.g., ["love", "career", "money", "health"]).';

-- =============================================================================
-- PHASE 2: Create Indexes
-- =============================================================================

-- Index for user_id lookups (used heavily by checkout, thank-you pages)
CREATE INDEX IF NOT EXISTS idx_orastria_user_id 
  ON orastria_submissions(user_id);

-- Index for fbclid (Facebook attribution queries)
CREATE INDEX IF NOT EXISTS idx_orastria_fbclid 
  ON orastria_submissions(fbclid);

-- =============================================================================
-- PHASE 3: Update RLS Policies (if needed)
-- =============================================================================

-- Existing policies should cover new columns, but verify:
-- - "Allow public inserts" permits anon users to INSERT (includes new columns)
-- - "Service role full access" permits service_role to SELECT/UPDATE/DELETE

-- No policy changes needed - new columns inherit existing INSERT/SELECT permissions.

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Run after migration to confirm schema:

-- 1. Check columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orastria_submissions'
  AND column_name IN ('user_id', 'fbclid', 'love_language', 'includes')
ORDER BY column_name;

-- 2. Check indexes created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'orastria_submissions'
  AND indexname IN ('idx_orastria_user_id', 'idx_orastria_fbclid');

-- 3. Test insert (use real anon key)
-- INSERT INTO orastria_submissions (
--   user_id, email, first_name, last_name, date_birth, 
--   sun_sign, genre, single, color_book, variant,
--   fbclid, love_language, includes
-- ) VALUES (
--   gen_random_uuid(), 'test@example.com', 'Test', 'User', '1990-01-01',
--   'Capricorn', 'Other', false, '#1a1a2e', 'book-1',
--   'fb.1.1740000000.test', 'quality_time', ARRAY['love', 'career']
-- );

-- =============================================================================
-- ROLLBACK PLAN (if something breaks)
-- =============================================================================

-- To rollback this migration:
-- 
-- DROP INDEX IF EXISTS idx_orastria_fbclid;
-- DROP INDEX IF EXISTS idx_orastria_user_id;
-- ALTER TABLE orastria_submissions DROP COLUMN IF EXISTS includes;
-- ALTER TABLE orastria_submissions DROP COLUMN IF EXISTS love_language;
-- ALTER TABLE orastria_submissions DROP COLUMN IF EXISTS fbclid;
-- ALTER TABLE orastria_submissions DROP COLUMN IF EXISTS user_id;

-- =============================================================================
-- MIGRATION LOG
-- =============================================================================

-- Migration applied: [DATE/TIME]
-- Applied by: [SERVICE_ROLE_USER]
-- Verified by: [TEST_SUBMISSION_ID]
-- Notes: [ANY ISSUES OR OBSERVATIONS]
