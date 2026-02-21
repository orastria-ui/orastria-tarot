/* ============================================
   ORASTRIA V2 - Casino / Gamification Edition
   ============================================ */

// --- Configuration ---
const WORKER_URL = 'https://tarot.orastria.com';

// --- Tarot Deck ---
const TAROT_DECK = [
  { name: "Six of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/six-of-coins.avif" },
  { name: "Four of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/four-of-coins.avif" },
  { name: "Ace of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ace-of-coins.avif" },
  { name: "Two of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/two-of-coins.avif" },
  { name: "Five of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/five-of-coins.avif" },
  { name: "Three of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/three-of-coins.avif" },
  { name: "Seven of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_8.png" },
  { name: "Eight of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_7.png" },
  { name: "Queen of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_2.png" },
  { name: "Nine of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_6.png" },
  { name: "Ace of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ace-of-cups.avif" },
  { name: "Three of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/three-of-cups.avif" },
  { name: "Page of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/page-of-coins.avif" },
  { name: "Two of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/two-of-cups.avif" },
  { name: "King of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/king-of-coins.avif" },
  { name: "Ten of Coins", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ten-of-coins.avif" },
  { name: "Knight of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_3.png" },
  { name: "Four of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/four-of-cups.avif" },
  { name: "Six of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_9.png" },
  { name: "Five of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_10.png" },
  { name: "Seven of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_8.png" },
  { name: "Queen of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/queen-of-cups.avif" },
  { name: "Knight of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/knight-of-cups.avif" },
  { name: "Eight of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_7.png" },
  { name: "Nine of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_6.png" },
  { name: "Ten of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ten-of-cups.avif" },
  { name: "King of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_ace.png" },
  { name: "Page of Cups", url: "https://f005.backblazeb2.com/file/mypartner/tarot/page-of-cups.avif" },
  { name: "Ace of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ace-of-wands.avif" },
  { name: "Two of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_queen.png" },
  { name: "Ten of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ten-of-wands.avif" },
  { name: "Six of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/six-of-wands.avif" },
  { name: "Three of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/three-of-wands.avif" },
  { name: "Nine of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_6.png" },
  { name: "Seven of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_8.png" },
  { name: "Four of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/four-of-wands.avif" },
  { name: "Eight of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_7.png" },
  { name: "Five of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_10.png" },
  { name: "Ace of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_king.png" },
  { name: "Queen of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/queen-of-wands.avif" },
  { name: "King of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/king-of-wands.avif" },
  { name: "Three of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/three-of-swords.avif" },
  { name: "Five of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/five-of-swords.avif" },
  { name: "Six of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/six-of-swords.avif" },
  { name: "Knight of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/knight-of-wands.avif" },
  { name: "Page of Wands", url: "https://f005.backblazeb2.com/file/mypartner/tarot/page-of-wands.avif" },
  { name: "Four of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/four-of-swords.avif" },
  { name: "Two of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/two-of-swords.avif" },
  { name: "Knight of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/knight-of-swords.avif" },
  { name: "Judgement", url: "https://f005.backblazeb2.com/file/mypartner/tarot/judgement.avif" },
  { name: "The World", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-world.avif" },
  { name: "Seven of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/seven-of-swords.avif" },
  { name: "Queen of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/queen-of-swords.avif" },
  { name: "Ten of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/ten-of-swords.avif" },
  { name: "Page of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/page-of-swords.avif" },
  { name: "Nine of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/nine-of-swords.avif" },
  { name: "Eight of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/eight-of-swords.avif" },
  { name: "King of Swords", url: "https://f005.backblazeb2.com/file/mypartner/tarot/king-of-swords.avif" },
  { name: "The Sun", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-sun.avif" },
  { name: "Death", url: "https://f005.backblazeb2.com/file/mypartner/tarot/death.avif" },
  { name: "The Devil", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-devil.avif" },
  { name: "The Star", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-star.avif" },
  { name: "Strength", url: "https://f005.backblazeb2.com/file/mypartner/tarot/strength.avif" },
  { name: "Temperance", url: "https://f005.backblazeb2.com/file/mypartner/tarot/temperance.avif" },
  { name: "Wheel of Fortune", url: "https://f005.backblazeb2.com/file/mypartner/tarot/wheel-of-fortune.avif" },
  { name: "The Tower", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-tower.avif" },
  { name: "The Moon", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-moon.avif" },
  { name: "The Hanged Man", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-hanged-man.avif" },
  { name: "The Lovers", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-lovers.avif" },
  { name: "Justice", url: "https://f005.backblazeb2.com/file/mypartner/tarot/justice.avif" },
  { name: "The Hermit", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-hermit.avif" },
  { name: "The Chariot", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-chariot.avif" },
  { name: "The Pope", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-pope.avif" },
  { name: "The Emperor", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-emperor.avif" },
  { name: "The Empress", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-empress.avif" },
  { name: "The Fool", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-fool.avif" },
  { name: "The High Priestess", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-high-priestess.avif" },
  { name: "The Magician", url: "https://f005.backblazeb2.com/file/mypartner/tarot/the-magician.avif" }
];

// --- Major Arcana names (for rarity assignment) ---
const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Pope", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const POSITIONS = [
  'Current Situation',
  'Main Challenge',
  'Advice',
  'Hidden Influence',
  'Likely Outcome'
];

const CATEGORY_SUGGESTIONS = {
  general: [
    "What should I focus on right now?",
    "What energy surrounds me today?",
    "What is blocking my progress?"
  ],
  love: [
    "What is the future of my relationship?",
    "Will I find love soon?",
    "What do I need to know about my love life?"
  ],
  money: [
    "How can I improve my finances?",
    "Is a career change right for me?",
    "What blocks my abundance?"
  ],
  health: [
    "What should I focus on for my wellbeing?",
    "How can I restore my energy?",
    "What does my body need right now?"
  ]
};

// --- State ---
const state = {
  currentStep: 1,
  category: '',
  question: '',
  email: '',
  drawnCards: [],
  cardRarities: [],
  reading: null,
  hasPaid: false,
  readingsUsed: 0,
  flippedCards: [],
  nextFlipIndex: 0,
  countdownInterval: null,
  spotsInterval: null,
  multiplierInterval: null,
  countdownSeconds: 299 // 4:59
};

// --- Rarity System ---
function assignRarity(cardName) {
  if (MAJOR_ARCANA.includes(cardName)) {
    // Major arcana: 40% epic, 60% legendary
    return Math.random() < 0.4 ? 'epic' : 'legendary';
  }
  // Minor arcana
  const roll = Math.random();
  if (roll < 0.45) return 'common';
  if (roll < 0.80) return 'rare';
  if (roll < 0.95) return 'epic';
  return 'legendary';
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  updateLiveCount();
  updateSuggestions();

  // Check payment return
  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') === 'true') {
    state.hasPaid = true;
    window.history.replaceState({}, '', window.location.pathname);
  }
});

// --- Particles ---
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    container.appendChild(p);
  }
}

// --- Live Counter ---
function updateLiveCount() {
  const el = document.getElementById('liveCount');
  if (!el) return;
  setInterval(() => {
    const current = parseInt(el.textContent.replace(/,/g, ''));
    const next = current + Math.floor(Math.random() * 3) + 1;
    el.textContent = next.toLocaleString();
  }, 5000);
}

// --- Category Selection ---
function selectCategory(tile) {
  document.querySelectorAll('.category-tile').forEach(t => t.classList.remove('selected'));
  tile.classList.add('selected');
  state.category = tile.dataset.category;
  document.getElementById('step1Btn').disabled = false;
}

// --- Question ---
function validateQuestion() {
  const textarea = document.getElementById('questionInput');
  state.question = textarea.value.trim();
  document.getElementById('charCount').textContent = textarea.value.length;
  document.getElementById('step2Btn').disabled = state.question.length < 10;
}

function updateSuggestions() {
  const container = document.getElementById('suggestions');
  if (!container) return;
  const cat = state.category || 'general';
  const suggestions = CATEGORY_SUGGESTIONS[cat] || CATEGORY_SUGGESTIONS.general;
  container.innerHTML = suggestions.map(s =>
    `<span class="suggestion-chip" onclick="useSuggestion('${s.replace(/'/g, "\\'")}')">${s}</span>`
  ).join('');
}

function useSuggestion(text) {
  const textarea = document.getElementById('questionInput');
  textarea.value = text;
  validateQuestion();
}

// --- Email ---
function validateEmail() {
  const input = document.getElementById('emailInput');
  state.email = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  document.getElementById('step3Btn').disabled = !valid;
}

// --- Step Navigation ---
function nextStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`step${step}`);
  if (target) target.classList.add('active');

  state.currentStep = step;

  // Progress bar
  const pct = (step / 5) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressBarGlow').style.width = pct + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (step === 2) updateSuggestions();
  if (step === 4) startShuffle();
}

// --- Shuffle ---
async function startShuffle() {
  state.drawnCards = drawCards(5);
  state.cardRarities = state.drawnCards.map(c => assignRarity(c.name));
  state.flippedCards = [];
  state.nextFlipIndex = 0;

  const energyFill = document.getElementById('energyFill');
  const energyLabel = document.getElementById('energyLabel');
  const shuffleTitle = document.getElementById('shuffleTitle');
  const shuffleSub = document.getElementById('shuffleSub');

  const stages = [
    { title: 'Shuffling the Deck', sub: 'The universe is aligning your cards...', to: 15 },
    { title: 'Channeling Energy', sub: 'Drawing from the cosmic field...', to: 35 },
    { title: 'Drawing Your Cards', sub: 'Five cards are being selected...', to: 55 },
    { title: 'Analyzing Patterns', sub: 'Reading the celestial connections...', to: 80 },
    { title: 'Finalizing Your Spread', sub: 'Your destiny awaits...', to: 95 },
  ];

  // Start API call in parallel
  const readingPromise = fetchReading();

  let progress = 0;
  for (const stage of stages) {
    if (shuffleTitle) shuffleTitle.textContent = stage.title;
    if (shuffleSub) shuffleSub.textContent = stage.sub;

    while (progress < stage.to) {
      progress += Math.random() * 3 + 1;
      if (progress > stage.to) progress = stage.to;
      if (energyFill) energyFill.style.width = Math.round(progress) + '%';
      if (energyLabel) energyLabel.textContent = Math.round(progress) + '%';
      await sleep(70);
    }
    await sleep(400);
  }

  // Wait for API
  try {
    state.reading = await readingPromise;
  } catch (err) {
    console.error('Reading API failed:', err);
    state.reading = getFallbackReading();
  }

  if (energyFill) energyFill.style.width = '100%';
  if (energyLabel) energyLabel.textContent = '100%';
  if (shuffleTitle) shuffleTitle.textContent = 'Cards Ready';
  if (shuffleSub) shuffleSub.textContent = 'Tap to reveal your destiny...';

  await sleep(600);

  renderRevealCards();
  nextStep(5);
  startCountdown();
  startMultiplierDecay();
}

function drawCards(count) {
  const deck = [...TAROT_DECK];
  const drawn = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * deck.length);
    drawn.push(deck.splice(idx, 1)[0]);
  }
  return drawn;
}

// --- API ---
async function fetchReading() {
  const response = await fetch(`${WORKER_URL}/reading`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: state.category,
      question: state.question,
      cards: state.drawnCards.map(c => c.name)
    })
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

function getFallbackReading() {
  return {
    cards: state.drawnCards.map((card, i) => ({
      position: POSITIONS[i],
      card: card.name,
      interpretation: `The ${card.name} appears in the position of ${POSITIONS[i]}, bringing powerful insights to your question about ${state.category}. This card suggests a period of transformation and reflection.\n\nIn this position, the card invites you to look deeper within yourself and trust the process unfolding before you. The energies surrounding your situation are shifting, and this card confirms that change is both necessary and beneficial.\n\nTake this as a sign to remain open to new perspectives and trust that the universe is guiding you toward your highest good.`
    })),
    synthesis: `Your five-card spread reveals a compelling narrative about your journey regarding ${state.category}. The cards work together to paint a picture of transformation, challenge, and ultimate growth.\n\nThe combination of cards drawn suggests that while you may face some obstacles in the near term, the overall trajectory of your path is positive. Trust in the process and remain open to the guidance that comes your way.\n\nThe hidden influences at play are working in your favor, even if they are not immediately apparent. Stay patient and trust that clarity will come with time.\n\nRemember that the tarot is a mirror reflecting your inner wisdom. The answers you seek are already within you — these cards simply illuminate the path forward.`
  };
}

// --- Reveal Cards ---
function renderRevealCards() {
  const container = document.getElementById('revealCards');
  if (!container) return;

  container.innerHTML = state.drawnCards.map((card, i) => {
    const rarity = state.cardRarities[i];
    const isLocked = !state.hasPaid && i >= 2;

    return `
      <div class="reveal-card-slot ${isLocked ? 'locked' : ''}" id="cardSlot${i}"
           data-index="${i}" onclick="flipCard(${i})">
        <div class="reveal-card-inner">
          <div class="reveal-card-front">&#10022;</div>
          <div class="reveal-card-back">
            <img src="${card.url}" alt="${card.name}" loading="lazy">
          </div>
        </div>
        <div class="card-label">
          <div class="card-position-label">${POSITIONS[i]}</div>
          <div class="card-name-label" id="cardName${i}" style="visibility:hidden">${card.name}</div>
          <div id="rarityTag${i}"></div>
        </div>
      </div>
    `;
  }).join('');
}

async function flipCard(index) {
  const slot = document.getElementById(`cardSlot${index}`);
  if (!slot) return;

  // Can't flip locked cards
  if (!state.hasPaid && index >= 2) return;

  // Already flipped
  if (state.flippedCards.includes(index)) return;

  // Must flip in order
  if (index !== state.nextFlipIndex) return;

  // Shake first
  slot.classList.add('card-shaking');
  await sleep(500);
  slot.classList.remove('card-shaking');

  // Flip
  slot.classList.add('flipped');
  state.flippedCards.push(index);
  state.nextFlipIndex = index + 1;

  // Show name
  const nameEl = document.getElementById(`cardName${index}`);
  if (nameEl) nameEl.style.visibility = 'visible';

  // Rarity
  const rarity = state.cardRarities[index];
  slot.classList.add(`rarity-${rarity}`);

  // Rarity flash
  const flash = document.createElement('div');
  flash.className = `rarity-flash ${rarity}`;
  slot.querySelector('.reveal-card-inner').appendChild(flash);
  setTimeout(() => flash.remove(), 700);

  // Rarity tag
  const tagEl = document.getElementById(`rarityTag${index}`);
  if (tagEl) {
    tagEl.innerHTML = `<span class="rarity-tag ${rarity}">${rarity}</span>`;
  }

  await sleep(300);

  // Show interpretation
  showInterpretation(index);

  // Update flip prompt
  updateFlipPrompt();
}

function updateFlipPrompt() {
  const prompt = document.getElementById('flipPrompt');
  if (!prompt) return;

  const maxFlippable = state.hasPaid ? 5 : 2;
  if (state.nextFlipIndex >= maxFlippable) {
    prompt.classList.add('hidden');

    // If free user flipped both, show synthesis (blurred) and paywall
    if (!state.hasPaid && state.nextFlipIndex >= 2) {
      renderSynthesis();
      showPaywall();
    }

    // If paid and all flipped
    if (state.hasPaid && state.nextFlipIndex >= 5) {
      renderSynthesis();
      document.getElementById('newReadingSection').classList.remove('hidden');
    }
  }
}

function showInterpretation(index) {
  const container = document.getElementById('interpretations');
  if (!container || !state.reading) return;

  const cardReading = state.reading.cards[index];
  if (!cardReading) return;

  const isLocked = !state.hasPaid && index >= 2;
  const rarity = state.cardRarities[index];
  const paragraphs = (cardReading.interpretation || '').split('\n').filter(p => p.trim());

  const div = document.createElement('div');
  div.className = `interp-card ${isLocked ? 'blurred' : ''}`;
  div.id = `interp-${index}`;
  div.innerHTML = `
    <div class="interp-header">
      <span class="interp-position-badge">${cardReading.position || POSITIONS[index]}</span>
      <span class="interp-card-name">${cardReading.card || state.drawnCards[index].name}</span>
      <span class="rarity-tag ${rarity}" style="margin-left:auto">${rarity}</span>
    </div>
    <div class="interp-text">
      ${paragraphs.map(p => `<p>${p}</p>`).join('')}
    </div>
    ${isLocked ? '<div class="interp-blur-overlay"></div>' : ''}
  `;

  container.appendChild(div);

  // Scroll to it
  div.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderSynthesis() {
  const container = document.getElementById('synthesisBox');
  if (!container || !state.reading) return;

  const isLocked = !state.hasPaid;
  const paragraphs = (state.reading.synthesis || '').split('\n').filter(p => p.trim());

  container.innerHTML = `
    <div class="synthesis-inner ${isLocked ? 'blurred' : ''}">
      <div class="synthesis-label">&#10022; Complete Reading Synthesis &#10022;</div>
      <div class="synthesis-text-content">
        ${paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
      ${isLocked ? '<div class="synthesis-blur-overlay"></div>' : ''}
    </div>
  `;
}

// --- Paywall ---
function showPaywall() {
  const paywall = document.getElementById('paywall');
  if (paywall) paywall.classList.remove('hidden');
}

function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  if (state.countdownInterval) clearInterval(state.countdownInterval);

  state.countdownInterval = setInterval(() => {
    state.countdownSeconds--;
    if (state.countdownSeconds <= 0) {
      clearInterval(state.countdownInterval);
      state.countdownSeconds = 0;
    }
    const m = Math.floor(state.countdownSeconds / 60);
    const s = state.countdownSeconds % 60;
    el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

function startMultiplierDecay() {
  const el = document.getElementById('multiplierText');
  if (!el) return;

  let multiplier = 3.2;

  if (state.multiplierInterval) clearInterval(state.multiplierInterval);

  state.multiplierInterval = setInterval(() => {
    multiplier -= 0.01;
    if (multiplier < 1.0) {
      multiplier = 1.0;
      clearInterval(state.multiplierInterval);
    }
    el.textContent = multiplier.toFixed(1) + 'x';
  }, 3000);
}

// --- Spots ---
(function spotsDecay() {
  const el = document.getElementById('spotsLeft');
  if (!el) return;
  setInterval(() => {
    let spots = parseInt(el.textContent);
    if (spots > 2 && Math.random() < 0.3) {
      el.textContent = spots - 1;
    }
  }, 8000);
})();

// --- Payment ---
function handlePayment() {
  // TODO: Replace with Whop.com checkout URL
  const stripeUrl = 'https://buy.stripe.com/14A5kD3SF0Tk1t28aG2sM0x';
  window.location.href = stripeUrl;
}

function unlockReading() {
  state.hasPaid = true;

  // Remove locked state from cards
  document.querySelectorAll('.reveal-card-slot.locked').forEach(slot => {
    slot.classList.remove('locked');
  });

  // Hide paywall
  const paywall = document.getElementById('paywall');
  if (paywall) paywall.classList.add('hidden');

  // Clear interpretations blurs
  document.querySelectorAll('.interp-card.blurred').forEach(el => {
    el.classList.remove('blurred');
    const overlay = el.querySelector('.interp-blur-overlay');
    if (overlay) overlay.remove();
  });

  // Clear synthesis blur
  const synthInner = document.querySelector('.synthesis-inner.blurred');
  if (synthInner) {
    synthInner.classList.remove('blurred');
    const overlay = synthInner.querySelector('.synthesis-blur-overlay');
    if (overlay) overlay.remove();
  }

  // Update flip prompt
  const prompt = document.getElementById('flipPrompt');
  if (prompt && state.nextFlipIndex < 5) {
    prompt.classList.remove('hidden');
    prompt.innerHTML = '<span class="flip-pulse">&#128071;</span> Tap the next card to reveal it';
  }

  // Show new reading button if all cards flipped
  if (state.nextFlipIndex >= 5) {
    document.getElementById('newReadingSection').classList.remove('hidden');
  }

  // Stop urgency timers
  if (state.countdownInterval) clearInterval(state.countdownInterval);
  if (state.multiplierInterval) clearInterval(state.multiplierInterval);
}

function startNewReading() {
  if (!state.hasPaid) return;

  state.currentStep = 1;
  state.category = '';
  state.question = '';
  state.drawnCards = [];
  state.cardRarities = [];
  state.reading = null;
  state.flippedCards = [];
  state.nextFlipIndex = 0;
  state.readingsUsed += 1;
  state.countdownSeconds = 299;

  // Reset UI
  document.querySelectorAll('.category-tile').forEach(c => c.classList.remove('selected'));
  document.getElementById('step1Btn').disabled = true;

  const qi = document.getElementById('questionInput');
  if (qi) { qi.value = ''; document.getElementById('charCount').textContent = '0'; document.getElementById('step2Btn').disabled = true; }

  document.getElementById('interpretations').innerHTML = '';
  document.getElementById('synthesisBox').innerHTML = '';
  document.getElementById('newReadingSection').classList.add('hidden');

  nextStep(1);
}

// --- Utilities ---
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Landing page function
function startFromLanding() {
  document.getElementById('step0').classList.remove('active');
  document.getElementById('step1').classList.add('active');
}
