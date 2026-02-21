/* ============================================
   ORASTRIA TAROT - Main Application Logic
   ============================================ */

// --- Configuration ---
// IMPORTANT: Replace this URL with your deployed Cloudflare Worker URL
const WORKER_URL = 'https://tarot.orastria.com';

// --- Tarot Deck ---
const TAROT_DECK = [
  { name: "Six of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_9.png" },
  { name: "Four of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_page.png" },
  { name: "Ace of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_king.png" },
  { name: "Two of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_queen.png" },
  { name: "Five of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_10.png" },
  { name: "Three of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_knight.png" },
  { name: "Seven of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_8.png" },
  { name: "Eight of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_7.png" },
  { name: "Queen of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_2.png" },
  { name: "Nine of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_6.png" },
  { name: "Ace of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_king.png" },
  { name: "Three of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_knight.png" },
  { name: "Page of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_4.png" },
  { name: "Two of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_queen.png" },
  { name: "King of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_ace.png" },
  { name: "Ten of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_5.png" },
  { name: "Knight of Coins", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_pentacles_3.png" },
  { name: "Four of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_page.png" },
  { name: "Six of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_9.png" },
  { name: "Five of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_10.png" },
  { name: "Seven of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_8.png" },
  { name: "Queen of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_2.png" },
  { name: "Knight of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_3.png" },
  { name: "Eight of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_7.png" },
  { name: "Nine of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_6.png" },
  { name: "Ten of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_5.png" },
  { name: "King of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_ace.png" },
  { name: "Page of Cups", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_swords_4.png" },
  { name: "Ace of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_king.png" },
  { name: "Two of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_queen.png" },
  { name: "Ten of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_5.png" },
  { name: "Six of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_9.png" },
  { name: "Three of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_knight.png" },
  { name: "Nine of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_6.png" },
  { name: "Seven of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_8.png" },
  { name: "Four of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_page.png" },
  { name: "Eight of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_7.png" },
  { name: "Five of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_10.png" },
  { name: "Ace of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_king.png" },
  { name: "Queen of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_2.png" },
  { name: "King of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_ace.png" },
  { name: "Three of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_knight.png" },
  { name: "Five of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_10.png" },
  { name: "Six of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_9.png" },
  { name: "Knight of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_3.png" },
  { name: "Page of Wands", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_cups_4.png" },
  { name: "Four of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_page.png" },
  { name: "Two of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_queen.png" },
  { name: "Knight of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_3.png" },
  { name: "Judgement", url: "https://archive.org/download/rider-waite-tarot/major_arcana_judgement.png" },
  { name: "The World", url: "https://archive.org/download/rider-waite-tarot/major_arcana_world.png" },
  { name: "Seven of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_8.png" },
  { name: "Queen of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_2.png" },
  { name: "Ten of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_5.png" },
  { name: "Page of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_4.png" },
  { name: "Nine of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_6.png" },
  { name: "Eight of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_7.png" },
  { name: "King of Swords", url: "https://archive.org/download/rider-waite-tarot/minor_arcana_wands_ace.png" },
  { name: "The Sun", url: "https://archive.org/download/rider-waite-tarot/major_arcana_sun.png" },
  { name: "Death", url: "https://archive.org/download/rider-waite-tarot/major_arcana_death.png" },
  { name: "The Devil", url: "https://archive.org/download/rider-waite-tarot/major_arcana_devil.png" },
  { name: "The Star", url: "https://archive.org/download/rider-waite-tarot/major_arcana_star.png" },
  { name: "Strength", url: "https://archive.org/download/rider-waite-tarot/major_arcana_strength.png" },
  { name: "Temperance", url: "https://archive.org/download/rider-waite-tarot/major_arcana_temperance.png" },
  { name: "Wheel of Fortune", url: "https://archive.org/download/rider-waite-tarot/major_arcana_fortune.png" },
  { name: "The Tower", url: "https://archive.org/download/rider-waite-tarot/major_arcana_tower.png" },
  { name: "The Moon", url: "https://archive.org/download/rider-waite-tarot/major_arcana_moon.png" },
  { name: "The Hanged Man", url: "https://archive.org/download/rider-waite-tarot/major_arcana_hanged.png" },
  { name: "The Lovers", url: "https://archive.org/download/rider-waite-tarot/major_arcana_lovers.png" },
  { name: "Justice", url: "https://archive.org/download/rider-waite-tarot/major_arcana_justice.png" },
  { name: "The Hermit", url: "https://archive.org/download/rider-waite-tarot/major_arcana_hermit.png" },
  { name: "The Chariot", url: "https://archive.org/download/rider-waite-tarot/major_arcana_chariot.png" },
  { name: "The Pope", url: "https://archive.org/download/rider-waite-tarot/major_arcana_hierophant.png" },
  { name: "The Emperor", url: "https://archive.org/download/rider-waite-tarot/major_arcana_emperor.png" },
  { name: "The Empress", url: "https://archive.org/download/rider-waite-tarot/major_arcana_empress.png" },
  { name: "The Fool", url: "https://archive.org/download/rider-waite-tarot/major_arcana_fool.png" },
  { name: "The High Priestess", url: "https://archive.org/download/rider-waite-tarot/major_arcana_priestess.png" },
  { name: "The Magician", url: "https://archive.org/download/rider-waite-tarot/major_arcana_magician.png" }
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
    "How can I improve my financial situation?",
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
  totalSteps: 5, // 1: category, 2: question, 3: email, 4: shuffling, 5: results
  category: '',
  question: '',
  email: '',
  drawnCards: [],
  reading: null,
  hasPaid: false,
  readingsUsed: 0,
  maxFreePreview: 2 // number of card interpretations shown for free
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  updateProgress();
  bindCategorySelection();
  bindQuestionInput();
  bindEmailInput();
}

// --- Progress ---
function updateProgress() {
  const dots = document.querySelectorAll('.progress-dot');
  const label = document.getElementById('progressLabel');
  const labels = ['Choose Topic', 'Ask Your Question', 'Your Email', 'Drawing Cards', 'Your Reading'];

  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i + 1 === state.currentStep) {
      dot.classList.add('active');
    } else if (i + 1 < state.currentStep) {
      dot.classList.add('completed');
    }
  });

  if (label) {
    label.textContent = labels[state.currentStep - 1] || '';
  }
}

// --- Step Navigation ---
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

  // Show target step
  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    targetStep.classList.add('active');
  }

  state.currentStep = step;
  updateProgress();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger step-specific logic
  if (step === 4) {
    startShuffling();
  }
}

// --- Step 1: Category Selection ---
function bindCategorySelection() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected from all
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
      // Add selected to clicked
      card.classList.add('selected');
      state.category = card.dataset.category;

      // Enable button
      document.getElementById('step1Btn').disabled = false;
    });
  });
}

function nextFromCategory() {
  if (!state.category) return;

  // Update suggestions for the question step
  updateSuggestions();

  goToStep(2);
}

// --- Step 2: Question Input ---
function bindQuestionInput() {
  const textarea = document.getElementById('questionInput');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    state.question = textarea.value.trim();
    document.getElementById('charCount').textContent = `${textarea.value.length}/300`;
    document.getElementById('step2Btn').disabled = state.question.length < 10;
  });
}

function updateSuggestions() {
  const container = document.getElementById('suggestionsContainer');
  if (!container) return;

  const suggestions = CATEGORY_SUGGESTIONS[state.category] || CATEGORY_SUGGESTIONS.general;
  container.innerHTML = suggestions.map(s =>
    `<span class="suggestion-chip" onclick="useSuggestion('${s.replace(/'/g, "\\'")}')">${s}</span>`
  ).join('');
}

function useSuggestion(text) {
  const textarea = document.getElementById('questionInput');
  textarea.value = text;
  textarea.dispatchEvent(new Event('input'));
}

function nextFromQuestion() {
  if (state.question.length < 10) return;
  goToStep(3);
}

function backToCategory() {
  goToStep(1);
}

// --- Step 3: Email ---
function bindEmailInput() {
  const input = document.getElementById('emailInput');
  if (!input) return;

  input.addEventListener('input', () => {
    state.email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
    document.getElementById('step3Btn').disabled = !valid;
  });
}

function nextFromEmail() {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  if (!valid) return;
  
  if (window.submitToOrastriaDB) {
    submitToOrastriaDB({
      email: state.email,
      answer_question: state.question,
      answer_answer: state.category
    }).then(r => r.success && console.log("✓ DB saved:", r.data?.id)).catch(e => console.error("DB error:", e));
  }
  
  goToStep(4);
}

function backToQuestion() {
  goToStep(2);
}

// --- Step 4: Shuffling Animation ---
async function startShuffling() {
  // Draw 5 random cards
  state.drawnCards = drawCards(5);

  const progressFill = document.getElementById('shuffleProgressFill');
  const shuffleText = document.getElementById('shuffleText');
  const shuffleSubtext = document.getElementById('shuffleSubtext');

  const stages = [
    { text: 'Connecting to the universe', sub: 'Aligning energies...', to: 15 },
    { text: 'Shuffling the deck', sub: 'The cards are listening...', to: 35 },
    { text: 'Channeling your energy', sub: 'Focusing on your question...', to: 55 },
    { text: 'Drawing your cards', sub: 'The spread reveals itself...', to: 80 },
    { text: 'Interpreting your reading', sub: 'The universe speaks...', to: 95 },
  ];

  let progress = 0;

  // Start the API call in parallel with the animation
  const readingPromise = fetchReading();

  for (const stage of stages) {
    if (shuffleText) shuffleText.textContent = stage.text;
    if (shuffleSubtext) shuffleSubtext.textContent = stage.sub;

    while (progress < stage.to) {
      progress += Math.random() * 3 + 1;
      if (progress > stage.to) progress = stage.to;
      if (progressFill) progressFill.style.width = Math.round(progress) + '%';
      await sleep(80);
    }
    await sleep(500);
  }

  // Wait for API to finish
  try {
    state.reading = await readingPromise;
  } catch (err) {
    console.error('Reading API failed:', err);
    // Use fallback reading
    state.reading = getFallbackReading();
  }

  // Complete progress
  if (progressFill) progressFill.style.width = '100%';
  if (shuffleText) shuffleText.textContent = 'Your reading is ready';
  if (shuffleSubtext) shuffleSubtext.textContent = 'The cards have spoken';

  await sleep(800);

  // Move to results
  renderResults();
  goToStep(5);
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

// --- API Call ---
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

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

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

// --- Step 5: Render Results ---
function renderResults() {
  renderCardSpread();
  renderInterpretations();
  renderSynthesis();
}

function renderCardSpread() {
  const container = document.getElementById('cardsSpread');
  if (!container) return;

  container.innerHTML = state.drawnCards.map((card, i) => `
    <div class="tarot-card-wrapper card-flip-enter ${i === 0 ? 'active-card' : ''}"
         style="animation-delay: ${i * 0.15}s"
         onclick="selectCard(${i})">
      <div class="tarot-card-img-wrapper">
        <img class="tarot-card-img" src="${card.url}" alt="${card.name}" loading="lazy">
      </div>
      <div class="tarot-card-position">${POSITIONS[i]}</div>
      <div class="tarot-card-name">${card.name}</div>
    </div>
  `).join('');
}

function selectCard(index) {
  document.querySelectorAll('.tarot-card-wrapper').forEach((w, i) => {
    w.classList.toggle('active-card', i === index);
  });

  // Scroll to that card's interpretation
  const interpretations = document.querySelectorAll('.interpretation-card');
  if (interpretations[index]) {
    interpretations[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function renderInterpretations() {
  const container = document.getElementById('interpretationsContainer');
  if (!container || !state.reading) return;

  const cards = state.reading.cards || [];

  container.innerHTML = cards.map((cardReading, i) => {
    const isLocked = !state.hasPaid && i >= state.maxFreePreview;
    const paragraphs = (cardReading.interpretation || '').split('\n').filter(p => p.trim());

    return `
      <div class="interpretation-card ${isLocked ? 'blurred' : ''}" id="interp-${i}">
        <div class="interpretation-header">
          <span class="interpretation-position">${cardReading.position || POSITIONS[i]}</span>
          <span class="interpretation-card-name">${cardReading.card || state.drawnCards[i].name}</span>
        </div>
        <div class="interpretation-text">
          ${paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
        ${isLocked ? '<div class="blur-overlay"></div>' : ''}
      </div>
    `;
  }).join('');
}

function renderSynthesis() {
  const container = document.getElementById('synthesisContainer');
  if (!container || !state.reading) return;

  const isLocked = !state.hasPaid;
  const synthesisText = state.reading.synthesis || '';
  const paragraphs = synthesisText.split('\n').filter(p => p.trim());

  container.innerHTML = `
    <div class="synthesis-card ${isLocked ? 'blurred' : ''}">
      <div class="stars-decoration">&#10022; &#10022; &#10022;</div>
      <div class="synthesis-title">Your Complete Reading</div>
      <div class="synthesis-text">
        ${paragraphs.map(p => `<p>${p}</p>`).join('')}
      </div>
      ${isLocked ? '<div class="blur-overlay"></div>' : ''}
    </div>
  `;

  // Show/hide paywall
  const paywallSection = document.getElementById('paywallSection');
  if (paywallSection) {
    paywallSection.classList.toggle('hidden', state.hasPaid);
  }

  // Show/hide "new reading" button
  const newReadingBtn = document.getElementById('newReadingBtn');
  if (newReadingBtn) {
    newReadingBtn.classList.toggle('hidden', !state.hasPaid);
  }
}

// --- Payment ---
function handlePayment() {
  // TODO: Replace with Whop.com checkout URL
  // For now, open a placeholder or the Whop checkout link
  // After payment confirmation, call unlockReading()

  // Placeholder: simulate payment for testing
  const whopUrl = 'https://whop.com/orastria/'; // Replace with actual Whop checkout URL
  window.open(whopUrl, '_blank');

  // In production, you'd listen for a webhook or redirect back with a success param
  // For testing, add a URL param check or manual unlock
}

function unlockReading() {
  state.hasPaid = true;
  renderInterpretations();
  renderSynthesis();
}

function startNewReading() {
  if (!state.hasPaid) return;

  // Reset state for new reading
  state.currentStep = 1;
  state.category = '';
  state.question = '';
  state.drawnCards = [];
  state.reading = null;
  state.readingsUsed += 1;

  // Reset UI
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('step1Btn').disabled = true;

  const questionInput = document.getElementById('questionInput');
  if (questionInput) {
    questionInput.value = '';
    document.getElementById('charCount').textContent = '0/300';
    document.getElementById('step2Btn').disabled = true;
  }

  goToStep(1);
}

// --- Utilities ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Check for payment success from URL ---
(function checkPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('paid') === 'true') {
    state.hasPaid = true;
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }
})();

// Landing page function
function startFromLanding() {
  document.getElementById('step0').classList.remove('active');
  document.getElementById('step1').classList.add('active');
}
