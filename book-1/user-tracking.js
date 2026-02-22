/**
 * User Tracking - Unique ID per visitor
 * Generates UUID on first visit, persists in localStorage + URL
 */

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create user ID
function getUserID() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlUID = urlParams.get('uid');
  const storedUID = localStorage.getItem('orastria_uid');

  // Priority: URL param > localStorage > generate new
  if (urlUID) {
    // Save to localStorage if not already there
    if (urlUID !== storedUID) {
      localStorage.setItem('orastria_uid', urlUID);
      console.log('✓ User ID from URL:', urlUID);
    }
    return urlUID;
  }

  if (storedUID) {
    // Add to URL if missing
    updateURLWithUID(storedUID);
    console.log('✓ User ID from localStorage:', storedUID);
    return storedUID;
  }

  // Generate new UUID
  const newUID = generateUUID();
  localStorage.setItem('orastria_uid', newUID);
  updateURLWithUID(newUID);
  console.log('✓ New user ID generated:', newUID);
  
  return newUID;
}

// Update URL with UID (without page reload)
function updateURLWithUID(uid) {
  const url = new URL(window.location);
  url.searchParams.set('uid', uid);
  window.history.replaceState({}, '', url);
}

// Track page view with user ID
async function trackPageView(uid) {
  if (!window.supabaseClient) {
    console.warn('Supabase not ready for tracking');
    return;
  }

  try {
    const { error } = await window.supabaseClient
      .from('orastria_page_views')
      .insert([{
        user_id: uid,
        page: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Tracking error:', error);
    } else {
      console.log('✓ Page view tracked:', uid);
    }
  } catch (err) {
    console.error('Tracking failed:', err);
  }
}

// Capture fbclid from URL and store it
function captureFbclid() {
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  
  if (fbclid) {
    localStorage.setItem('orastria_fbclid', fbclid);
    console.log('✓ fbclid captured:', fbclid.substring(0, 20) + '...');
  }
}

// Store email when captured (call this from quiz)
function storeEmail(email) {
  if (email) {
    localStorage.setItem('orastria_email', email.toLowerCase().trim());
    console.log('✓ Email stored for tracking');
  }
}

// Initialize on page load
(function initUserTracking() {
  const uid = getUserID();
  
  // Store globally for use in other scripts
  window.orastriaUID = uid;

  // Capture fbclid if present
  captureFbclid();

  // Track page view after Supabase loads
  setTimeout(() => trackPageView(uid), 1000);
})();

// Export for use in other scripts
window.getUserID = getUserID;
window.storeEmail = storeEmail;
window.captureFbclid = captureFbclid;
