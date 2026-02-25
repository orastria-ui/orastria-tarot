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

// Capture gclid from URL and store it (Google Ads)
function captureGclid() {
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  
  if (gclid) {
    localStorage.setItem('orastria_gclid', gclid);
    console.log('✓ gclid captured:', gclid.substring(0, 20) + '...');
  }
}

// Capture msclkid from URL and store it (Microsoft/Bing Ads)
function captureMsclkid() {
  const urlParams = new URLSearchParams(window.location.search);
  const msclkid = urlParams.get('msclkid');
  
  if (msclkid) {
    localStorage.setItem('orastria_msclkid', msclkid);
    console.log('✓ msclkid captured:', msclkid.substring(0, 20) + '...');
  }
}

// Store email when captured (call this from quiz)
function storeEmail(email) {
  if (email) {
    localStorage.setItem('orastria_email', email.toLowerCase().trim());
    console.log('✓ Email stored for tracking');
  }
}

// Resolve session UID: Migrate old user_id-based URLs to database id
async function resolveSessionUID() {
  const params = new URLSearchParams(window.location.search);
  const uid = params.get('uid');
  
  if (!uid || !window.supabaseClient) return; // No uid or Supabase not ready
  
  try {
    // First, check if this uid matches an actual `id` in the DB (already correct)
    const { data: byId, error: idError } = await window.supabaseClient
      .from('orastria_submissions')
      .select('id')
      .eq('id', uid)
      .maybeSingle();
    
    if (byId) {
      console.log('✓ UID is already a valid database ID');
      return; // UID is already correct
    }
    
    // If not found by `id`, try looking up by `user_id` (old format)
    const { data: byUserId, error: userIdError } = await window.supabaseClient
      .from('orastria_submissions')
      .select('id')
      .eq('user_id', uid)
      .order('created_at', { ascending: false }) // Take most recent if duplicates
      .limit(1)
      .maybeSingle();
    
    if (byUserId) {
      console.log('→ Migrating old user_id to database ID:', byUserId.id);
      
      // Update localStorage and global variable
      localStorage.setItem('orastria_uid', byUserId.id);
      window.orastriaUID = byUserId.id;
      
      // Redirect to correct URL
      params.set('uid', byUserId.id);
      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.location.replace(newURL); // replace so it doesn't add to browser history
      return;
    }
    
    // If neither found, uid is unresolvable (NULL or corrupted entry)
    console.warn('⚠️  UID not found in database (by id or user_id):', uid);
    
  } catch (err) {
    console.error('Session UID resolution error:', err);
  }
}

// Initialize on page load
(function initUserTracking() {
  const uid = getUserID();
  
  // Store globally for use in other scripts
  window.orastriaUID = uid;

  // Capture fbclid if present (Meta Ads)
  captureFbclid();
  
  // Capture gclid if present (Google Ads)
  captureGclid();
  
  // Capture msclkid if present (Microsoft/Bing Ads)
  captureMsclkid();

  // Resolve session UID (migrate old user_id-based URLs) after Supabase loads
  setTimeout(() => {
    resolveSessionUID().then(() => {
      // Track page view after migration completes
      trackPageView(window.orastriaUID || uid);
    });
  }, 1000);
})();

// Export for use in other scripts
window.getUserID = getUserID;
window.storeEmail = storeEmail;
window.captureFbclid = captureFbclid;
window.captureGclid = captureGclid;
window.captureMsclkid = captureMsclkid;
