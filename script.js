/* ============================================================
   HOME & CAR — script.js
   Interactions, animations, and dynamic behaviors
   ============================================================ */

'use strict';

/* ======================== NAVBAR ======================== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  // Scroll: add .scrolled class
  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    handleBackToTop();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');

    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', !isOpen);

    // Accessibility
    hamburger.setAttribute('aria-expanded', !isOpen);
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.classList.remove('menu-open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ======================== ACTIVE NAV LINK ======================== */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  const offset = 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ======================== SCROLL REVEAL ======================== */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-right');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, parseInt(delay));

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(target => observer.observe(target));
})();

/* ======================== HERO ANIMATIONS ======================== */
function triggerHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero .reveal, .hero .reveal-right');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 150);
  });
}

/* ======================== HOW IT WORKS TABS ======================== */
(function initHiwTabs() {
  const tabs  = document.querySelectorAll('.hiw-tab');
  const flows = document.querySelectorAll('.hiw-flow');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update flows
      flows.forEach(flow => {
        flow.classList.remove('active');
        if (flow.id === `tab-${target}`) {
          flow.classList.add('active');

          // Re-trigger reveal animations inside the active flow
          const reveals = flow.querySelectorAll('.reveal');
          reveals.forEach(el => el.classList.remove('visible'));

          setTimeout(() => {
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
          }, 50);
        }
      });
    });
  });
})();

/* ======================== TESTIMONIALS SLIDER ======================== */
(function initTestimonials() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');

  if (!track) return;

  const cards      = track.querySelectorAll('.testi-card');
  const totalCards = cards.length;
  let current      = 0;
  let autoInterval = null;
  let cardsPerView = getCardsPerView();

  const totalSlides = Math.ceil(totalCards / cardsPerView);

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Get cards per view based on screen
  function getCardsPerView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  // Calculate card width including gap
  function getCardWidth() {
    const card = cards[0];
    if (!card) return 0;
    const gap = 24;
    return card.offsetWidth + gap;
  }

  // Go to a specific slide
  function goTo(index) {
    current = Math.max(0, Math.min(index, totalSlides - 1));
    const offset = current * cardsPerView * getCardWidth();
    const isRtl = document.documentElement.dir === 'rtl';
    const sign = isRtl ? 1 : -1;
    track.style.transform = `translateX(${sign * offset}px)`;

    // Update dots
    document.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  // Next / Prev
  function next() {
    goTo(current < totalSlides - 1 ? current + 1 : 0);
  }

  function prev() {
    goTo(current > 0 ? current - 1 : totalSlides - 1);
  }

  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });

  // Auto-play
  function startAuto() {
    autoInterval = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  // Touch / swipe support
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    let diff = touchStartX - touchEndX;
    if (document.documentElement.dir === 'rtl') diff = -diff;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  // Responsive: recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cardsPerView = getCardsPerView();
      buildDots();
      goTo(0);
    }, 200);
  });

  // Init
  buildDots();
  startAuto();

  // Pause auto on hover
  track.closest('.testimonials-wrapper')?.addEventListener('mouseenter', () => clearInterval(autoInterval));
  track.closest('.testimonials-wrapper')?.addEventListener('mouseleave', startAuto);
})();

/* ======================== FAQ ACCORDION ======================== */
(function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-q');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
    });
  });
})();

/* ======================== BACK TO TOP ======================== */
function handleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ======================== SMOOTH SCROLL ======================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ======================== PROVIDER INCOME BAR ANIMATION ======================== */
(function initIncomeChart() {
  const chart = document.querySelector('.pv-income-chart');
  if (!chart) return;

  const bars = chart.querySelectorAll('.pv-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate bars on enter
        bars.forEach((bar, i) => {
          const targetHeight = bar.style.height;
          bar.style.height = '0%';
          setTimeout(() => {
            bar.style.transition = `height 600ms cubic-bezier(.34,1.06,.64,1)`;
            bar.style.height = targetHeight;
          }, i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(chart);
})();

/* ======================== COUNTER ANIMATION ======================== */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-num');

  if (!statNums.length) return;

  function animateCounter(el) {
    const text  = el.textContent;
    const num   = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix = text.replace(/[0-9.]/g, '');
    const duration = 1800;
    const start = performance.now();

    function update(ts) {
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (num * eased).toFixed(num % 1 !== 0 ? 1 : 0);
      el.textContent = current + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ======================== SERVICE CARD RIPPLE ======================== */
(function initRipple() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0; height: 0;
        border-radius: 50%;
        background: rgba(29,107,60,.12);
        transform: translate(-50%, -50%);
        animation: rippleAnim 600ms ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ======================== PARALLAX BLOBS ======================== */
(function initParallaxBlobs() {
  const blobs = document.querySelectorAll('.hero-bg .blob');
  if (!blobs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = 0.05 + i * 0.02;
          blob.style.transform += ` translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ======================== NAVBAR HIDE ON MOBILE SCROLL ======================== */
(function initSmartNavbar() {
  let lastScrollY = window.scrollY;
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Only hide after scrolling past 100px
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY + 5) {
        // Scrolling down: hide on small screens
        if (window.innerWidth < 900) {
          navbar.style.transform = 'translateY(-100%)';
        }
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up: always show
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
})();

/* ======================== APP UI CAROUSEL (phone screen) ======================== */
(function initAppUiCarousel() {
  const cats = document.querySelectorAll('.app-cat');
  if (!cats.length) return;

  let catIndex = 0;

  function cycleCat() {
    cats[catIndex].classList.remove('active');
    catIndex = (catIndex + 1) % cats.length;
    cats[catIndex].classList.add('active');
  }

  setInterval(cycleCat, 2500);
})();

/* ======================== FLOATING CARDS STAGGER ======================== */
(function initFloatStagger() {
  const floatCards = document.querySelectorAll('.float-card');

  floatCards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.8}s`;
  });
})();

/* ======================== INTERSECTION: SERVICE CARDS ======================== */
(function initServiceCardEntrance() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  // Cards start hidden via reveal class (already handled)
  // This adds a stagger via data-delay attribute already set in HTML
})();

/* ======================== UTILITY: throttle ======================== */
function throttle(fn, wait) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ======================== PAGE VISIBILITY ======================== */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '👋 Come back — Home & Car';
  } else {
    document.title = 'Home & Car – Services At Your Doorstep';
  }
});

/* ======================== INIT LOG ======================== */
console.log('%c🏠 Home & Car Loaded', 'color:#2D9B5F;font-size:16px;font-weight:700;');
console.log('%cPremium startup design · homeandcar.app', 'color:#4ECFA5;font-size:12px;');

/* ======================== LANGUAGE SWITCHER ======================== */
(function initLanguageSwitcher() {
  let currentLang = localStorage.getItem("hc_lang") || "en";
  const langBtns = document.querySelectorAll(".lang-btn");
  const originalTexts = new WeakMap();

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("hc_lang", lang);
    
    // Set HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    
    // Update buttons
    langBtns.forEach(btn => {
      btn.textContent = lang === "en" ? "عربي" : "EN";
    });
    
    // Update title
    if (lang === "ar" && typeof translations !== 'undefined' && translations["Home & Car – Services At Your Doorstep"]) {
        document.title = translations["Home & Car – Services At Your Doorstep"];
    } else {
        document.title = "Home & Car – Services At Your Doorstep";
    }

    // Traverse DOM and translate
    translateDOM(document.body, lang);
  }

  function translateDOM(node, lang) {
    // Translate Placeholders
    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute("placeholder")) {
      if (!originalTexts.has(node)) {
        originalTexts.set(node, node.getAttribute("placeholder").trim());
      }
      const enText = originalTexts.get(node);
      if (lang === "ar" && typeof translations !== 'undefined' && translations[enText]) {
        node.setAttribute("placeholder", translations[enText]);
      } else {
        node.setAttribute("placeholder", enText);
      }
    }

    // Translate Text Nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue.trim();
      if (text && text.length > 1 && !['&', 'n', 'b', 's', 'p', ';'].includes(text)) {
        if (!originalTexts.has(node)) {
          originalTexts.set(node, node.nodeValue);
        }
        
        let origValue = originalTexts.get(node);
        let enText = origValue.trim();
        
        if (lang === "ar" && typeof translations !== 'undefined' && translations[enText]) {
          node.nodeValue = origValue.replace(enText, translations[enText]);
        } else {
          node.nodeValue = origValue;
        }
      }
    } else {
      // Ignore scripts and styles
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      
      // Traverse children
      for (let child of node.childNodes) {
        translateDOM(child, lang);
      }
    }
  }

  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      updateLanguage(currentLang === "en" ? "ar" : "en");
    });
  });

  // Initialize on load
  if (currentLang === "ar") {
    // wait for DOM translations if translations.js is loaded
    setTimeout(() => updateLanguage("ar"), 50);
  } else {
      updateLanguage("en");
  }
})();