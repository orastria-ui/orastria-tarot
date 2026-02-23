# ACTION_LOG - book-1 (Orastria Quiz)

## 2026-02-23 - Fix: Restore state after Stripe back navigation
**By:** Asterix
**Issue:** When user clicks Stripe checkout then navigates back, quiz resets to beginning
**Solution:** Save/restore state via sessionStorage

### Changes Made:

#### 1. quiz.js - Added state persistence functions
**Before:** No state persistence
**After:** Added `saveStateBeforeCheckout()` and `restoreStateIfReturning()`

#### 2. quiz.js - Modified `initiateCheckout()`
**Before:** Direct redirect to Stripe
**After:** Save state to sessionStorage before redirect

#### 3. quiz.js - Modified DOMContentLoaded
**Before:** Just initializes dropdowns and autocomplete
**After:** Also checks for and restores saved state on page load

### How it works:
1. When user clicks "Get My Book" (initiateCheckout), we save the entire quiz state to sessionStorage
2. When page loads, we check if there's a saved state from a pending checkout
3. If yes, we restore the state and show the thank you screen directly
4. State expires after 30 minutes for security

### To revert:
Remove the following from quiz.js:
- Lines 15-77 (STATE_KEY, CHECKOUT_FLAG, and all state persistence functions)
- Lines in DOMContentLoaded that call restoreStateIfReturning()
- Line in initiateCheckout() that calls saveStateBeforeCheckout()

---

## 2026-02-23 13:15 - Fix: Send custom properties to Klaviyo
**By:** Asterix
**Issue:** Klaviyo profiles were created without custom properties (zodiac, status, goal, etc.)
**Solution:** Pass all quiz data to createKlaviyoProfile function

### Changes Made:

#### 1. quiz.js - Modified createKlaviyoProfile call
**Before:** `createKlaviyoProfile(email, firstName, uid)`
**After:** `createKlaviyoProfile(email, firstName, uid, { zodiac, gender, status, goal, mindset, ... })`

#### 2. supabase-integration.js - Updated createKlaviyoProfile function
**Before:** Only accepted email, firstName, uid
**After:** Accepts 4th param `customProps` and sends all fields to Worker

### Next step needed:
Worker `orastria-api` needs to be updated to accept and forward these custom properties to Klaviyo API.

---
