
---

## 2026-02-23 17:00 - Fix: Purchase tracking with deduplication
**By:** Asterix
**Issue:** Purchase event firing on every page load, including renewals and repeat visits

### New Logic:
1. ✅ Check UID exists in URL (required)
2. ✅ Query Supabase to check if buy != 'yes' (NEW purchase only)
3. ✅ If already purchased → DON'T fire Purchase event
4. ✅ If NEW purchase → Fire Purchase with event_id for deduplication
5. ✅ After fire → Update Supabase (buy=true) + Klaviyo (pay?=yes)

### Changes:
- Removed automatic Purchase fire on page load
- Added Supabase verification before firing
- Added event_id (uid + timestamp) for Meta deduplication
- Source of truth: Supabase, not localStorage
- Supabase and Klaviyo updated AFTER successful fire

### Event ID Format:
`purchase_{uid}_{timestamp}`

### To Revert:
```bash
git checkout HEAD~1 -- thank-you-book/index.html
git push origin main
```
