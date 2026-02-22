# Thank You Page

**URL:** `https://tarot.orastria.com/thank-you-book/`

## Features

### ✅ Personalized for User
- Hero title: "Payment confirmed, **[FirstName]**. ✨"
- Book cover shows their name
- All content uses first name only (e.g., "Sarah" not "Sarah Johnson")

### ✅ Animated Checkmark
- SVG checkmark animates on page load
- Ring draws first, then tick appears
- Pulsing glow effect

### ✅ UID Tracking
- Automatically pulls UID from URL or localStorage
- Tracks page view with Facebook Pixel
- Tracks "Purchase" conversion event (€7.99)

### ✅ What's Included
- 3-step "What happens next" timeline
- Book preview with chapter list
- 30-day money-back guarantee
- Social sharing (WhatsApp + copy link)

## Usage

### After Payment
Redirect from checkout/payment success to:
```
/thank-you-book/?uid=abc123&name=Sarah+Johnson
```

### Data Sources
Pulls name from (in priority order):
1. **URL parameter:** `?name=Sarah Johnson`
2. **localStorage:** `orastria_name`
3. **Fallback:** "friend"

### Facebook Pixel Events
Automatically fires on page load:
- `PageView`
- `Purchase` (value: 7.99, currency: EUR)

## Files

- `index.html` - Main thank you page
- `thank-you.css` - Styling (animated checkmark, steps, book preview)
- `../user-tracking.js` - Loaded for UID tracking

## Example

**URL:** `/thank-you-book/?uid=a1b2c3d4&name=Sarah%20Johnson`

**Result:**
- Hero: "Payment confirmed, **Sarah**. ✨"
- Cover: "Sarah" (first name only)
- UID tracked in all analytics

## Integration

### From Checkout Page
After successful Stripe/Whop payment:
```javascript
const userData = {
  uid: window.orastriaUID,
  name: localStorage.getItem('orastria_name')
};

window.location.href = `/thank-you-book/?uid=${userData.uid}&name=${encodeURIComponent(userData.name)}`;
```

### Expected Flow
1. User completes quiz → localStorage stores name
2. User buys on checkout page → payment succeeds
3. Redirect to `/thank-you-book/?uid=...&name=...`
4. Page shows personalized confirmation
5. Email delivery happens (separate process)

## Assets

Uses shared assets from book-1:
- Logo: `../book-1/assets/images/logo.avif`
- User tracking: `../user-tracking.js`

Make sure book-1 assets are deployed.
