/**
 * Orastria Checkout - Personalization & CTA handlers
 */

// ── PERSONALIZATION ───────────────────────────────────────────

function getUserData() {
  const params = new URLSearchParams(window.location.search);
  
  // Try URL params first, fallback to localStorage
  return {
    name: params.get('name') || localStorage.getItem('orastria_name') || 'friend',
    dob: params.get('dob') || localStorage.getItem('orastria_dob') || '',
    zodiac: params.get('zodiac') || localStorage.getItem('orastria_zodiac') || '',
    uid: params.get('uid') || localStorage.getItem('orastria_uid') || window.orastriaUID || ''
  };
}

function formatDate(dobString) {
  if (!dobString) return 'Jan 1, 1990';
  
  try {
    // Expecting format: YYYY-MM-DD or similar
    const date = new Date(dobString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    return dobString || 'Jan 1, 1990';
  }
}

function personalizeCheckout() {
  const userData = getUserData();
  
  console.log('✓ Checkout personalization:', userData);
  
  // Update hero title with name
  const nameEl = document.getElementById('co-name');
  if (nameEl && userData.name) {
    nameEl.textContent = userData.name;
  }
  
  // Update book cover name
  const coverNameEl = document.getElementById('co-cover-name');
  if (coverNameEl && userData.name) {
    const firstName = userData.name.split(' ')[0]; // Use first name only for cover
    coverNameEl.textContent = firstName;
  }
  
  // Update book cover date
  const coverDateEl = document.getElementById('co-cover-date');
  if (coverDateEl && userData.dob) {
    coverDateEl.textContent = formatDate(userData.dob);
  }
  
  // Update zodiac glyph (optional - could add zodiac-specific SVG paths)
  // For now, keeping the generic zodiac symbol
  
  // Store for analytics
  window.checkoutUserData = userData;
}

// ── CHECKOUT HANDLERS ─────────────────────────────────────────

document.getElementById('co-checkout-btn').addEventListener('click', () => {
  const userData = getUserData();
  
  // TODO: Replace with real payment URL (Stripe/Whop)
  const checkoutUrl = `https://checkout.example.com?uid=${userData.uid}&name=${encodeURIComponent(userData.name)}`;
  
  console.log('Checkout clicked:', checkoutUrl);
  
  // Track conversion event
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: 7.99,
      currency: 'EUR',
      content_name: 'Orastria Full Book'
    });
  }
  
  // Redirect to payment (placeholder for now)
  alert(`Checkout: ${checkoutUrl}\n\nTODO: Replace with real payment link`);
  // window.location.href = checkoutUrl;
});

document.getElementById('co-skip-btn').addEventListener('click', () => {
  const userData = getUserData();
  
  // TODO: Replace with confirmation/thank you page
  const skipUrl = `/book-1/confirmation?uid=${userData.uid}`;
  
  console.log('Skip clicked:', skipUrl);
  
  // Track decline event
  if (window.fbq) {
    window.fbq('trackCustom', 'DeclineUpsell', {
      content_name: 'Orastria Full Book'
    });
  }
  
  // Redirect to free book confirmation
  alert(`Skip: ${skipUrl}\n\nTODO: Create confirmation page`);
  // window.location.href = skipUrl;
});

// ── CAROUSEL ANIMATION ────────────────────────────────────────

(function initCarousel() {
  const track = document.getElementById('co-carousel-track');
  if (!track) return;

  // Clone all original items and append for seamless loop
  const originals = Array.from(track.children);
  originals.forEach(item => track.appendChild(item.cloneNode(true)));

  const speed = 0.6; // px per frame
  let offset = 0;
  let paused = false;

  // Pause on hover
  track.addEventListener('mouseenter', () => paused = true);
  track.addEventListener('mouseleave', () => paused = false);

  function tick() {
    if (!paused) {
      offset += speed;
      
      // Calculate half-width (one set of items)
      const halfWidth = originals.reduce((sum, el) => {
        return sum + el.offsetWidth + 16; // 16 = gap
      }, 0);

      if (offset >= halfWidth) offset -= halfWidth;
      track.style.transform = `translateX(-${offset}px)`;
    }
    
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
})();

// ── INIT ──────────────────────────────────────────────────────

// Wait for user-tracking.js to initialize UID
setTimeout(personalizeCheckout, 500);

console.log('✓ Orastria checkout loaded');
