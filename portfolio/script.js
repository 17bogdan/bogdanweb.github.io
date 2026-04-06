/* ═══════════════════════════════════════════════
   PORTFOLIO — BBotnaruc — script.js
   Three.js hero canvas + GSAP-like animations
═══════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   PRELOADER
────────────────────────────────────────────── */
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    initRevealObserver();
    animateHeroEntrance();
  }, 2000);
});
document.body.style.overflow = 'hidden';

/* ──────────────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────────────── */
const cursorOuter = document.getElementById('cursor-outer');
const cursorDot   = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;
  });

  function lerpCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = `${outerX}px`;
    cursorOuter.style.top  = `${outerY}px`;
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();

  document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ──────────────────────────────────────────────
   HEADER — scroll effect
────────────────────────────────────────────── */
const hdr = document.getElementById('hdr');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  hdr.classList.toggle('scrolled', y > 30);
  hdr.style.transform = y > lastScroll && y > 100 ? 'translateY(-100%)' : 'translateY(0)';
  lastScroll = y;
}, { passive: true });

/* ──────────────────────────────────────────────
   MOBILE MENU
────────────────────────────────────────────── */
const menuBtn   = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', !open);
  menuBtn.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = open ? '' : 'hidden';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ──────────────────────────────────────────────
   HERO ENTRANCE ANIMATION
────────────────────────────────────────────── */
function animateHeroEntrance() {
  document.querySelectorAll('#hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), parseFloat(el.style.getPropertyValue('--d') || '0') * 1000 + 200);
  });
}

/* ──────────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────────── */
function initRevealObserver() {
  const els = document.querySelectorAll(
    '.reveal-up:not(#hero *), .reveal-left, .reveal-right'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));

  /* Skill bars */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar').forEach(bar => bar.classList.add('animated'));
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-item').forEach(el => skillObs.observe(el));

  /* Counter animation */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num[data-count]').forEach(animateCounter);
        countObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) countObs.observe(statsEl);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();
  function update(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ──────────────────────────────────────────────
   THREE.JS — HERO CANVAS (particle field)
────────────────────────────────────────────── */
(function initHeroCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  /* Particle cloud */
  const COUNT = 3000;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const sizes     = new Float32Array(COUNT);

  const colA = new THREE.Color(0x7B2FFF);
  const colB = new THREE.Color(0x00D4FF);
  const colC = new THREE.Color(0xFF2FBE);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 8 - 2;
    sizes[i] = Math.random() * 2.5 + 0.5;

    const t = Math.random();
    const col = t < 0.5
      ? colA.clone().lerp(colB, t * 2)
      : colB.clone().lerp(colC, (t - 0.5) * 2);
    colors[i3]     = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    vertexColors: true,
    sizeAttenuation: true,
    size: 0.025,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* Wireframe sphere */
  const sphereGeo = new THREE.IcosahedronGeometry(2, 2);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x7B2FFF, wireframe: true, transparent: true, opacity: 0.06,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.set(4, -1, -3);
  scene.add(sphere);

  const sphereGeo2 = new THREE.IcosahedronGeometry(1.2, 1);
  const sphereMat2 = new THREE.MeshBasicMaterial({
    color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.08,
  });
  const sphere2 = new THREE.Mesh(sphereGeo2, sphereMat2);
  sphere2.position.set(-5, 2, -4);
  scene.add(sphere2);

  /* Mouse interaction */
  let mouseNX = 0, mouseNY = 0;
  document.addEventListener('mousemove', e => {
    mouseNX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Resize */
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize, { passive: true });

  /* Render loop */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    points.rotation.y = t * 0.05 + mouseNX * 0.15;
    points.rotation.x = mouseNY * 0.08;
    sphere.rotation.y  = t * 0.2;
    sphere.rotation.x  = t * 0.1;
    sphere2.rotation.y = -t * 0.3;
    sphere2.rotation.x = t * 0.15;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ──────────────────────────────────────────────
   THREE.JS — CONTACT CANVAS (flowing field)
────────────────────────────────────────────── */
(function initContactCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 4 + 0.5;
    positions[i3]     = Math.cos(angle) * r;
    positions[i3 + 1] = (Math.random() - 0.5) * 5;
    positions[i3 + 2] = Math.sin(angle) * r - 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x7B2FFF, size: 0.03, transparent: true, opacity: 0.5,
    sizeAttenuation: true, depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  function onResize() {
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize, { passive: true });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    pts.rotation.y = t * 0.15;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ──────────────────────────────────────────────
   ABOUT CARD — 3D TILT
────────────────────────────────────────────── */
const aboutCard = document.getElementById('about-card');
if (aboutCard) {
  const inner = aboutCard.querySelector('.about-card-inner');
  aboutCard.addEventListener('mousemove', e => {
    const rect = aboutCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg) scale(1.02)`;
    inner.style.boxShadow = `${-x * 20}px ${-y * 20}px 60px rgba(123,47,255,.25)`;
  });
  aboutCard.addEventListener('mouseleave', () => {
    inner.style.transform = '';
    inner.style.boxShadow = '';
  });
}

/* ──────────────────────────────────────────────
   PROJECT CARDS — 3D HOVER TILT
────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(1200px) rotateX(${-y * 4}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ──────────────────────────────────────────────
   MARQUEE — pause on hover (already in CSS)
────────────────────────────────────────────── */

/* ──────────────────────────────────────────────
   GLITCH EFFECT on hero title (subtle)
────────────────────────────────────────────── */
(function glitchTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  setInterval(() => {
    title.style.filter = 'brightness(1.08) contrast(1.02)';
    setTimeout(() => { title.style.filter = ''; }, 80);
  }, 4000 + Math.random() * 3000);
})();

/* ──────────────────────────────────────────────
   SMOOTH BACK-TO-TOP
────────────────────────────────────────────── */
document.querySelectorAll('a[href="#hero"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
