/* ============================================================
   GSAP Animations — Aqua Hotel
   Senior Design Engineer 2026
   ============================================================ */

class AquaAnimations {
  constructor() {
    this._registerScrollTrigger();
    this._initNav();
    this._initLoader();
    this._initCursor();
    this._initScrollReveal();
    this._initCounters();
    this._initHoverEffects();
    this._initPageTransitions();
    this._initMenuTabs();
  }

  _registerScrollTrigger() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // ---- LOADER ----
  _initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    const pct = loader.querySelector('.loader__percent');
    let count = 0;

    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 15) + 5;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);

        if (pct) pct.textContent = '100%';

        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(loader, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
              },
            });
          } else {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
          }
        }, 300);
      }
      if (pct && count < 100) pct.textContent = count + '%';
    }, 80);

    document.body.style.overflow = 'hidden';
  }

  // ---- CUSTOM CURSOR ----
  _initCursor() {
    const outer = document.querySelector('.cursor-outer');
    const inner = document.querySelector('.cursor-inner');
    if (!outer || !inner) return;

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      inner.style.left = mouseX + 'px';
      inner.style.top  = mouseY + 'px';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    const tick = () => {
      outerX = lerp(outerX, mouseX, 0.12);
      outerY = lerp(outerY, mouseY, 0.12);
      outer.style.left = outerX + 'px';
      outer.style.top  = outerY + 'px';
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mouseleave', () => {
      outer.style.opacity = '0';
      inner.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      outer.style.opacity = '1';
      inner.style.opacity = '1';
    });
  }

  // ---- NAVBAR ----
  _initNav() {
    const navbar = document.querySelector('.navbar');
    const burger = document.querySelector('.navbar__burger');
    const mobileMenu = document.querySelector('.navbar__mobile');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      });
    }

    if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ---- SCROLL REVEAL ----
  _initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: use Intersection Observer
      this._initIntersectionObserver();
      return;
    }

    // Section labels
    gsap.utils.toArray('.section-label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: 'power2.out',
      });
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    });

    // Generic fade-up
    gsap.utils.toArray('.gsap-fade-up').forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: (i % 4) * 0.1,
        ease: 'power3.out',
      });
    });

    // Cards stagger
    gsap.utils.toArray('.card, .room-card, .testimonial-card, .menu-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 50,
        duration: 0.7,
        delay: (i % 4) * 0.08,
        ease: 'power3.out',
      });
    });

    // Stats counter
    gsap.utils.toArray('.stat-item__number').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });
    });

    // Feature list items
    gsap.utils.toArray('.feature-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        opacity: 0,
        x: -40,
        duration: 0.6,
        delay: i * 0.12,
        ease: 'power2.out',
      });
    });

    // Gallery strip
    gsap.utils.toArray('.gallery-strip__item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // Booking bar
    const bar = document.querySelector('.booking-bar__inner');
    if (bar) {
      gsap.from(bar, {
        scrollTrigger: { trigger: bar, start: 'top 95%', toggleActions: 'play none none none' },
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'power3.out',
      });
    }

    // Location items
    gsap.utils.toArray('.location-item').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        opacity: 0,
        x: 40,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });
  }

  _initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gsap-fade-up, .card, .room-card, .testimonial-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      observer.observe(el);
    });
  }

  // ---- COUNTERS ----
  _initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // ---- HOVER EFFECTS ----
  _initHoverEffects() {
    if (typeof gsap === 'undefined') return;

    // Magnetic buttons
    document.querySelectorAll('.btn--primary, .btn--outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ---- PAGE TRANSITIONS ----
  _initPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target])');
    if (typeof gsap === 'undefined') return;

    links.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('//')) return;

        e.preventDefault();

        gsap.to(document.body, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            window.location.href = href;
          },
        });
      });
    });

    // Fade in on load
    gsap.from(document.body, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  // ---- MENU TABS (Restaurant page) ----
  _initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.menu-section').forEach(sec => {
          sec.style.display = 'none';
        });

        const target = document.getElementById('menu-' + targetId);
        if (target) {
          target.style.display = '';

          if (typeof gsap !== 'undefined') {
            gsap.from(target.querySelectorAll('.menu-item'), {
              opacity: 0,
              y: 20,
              duration: 0.4,
              stagger: 0.05,
              ease: 'power2.out',
            });
          }
        }
      });
    });
  }
}

// ---- SMOOTH SCROLL ----
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}

// ---- BOOKING FORM VALIDATION ----
class BookingForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    this._init();
  }

  _init() {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = this.form.querySelectorAll('input[type="date"]');
    dateInputs.forEach(inp => {
      inp.setAttribute('min', today);
    });

    // Validate check-out >= check-in
    const checkIn  = this.form.querySelector('[name="checkin"]');
    const checkOut = this.form.querySelector('[name="checkout"]');

    if (checkIn && checkOut) {
      checkIn.addEventListener('change', () => {
        checkOut.setAttribute('min', checkIn.value);
        if (checkOut.value && checkOut.value < checkIn.value) {
          checkOut.value = checkIn.value;
        }
      });
    }

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  _handleSubmit() {
    const data = new FormData(this.form);
    const payload = Object.fromEntries(data.entries());

    // Basic validation
    for (const [key, val] of Object.entries(payload)) {
      if (!val.trim()) {
        this._showError('Vă rugăm completați toate câmpurile obligatorii.');
        return;
      }
    }

    this._showSuccess('Cererea de rezervare a fost trimisă! Vă vom contacta în cel mai scurt timp.');
    this.form.reset();
  }

  _showSuccess(msg) {
    this._showMessage(msg, 'success');
  }

  _showError(msg) {
    this._showMessage(msg, 'error');
  }

  _showMessage(msg, type) {
    const el = document.createElement('div');
    el.className = `form-message form-message--${type}`;
    el.textContent = msg;
    el.style.cssText = `
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.875rem;
      background: ${type === 'success' ? 'rgba(0, 207, 222, 0.1)' : 'rgba(220, 60, 60, 0.1)'};
      border: 1px solid ${type === 'success' ? 'rgba(0, 207, 222, 0.3)' : 'rgba(220, 60, 60, 0.3)'};
      color: ${type === 'success' ? '#00CFDE' : '#E05555'};
    `;

    const existing = this.form.querySelector('.form-message');
    if (existing) existing.remove();

    this.form.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.4s';
        setTimeout(() => el.remove(), 400);
      }
    }, 5000);
  }
}

// ---- CONTACT FORM ----
class ContactForm extends BookingForm {
  constructor() {
    super('.contact-form');
  }
}

// ---- INIT ALL ----
document.addEventListener('DOMContentLoaded', () => {
  window.aquaAnimations = new AquaAnimations();
  window.smoothScroll   = new SmoothScroll();
  window.bookingForm    = new BookingForm('.booking-form');
  window.contactForm    = new ContactForm();
});
