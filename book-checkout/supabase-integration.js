/**
 * Orastria Supabase Integration - Checkout Tracking
 * Updates add_to_cart and buy columns for user journey tracking
 */

// Export Supabase config globally for use in checkout.js
window.SUPABASE_URL = 'https://bkxgpjxfexndjwawaiph.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_qw9JxZ0SwYY5s_yOOylcgg_BWF2FnQ7';

const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

/**
 * Update submission record with add_to_cart or buy event
 * @param {string} uid - User UUID
 * @param {string} field - 'add_to_cart' or 'buy'
 */
async function trackConversion(uid, field) {
  if (!uid) {
    console.warn(`⚠️ Cannot track ${field} - no UID found`);
    return;
  }

  // Validate field
  if (field !== 'add_to_cart' && field !== 'buy') {
    console.error(`Invalid field: ${field}. Must be 'add_to_cart' or 'buy'`);
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orastria_submissions?id=eq.${uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        [field]: 'yes'
      })
    });

    if (response.ok) {
      console.log(`✓ Tracked ${field} for user:`, uid);
    } else {
      const error = await response.text();
      console.error(`Failed to track ${field}:`, response.status, error);
    }
  } catch (error) {
    console.error(`Error tracking ${field}:`, error);
  }
}

/**
 * Track add-to-cart event (checkout button click)
 */
async function trackAddToCart() {
  const uid = window.orastriaUID || localStorage.getItem('orastria_uid');
  await trackConversion(uid, 'add_to_cart');
}

/**
 * Track purchase event (thank you page load)
 */
async function trackPurchase() {
  const uid = window.orastriaUID || localStorage.getItem('orastria_uid');
  await trackConversion(uid, 'buy');
}

// Export for use in other scripts
window.orastriaTracking = {
  trackAddToCart,
  trackPurchase
};
