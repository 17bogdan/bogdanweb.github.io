/* ============================================================
   KRK SERVICE AUTO — Main JavaScript (WOW Edition)
   ============================================================ */

'use strict';

/* ============================================================
   DIAGNOSTIC HUD CANVAS — ECU Scanner Effect
   (Replaces abstract particle net — automotive-themed)
   ============================================================ */
class DiagnosticHUD {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.targets = [];
    this.scanY = 0;
    this.tick = 0;
    this.raf = null;
    this._resize = this.resize.bind(this);
    window.addEventListener('resize', this._resize);
    this.resize();
    this.loop();
  }

  resize() {
    const p = this.canvas.parentElement;
    this.canvas.width = p.offsetWidth;
    this.canvas.height = p.offsetHeight;
    this.buildNodes();
    this.targets = [this.mkTarget(), this.mkTarget(), this.mkTarget()];
  }

  buildNodes() {
    const { width: W, height: H } = this.canvas;
    this.nodes = [];
    for (let x = 60; x < W; x += 80) {
      for (let y = 50; y < H; y += 65) {
        this.nodes.push({
          x: x + (Math.random() - 0.5) * 28,
          y: y + (Math.random() - 0.5) * 28,
          phase: Math.random() * Math.PI * 2,
          speed: 0.007 + Math.random() * 0.014,
          r: 0.4 + Math.random() * 1.1,
        });
      }
    }
  }

  mkTarget() {
    const { width: W, height: H } = this.canvas;
    return {
      x: 90 + Math.random() * (W - 220),
      y: 80 + Math.random() * (H - 170),
      w: 55 + Math.random() * 95,
      h: 38 + Math.random() * 60,
      life: 0,
      maxLife: 140 + Math.random() * 160,
    };
  }

  loop() {
    this.raf = requestAnimationFrame(() => this.loop());
    const { ctx, canvas: c } = this;
    this.tick++;
    ctx.clearRect(0, 0, c.width, c.height);

    /* --- Grid nodes (circuit board dots) --- */
    for (const n of this.nodes) {
      n.phase += n.speed;
      const a = (Math.sin(n.phase) * 0.22 + 0.28) * 0.6;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(227,30,36,${a})`;
      ctx.fill();
    }

    /* --- Horizontal scan beam (diagnostic sweep) --- */
    this.scanY += 1.1;
    if (this.scanY > c.height + 70) this.scanY = -70;

    const sg = ctx.createLinearGradient(0, this.scanY - 70, 0, this.scanY + 70);
    sg.addColorStop(0, 'rgba(227,30,36,0)');
    sg.addColorStop(0.42, 'rgba(227,30,36,0.03)');
    sg.addColorStop(0.5, 'rgba(227,30,36,0.075)');
    sg.addColorStop(0.58, 'rgba(227,30,36,0.03)');
    sg.addColorStop(1, 'rgba(227,30,36,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(0, this.scanY - 70, c.width, 140);

    ctx.beginPath();
    ctx.moveTo(0, this.scanY);
    ctx.lineTo(c.width, this.scanY);
    ctx.strokeStyle = 'rgba(227,30,36,0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    /* Data blips on scan line */
    if (this.tick % 5 === 0) {
      const bx = Math.random() * c.width;
      const bw = 12 + Math.random() * 55;
      ctx.fillStyle = 'rgba(227,30,36,0.1)';
      ctx.fillRect(bx, this.scanY - 1, bw, 2);
    }

    /* --- Corner-bracket scan targets (OBD style) --- */
    for (let i = 0; i < this.targets.length; i++) {
      const t = this.targets[i];
      t.life++;
      if (t.life > t.maxLife) { this.targets[i] = this.mkTarget(); continue; }
      const fi = Math.min(t.life / 22, 1);
      const fo = Math.min((t.maxLife - t.life) / 22, 1);
      const alpha = Math.min(fi, fo) * 0.5;

      ctx.strokeStyle = `rgba(227,30,36,${alpha})`;
      ctx.lineWidth = 1;
      const { x, y, w, h } = t;
      const cs = 11;

      // TL
      ctx.beginPath(); ctx.moveTo(x, y + cs); ctx.lineTo(x, y); ctx.lineTo(x + cs, y); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(x + w - cs, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cs); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(x, y + h - cs); ctx.lineTo(x, y + h); ctx.lineTo(x + cs, y + h); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(x + w - cs, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cs); ctx.stroke();

      /* Inner crosshair — appears mid-life */
      const pct = t.life / t.maxLife;
      if (pct > 0.25 && pct < 0.75) {
        const mx = x + w / 2, my = y + h / 2;
        ctx.strokeStyle = `rgba(227,30,36,${alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(mx - 9, my); ctx.lineTo(mx + 9, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - 7); ctx.lineTo(mx, my + 7); ctx.stroke();
      }
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._resize);
  }
}

/* ============================================================
   3D TILT + SPOTLIGHT ON SERVICE CARDS
   ============================================================ */
function initTiltCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    // inject spotlight
    if (!card.querySelector('.card-spotlight')) {
      const sl = document.createElement('div');
      sl.className = 'card-spotlight';
      card.insertBefore(sl, card.firstChild);
    }
    const spotlight = card.querySelector('.card-spotlight');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 55%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      spotlight.style.background = '';
    });
  });
}

/* ============================================================
   TEXT SCRAMBLE
   ============================================================ */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '0123456789ABCDEF!<>-_\\/[]{}=+*^?#';
    this.frame = 0;
    this.queue = [];
  }

  setText(newText) {
    const old = this.el.textContent;
    const len = Math.max(old.length, newText.length);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 8);
      const end = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(this._raf);
    this.frame = 0;
    this._update();
  }

  _update() {
    let output = '', complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.3) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += `<span class="scramble-char">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }
    this.el.innerHTML = output;
    if (complete < this.queue.length) {
      this._raf = requestAnimationFrame(() => { this.frame++; this._update(); });
    }
  }
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-white, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================================
   CAR JOURNEY — Car drives between process stations
   ============================================================ */
function initCarJourney() {
  const car = document.getElementById('cjCar');
  const roadFill = document.getElementById('cjRoadFill');
  const stationIds = ['cjS0', 'cjS1', 'cjS2', 'cjS3'];
  const stations = stationIds.map(id => document.getElementById(id));
  const steps = document.querySelectorAll('.pw-step-auto');
  if (!car) return;

  let triggered = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      startJourney();
    }
  }, { threshold: 0.25 });

  const section = document.querySelector('.process-wow');
  if (section) obs.observe(section);

  function getCarLeft(idx) {
    const track = document.querySelector('.cj-track');
    const station = stations[idx];
    if (!track || !station) return 0;
    const tr = track.getBoundingClientRect();
    const sr = station.getBoundingClientRect();
    const carW = car.getBoundingClientRect().width || 110;
    return (sr.left - tr.left + sr.width / 2) - carW / 2;
  }

  function arriveAt(idx) {
    car.classList.remove('spinning');
    car.classList.add('arrived');
    setTimeout(() => car.classList.remove('arrived'), 600);

    if (stations[idx]) stations[idx].classList.add('lit');

    if (steps[idx]) {
      steps[idx].classList.add('animate-in');
      // burst effect
      setTimeout(() => steps[idx].classList.add('burst'), 50);
      setTimeout(() => steps[idx].classList.remove('burst'), 800);
    }

    if (idx < 3) setTimeout(() => driveToStep(idx + 1), 700);
  }

  function driveToStep(idx) {
    car.classList.add('spinning');
    car.style.left = getCarLeft(idx) + 'px';
    setTimeout(() => arriveAt(idx), 1060);
  }

  function startJourney() {
    if (roadFill) roadFill.style.width = '100%';

    // Place car off screen left, then begin
    car.style.transition = 'none';
    car.style.left = '-130px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        car.style.transition = 'left 1.05s cubic-bezier(0.4,0,0.2,1)';
        setTimeout(() => driveToStep(0), 120);
      });
    });
  }
}

/* ============================================================
   HUD PANEL — OBD Data Flickering
   ============================================================ */
function initHudPanel() {
  const hdRpm  = document.getElementById('hdRpm');
  const hdTemp = document.getElementById('hdTemp');
  const hdVolt = document.getElementById('hdVolt');
  const hdBat  = document.getElementById('hdBat');

  if (!hdRpm) return;

  const update = () => {
    if (hdRpm)  hdRpm.textContent  = (810 + Math.floor(Math.random() * 130)).toString();
    if (hdTemp) hdTemp.textContent = (87 + Math.floor(Math.random() * 9)) + '°C';
    if (hdVolt) hdVolt.textContent = (12.3 + Math.random() * 0.6).toFixed(1) + 'V';
    if (hdBat)  hdBat.textContent  = (91 + Math.floor(Math.random() * 7)) + '%';
  };

  setTimeout(() => {
    update();
    setInterval(update, 950);
  }, 2900);
}

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1800);
});

document.body.style.overflow = 'hidden';

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- HAMBURGER / MOBILE NAV ---------- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- SCROLL TO TOP ---------- */
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- REVEAL ON SCROLL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ---------- ANIMATED COUNTERS ---------- */
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ---------- HERO PARTICLES ---------- */
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    particlesContainer.appendChild(p);
  }
}

/* ---------- SMOOTH ANCHOR SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- LIGHTBOX (Gallery) ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

if (lightbox) {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigate = (dir) => {
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.opacity = '1';
    }, 150);
  };

  lightboxImg.style.transition = 'opacity 0.15s ease';

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Deschide fotografia ${i + 1}`);
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (field.type === 'checkbox') {
        if (!field.checked) {
          valid = false;
          field.closest('.form-check').style.outline = '2px solid var(--red)';
          field.closest('.form-check').style.borderRadius = '4px';
        } else {
          field.closest('.form-check').style.outline = '';
        }
      } else {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--red)';
        }
      }
    });

    if (!valid) {
      const firstError = contactForm.querySelector('[required][style*="border-color"]');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission (would be a real API call in production)
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⟳</span> Se trimite...';

    setTimeout(() => {
      contactForm.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
      }
    }, 1200);
  });

  // Live validation feedback
  contactForm.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = 'var(--red)';
      } else {
        field.style.borderColor = '';
      }
    });
    field.addEventListener('input', () => {
      if (field.value.trim()) field.style.borderColor = '';
    });
  });
}

/* ---------- ACTIVE NAV LINK ---------- */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

/* ---------- MARQUEE PAUSE ON HOVER ---------- */
const marqueeTrack = document.getElementById('marqueeTrack');
if (marqueeTrack) {
  marqueeTrack.closest('.marquee-strip')?.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.closest('.marquee-strip')?.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

/* ============================================================
   HERO CANVAS — Diagnostic HUD
   ============================================================ */
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  new DiagnosticHUD(heroCanvas);
}

/* ============================================================
   INIT ALL WOW + AUTO FEATURES
   ============================================================ */
window.addEventListener('load', () => {
  initTiltCards();
  initMagneticButtons();
  initCarJourney();
  initHudPanel();
  initScrambleTitles();
  initStatBars();
  initOrbs();
  initStatGauges();
});

/* ============================================================
   STAT GAUGES — Speedometer arcs for hero stats
   ============================================================ */
function initStatGauges() {
  const gaugeWraps = document.querySelectorAll('.stat-gauge-wrap');
  if (!gaugeWraps.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate the fill arc from 0 to its target
        const fill = entry.target.querySelector('.gauge-fill');
        if (fill) {
          const target = fill.dataset.target || fill.getAttribute('stroke-dasharray') || '0 314';
          fill.style.strokeDasharray = target;
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  gaugeWraps.forEach(wrap => {
    // Save the target dasharray from HTML attribute and reset to 0
    const fill = wrap.querySelector('.gauge-fill');
    if (fill) {
      fill.dataset.target = fill.getAttribute('stroke-dasharray');
      fill.style.strokeDasharray = '0 314';
    }
    observer.observe(wrap);
  });
}

/* ============================================================
   TEXT SCRAMBLE — Section titles on scroll
   ============================================================ */
function initScrambleTitles() {
  document.querySelectorAll('.scramble-on-view').forEach(el => {
    const original = el.textContent;
    const ts = new TextScramble(el);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ts.setText(original);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    obs.observe(el);
  });
}

/* ============================================================
   HERO STAT BARS
   ============================================================ */
function initStatBars() {
  document.querySelectorAll('.hero-stat').forEach((stat, i) => {
    // add bar
    if (!stat.querySelector('.hero-stat-bar')) {
      const bar = document.createElement('div');
      bar.className = 'hero-stat-bar';
      bar.innerHTML = '<div class="hero-stat-bar-fill"></div>';
      stat.appendChild(bar);
    }
    setTimeout(() => {
      stat.classList.add('animated');
    }, 2200 + i * 200);
  });
}

/* ============================================================
   FLOATING ORBS — inject into hero
   ============================================================ */
function initOrbs() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  ['orb-1', 'orb-2'].forEach(cls => {
    if (!hero.querySelector(`.${cls}`)) {
      const orb = document.createElement('div');
      orb.className = `orb ${cls}`;
      hero.appendChild(orb);
    }
  });
}

/* ============================================================
   GLITCH — Hero title accent
   ============================================================ */
(function initGlitch() {
  const accent = document.querySelector('.hero-title .accent');
  if (!accent) return;
  const txt = accent.textContent;
  accent.classList.add('hero-title-glitch');
  accent.setAttribute('data-text', txt);
})();

/* ============================================================
   REVEAL WITH STAGGER for brand chips
   ============================================================ */
window.addEventListener('load', () => {
  const chipObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.brand-chip').forEach((chip, i) => {
          chip.style.opacity = '0';
          chip.style.transform = 'translateY(16px)';
          chip.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.04}s`;
          requestAnimationFrame(() => {
            chip.style.opacity = '';
            chip.style.transform = '';
          });
        });
        chipObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const brandsGrid = document.querySelector('.brands-grid');
  if (brandsGrid) chipObs.observe(brandsGrid);
});
