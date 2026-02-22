# User ID Tracking - Deployment Summary

## ✅ Implemented Across All Flows

User ID tracking is now active on:

1. **Landing Page** (`/`) - Track visitor entry point
2. **V1 Flow** (`/v1/`) - Elegant tarot reading flow
3. **V2 Flow** (`/v2/`) - Casino Royale experience
4. **V3 Flow** (`/v3/`) - Simplified flow
5. **Book-1 Flow** (`/book-1/`) - Full astrology book quiz

## How It Works

### On Every Page:
1. Visitor lands on any Orastria page
2. UUID generated (if first visit) or retrieved from localStorage
3. URL updated: `https://tarot.orastria.com/v1/?uid=a1b2c3d4-5678-...`
4. Page view tracked in Supabase (`orastria_page_views` table)

### Cross-Flow Tracking:
- User starts on landing page → UUID created
- Clicks "Start V1" → **Same UUID** carried over in URL
- Completes form → Submission linked to same UUID
- Returns tomorrow → **Same UUID** retrieved from localStorage

### Data Captured:
- **Page views:** user_id, page, referrer, timestamp
- **Form submissions:** user_id + all form data
- **Analytics:** Track conversion funnel, drop-off points

## Files Changed (Commit bc573f8)

```
index.html                      → Added user-tracking.js
user-tracking.js                → New (root level, shared)

v1/index.html                   → Added user-tracking.js
v1/user-tracking.js             → New (copy)
v1/supabase-integration.js      → Added user_id field

v2/index.html                   → Added user-tracking.js
v2/user-tracking.js             → New (copy)
v2/supabase-integration.js      → Added user_id field

v3/index.html                   → Added user-tracking.js
v3/user-tracking.js             → New (copy)

book-1/user-tracking.js         → Already done (af39db0)
book-1/supabase-integration.js  → Already done (af39db0)
```

## Supabase Setup Required

**Run once in Supabase SQL Editor:**

```sql
-- 1. Create page views table
CREATE TABLE IF NOT EXISTS public.orastria_page_views (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_user_id ON public.orastria_page_views(user_id);
CREATE INDEX idx_page_views_timestamp ON public.orastria_page_views(timestamp DESC);

ALTER TABLE public.orastria_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.orastria_page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON public.orastria_page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Add user_id to submissions
ALTER TABLE public.orastria_submissions 
ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE INDEX IF NOT EXISTS idx_submissions_user_id 
ON public.orastria_submissions(user_id);
```

## Testing

Visit any page:
- Open browser console (F12)
- Check logs for: `✓ New user ID generated: [UUID]`
- Verify URL has: `?uid=...`
- Refresh page → Same UID persists
- Open incognito → New UID generated

## Analytics Queries

**Track conversion funnel:**
```sql
SELECT 
  COUNT(DISTINCT pv.user_id) as visitors,
  COUNT(DISTINCT s.user_id) as conversions,
  ROUND(COUNT(DISTINCT s.user_id)::numeric / COUNT(DISTINCT pv.user_id) * 100, 2) as conversion_rate
FROM orastria_page_views pv
LEFT JOIN orastria_submissions s ON pv.user_id = s.user_id
WHERE pv.timestamp > NOW() - INTERVAL '7 days';
```

**Drop-off by page:**
```sql
SELECT 
  page,
  COUNT(DISTINCT user_id) as visitors
FROM orastria_page_views
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY page
ORDER BY visitors DESC;
```

## Live Status

✅ **Deployed:** GitHub Pages will rebuild in ~1-2 minutes  
✅ **All flows:** Landing, V1, V2, V3, Book-1  
⏳ **Supabase:** Awaiting SQL setup (see above)

After Supabase setup, tracking will be fully operational across all flows.
