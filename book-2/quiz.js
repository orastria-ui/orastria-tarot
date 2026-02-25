/* ============================================================
   ORASTRIA QUIZ — JAVASCRIPT (book-2 variant)
   10 steps instead of 13, combined birth info
   ============================================================ */

// ── STATE ──────────────────────────────────────────────────
const state = {
  gender: '',
  dob: { month: null, day: null, year: null },
  birthTime: '',
  birthPlace: '',
  zodiac: '',
  status: '',
  goal: '',
  mindset: '',
  loveLanguage: '',
  includes: [],
  name: '',
  email: '',
  coverColor: '#1a1a2e',
  coverColorSpine: '#0f0f1a',
};

let currentStep = 0;
let maxStep = 10; // book-2 has 10 steps

// ══════════════════════════════════════════════════════════════════
// LIVE COUNTER ANIMATION
// ══════════════════════════════════════════════════════════════════

function initLiveCounter() {
  const counter = document.getElementById('bookCount');
  if (!counter) return;

  // Start with random number between 480-560
  let count = 480 + Math.floor(Math.random() * 80);
  counter.textContent = count;

  // Increment every 3-8 seconds
  setInterval(() => {
    const increment = Math.random() < 0.3 ? 2 : 1; // 30% chance of +2
    count += increment;
    counter.textContent = count;
  }, 3000 + Math.random() * 5000);
}

// ══════════════════════════════════════════════════════════════════
// FAQ TOGGLE
// ══════════════════════════════════════════════════════════════════

function toggleFaq(element) {
  // Close other FAQs
  document.querySelectorAll('.faq-item.open').forEach(item => {
    if (item !== element) item.classList.remove('open');
  });
  // Toggle this one
  element.classList.toggle('open');
}

// ══════════════════════════════════════════════════════════════════
// SCROLL TO GENDER
// ══════════════════════════════════════════════════════════════════

function scrollToGender() {
  const genderSection = document.querySelector('.gender-label');
  if (genderSection) {
    genderSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ══════════════════════════════════════════════════════════════════
// STATE PERSISTENCE
// ══════════════════════════════════════════════════════════════════

const QUIZ_STATE_KEY = 'orastria_quiz_progress_v2';
const STATE_KEY = 'orastria_quiz_state_v2';
const CHECKOUT_FLAG = 'orastria_checkout_pending';

function saveQuizState() {
  const saveData = {
    state: { ...state },
    currentStep: currentStep,
    timestamp: Date.now()
  };
  localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(saveData));
}

function loadQuizState() {
  try {
    const saved = localStorage.getItem(QUIZ_STATE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(QUIZ_STATE_KEY);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

function clearQuizState() {
  localStorage.removeItem(QUIZ_STATE_KEY);
}

function saveStateBeforeCheckout() {
  const saveData = {
    state: { ...state },
    currentStep: currentStep,
    timestamp: Date.now()
  };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(saveData));
  sessionStorage.setItem(CHECKOUT_FLAG, 'true');
}

function restoreStateIfReturning() {
  const checkoutPending = sessionStorage.getItem(CHECKOUT_FLAG);
  const savedData = sessionStorage.getItem(STATE_KEY);
  if (!checkoutPending || !savedData) return false;
  try {
    const parsed = JSON.parse(savedData);
    if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
      clearCheckoutState();
      return false;
    }
    Object.assign(state, parsed.state);
    currentStep = parsed.currentStep;
    return true;
  } catch (e) {
    clearCheckoutState();
    return false;
  }
}

function clearCheckoutState() {
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(CHECKOUT_FLAG);
}

function applyRestoredState() {
  if (state.zodiac) populateZodiacReveal(state.zodiac);
  if (state.name) {
    updateBookCoverName(state.name);
    updateBookCoverDate();
  }
  if (state.coverColor) {
    document.getElementById('book-bg')?.setAttribute('fill', state.coverColor);
    document.getElementById('book-spine')?.setAttribute('fill', state.coverColorSpine);
  }
  showScreen('screen-thankyou');
  const finalPreview = document.getElementById('final-book-preview');
  const srcSVG = document.getElementById('book-cover')?.querySelector('svg');
  if (srcSVG && finalPreview) finalPreview.innerHTML = srcSVG.outerHTML;
  const tyName = document.getElementById('ty-name');
  if (tyName) tyName.textContent = state.name || 'friend';
  clearCheckoutState();
}

// ══════════════════════════════════════════════════════════════════
// SESSION RESUME
// ══════════════════════════════════════════════════════════════════

window.addEventListener('orastria-session-ready', function(e) {
  const session = e.detail;
  if (session.last_step > 0 && session.last_step < 10 && !session.email && currentStep === 0) {
    const savedProgress = loadQuizState();
    if (savedProgress && savedProgress.currentStep >= session.last_step) {
      Object.assign(state, savedProgress.state);
      currentStep = savedProgress.currentStep;
      if (state.zodiac && currentStep >= 2) populateZodiacReveal(state.zodiac);
      if (state.name && currentStep >= 9) {
        updateBookCoverName(state.name);
        updateBookCoverDate();
      }
      if (state.coverColor && currentStep >= 9) {
        document.getElementById('book-bg')?.setAttribute('fill', state.coverColor);
        document.getElementById('book-spine')?.setAttribute('fill', state.coverColorSpine);
      }
      showScreen('screen-quiz');
      showStepWithoutTracking(currentStep);
    }
  }
});

// ── ZODIAC DATA ─────────────────────────────────────────────
const ZODIAC = {
  Aries:       { emoji:'♈', dates:'Mar 21–Apr 19', traits:['🔥 Bold','⚡ Driven','🎯 Fearless'],  desc:'As {g}, you charge into life with unstoppable energy — a natural-born leader who thrives on challenge.' },
  Taurus:      { emoji:'♉', dates:'Apr 20–May 20', traits:['🌿 Grounded','💎 Loyal','🎨 Creative'], desc:'As {g}, you build with patience and grace — your steadfast nature creates security and beauty everywhere you go.' },
  Gemini:      { emoji:'♊', dates:'May 21–Jun 20', traits:['💬 Witty','✨ Curious','🌀 Adaptable'], desc:'As {g}, your mind moves at lightning speed — you are the communicator, the connector, the eternal seeker.' },
  Cancer:      { emoji:'♋', dates:'Jun 21–Jul 22', traits:['🌊 Intuitive','💞 Nurturing','🏠 Deep'],    desc:'As {g}, your emotional intelligence is extraordinary — you feel things deeply and protect those you love fiercely.' },
  Leo:         { emoji:'♌', dates:'Jul 23–Aug 22', traits:['👑 Magnetic','☀️ Warm','🎭 Bold'],      desc:'As {g}, you carry the sun within you — your natural charisma lights up every room and inspires those around you.' },
  Virgo:       { emoji:'♍', dates:'Aug 23–Sep 22', traits:['🔬 Precise','🌱 Devoted','📚 Wise'],   desc:'As {g}, your sharp mind and careful heart create mastery — you turn chaos into order with quiet brilliance.' },
  Libra:       { emoji:'♎', dates:'Sep 23–Oct 22', traits:['⚖️ Fair','🌸 Charming','🕊️ Peaceful'], desc:'As {g}, you seek balance and beauty in all things — your grace and diplomacy make you an irreplaceable presence.' },
  Scorpio:     { emoji:'♏', dates:'Oct 23–Nov 21', traits:['🔮 Intense','🦅 Perceptive','🌑 Deep'], desc:'As {g}, you see beyond the surface — your magnetic depth and fierce loyalty forge bonds that last lifetimes.' },
  Sagittarius: { emoji:'♐', dates:'Nov 22–Dec 21', traits:['🏹 Adventurous','🌍 Visionary','🔥 Free'],  desc:'As {g}, you carry a bold adventurous spirit — always ready to leap toward new horizons with confidence and fire.' },
  Capricorn:   { emoji:'♑', dates:'Dec 22–Jan 19', traits:['⛰️ Determined','🏆 Ambitious','🎯 Steady'],desc:'As {g}, your discipline and vision set you apart — you build empires quietly, one strategic step at a time.' },
  Aquarius:    { emoji:'♒', dates:'Jan 20–Feb 18', traits:['⚡ Original','🌐 Visionary','🤝 Humane'],  desc:'As {g}, you think years ahead of everyone else — your revolutionary mind is here to change the world.' },
  Pisces:      { emoji:'♓', dates:'Feb 19–Mar 20', traits:['🌊 Empathic','🎨 Creative','✨ Dreamy'],  desc:'As {g}, you move between worlds with effortless grace — your empathy and creativity make you a true soul artist.' },
};

const RARE_TRAITS = {
  Aries:'courage &amp; passion', Taurus:'patience &amp; beauty', Gemini:'wit &amp; adaptability',
  Cancer:'empathy &amp; intuition', Leo:'charisma &amp; warmth', Virgo:'precision &amp; devotion',
  Libra:'balance &amp; grace', Scorpio:'depth &amp; perception', Sagittarius:'creativity &amp; determination',
  Capricorn:'ambition &amp; discipline', Aquarius:'vision &amp; originality', Pisces:'empathy &amp; creativity',
};

const RARE_COUNTS = {
  Aries:79304,Taurus:91042,Gemini:84231,Cancer:88104,Leo:92460,Virgo:86733,
  Libra:89120,Scorpio:81992,Sagittarius:89469,Capricorn:83107,Aquarius:87654,Pisces:90213,
};

const ZODIAC_GLYPHS = {
  Aries:       'M10 18 C10 18 3 12 3 7 C3 4 6 2 10 2 C14 2 17 4 17 7 C17 12 10 18 10 18 M10 2 L10 18',
  Taurus:      'M3 8 C3 5 6 3 10 3 C14 3 17 5 17 8 C17 11 14 13 10 13 C6 13 3 11 3 8 M10 13 L10 19 M7 19 L13 19',
  Gemini:      'M4 3 L16 3 M4 17 L16 17 M4 3 L4 17 M16 3 L16 17 M10 10 L4 10 M10 10 L16 10',
  Cancer:      'M3 8 C3 5 6 3 9 3 C12 3 15 5 15 8 M5 12 C5 15 8 17 11 17 C14 17 17 15 17 12 M3 8 C5 8 6 9 6 10 C6 11 5 12 3 12 M17 8 C15 8 14 9 14 10 C14 11 15 12 17 12',
  Leo:         'M10 10 C10 10 5 8 5 5 C5 3 7 2 9 3 C11 4 10 6 10 8 C10 10 10 18 10 18 C10 18 13 17 15 18 C17 19 18 18 18 16 C18 14 16 13 14 13 C12 13 10 14 10 16',
  Virgo:       'M5 2 L5 13 C5 16 7 18 10 18 C13 18 15 16 15 13 L15 8 M10 8 C10 8 10 4 13 3 C15 2 17 4 17 7 M5 8 C5 8 7 8 10 8',
  Libra:       'M3 14 L17 14 M3 17 L17 17 M10 14 C10 14 5 11 5 7 C5 4 7 2 10 2 C13 2 15 4 15 7 C15 11 10 14 10 14',
  Scorpio:     'M3 4 L3 13 C3 16 5 18 8 18 C11 18 13 16 13 13 L13 9 M13 9 C13 9 14 11 16 11 C18 11 19 10 19 8 M13 11 L16 14 L19 11',
  Sagittarius: 'M3 17 L17 3 M9 3 L17 3 L17 11 M3 9 L9 17',
  Capricorn:   'M4 3 L4 13 C4 16 6 18 9 18 C12 18 14 16 14 13 C14 10 12 8 10 8 C12 8 14 6 14 4 C14 3 13 2 12 3 C11 4 12 5 12 6 C12 8 10 9 8 9',
  Aquarius:    'M3 7 C5 5 7 9 9 7 C11 5 13 9 15 7 C17 5 19 7 19 7 M3 13 C5 11 7 15 9 13 C11 11 13 15 15 13 C17 11 19 13 19 13',
  Pisces:      'M10 3 L10 17 M3 5 C3 5 5 10 3 15 M17 5 C17 5 15 10 17 15 M3 5 C6 5 14 5 17 5 M3 15 C6 15 14 15 17 15',
};

function getZodiac(month, day) {
  const m = parseInt(month), d = parseInt(day);
  if ((m===3&&d>=21)||(m===4&&d<=19))   return 'Aries';
  if ((m===4&&d>=20)||(m===5&&d<=20))   return 'Taurus';
  if ((m===5&&d>=21)||(m===6&&d<=20))   return 'Gemini';
  if ((m===6&&d>=21)||(m===7&&d<=22))   return 'Cancer';
  if ((m===7&&d>=23)||(m===8&&d<=22))   return 'Leo';
  if ((m===8&&d>=23)||(m===9&&d<=22))   return 'Virgo';
  if ((m===9&&d>=23)||(m===10&&d<=22))  return 'Libra';
  if ((m===10&&d>=23)||(m===11&&d<=21)) return 'Scorpio';
  if ((m===11&&d>=22)||(m===12&&d<=21)) return 'Sagittarius';
  if ((m===12&&d>=22)||(m===1&&d<=19))  return 'Capricorn';
  if ((m===1&&d>=20)||(m===2&&d<=18))   return 'Aquarius';
  return 'Pisces';
}

// ══════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  populateDaySelect();
  populateYearSelect();
  populateHourSelect();

  document.getElementById('dob-month').addEventListener('change', populateDaySelect);
  document.getElementById('dob-year').addEventListener('change', populateDaySelect);

  initPlacesAutocomplete();
  initLiveCounter();

  document.getElementById('birth-place').addEventListener('keydown', e => { if(e.key==='Enter') submitBirthInfo(); });
  document.getElementById('user-name').addEventListener('keydown', e => { if(e.key==='Enter') submitNameAndCover(); });
  document.getElementById('user-email').addEventListener('keydown', e => { if(e.key==='Enter') submitEmail(); });

  // Live update name on book cover
  document.getElementById('user-name').addEventListener('input', e => {
    const name = e.target.value.trim();
    if (name) document.getElementById('cover-name').textContent = name;
  });

  if (restoreStateIfReturning()) {
    setTimeout(applyRestoredState, 100);
  }
});

function populateDaySelect() {
  const month = parseInt(document.getElementById('dob-month').value) || 1;
  const year  = parseInt(document.getElementById('dob-year').value)  || 2000;
  const days  = new Date(year, month, 0).getDate();
  const sel   = document.getElementById('dob-day');
  const prev  = sel.value;
  sel.innerHTML = '<option value="">Day</option>';
  for (let i=1; i<=days; i++) {
    const o = document.createElement('option');
    o.value = o.textContent = i;
    sel.appendChild(o);
  }
  if (prev && parseInt(prev) <= days) sel.value = prev;
}

function populateYearSelect() {
  const sel = document.getElementById('dob-year');
  const cur = new Date().getFullYear();
  for (let y=cur-16; y>=1920; y--) {
    const o = document.createElement('option');
    o.value = o.textContent = y;
    sel.appendChild(o);
  }
}

function populateHourSelect() {
  const sel = document.getElementById('birth-hour');
  for (let h=1; h<=12; h++) {
    const o = document.createElement('option');
    o.value = h < 10 ? '0'+h : String(h);
    o.textContent = h < 10 ? '0'+h : String(h);
    sel.appendChild(o);
  }
}

// ── SCREEN TRANSITIONS ──────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

// ── LANDING ─────────────────────────────────────────────────
function selectGender(gender) {
  state.gender = gender;
  showScreen('screen-quiz');
  currentStep = 1;
  showStep(1);
  saveQuizState();
}

// ── QUIZ NAVIGATION ─────────────────────────────────────────

function showStepWithoutTracking(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('step-'+n);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0,0);
  }
  document.getElementById('step-current').textContent = n;
  const pct = ((n-1) / (maxStep-1)) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('back-btn').style.visibility = n <= 1 ? 'hidden' : 'visible';
}

function showStep(n) {
  showStepWithoutTracking(n);
  saveQuizState();
  if (n > (window.orastriaLastStep || 0)) {
    if (window.queueStepUpdate) window.queueStepUpdate(n);
    window.orastriaLastStep = n;
  }
}

function nextStep() {
  currentStep++;
  if (currentStep > maxStep) {
    startLoading();
    return;
  }
  showStep(currentStep);
}

function goBack() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  } else {
    showScreen('screen-0');
    currentStep = 0;
  }
}

// ══════════════════════════════════════════════════════════════════
// STEP SUBMISSIONS
// ══════════════════════════════════════════════════════════════════

// STEP 1 — Combined Birth Info
function submitBirthInfo() {
  const m = document.getElementById('dob-month').value;
  const d = document.getElementById('dob-day').value;
  const y = document.getElementById('dob-year').value;
  const p = document.getElementById('birth-place').value.trim();

  if (!m || !d || !y) { shakeInput('dob-month'); return; }
  if (!p) { shakeInput('birth-place'); return; }

  state.dob = { month: m, day: d, year: y };
  state.birthPlace = p;

  // Time is optional
  const h = document.getElementById('birth-hour').value;
  const mi = document.getElementById('birth-min').value;
  const ap = document.getElementById('birth-ampm').value;
  if (h && mi) {
    state.birthTime = `${h}:${mi} ${ap}`;
  } else {
    state.birthTime = 'Unknown';
  }

  // Calculate zodiac
  const zodiac = getZodiac(m, d);
  state.zodiac = zodiac;
  populateZodiacReveal(zodiac);

  nextStep();
}

// STEP 2 — Zodiac Reveal (populated in submitBirthInfo)
function populateZodiacReveal(zodiac) {
  const z = ZODIAC[zodiac];
  document.getElementById('zodiac-emoji').textContent = z.emoji;
  document.getElementById('zodiac-name').textContent = zodiac;

  const gLabel = state.gender === 'Male' ? 'a Male '+zodiac :
                 state.gender === 'Female' ? 'a Female '+zodiac : 'a '+zodiac;
  document.getElementById('zodiac-desc').innerHTML = z.desc.replace('{g}', gLabel);

  const traitsEl = document.getElementById('zodiac-traits');
  traitsEl.innerHTML = z.traits.map(t => `<span class="trait-pill">${t}</span>`).join('');

  // Rare card
  const rPct = (Math.random()*0.3 + 0.1).toFixed(2);
  document.getElementById('rare-pct').textContent = rPct + '%';
  document.getElementById('rare-sign').textContent = zodiac;
  document.getElementById('rare-traits').innerHTML = RARE_TRAITS[zodiac];
  document.getElementById('rare-count').textContent = RARE_COUNTS[zodiac].toLocaleString() + ' ' + zodiac;

  // Update book cover glyph
  const glyphEl = document.getElementById('zodiac-glyph');
  if (glyphEl && ZODIAC_GLYPHS[zodiac]) {
    glyphEl.innerHTML = `<path d="${ZODIAC_GLYPHS[zodiac]}"/>`;
  }
}

// STEP 3-6 — Single-select options
function selectOption(btn, field, value) {
  btn.closest('.options-list').querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state[field] = value;
  setTimeout(() => nextStep(), 260);
}

// STEP 8 — Multi-select
function toggleMulti(btn, field, value) {
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) {
    if (!state[field]) state[field] = [];
    if (!state[field].includes(value)) state[field].push(value);
  } else {
    state[field] = state[field].filter(v => v !== value);
  }
}

function submitIncludes() {
  nextStep();
}

// STEP 9 — Name + Book Cover (combined)
function submitNameAndCover() {
  const n = document.getElementById('user-name').value.trim();
  if (!n) { shakeInput('user-name'); return; }
  state.name = n;
  updateBookCoverName(n);
  updateBookCoverDate();

  // Copy book to final preview
  const finalPreview = document.getElementById('final-book-preview');
  const srcSVG = document.getElementById('book-cover')?.querySelector('svg');
  if (srcSVG && finalPreview) finalPreview.innerHTML = srcSVG.outerHTML;

  // Set final name
  document.getElementById('final-name').textContent = n + "'s";

  nextStep();
}

function updateBookCoverName(name) {
  document.getElementById('cover-name').textContent = name;
}

function updateBookCoverDate() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = parseInt(state.dob.month);
  const d = state.dob.day;
  const y = state.dob.year;
  const place = state.birthPlace ? state.birthPlace.split(',')[0] : '';
  if (m && d && y) {
    document.getElementById('cover-date').textContent = months[m-1] + ' ' + d + ', ' + y;
  }
  if (place) {
    document.getElementById('cover-place').textContent = place;
  }
}

function setBookColor(btn, fill, spine) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('book-bg').setAttribute('fill', fill);
  const spineEl = document.getElementById('book-spine');
  if (spineEl) spineEl.setAttribute('fill', spine);
  state.coverColor = fill;
  state.coverColorSpine = spine;

  // Glow colors
  const glowColors = {
    '#1a1a2e':'rgba(201,162,39,0.2)',
    '#2d1b4e':'rgba(107,91,149,0.3)',
    '#1a2e1a':'rgba(80,180,80,0.2)',
    '#6b2d2d':'rgba(200,80,80,0.25)',
    '#2d2d4e':'rgba(100,100,200,0.25)',
    '#f5f0e8':'rgba(240,220,180,0.3)',
  };
  document.getElementById('book-glow').style.background =
    `radial-gradient(circle, ${glowColors[fill]||'rgba(201,162,39,0.2)'} 0%, transparent 70%)`;

  // Light color text fix
  const isLight = fill === '#f5f0e8';
  const textColor = isLight ? '#5a3d00' : '#c9a227';
  document.querySelectorAll('#book-cover text').forEach(t => {
    if (!t.getAttribute('fill') || t.getAttribute('fill') !== 'none') {
      t.setAttribute('fill', textColor);
    }
  });
  document.querySelectorAll('#book-cover rect, #book-cover line, #book-cover circle, #book-cover path').forEach(el => {
    const s = el.getAttribute('stroke');
    if (s && s !== 'none') el.setAttribute('stroke', textColor);
  });
  const glyphGrp = document.getElementById('zodiac-glyph');
  if (glyphGrp) glyphGrp.setAttribute('stroke', textColor);
}

// STEP 10 — Email
async function submitEmail() {
  const e = document.getElementById('user-email').value.trim();
  if (!e || !e.includes('@')) { shakeInput('user-email'); return; }
  state.email = e;

  if (window.storeEmail) window.storeEmail(e);

  const userId = window.orastriaUID || localStorage.getItem('orastria_uid') || null;

  // Klaviyo
  if (window.createKlaviyoProfile) {
    window.createKlaviyoProfile(state.email, state.name.split(' ')[0] || state.name, userId, {
      zodiac: state.zodiac,
      gender: state.gender,
      status: state.status,
      goal: state.goal,
      mindset: state.mindset,
      loveLanguage: state.loveLanguage,
      birthDate: `${state.dob.year}-${String(state.dob.month).padStart(2,'0')}-${String(state.dob.day).padStart(2,'0')}`,
      birthPlace: state.birthPlace,
      coverColor: state.coverColor,
      variant: 'book-2'
    }).then(klaviyoId => {
      if (klaviyoId) console.log('✓ Klaviyo profile created:', klaviyoId);
    }).catch(err => console.error('Klaviyo error:', err));
  }

  // Supabase
  if (window.submitToOrastriaDB) {
    submitToOrastriaDB({
      email: state.email,
      firstName: state.name.split(' ')[0] || state.name,
      lastName: state.name.split(' ').slice(1).join(' ') || null,
      dateBirth: `${state.dob.year}-${String(state.dob.month).padStart(2,'0')}-${String(state.dob.day).padStart(2,'0')}`,
      birthTime: state.birthTime,
      birthPlace: state.birthPlace,
      zodiac: state.zodiac,
      gender: state.gender,
      status: state.status,
      goal: state.goal,
      mindset: state.mindset,
      coverColor: state.coverColor,
      variant: 'book-2'
    }).then(r => {
      if (r.success) {
        const dbID = r.data.id;
        window.orastriaUID = dbID;
        localStorage.setItem('orastria_uid', dbID);

        const url = new URL(window.location);
        url.searchParams.set('uid', dbID);
        window.history.replaceState({}, '', url);

        // n8n webhook
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const timeStr = (state.birthTime && state.birthTime !== 'Unknown') ? state.birthTime : '12:00 pm';
        const birthDateFormatted = `${monthNames[state.dob.month-1]} ${state.dob.day}, ${state.dob.year} ${timeStr}`;

        fetch('https://ismypartner.app.n8n.cloud/webhook/20a6c1c6-df2e-4d43-a19b-4daa65017850', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: dbID,
            tracker_id: Date.now() + 'x' + Math.random().toString(36).substr(2,9),
            email: state.email,
            first_name: state.name.split(' ')[0] || state.name,
            last_name: state.name.split(' ').slice(1).join(' ') || '',
            date_of_birth: birthDateFormatted,
            hour_birth: timeStr,
            place_of_birth: state.birthPlace || '',
            genre: state.gender || '',
            single: state.status === 'single' ? 'Yes' : 'No',
            color_book: state.coverColor || '#1a1a2e',
            zodiac: state.zodiac || '',
            goal: state.goal || '',
            mindset: state.mindset || '',
            love_language: state.loveLanguage || '',
            includes: state.includes.join(', ') || '',
            variant: 'book-2'
          })
        }).then(r => r.ok ? console.log('✓ n8n webhook sent') : console.error('Webhook failed'))
          .catch(e => console.error('Webhook error:', e));
      }
    });
  }

  startLoading();
}

// ── LOADING ─────────────────────────────────────────────────
function startLoading() {
  showScreen('screen-loading');

  const finalPreview = document.getElementById('final-book-preview');
  const srcSVG = document.getElementById('book-cover')?.querySelector('svg');
  if (srcSVG && finalPreview && !finalPreview.innerHTML) {
    finalPreview.innerHTML = srcSVG.outerHTML;
  }

  document.getElementById('ty-name').textContent = state.name || 'friend';
  animateLoading();
}

function animateLoading() {
  const bars = ['lbar-1','lbar-2','lbar-3'];
  const pcts = ['lpct-1','lpct-2','lpct-3'];
  const durations = [8000, 9000, 13000];

  function runBar(i) {
    if (i >= bars.length) {
      setTimeout(() => showScreen('screen-thankyou'), 400);
      return;
    }
    const bar = document.getElementById(bars[i]);
    const pct = document.getElementById(pcts[i]);
    const dur = durations[i];
    const step = 16;
    let cur = 0;
    const inc = (100 / (dur / step));

    const ticker = setInterval(() => {
      cur = Math.min(cur + inc + (Math.random()*inc*0.5), 100);
      bar.style.width = cur + '%';
      pct.textContent = Math.floor(cur) + '%';
      if (cur >= 100) {
        clearInterval(ticker);
        bar.style.background = 'linear-gradient(90deg, #6b5b95, #c9a227)';
        setTimeout(() => runBar(i+1), 300);
      }
    }, step);
  }
  runBar(0);
}

// ── HELPERS ──────────────────────────────────────────────────
function shakeInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = '#e05c5c';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 800);

  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
    `;
    document.head.appendChild(style);
  }
  el.style.animation = 'shake 0.4s ease';
}

function initPlacesAutocomplete() {
  const input = document.getElementById('birth-place');
  if (!input || typeof google === 'undefined') {
    setTimeout(initPlacesAutocomplete, 500);
    return;
  }

  const autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      input.value = place.formatted_address;
    }
  });
}

// ── CHECKOUT ────────────────────────────────────────────────
function initiateCheckout() {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('uid') || localStorage.getItem('orastria_uid') || 'unknown';
  const emailInput = document.getElementById('user-email');
  const email = emailInput ? emailInput.value : '';

  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', {
      content_name: 'Astrology Book',
      content_category: 'book',
      value: 7.99,
      currency: 'EUR'
    });
  }

  if (window.queueStepUpdate) window.queueStepUpdate(11); // checkout = step 11 for book-2

  saveStateBeforeCheckout();

  const stripePaymentLink = 'https://buy.stripe.com/dRmbJ188V6dEc7G76C2sM0y';
  const checkoutUrl = stripePaymentLink + '?client_reference_id=' + encodeURIComponent(uid) + '&prefilled_email=' + encodeURIComponent(email);

  window.location.replace(checkoutUrl);
}

function sendFreeBookOnly() {
  if (typeof fbq !== 'undefined') {
    fbq('track', 'Lead', { content_name: 'Free Astrology Book', content_category: 'book' });
  }
  alert('Your free book will be sent to your email!');
}
