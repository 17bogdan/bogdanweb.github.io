/* ============ IVOLT · PREMIUM INTERACTIONS ============ */
(() => {
  'use strict';

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  /* ---------- Auto-stagger indexes for groups ---------- */
  document.querySelectorAll('.stagger').forEach(group => {
    const children = group.querySelectorAll(':scope > .reveal, :scope > .reveal-img, :scope .check-list > .reveal');
    let i = 0;
    children.forEach(child => {
      if (!child.style.getPropertyValue('--stagger-index')) {
        child.style.setProperty('--stagger-index', i++);
      }
    });
  });

  /* ---------- Apply per-element data-delay -> CSS var ---------- */
  document.querySelectorAll('[data-delay]').forEach(el => {
    el.style.setProperty('--rd', `${el.dataset.delay}ms`);
  });

  /* ---------- Bidirectional reveal observer ---------- */
  // Elements animate IN when entering viewport (from above: translateY(-70) -> 0)
  // and animate OUT when leaving (push back up) so they re-trigger on scroll-down.
  const revealEls = document.querySelectorAll('.reveal, .reveal-img');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('visible', 'seen');
      } else {
        el.classList.remove('visible');
        // keep .seen so the "out" style applies (only after first reveal)
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -5% 0px'
  });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Counter animation ---------- */
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(c => counterIO.observe(c));

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    status.textContent = '— Se transmite...';
    setTimeout(() => {
      status.textContent = '✓ Mulțumim. Vă vom contacta în curând.';
      form.reset();
    }, 900);
  });

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      galleryItems.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.cat === filter;
        if (match) {
          item.classList.remove('hidden');
          // replay drop animation
          item.classList.remove('visible');
          item.style.setProperty('--rd', `${i * 70}ms`);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => item.classList.add('visible'));
          });
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCat = document.getElementById('lbCat');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta = document.getElementById('lbMeta');
  let currentIndex = 0;

  const getVisibleItems = () =>
    Array.from(galleryItems).filter(it => !it.classList.contains('hidden'));

  const openLightbox = idx => {
    const items = getVisibleItems();
    if (!items.length) return;
    currentIndex = (idx + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbCat.textContent = item.querySelector('.g-cat').textContent;
    lbTitle.textContent = item.querySelector('h4').textContent;
    lbMeta.textContent = item.querySelector('.g-meta').textContent;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = getVisibleItems();
      const idx = items.indexOf(item);
      if (idx >= 0) openLightbox(idx);
    });
  });

  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => openLightbox(currentIndex - 1));
  document.getElementById('lbNext')?.addEventListener('click', () => openLightbox(currentIndex + 1));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
})();

/* ============================================
   PREMIUM: Preloader, Scroll Progress,
   Testimonials slider, Magnetic buttons
   ============================================ */

/* Preloader — hide after load */
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  const hide = () => {
    setTimeout(() => pre.classList.add('is-hidden'), 2700);
  };
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
})();

/* Scroll progress bar */
(function () {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Testimonials slider */
(function () {
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prev = document.getElementById('testiPrev');
  const next = document.getElementById('testiNext');
  if (!track || !dotsWrap) return;
  const slides = Array.from(track.querySelectorAll('.testi-slide'));
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  const go = (i, user) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === current));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === current));
    if (user) reset();
  };
  const reset = () => {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 7000);
  };

  prev && prev.addEventListener('click', () => go(current - 1, true));
  next && next.addEventListener('click', () => go(current + 1, true));
  go(0);
  reset();
})();

/* Magnetic buttons — primary CTAs follow cursor subtly */
(function () {
  const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mql.matches) return;
  const btns = document.querySelectorAll('.btn-primary');
  btns.forEach((btn) => {
    btn.classList.add('magnetic');
    const strength = 0.25;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
