# Orastria Checkout Page

**URL:** `https://tarot.orastria.com/book-checkout/`

## Features

### ✅ Personalized Book Cover
- Displays user's **first name** on the cover
- Shows their **birth date** (e.g., "Jan 15, 1990")
- Animated floating book with glow effect

### ✅ User ID Tracking
- UID automatically carried over from quiz
- Added to checkout URL: `?uid=abc123`
- Tracked in all conversion events

### ✅ Data Sources
Pulls user data from (in priority order):
1. **URL parameters** (`?name=...&dob=...&zodiac=...&uid=...`)
2. **localStorage** (`orastria_name`, `orastria_dob`, `orastria_zodiac`, `orastria_uid`)
3. **Fallback:** "friend", generic date

### ✅ Conversion Tracking
- Facebook Pixel: `InitiateCheckout` event on button click
- Custom event: `DeclineUpsell` when user skips

## Usage

### From Book-1 Quiz
After quiz completion, redirect to:
```javascript
window.location.href = `/book-checkout/?uid=${userData.uid}&name=${userData.name}&dob=${userData.dob}&zodiac=${userData.zodiac}`;
```

### Direct Link (with UID)
```
https://tarot.orastria.com/book-checkout/?uid=abc-123&name=Sarah&dob=1990-01-15&zodiac=Capricorn
```

## TODO

### 🔧 Integration Needed
1. **Payment URL** (line 56 in `checkout.js`)
   - Replace placeholder with real Stripe/Whop checkout link
   - Pass UID, name, and metadata

2. **Skip/Confirmation Page** (line 74 in `checkout.js`)
   - Create `/book-1/confirmation` page
   - Show "free book sent to email" message

3. **Store Quiz Data** (in quiz.js)
   - Save name, DOB, zodiac to localStorage after quiz:
     ```javascript
     localStorage.setItem('orastria_name', userName);
     localStorage.setItem('orastria_dob', userDOB);
     localStorage.setItem('orastria_zodiac', userZodiac);
     ```

## Files

- `index.html` - Main checkout page
- `checkout.css` - Styling (matches book-1 design)
- `checkout.js` - Personalization logic + CTA handlers
- `../user-tracking.js` - Loaded for UID tracking

## Personalization Examples

**URL:** `/book-checkout/?uid=a1b2&name=Sarah%20Johnson&dob=1990-01-15&zodiac=Capricorn`

**Result:**
- Hero: "Your free book is on its way, **Sarah**."
- Cover: "Sarah" (first name only)
- Cover date: "Jan 15, 1990"
- All CTAs include `uid=a1b2` in checkout URL

## Analytics

Track these in Facebook Pixel / Google Analytics:
- `PageView` - Checkout page loaded
- `InitiateCheckout` - "Get my full book" clicked (value: €7.99)
- `DeclineUpsell` - "No thanks" clicked

Link all events to `user_id` (UID) for full funnel tracking.
