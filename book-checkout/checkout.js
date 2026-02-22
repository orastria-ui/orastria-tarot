/**
 * Orastria Checkout - Personalization & CTA handlers
 */

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

function personalizeCheckout() {
  const userData = getUserData();
  console.log('✓ Checkout personalization:', userData);
  
  const nameEl = document.getElementById('co-name');
  if (nameEl && userData.name) nameEl.textContent = userData.name;
  
  const coverNameEl = document.getElementById('co-cover-name');
  if (coverNameEl && userData.name) {
    coverNameEl.textContent = userData.name.split(' ')[0];
  }
  
  const coverDateEl = document.getElementById('co-cover-date');
  if (coverDateEl && userData.dob) {
    coverDateEl.textContent = formatDate(userData.dob);
  }
  
  window.checkoutUserData = userData;
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
