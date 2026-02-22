/**
 * Orastria Checkout - Personalization & CTA handlers
 */

// ── SUPABASE CONFIG ───────────────────────────────────────────
const SUPABASE_URL = 'https://bkxgpjxfexndjwawaiph.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qw9JxZ0SwYY5s_yOOylcgg_BWF2FnQ7';

// ── PERSONALIZATION ───────────────────────────────────────────

function getUserData() {
  const params = new URLSearchParams(window.location.search);
  
  return {
    name: params.get('name') || localStorage.getItem('orastria_name') || 'friend',
    email: params.get('email') || localStorage.getItem('orastria_email') || '',
    dob: params.get('dob') || localStorage.getItem('orastria_dob') || '',
    zodiac: params.get('zodiac') || localStorage.getItem('orastria_zodiac') || '',
    uid: params.get('uid') || localStorage.getItem('orastria_uid') || window.orastriaUID || ''
  };
}

async function fetchUserFromDB(uid) {
  if (!uid) {
    console.log('⚠️ No UID provided to fetchUserFromDB');
    return null;
  }
  
  console.log('→ Fetching user from database for UID:', uid);
  
  try {
    const url = `${SUPABASE_URL}/rest/v1/orastria_submissions?user_id=eq.${uid}`;
    console.log('→ Query URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    console.log('← Response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch user from DB:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('← Response data:', data.length, 'records found');
    
    if (data && data.length > 0) {
      const user = data[0];
      console.log('✓ User record:', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        sun_sign: user.sun_sign
      });
      
      // Build full name
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'friend';
      console.log('→ Built full name:', fullName);
      
      // Store in localStorage for future visits
      if (user.email) localStorage.setItem('orastria_email', user.email);
      if (fullName !== 'friend') localStorage.setItem('orastria_name', fullName);
      if (user.date_birth) localStorage.setItem('orastria_dob', user.date_birth);
      if (user.sun_sign) localStorage.setItem('orastria_zodiac', user.sun_sign);
      
      return {
        name: fullName,
        email: user.email || '',
        dob: user.date_birth || '',
        zodiac: user.sun_sign || '',
        uid: uid
      };
    }
    
    console.warn('⚠️ No records found for UID:', uid);
    return null;
  } catch (error) {
    console.error('❌ Exception fetching user from DB:', error);
    return null;
  }
}

function formatDate(dobString) {
  if (!dobString) return 'Jan 1, 1990';
  try {
    const date = new Date(dobString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    return dobString || 'Jan 1, 1990';
  }
}

async function personalizeCheckout() {
  console.log('━━━ PERSONALIZING CHECKOUT ━━━');
  const userData = getUserData();
  console.log('Initial userData:', userData);
  
  // If we have a UID but no name, try to fetch from database
  if (userData.uid && userData.name === 'friend') {
    console.log('→ Name is "friend", attempting database lookup...');
    const dbUser = await fetchUserFromDB(userData.uid);
    if (dbUser) {
      console.log('✓ Database user found, merging data');
      Object.assign(userData, dbUser);
    } else {
      console.warn('⚠️ Database lookup returned null');
    }
  } else {
    console.log('→ Skipping database lookup (UID:', userData.uid, '| name:', userData.name + ')');
  }
  
  console.log('Final userData:', userData);
  
  const nameEl = document.getElementById('co-name');
  if (nameEl) {
    console.log('→ Updating page title name to:', userData.name);
    nameEl.textContent = userData.name;
  } else {
    console.error('❌ Element #co-name not found!');
  }
  
  const coverNameEl = document.getElementById('co-cover-name');
  if (coverNameEl && userData.name) {
    const firstName = userData.name.split(' ')[0];
    console.log('→ Updating book cover name to:', firstName);
    coverNameEl.textContent = firstName;
  }
  
  const coverDateEl = document.getElementById('co-cover-date');
  if (coverDateEl && userData.dob) {
    const formattedDate = formatDate(userData.dob);
    console.log('→ Updating book cover date to:', formattedDate);
    coverDateEl.textContent = formattedDate;
  }
  
  window.checkoutUserData = userData;
  console.log('━━━ PERSONALIZATION COMPLETE ━━━');
}

// ── CHECKOUT HANDLERS ─────────────────────────────────────────

document.getElementById('co-checkout-btn').addEventListener('click', async () => {
  const userData = getUserData();
  
  // Track in Supabase
  if (window.orastriaTracking) {
    await window.orastriaTracking.trackAddToCart();
  }
  
  // Track InitiateCheckout in Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: 24.99,
      currency: 'USD',
      content_name: 'Orastria Full Book'
    });
  }
  
  // Redirect to Stripe checkout via Worker
  const checkoutUrl = `https://api.orastria.org/checkout/remarketing?uid=${encodeURIComponent(userData.uid)}&email=${encodeURIComponent(userData.email)}&name=${encodeURIComponent(userData.name)}`;
  window.location.href = checkoutUrl;
});

document.getElementById('co-skip-btn').addEventListener('click', () => {
  const userData = getUserData();
  
  // Track decline
  if (window.fbq) {
    window.fbq('trackCustom', 'DeclineUpsell', {
      content_name: 'Orastria Full Book'
    });
  }
  
  // Redirect to free book confirmation
  window.location.href = `/thank-you-book?uid=${userData.uid}&free=true`;
});

// ── CAROUSEL ANIMATION ────────────────────────────────────────

(function initCarousel() {
  const track = document.getElementById('co-carousel-track');
  if (!track) return;

  const originals = Array.from(track.children);
  originals.forEach(item => track.appendChild(item.cloneNode(true)));

  const speed = 0.6;
  let offset = 0;
  let paused = false;

  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  function tick() {
    if (!paused) {
      offset += speed;
      const halfWidth = originals.reduce((sum, el) => sum + el.offsetWidth + 16, 0);
      if (offset >= halfWidth) offset -= halfWidth;
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ── INIT ──────────────────────────────────────────────────────
setTimeout(personalizeCheckout, 500);
console.log('✓ Orastria checkout loaded');
