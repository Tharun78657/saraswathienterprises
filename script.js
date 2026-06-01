// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== PREMIUM HERO SLIDER =====
(function () {
  const DURATION = 4000;

  const slides = [
    { badge: '100% Vegetarian',   title: 'Authentic Veg Catering',         sub: 'Traditional vegetarian dishes prepared with fresh ingredients and unforgettable flavors.',      cta: 'Explore Menu' },
    { badge: 'Premium Non-Veg',   title: 'Rich Non-Veg Delicacies',         sub: 'Chicken, Mutton and Signature Specialties crafted for every celebration.',                     cta: 'View Specials' },
    { badge: 'Frozen Delights',   title: 'Premium Ice Cream Collection',    sub: 'Creamy desserts and refreshing treats loved by guests of all ages.',                           cta: 'See Desserts' },
    { badge: 'Refreshing Drinks', title: 'Cool Drinks & Mocktails',         sub: 'Refreshing beverages perfectly paired with every occasion.',                                   cta: 'View Beverages' },
    { badge: 'Sweet Memories',    title: 'Traditional Indian Sweets',       sub: 'Delicious handcrafted sweets made with purity, tradition and taste.',                          cta: 'See Sweets' },
  ];

  let current = 0;
  let autoTimer = null;

  // elements
  const badgeText = document.getElementById('hsBadgeText');
  const titleEl   = document.getElementById('hsTitle');
  const subEl     = document.getElementById('hsSub');
  const ctaBtn    = document.getElementById('hsCtaBtn');
  const ctaWrap   = document.getElementById('hsCta');
  const barEl     = document.getElementById('hsBar');
  const dots      = document.querySelectorAll('.hs-dot');
  const counterEl = document.getElementById('hsCurrent');

  // ── Swiper init ──
  const swiper = new Swiper('#hsSwiper', {
    loop: true,
    speed: 900,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    allowTouchMove: true,
    slidesPerView: 1,
    spaceBetween: 0,
    grabCursor: false,
    on: {
      slideChangeTransitionStart: function () {
        const realIdx = this.realIndex;
        if (realIdx !== current) {
          current = realIdx;
          updateText(current);
          updateDots(current);
          updateCounter(current);
          restartProgress();
        }
      }
    }
  });

  // ── char-split animation ──
  function splitChars(el, text) {
    el.innerHTML = text.split('').map(ch =>
      ch === ' '
        ? '<span class="char" style="display:inline-block;width:0.28em;opacity:1;transform:none;"> </span>'
        : `<span class="char">${ch}</span>`
    ).join('');
  }

  function animateChars(el) {
    const chars = el.querySelectorAll('.char');
    chars.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(28px)';
      c.style.transition = 'none';
      setTimeout(() => {
        c.style.transition = `opacity 0.35s ease ${i * 0.032}s, transform 0.4s ease ${i * 0.032}s`;
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, 30);
    });
  }

  function updateText(idx) {
    const d = slides[idx];
    // badge
    badgeText.style.opacity = '0';
    setTimeout(() => {
      badgeText.textContent = d.badge;
      badgeText.style.transition = 'opacity 0.4s ease';
      badgeText.style.opacity = '1';
    }, 150);

    // title chars
    splitChars(titleEl, d.title);
    animateChars(titleEl);

    // subtitle
    subEl.classList.remove('visible');
    setTimeout(() => {
      subEl.textContent = d.sub;
      subEl.classList.add('visible');
    }, 500);

    // cta
    ctaWrap.classList.remove('visible');
    ctaBtn.textContent = d.cta;
    setTimeout(() => ctaWrap.classList.add('visible'), 800);
  }

  function updateDots(idx) {
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function updateCounter(idx) {
    counterEl.textContent = String(idx + 1).padStart(2, '0');
  }

  // ── progress bar ──
  function restartProgress() {
    barEl.style.transition = 'none';
    barEl.style.width = '0%';
    barEl.offsetWidth; // reflow
    barEl.style.transition = `width ${DURATION}ms linear`;
    barEl.style.width = '100%';
  }

  // ── autoplay ──
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => swiper.slideNext(), DURATION);
  }

  // ── controls ──
  document.getElementById('hsNext').addEventListener('click', () => {
    clearInterval(autoTimer); swiper.slideNext(); startAuto();
  });
  document.getElementById('hsPrev').addEventListener('click', () => {
    clearInterval(autoTimer); swiper.slidePrev(); startAuto();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      swiper.slideToLoop(i);
      startAuto();
    });
  });

  // ── sparkles ──
  const sparkleContainer = document.getElementById('hsSparkles');
  if (sparkleContainer) {
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${40 + Math.random() * 55}%;
        --dur: ${2.5 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 4}s;
        width: ${4 + Math.random() * 5}px;
        height: ${4 + Math.random() * 5}px;
      `;
      sparkleContainer.appendChild(s);
    }
  }

  // mouse parallax disabled — image fills exact 1920x900

  // ── stats counter ──
  let counted = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    document.querySelectorAll('.hs-count').forEach(el => {
      const target = +el.dataset.target;
      const dur = 1800;
      const step = 16;
      const inc = target / (dur / step);
      let val = 0;
      const t = setInterval(() => {
        val = Math.min(val + inc, target);
        el.textContent = Math.floor(val).toLocaleString();
        if (val >= target) clearInterval(t);
      }, step);
    });
  }
  // run counters after short delay on page load
  setTimeout(runCounters, 600);

  // ── init ──
  splitChars(titleEl, slides[0].title);
  animateChars(titleEl);
  setTimeout(() => subEl.classList.add('visible'), 500);
  setTimeout(() => ctaWrap.classList.add('visible'), 800);
  restartProgress();
  startAuto();
})();

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== MENU DATA =====
const menuData = {
  veg: [
    // Vegetable Biryani – colourful veg biryani in a pot
    { name: 'Vegetable Biryani', desc: 'Fragrant basmati rice with fresh vegetables & aromatic spices', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Paneer Butter Masala – bright orange paneer gravy
    { name: 'Paneer Butter Masala', desc: 'Soft paneer in rich, creamy tomato-based gravy', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Dal Tadka – yellow lentil dal in bowl
    { name: 'Dal Tadka', desc: 'Slow-cooked lentils tempered with cumin, garlic & ghee', img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Sambar Rice – South Indian thali / sambar
    { name: 'Sambar Rice', desc: 'Traditional Tamil Nadu sambar with hot rice and papad', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Curd Rice – white curd rice with tempering
    { name: 'Curd Rice', desc: 'Cool, comforting curd rice tempered with mustard & curry leaves', img: 'https://images.unsplash.com/photo-1630383249896-483b1fbf5fc?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Puri Masala – puffy deep-fried pooris
    { name: 'Puri Masala', desc: 'Fluffy deep-fried pooris with spicy potato masala', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Idli Sambar – white idlis on plate
    { name: 'Idli Sambar', desc: 'Steamed soft idlis with piping hot sambar and chutneys', img: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
    // Chapati with Kurma – layered rotis / chapati
    { name: 'Chapati with Kurma', desc: 'Soft whole wheat chapatis with mixed vegetable kurma', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80', tag: 'veg', tagLabel: 'Veg' },
  ],
  nonveg: [
    // Chicken Biryani – chicken biryani with raita
    { name: 'Chicken Biryani', desc: 'Dum-cooked biryani with tender chicken and fragrant saffron rice', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Mutton Curry – dark rich mutton gravy
    { name: 'Mutton Curry', desc: 'Slow-cooked tender mutton in a rich spice-laden gravy', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Tandoori Chicken – charred red tandoori chicken
    { name: 'Tandoori Chicken', desc: 'Marinated whole chicken slow-roasted in traditional clay oven', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c081cc?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Fish Curry – South Indian fish curry
    { name: 'Fish Curry', desc: 'Coastal-style fish curry cooked with tamarind and coconut milk', img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Prawn Masala – prawns in masala
    { name: 'Prawn Masala', desc: 'Juicy prawns in a bold, spicy masala — a crowd favourite', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Chicken 65 – fried crispy chicken pieces
    { name: 'Chicken 65', desc: 'Crispy deep-fried chicken with chillies — the ultimate starter', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cee6a5?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Egg Masala – boiled eggs in thick gravy
    { name: 'Egg Masala', desc: 'Hard-boiled eggs in a spiced onion-tomato gravy', img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
    // Mutton Biryani – dum biryani topped with mutton
    { name: 'Mutton Biryani', desc: 'Premium dum biryani with succulent mutton and whole spices', img: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80', tag: 'nonveg', tagLabel: 'Non-Veg' },
  ],
  sweets: [
    // Gulab Jamun – dark round jamuns in syrup
    { name: 'Gulab Jamun', desc: 'Soft milk-solid dumplings soaked in rose-cardamom sugar syrup', img: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Payasam / Kheer – creamy rice kheer with saffron
    { name: 'Payasam', desc: 'Creamy vermicelli kheer with cashews, raisins and saffron', img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Halwa – orange-gold wheat halwa
    { name: 'Halwa', desc: 'Rich wheat halwa garnished with ghee-fried nuts — temple style', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Rasgulla – white spongy balls in bowl
    { name: 'Rasgulla', desc: 'Soft, spongy chena balls in light sugar syrup', img: 'https://images.unsplash.com/photo-1666450569913-7d7d6f6f2b16?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Kesari Bath – orange saffron semolina sweet
    { name: 'Kesari Bath', desc: 'Semolina-based sweet with saffron, ghee and dry fruits', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Jangiri / Imarti – spiral deep-fried sweet
    { name: 'Jangiri', desc: 'Crispy spiral-shaped urad dal sweets dipped in sugar syrup', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Ice Cream – scoops in cone/cup
    { name: 'Ice Cream Bar', desc: 'Premium live ice cream station with 12+ flavours and toppings', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
    // Mysore Pak – golden gram flour sweet squares
    { name: 'Mysore Pak', desc: 'Melt-in-mouth gram flour fudge made with pure ghee', img: 'https://images.unsplash.com/photo-1571119829751-dd8e2477d32b?w=400&q=80', tag: 'sweet', tagLabel: 'Sweet' },
  ],
  drinks: [
    // Mango Lassi – thick yellow mango yoghurt drink
    { name: 'Fresh Mango Lassi', desc: 'Thick, chilled mango yoghurt drink — summer favourite', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Panakam / lemon jaggery drink – yellowish drink in glass
    { name: 'Panakam', desc: 'Traditional jaggery-lemon drink with pepper and cardamom', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Filter Kaapi – frothy South Indian coffee in tumbler-davara
    { name: 'Filter Kaapi', desc: 'Authentic South Indian filter coffee with frothy top', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Tender Coconut Water – whole tender coconut with straw
    { name: 'Tender Coconut Water', desc: 'Fresh, chilled tender coconut served straight from the shell', img: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Rose Milk – pink drink in glass
    { name: 'Rose Milk', desc: 'Chilled full-cream milk with rose syrup and basil seeds', img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Fresh Lime Soda – lime soda with ice
    { name: 'Fresh Lime Soda', desc: 'Refreshing lime soda — sweet, salted or mixed to order', img: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Watermelon Juice – bright red watermelon juice
    { name: 'Watermelon Juice', desc: 'Cold-pressed fresh watermelon juice with a hint of mint', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
    // Buttermilk / Mor – white spiced buttermilk
    { name: 'Buttermilk (Mor)', desc: 'Spiced traditional Tamil buttermilk — light and digestive', img: 'https://images.unsplash.com/photo-1571167366136-b57e40d75d30?w=400&q=80', tag: 'drink', tagLabel: 'Drink' },
  ]
};

function renderMenu(tab) {
  const grid = document.getElementById('menuGrid');
  const items = menuData[tab];
  grid.innerHTML = items.map(item => `
    <div class="menu-card fade-up">
      <div class="menu-card-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="menu-card-body">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <span class="menu-tag ${item.tag}">${item.tagLabel}</span>
      </div>
    </div>
  `).join('');
  setTimeout(() => {
    grid.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 30);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.tab);
  });
});

renderMenu('veg');

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

function addFadeUpToElements() {
  const selectors = [
    '.service-card', '.why-card', '.testi-card',
    '.gallery-item', '.about-text', '.about-visual',
    '.contact-info', '.contact-form-wrap', '.pillar'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  });
}
addFadeUpToElements();

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('formSuccess').classList.add('show');
    btn.innerHTML = 'Send Enquiry <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    this.reset();
    setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
  }, 1200);
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });
