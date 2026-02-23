# Supabase Schema Audit - Orastria

**Date:** 2026-02-23  
**Auditor:** JP (Master Orchestrator)  
**Issue:** Database schema vs. Quiz fields vs. Webhook payload mismatch

---

## Executive Summary

**CRITICAL FINDING:** The database is missing 4 key columns that the quiz collects and the webhook sends:
1. `user_id` (UUID for tracking) - **CRITICAL**
2. `fbclid` (Facebook Click ID for attribution)
3. `love_language` (quiz question response)
4. `includes` (book topics selection - array)

**Additionally:** Many legacy columns from old variants (v1/v2/cas) are unused by book-1 quiz.

---

## Current Database Schema

**Table:** `orastria_submissions`

### Columns (59 total)
```sql
-- Identity & Timestamps
id UUID PRIMARY KEY
created_at TIMESTAMP WITH TIME ZONE
updated_at TIMESTAMP WITH TIME ZONE

-- User Information
email TEXT
first_name TEXT
last_name TEXT

-- Birth Information
date_birth DATE
hcur_min_am TEXT
place_of_birth TEXT
place_birth_coordonate JSONB

-- Astrological Data
sun_sign TEXT
sun_sign_option TEXT              -- ⚠️ NOT USED by book-1
genre TEXT
single BOOLEAN

-- Reading Details
answer_question TEXT
answer_answer TEXT
teaser_reading TEXT               -- ⚠️ NOT USED by book-1
color_book TEXT

-- Navigation & Flow (Legacy from v1/v2/cas)
lang TEXT
last_step TEXT                    -- ⚠️ NOT USED by book-1
from_source TEXT                  -- ⚠️ NOT USED by book-1
from_old TEXT                     -- ⚠️ NOT USED by book-1
buy_variation TEXT                -- ⚠️ NOT USED by book-1

-- Purchase & Conversion (Legacy)
buy BOOLEAN
click_buy TIMESTAMP               -- ⚠️ NOT USED by book-1
add_to_cart_fired BOOLEAN         -- ⚠️ NOT USED by book-1
stripe_link_click BOOLEAN         -- ⚠️ NOT USED by book-1

-- Payment Integration (Legacy)
stripe_customer_id TEXT           -- ⚠️ NOT USED by book-1
stripe_subscription_id TEXT       -- ⚠️ NOT USED by book-1
klaviyo_id TEXT                   -- ⚠️ NOT USED by book-1

-- Metadata
variant TEXT
user_agent TEXT
ip_address INET
```

---

## Quiz Fields (book-1/quiz.js)

**What the quiz actually collects:**

| Field | Question | Data Type | DB Column | Status |
|-------|----------|-----------|-----------|--------|
| email | "What's your email?" | string | ✅ `email` | Match |
| name (first_name/last_name) | "What's your name?" | string | ✅ `first_name`, `last_name` | Match |
| dob (year/month/day) | "What's your date of birth?" | date | ✅ `date_birth` | Match |
| birthTime | "What time were you born?" | string | ✅ `hcur_min_am` | Match |
| birthPlace | "Where were you born?" | string | ✅ `place_of_birth` | Match |
| zodiac | (calculated) | string | ✅ `sun_sign` | Match |
| gender | "What's your gender?" | string | ✅ `genre` | Match |
| status | "Relationship status?" | string | ✅ `single` (boolean) | Match |
| goal | "What's your life goal?" | string | ✅ `answer_question` | Match |
| mindset | "How's your mindset?" | string | ✅ `answer_answer` | Match |
| loveLanguage | "What's your love language?" | string | ❌ **MISSING** | No column! |
| includes | "What topics interest you?" | array | ❌ **MISSING** | No column! |
| coverColor | "Book cover color?" | string | ✅ `color_book` | Match |
| **user_id** | (auto-generated UUID) | uuid | ❌ **MISSING** | **CRITICAL!** |
| fbclid | (tracked from FB ads) | string | ❌ **MISSING** | No column! |

---

## Webhook Payload (n8n)

**What quiz.js sends to n8n webhook:**

```json
{
  "user_id": "4cfee660-94ad-4ad2-8806-4c4f72ce414d",  // ❌ NOT IN DB
  "tracker_id": "1740319200x7k3m9a",                 // ❌ NOT IN DB
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "date_of_birth": "Jan 15, 1990 2:30 pm",          // Format differs
  "hour_birth": "2:30 pm",
  "place_of_birth": "New York, NY, USA",
  "place_coordonates": "",                           // Empty (could add lat/lng)
  "genre": "Female",
  "single": "No",
  "color_book": "#4a3f35",
  "zodiac": "Capricorn",
  "goal": "career",
  "mindset": "growth",
  "love_language": "quality_time",                   // ❌ NOT IN DB
  "includes": "love, career, money",                 // ❌ NOT IN DB
  "all_question": "Gender, Date of Birth...",        // ❌ NOT IN DB
  "all_response": "Female, Jan 15, 1990..."          // ❌ NOT IN DB
}
```

---

## Supabase Integration (book-1/supabase-integration.js)

**What actually gets inserted into Supabase:**

```js
{
  user_id: window.orastriaUID || null,              // ❌ Column doesn't exist!
  email: formData.email,
  first_name: formData.firstName,
  last_name: formData.lastName,
  date_birth: formData.dateBirth,                   // DATE format
  hcur_min_am: formData.birthTime,
  place_of_birth: formData.birthPlace,
  place_birth_coordonate: formData.placeCoords,     // JSONB {lat, lng}
  sun_sign: formData.zodiac,
  genre: formData.gender,
  single: formData.status === 'single',
  answer_question: formData.goal,
  answer_answer: formData.mindset,
  color_book: formData.coverColor,
  variant: 'book-1',
  user_agent: navigator.userAgent,
  ip_address: ipAddress,                            // From api.ipify.org
  fbclid: fbclid,                                   // ❌ Column doesn't exist!
  lang: 'en'
}
```

**Note:** Supabase integration tries to insert `user_id` and `fbclid`, but these columns don't exist, causing silent failures or data loss.

---

## Critical Issues

### 1. **user_id Column Missing (CRITICAL)**
- **Impact:** Cannot track users across sessions
- **Used by:** Tracking system, checkout page, thank-you page
- **Consequence:** User personalization broken, analytics incomplete
- **Fix:** `ALTER TABLE ADD COLUMN user_id UUID;`

### 2. **fbclid Column Missing (HIGH)**
- **Impact:** Cannot attribute conversions to Facebook ads
- **Used by:** Facebook Pixel, attribution tracking
- **Consequence:** ROI tracking broken
- **Fix:** `ALTER TABLE ADD COLUMN fbclid TEXT;`

### 3. **love_language Column Missing (MEDIUM)**
- **Impact:** Losing quiz response data
- **Used by:** Webhook payload, potentially for personalization
- **Consequence:** Incomplete user profile
- **Fix:** `ALTER TABLE ADD COLUMN love_language TEXT;`

### 4. **includes Column Missing (MEDIUM)**
- **Impact:** Losing book topics selection
- **Used by:** Webhook payload, book customization intent
- **Consequence:** Can't segment users by interests
- **Fix:** `ALTER TABLE ADD COLUMN includes TEXT[];` (array of topics)

### 5. **Webhook Reads Nothing from Database**
- **Impact:** Webhook gets direct payload, not database truth
- **Current flow:** Quiz → (parallel) → Supabase + n8n webhook
- **Problem:** If Supabase insert fails, webhook still fires with stale data
- **Recommended:** Webhook should read from database after insert

---

## Recommended Fixes

### Phase 1: Add Missing Columns (URGENT)
**Coordinate with Asterix before running!**

```sql
-- Add missing critical columns
ALTER TABLE orastria_submissions
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS fbclid TEXT,
  ADD COLUMN IF NOT EXISTS love_language TEXT,
  ADD COLUMN IF NOT EXISTS includes TEXT[];

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_orastria_user_id ON orastria_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_orastria_fbclid ON orastria_submissions(fbclid);

-- Add comment
COMMENT ON COLUMN orastria_submissions.user_id IS 'Unique user tracking ID from orastriaUID';
COMMENT ON COLUMN orastria_submissions.fbclid IS 'Facebook Click ID for ad attribution';
COMMENT ON COLUMN orastria_submissions.love_language IS 'User love language preference from quiz';
COMMENT ON COLUMN orastria_submissions.includes IS 'Book topics user selected (array)';
```

### Phase 2: Update Supabase Integration (URGENT)
No changes needed - `supabase-integration.js` already tries to insert these fields!

### Phase 3: Modify Webhook to Read from Database (RECOMMENDED)
**Current flow:**
```
Quiz → Supabase (insert)
     → n8n webhook (direct payload)
```

**Recommended flow:**
```
Quiz → Supabase (insert) → get inserted record → n8n webhook (database data)
```

**Benefits:**
- Single source of truth (database)
- Webhook always has complete, validated data
- No mismatch between DB and webhook
- Easier to replay webhooks from database

**Implementation:**
Modify `quiz.js` to:
1. Insert to Supabase
2. Get returned record with all fields
3. Send that record to webhook

### Phase 4: Clean Up Legacy Columns (OPTIONAL)
If old variants (v1/v2/cas) are deprecated, consider archiving unused columns:
- `sun_sign_option`, `teaser_reading`, `last_step`, `from_source`, `from_old`, `buy_variation`
- `click_buy`, `add_to_cart_fired`, `stripe_link_click`
- `stripe_customer_id`, `stripe_subscription_id`, `klaviyo_id`

**Don't drop them yet** - Asterix might use them for old flows!

---

## Migration Strategy

### Step 1: Coordinate with Asterix ✋
**Before making ANY schema changes:**
1. Share this audit with Asterix
2. Confirm they're not using `user_id`, `fbclid`, `love_language`, `includes` columns differently
3. Confirm legacy columns can stay (don't break their old flows)
4. Get explicit approval on migration SQL

### Step 2: Run Migration (After Approval)
```bash
# Connect to Supabase
psql $SUPABASE_URL

# Run migration script (see Phase 1 SQL above)
\i orastria_migration_2026-02-23.sql

# Verify columns added
\d orastria_submissions
```

### Step 3: Test Submission
1. Submit test quiz on tarot.orastria.com/book-1
2. Verify `user_id`, `fbclid`, `love_language`, `includes` populate
3. Check webhook receives complete data
4. Verify no errors in console

### Step 4: Modify Webhook (After DB Migration)
Only after Phase 1 is complete and tested:
- Update quiz.js to send database record to webhook (not direct form data)
- This ensures webhook always reflects database truth

---

## Files Audited

1. `/root/.openclaw/workspace/supabase-orastria-schema.sql` - Current database schema
2. `/root/.openclaw/workspace/orastria-migration/repo/book-1/supabase-integration.js` - What gets inserted
3. `/root/.openclaw/workspace/orastria-migration/repo/book-1/quiz.js` - What quiz collects + webhook payload
4. `/root/.openclaw/workspace/orastria-migration/repo/book-1/SQL_SETUP.md` - Setup instructions (if exists)

---

## Next Actions

1. ✋ **STOP** - Don't run migration yet
2. 📨 **Message Asterix** - Share this audit, get confirmation
3. ✅ **Get approval** - Confirm column additions won't break their work
4. 🛠️ **Run migration** - Add 4 missing columns
5. 🧪 **Test** - Submit quiz, verify data flows
6. 🔄 **Update webhook** - Read from database instead of direct payload

---

**Audit Complete:** 2026-02-23 13:50 UTC  
**Status:** Awaiting Asterix coordination before migration
