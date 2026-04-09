/* ═══════════════════════════════════════════════════════════
   ANIMA CLINIQUE — JavaScript
   Total redesign: Light sci-fi theme animations
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────
     1.  PRELOADER
  ──────────────────────────────────────────── */
  const preloader  = document.getElementById('preloader');
  const fillEl     = document.getElementById('preloaderFill');
  const pctEl      = document.getElementById('preloaderPct');

  document.body.style.overflow = 'hidden';

  function runPreloader () {
    let val = 0;
    const target = 100;
    const step   = () => {
      val += Math.random() * 4 + 1;
      if (val >= target) val = target;
      if (fillEl) fillEl.style.width = val + '%';
      if (pctEl)  pctEl.textContent  = Math.round(val) + '%';
      if (val < target) setTimeout(step, 30);
    };
    step();
  }
  runPreloader();

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('done');
      document.body.style.overflow = '';
      initAOS(); // kick off scroll animations after reveal
    }, 2000);
  });


  /* ────────────────────────────────────────────
     2.  CUSTOM CURSOR (gold crosshair)
  ──────────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    });

    function trailRing () {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      requestAnimationFrame(trailRing);
    }
    trailRing();

    document.querySelectorAll('a, button, .svc, .g-item, .testi').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('big'); cursorRing.classList.add('big'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('big'); cursorRing.classList.remove('big'); });
    });
  }


  /* ────────────────────────────────────────────
     3.  SCROLL PROGRESS BAR
  ──────────────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${Math.min(pct, 1)})`;
  }, { passive: true });


  /* ────────────────────────────────────────────
     4.  NAVIGATION — scroll + mobile burger
  ──────────────────────────────────────────── */
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');

  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (burger) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.classList.toggle('open');
    });
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }


  /* ────────────────────────────────────────────
     5.  HERO CANVAS — light particle mesh
  ──────────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Gold-tinted particles on cream/white bg
    const GOLD_RGBA = (a) => `rgba(201,169,110,${a})`;
    const COUNT = 60;
    const nodes = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * 1400,
      y:  Math.random() * 900,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      r:  .8 + Math.random() * 1.2,
    }));

    // Mouse influence
    let mouseX = -9999, mouseY = -9999;
    document.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function drawFrame () {
      ctx.clearRect(0, 0, W, H);

      // Very subtle warm gradient bg overlay
      const grad = ctx.createRadialGradient(W * .6, H * .3, 0, W * .6, H * .3, W * .7);
      grad.addColorStop(0,   'rgba(201,169,110,.025)');
      grad.addColorStop(1,   'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Update & draw nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = GOLD_RGBA((.08 * (1 - dist / 140)).toFixed(3));
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }
        // Mouse repulsion / highlight
        const mx  = nodes[i].x - mouseX;
        const my2 = nodes[i].y - mouseY;
        const md  = Math.sqrt(mx * mx + my2 * my2);
        if (md < 80) {
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = GOLD_RGBA('.3');
          ctx.fill();
        }
      }

      // Draw dots
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = GOLD_RGBA('.2');
        ctx.fill();
      });

      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  }


  /* ────────────────────────────────────────────
     6.  AOS — Custom Animate On Scroll
  ──────────────────────────────────────────── */
  function initAOS () {
    const els = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseFloat(el.dataset.aosDelay || 0);
        el.style.setProperty('--_delay', delay + 'ms');
        setTimeout(() => el.classList.add('aos-animate'), delay);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    els.forEach(el => observer.observe(el));
  }
  // Also init immediately in case page already loaded
  initAOS();


  /* ────────────────────────────────────────────
     7.  COUNTER ANIMATION
  ──────────────────────────────────────────── */
  const counted = new WeakSet();
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || counted.has(entry.target)) return;
      const el   = entry.target;
      counted.add(el);
      const end  = parseFloat(el.dataset.count);
      if (isNaN(end)) return;

      const duration = 1800;
      const step     = 16;
      const steps    = duration / step;
      let   current  = 0;
      const inc      = end / steps;

      const timer = setInterval(() => {
        current += inc;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.round(current);
      }, step);
    });
  }, { threshold: .5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));


  /* ────────────────────────────────────────────
     8.  PARALLAX — Hero image slow scroll
  ──────────────────────────────────────────── */
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroImg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }, { passive: true });
  }

  // Hero mouse parallax (subtle)
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - .5) * 2;
      const y = (e.clientY / window.innerHeight - .5) * 2;
      const frame = heroSection.querySelector('.hero__frame');
      if (frame) frame.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      const frame = heroSection.querySelector('.hero__frame');
      if (frame) frame.style.transform = '';
    });
  }


  /* ────────────────────────────────────────────
     9.  MAGNETIC BUTTONS
  ──────────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x    = (e.clientX - rect.left - rect.width  / 2) * .25;
      const y    = (e.clientY - rect.top  - rect.height / 2) * .25;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ────────────────────────────────────────────
     10.  SERVICE CARD 3D TILT
  ──────────────────────────────────────────── */
  document.querySelectorAll('.svc').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective    = '800px';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - .5;
      const y    = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ────────────────────────────────────────────
     11.  ABOUT IMAGE TILT
  ──────────────────────────────────────────── */
  const aboutImgWrap = document.querySelector('.about__img-wrap');
  if (aboutImgWrap) {
    aboutImgWrap.addEventListener('mousemove', e => {
      const rect = aboutImgWrap.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - .5) * 10;
      const y    = ((e.clientY - rect.top)  / rect.height - .5) * 6;
      aboutImgWrap.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    aboutImgWrap.addEventListener('mouseleave', () => {
      aboutImgWrap.style.transform = '';
    });
    aboutImgWrap.style.transformStyle = 'preserve-3d';
    aboutImgWrap.style.transition     = 'transform .6s cubic-bezier(.23,1,.32,1)';
  }


  /* ────────────────────────────────────────────
     12.  CONTACT FORM
  ──────────────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const span = btn.querySelector('span');

      btn.disabled     = true;
      span.textContent = 'Se trimite…';

      setTimeout(() => {
        form.querySelectorAll('input, select, textarea').forEach(el => { el.value = ''; });
        btn.style.display = 'none';
        if (success) success.classList.add('show');
      }, 1400);
    });
  }


  /* ────────────────────────────────────────────
     13.  SMOOTH SCROLL
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ────────────────────────────────────────────
     14.  ACTIVE NAV LINK
  ──────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + id
          ? 'var(--gold-d)' : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObserver.observe(s));


  /* ────────────────────────────────────────────
     15.  GALLERY — gold shimmer on hover
  ──────────────────────────────────────────── */
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = '0 0 30px rgba(201,169,110,.25)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
    });
  });


  /* ────────────────────────────────────────────
     16.  TYPEWRITER on hero sys tag (subtle)
  ──────────────────────────────────────────── */
  const sysTag = document.querySelector('.hero__sys');
  if (sysTag) {
    const text = sysTag.textContent;
    sysTag.textContent = '';
    let i = 0;
    const dot = sysTag.querySelector ? null : null;

    function typeChar () {
      if (i < text.length) {
        sysTag.textContent += text[i++];
        setTimeout(typeChar, 35);
      }
    }
    // Start after preloader
    setTimeout(typeChar, 2200);
  }


  /* ────────────────────────────────────────────
     17.  TECH ORB — orbit dots counter-rotate text
         (keep labels readable while parent spins)
  ──────────────────────────────────────────── */
  const orbitEls = document.querySelectorAll('.tech__orbit');
  const speedMap = { to1: 20, to2: 14, to3: 28, to4: 18 };

  function counterRotateLabels (ts) {
    orbitEls.forEach(orbit => {
      const duration = parseFloat(window.getComputedStyle(orbit).animationDuration) || 20;
      const angle    = (ts / 1000 / duration * 360) % 360;
      const reverse  = orbit.classList.contains('to2') || orbit.classList.contains('to4');
      const a        = reverse ? angle : -angle;
      const label    = orbit.querySelector('.tech__ol');
      if (label) label.style.transform = `translateX(-50%) rotate(${a}deg)`;
    });
    requestAnimationFrame(counterRotateLabels);
  }
  requestAnimationFrame(counterRotateLabels);

})();
