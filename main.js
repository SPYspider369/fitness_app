// ============================================
// FITFORGE – Global JavaScript (v2)
// ============================================

// ─── NAVBAR SCROLL ─────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ─── MOBILE NAV ────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileNavClose && mobileNav) {
  mobileNavClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
}
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── SMOOTH SCROLL ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ─── SCROLL ANIMATIONS ─────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.feature-card, .program-card, .testimonial-card, .blog-card, .blog-preview-card, .meal-card, .tip-card, .diet-cat-card, .food-card, .pricing-card, .big-stat'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ─── ANIMATED COUNTERS ──────────────
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const startTime = performance.now();
  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    if (target >= 100000) {
      el.textContent = (current / 1000).toFixed(0) + 'K+';
    } else if (target >= 1000) {
      el.textContent = current.toLocaleString() + '+';
    } else {
      el.textContent = current + suffix;
    }
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statEl = entry.target;
      const target = parseInt(statEl.dataset.target);
      const numEl = statEl.querySelector('[id^="stat-"]');
      if (numEl) {
        const suffix = numEl.id === 'stat-success' ? '%' : numEl.id === 'stat-countries' ? '+' : '';
        animateCounter(numEl, target, suffix);
      }
      counterObserver.unobserve(statEl);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.big-stat[data-target]').forEach(el => counterObserver.observe(el));

// ─── NEWSLETTER POPUP ────────────────
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');

function hidePopup() {
  if (!popupOverlay) return;
  popupOverlay.classList.remove('show');
  document.body.style.overflow = '';
  sessionStorage.setItem('ff_popup_closed', '1');
}

window.submitPopup = function() {
  const email = document.getElementById('popupEmail');
  if (email && email.value.includes('@')) {
    const card = document.querySelector('.popup-card');
    if (card) card.innerHTML = `
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:56px;margin-bottom:16px">🎉</div>
        <h3 style="font-family:var(--font-display);font-size:2rem;letter-spacing:0.02em;margin-bottom:12px">You're In!</h3>
        <p style="color:var(--grey);font-size:15px;line-height:1.6;margin-bottom:24px">Your free 7-day plan is on its way. Check your inbox!</p>
        <button onclick="hidePopup()" class="btn-primary" style="display:inline-block">Start Training →</button>
      </div>`;
  } else if (email) {
    email.style.borderColor = '#ef4444';
    email.placeholder = 'Please enter a valid email';
  }
};

if (popupClose) popupClose.addEventListener('click', hidePopup);
if (popupOverlay) {
  popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) hidePopup(); });
}
setTimeout(() => {
  if (popupOverlay && !sessionStorage.getItem('ff_popup_closed')) {
    popupOverlay.classList.add('show');
  }
}, 6000);

// ─── BLOG SEARCH ─────────────────────
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  const searchBtn = searchInput.closest('.blog-search')?.querySelector('button');
  const runSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.blog-card').forEach(card => {
      card.style.display = (!query || card.textContent.toLowerCase().includes(query)) ? 'block' : 'none';
    });
  };
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });
  if (searchBtn) searchBtn.addEventListener('click', runSearch);
}

// ─── FILTER TABS ─────────────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.blog-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'block' : 'none';
    });
  });
});

// ─── LOAD MORE ───────────────────────
const loadMoreBtn = document.getElementById('loadMore');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    loadMoreBtn.textContent = '✓ All articles loaded';
    loadMoreBtn.style.opacity = '0.5';
    loadMoreBtn.disabled = true;
  });
}

// ─── MACRO CALCULATOR ────────────────
let selectedGoal = 'loss';
document.querySelectorAll('.goal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedGoal = btn.dataset.goal;
  });
});

window.calculateMacros = function() {
  const age    = parseInt(document.getElementById('age')?.value)    || 25;
  const weight = parseFloat(document.getElementById('weight')?.value) || 70;
  const height = parseFloat(document.getElementById('height')?.value) || 175;
  const gender = document.getElementById('gender')?.value || 'male';
  const activity = parseFloat(document.getElementById('activity')?.value) || 1.55;

  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activity;
  const calories = Math.round(
    selectedGoal === 'loss' ? tdee - 400 :
    selectedGoal === 'gain' ? tdee + 350 : tdee
  );
  const protein = Math.round(weight * 2.0);
  const fats    = Math.round((calories * 0.25) / 9);
  const carbs   = Math.max(Math.round((calories - protein * 4 - fats * 9) / 4), 50);

  document.getElementById('kcalResult').textContent    = calories;
  document.getElementById('proteinResult').textContent = protein + 'g';
  document.getElementById('carbsResult').textContent   = carbs   + 'g';
  document.getElementById('fatsResult').textContent    = fats    + 'g';

  const total = protein * 4 + carbs * 4 + fats * 9;
  document.getElementById('proteinBar').style.width = Math.round(protein * 4 / total * 100) + '%';
  document.getElementById('carbsBar').style.width   = Math.round(carbs   * 4 / total * 100) + '%';
  document.getElementById('fatsBar').style.width    = Math.round(fats    * 9 / total * 100) + '%';

  document.getElementById('calcResults').style.display = 'block';
  document.querySelector('.calc-form').style.display   = 'none';
};

window.resetCalc = function() {
  document.getElementById('calcResults').style.display = 'none';
  document.querySelector('.calc-form').style.display   = 'block';
};

// ─── FOOD TABS ────────────────────────
const foodsData = {
  protein: [
    { name:'Chicken Breast', per:'100g',       value:'31g protein', kcal:'165 kcal', emoji:'🍗', img:'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' },
    { name:'Eggs',           per:'2 large',    value:'12g protein', kcal:'155 kcal', emoji:'🥚', img:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80' },
    { name:'Greek Yogurt',   per:'200g',       value:'20g protein', kcal:'130 kcal', emoji:'🥛', img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
    { name:'Tuna',           per:'140g',       value:'34g protein', kcal:'180 kcal', emoji:'🐟', img:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
    { name:'Cottage Cheese', per:'150g',       value:'18g protein', kcal:'120 kcal', emoji:'🧀', img:'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80' },
    { name:'Lentils',        per:'100g cooked',value:'9g protein',  kcal:'116 kcal', emoji:'🫘', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  ],
  carbs: [
    { name:'Brown Rice',    per:'100g cooked', value:'23g carbs', kcal:'112 kcal', emoji:'🍚', img:'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&q=80' },
    { name:'Sweet Potato',  per:'1 medium',    value:'26g carbs', kcal:'112 kcal', emoji:'🍠', img:'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&q=80' },
    { name:'Oats',          per:'80g dry',     value:'54g carbs', kcal:'307 kcal', emoji:'🌾', img:'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80' },
    { name:'Banana',        per:'1 medium',    value:'27g carbs', kcal:'105 kcal', emoji:'🍌', img:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&q=80' },
    { name:'Quinoa',        per:'100g cooked', value:'21g carbs', kcal:'120 kcal', emoji:'🌿', img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80' },
    { name:'Blueberries',   per:'150g',        value:'21g carbs', kcal:'85 kcal',  emoji:'🫐', img:'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80' },
  ],
  fats: [
    { name:'Avocado',     per:'½ medium', value:'15g fat', kcal:'160 kcal', emoji:'🥑', img:'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
    { name:'Almonds',     per:'30g',      value:'14g fat', kcal:'170 kcal', emoji:'🌰', img:'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80' },
    { name:'Salmon',      per:'150g',     value:'13g fat', kcal:'280 kcal', emoji:'🐟', img:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80' },
    { name:'Olive Oil',   per:'1 tbsp',   value:'14g fat', kcal:'120 kcal', emoji:'🫒', img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
    { name:'Walnuts',     per:'30g',      value:'18g fat', kcal:'185 kcal', emoji:'🌰', img:'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80' },
    { name:'Chia Seeds',  per:'2 tbsp',   value:'9g fat',  kcal:'138 kcal', emoji:'🌱', img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80' },
  ],
  super: [
    { name:'Spinach',        per:'100g',    value:'Iron, Folate',   kcal:'23 kcal',  emoji:'🥬', img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80' },
    { name:'Berries Mix',    per:'150g',    value:'Antioxidants',   kcal:'75 kcal',  emoji:'🫐', img:'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80' },
    { name:'Turmeric',       per:'1 tsp',   value:'Anti-inflam.',   kcal:'8 kcal',   emoji:'🌿', img:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80' },
    { name:'Broccoli',       per:'100g',    value:'Vit C, K, B6',   kcal:'55 kcal',  emoji:'🥦', img:'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80' },
    { name:'Ginger',         per:'1 thumb', value:'Anti-nausea',    kcal:'20 kcal',  emoji:'🫚', img:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80' },
    { name:'Dark Chocolate', per:'30g 85%+',value:'Magnesium',      kcal:'170 kcal', emoji:'🍫', img:'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80' },
  ]
};

window.renderFoods = function(category) {
  const grid = document.getElementById('foodsGrid');
  if (!grid) return;
  grid.innerHTML = (foodsData[category] || []).map(food => `
    <div class="food-card">
      <img src="${food.img}" alt="${food.name}" loading="lazy" onerror="this.parentElement.querySelector('.food-emoji').style.fontSize='48px'"/>
      <div class="food-emoji">${food.emoji}</div>
      <div class="food-body">
        <h4>${food.name}</h4>
        <p>${food.per}</p>
        <div class="food-stats">
          <span class="food-stat protein-stat">${food.value}</span>
          <span class="food-stat">${food.kcal}</span>
        </div>
      </div>
    </div>`).join('');
};

document.querySelectorAll('.food-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.food-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderFoods(tab.dataset.goal);
  });
});

if (document.getElementById('foodsGrid')) renderFoods('protein');
