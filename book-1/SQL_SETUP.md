# Supabase Table Setup for User Tracking

## 1. Page Views Table

Run this in Supabase SQL Editor:

```sql
-- Create page views tracking table
CREATE TABLE IF NOT EXISTS public.orastria_page_views (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for fast lookups by user_id
CREATE INDEX idx_page_views_user_id ON public.orastria_page_views(user_id);
CREATE INDEX idx_page_views_timestamp ON public.orastria_page_views(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.orastria_page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts" ON public.orastria_page_views
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow read for authenticated users only
CREATE POLICY "Allow authenticated reads" ON public.orastria_page_views
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

## 2. Add user_id column to existing submissions table

```sql
-- Add user_id column to orastria_submissions if it doesn't exist
ALTER TABLE public.orastria_submissions 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_submissions_user_id 
ON public.orastria_submissions(user_id);
```

## How It Works

**First Visit:**
1. User lands on https://tarot.orastria.com/book-1/
2. JavaScript generates UUID (e.g., `a1b2c3d4-5678-...`)
3. URL updates to: `https://tarot.orastria.com/book-1/?uid=a1b2c3d4-5678-...`
4. UUID stored in `localStorage` (persists across sessions)
5. Page view tracked in `orastria_page_views` table

**Return Visit:**
1. UUID retrieved from localStorage
2. URL auto-updated with `?uid=...`
3. Same user_id used throughout journey

**Form Submission:**
1. All form data saved to `orastria_submissions` with `user_id`
2. Can track full user journey: page views → form submission

**Benefits:**
- Track partial completions (drop-off analysis)
- Link multiple sessions to same user
- No cookies needed (uses localStorage + URL)
- Works across page refreshes
- Survives browser restarts (localStorage)
