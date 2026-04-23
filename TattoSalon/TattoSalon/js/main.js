/**
 * INK ASYLUM — Main JS
 * GSAP ScrollTrigger, Loading Screen, Navbar, Custom Cursor,
 * Typewriter, Counters, Testimonials Slider, Magnetic Effect
 */

(function () {
  'use strict';

  /* ============================================================
     LOADING SCREEN
  ============================================================ */
  function initLoadingScreen() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;

    // Minimum display time 2.4s, then fade out
    setTimeout(() => {
      screen.classList.add('fade-out');
      screen.addEventListener('animationend', () => {
        screen.style.display = 'none';
        document.body.classList.remove('loading');
        // Kick off hero animations after reveal
        initTypewriter();
      }, { once: true });
    }, 2400);
  }

  /* ============================================================
     CUSTOM CURSOR
  ============================================================ */
  function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states
    const hoverTargets = document.querySelectorAll(
      'a, button, .filter-btn, .testi-btn, .testi-dot, .service-card, .portfolio-item, .artist-card'
    );

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
    });
  }

  /* ============================================================
     NAVBAR
  ============================================================ */
  function initNavbar() {
    const navbar  = document.getElementById('navbar');
    const toggle  = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!navbar) return;

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = current;
    }, { passive: true });

    // Mobile toggle
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('open');
        navLinks.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });

      // Close on link click
      navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          toggle.classList.remove('open');
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ============================================================
     TYPEWRITER EFFECT
  ============================================================ */
  function initTypewriter() {
    const el   = document.getElementById('typewriterLine');
    if (!el) return;

    const text   = 'INK ASYLUM';
    const speed  = 100; // ms per character
    el.textContent = '';

    let i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(type, speed);
      } else {
        // Stop cursor blinking after done
        setTimeout(() => el.classList.add('done'), 1000);
      }
    }

    setTimeout(type, 300);
  }

  /* ============================================================
     GSAP SCROLL ANIMATIONS
  ============================================================ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: just show everything if GSAP didn't load
      document.querySelectorAll('.gsap-reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- Section reveals ---
    gsap.utils.toArray('.gsap-reveal').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;

      gsap.to(el, {
        opacity:   1,
        y:         0,
        duration:  0.9,
        delay:     delay,
        ease:      'power3.out',
        scrollTrigger: {
          trigger:  el,
          start:    'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    // --- Navbar progress line (optional visual flair) ---
    // None needed — clean minimal nav

    // --- Parallax on about image ---
    const aboutImg = document.querySelector('.about-img');
    if (aboutImg) {
      gsap.to(aboutImg, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.5,
        },
      });
    }

    // --- Hero overlay parallax ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end:   'bottom top',
          scrub: 1,
        },
      });
    }

    // --- Counters ---
    initCounters();
  }

  /* ============================================================
     ANIMATED COUNTERS
  ============================================================ */
  function initCounters() {
    if (typeof gsap === 'undefined') {
      // Plain JS fallback
      document.querySelectorAll('.stat-number').forEach((el) => {
        el.textContent = el.dataset.target;
      });
      return;
    }

    const counters = document.querySelectorAll('.stat-number');

    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target, 10);
      const obj    = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start:   'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate() {
          counter.textContent = Math.round(obj.val).toLocaleString('ro-RO');
        },
        onComplete() {
          counter.textContent = target.toLocaleString('ro-RO');
        },
      });
    });
  }

  /* ============================================================
     TESTIMONIALS SLIDER
  ============================================================ */
  function initTestimonials() {
    const track   = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');
    const dotsWrap = document.getElementById('testiDots');
    if (!track) return;

    const cards  = track.querySelectorAll('.testimonial-card');
    const count  = cards.length;
    let current  = 0;
    let autoPlay = null;

    // Build dots
    const dots = [];
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(index) {
      current = (index + count) % count;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAuto();
      }
    }, { passive: true });

    // Auto-play
    function startAuto() {
      autoPlay = setInterval(next, 5000);
    }

    function resetAuto() {
      clearInterval(autoPlay);
      startAuto();
    }

    startAuto();
  }

  /* ============================================================
     PORTFOLIO FILTER
  ============================================================ */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items      = document.querySelectorAll('.portfolio-item');
    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Active state
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        items.forEach((item) => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
            item.classList.add('visible');
          } else {
            item.classList.add('hidden');
            item.classList.remove('visible');
          }
        });
      });
    });

    // Initialize all as visible
    items.forEach((item) => item.classList.add('visible'));
  }

  /* ============================================================
     MAGNETIC BUTTON EFFECT
  ============================================================ */
  function initMagnetic() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect    = el.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx      = e.clientX - centerX;
        const dy      = e.clientY - centerY;
        const strength = 0.35;
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLL (for browsers without native support)
  ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     HERO DIVIDER / SECTION SEPARATORS (subtle animated line)
  ============================================================ */
  function addSectionSeparators() {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
      const line = document.createElement('div');
      line.style.cssText = `
        position: absolute;
        bottom: 0; left: 50%; transform: translateX(-50%);
        width: 1px; height: 60px;
        background: linear-gradient(to bottom, rgba(212,175,55,0.3), transparent);
        pointer-events: none;
      `;
      sec.appendChild(line);
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    initLoadingScreen();
    initCursor();
    initNavbar();
    initGSAP();
    initTestimonials();
    initPortfolioFilter();
    initMagnetic();
    initSmoothScroll();
    addSectionSeparators();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
