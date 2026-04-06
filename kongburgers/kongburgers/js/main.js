/* ============================================
   KONGBURGERS — main.js
   Three.js 3D + All Interactions
   ============================================ */

/* ---- CURSOR ---- */
const cur = document.getElementById('cur');
const dot = document.getElementById('curdot');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function animCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  cur.style.left = cx + 'px';
  cur.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .mcard, .duo-card, .menu-hero-card, .extra-item, .mhigh').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

/* ---- NAV SCROLL ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 60);
});

/* ---- MARQUEE DUPLICATE (infinite) ---- */
const mi = document.getElementById('marqueeInner');
if (mi) mi.innerHTML += mi.innerHTML;

/* ============================================
   THREE.JS — HERO SCENE
   Rotating geometric shapes + particles
   ============================================ */
(function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.set(0, 0, 5);

  /* MATERIALS */
  const redWire = new THREE.MeshBasicMaterial({ color: 0xD62828, wireframe: true });
  const redEdge = new THREE.LineBasicMaterial({ color: 0xD62828, transparent: true, opacity: 0.6 });
  const dimRed = new THREE.MeshBasicMaterial({ color: 0xD62828, wireframe: true, opacity: 0.2, transparent: true });

  /* === CENTRAL TORUS KNOT === */
  const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.25, 128, 16);
  const torus = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({
    color: 0xD62828, wireframe: true, opacity: 0.18, transparent: true
  }));
  torus.position.set(2.8, 0, -1);
  scene.add(torus);

  /* === ICOSAHEDRON === */
  const icoGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const ico = new THREE.Mesh(icoGeo, new THREE.MeshBasicMaterial({
    color: 0xD62828, wireframe: true, opacity: 0.22, transparent: true
  }));
  ico.position.set(-3, 1, -1.5);
  scene.add(ico);

  /* === OCTAHEDRON === */
  const octGeo = new THREE.OctahedronGeometry(0.6);
  const oct = new THREE.Mesh(octGeo, new THREE.MeshBasicMaterial({
    color: 0xFF3333, wireframe: true, opacity: 0.3, transparent: true
  }));
  oct.position.set(0, -2.5, 0);
  scene.add(oct);

  /* === RING (flat torus) === */
  const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 8, 120);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
    color: 0xD62828, opacity: 0.15, transparent: true
  }));
  ring.rotation.x = Math.PI / 4;
  ring.position.set(2, 0.5, -2);
  scene.add(ring);

  const ringGeo2 = new THREE.TorusGeometry(1.6, 0.015, 8, 80);
  const ring2 = new THREE.Mesh(ringGeo2, new THREE.MeshBasicMaterial({
    color: 0xD62828, opacity: 0.1, transparent: true
  }));
  ring2.rotation.x = -Math.PI / 3;
  ring2.position.set(-2.5, -0.5, -1.5);
  scene.add(ring2);

  /* === FLOATING PARTICLES === */
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
    color: 0xD62828, size: 0.04, transparent: true, opacity: 0.6
  }));
  scene.add(particles);

  /* === GRID PLANE === */
  const gridHelper = new THREE.GridHelper(30, 30, 0xD62828, 0xD62828);
  gridHelper.material.opacity = 0.04;
  gridHelper.material.transparent = true;
  gridHelper.position.y = -3;
  scene.add(gridHelper);

  /* MOUSE PARALLAX */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ANIMATE */
  let t = 0;
  function animateHero() {
    requestAnimationFrame(animateHero);
    t += 0.008;

    torus.rotation.x = t * 0.4;
    torus.rotation.y = t * 0.6;
    torus.rotation.z = t * 0.2;

    ico.rotation.x = t * 0.5;
    ico.rotation.y = t * 0.7;

    oct.rotation.x = t * 0.8;
    oct.rotation.z = t * 0.5;

    ring.rotation.z = t * 0.3;
    ring2.rotation.y = t * 0.4;

    particles.rotation.y = t * 0.05;
    particles.rotation.x = t * 0.02;
    gridHelper.rotation.y = t * 0.03;

    /* camera drift on mouse */
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animateHero();

  /* RESIZE */
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

/* ============================================
   THREE.JS — SHOWCASE STRIP SCENE
   Rotating burger-like geometry
   ============================================ */
(function initShowcaseScene() {
  const canvas = document.getElementById('showcaseCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 0, 6);

  /* Build a stylised "burger" from disc geometries */
  const group = new THREE.Group();
  scene.add(group);

  const addDisc = (y, rx, ry, rz, color, wireframe, opacity) => {
    const geo = new THREE.CylinderGeometry(rx, ry, rz, 32);
    const mat = new THREE.MeshBasicMaterial({ color, wireframe, transparent: true, opacity });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = y;
    group.add(mesh);
    return mesh;
  };

  /* Bun top */
  const bunTop = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xD62828, wireframe: true, transparent: true, opacity: 0.3 })
  );
  bunTop.position.y = 1.0;
  group.add(bunTop);

  /* Patties / fillings as wireframe discs */
  addDisc(0.6, 1.4, 1.4, 0.08, 0xD62828, false, 0.1);
  addDisc(0.4, 1.3, 1.3, 0.18, 0xFF3333, true, 0.35); // patty
  addDisc(0.2, 1.4, 1.4, 0.08, 0xC8952A, false, 0.12); // cheese
  addDisc(0.0, 1.3, 1.3, 0.12, 0xD62828, true, 0.2); // second patty
  addDisc(-0.15, 1.4, 1.4, 0.06, 0xD62828, false, 0.08); // base

  /* Bun bottom */
  const bunBot = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xD62828, wireframe: true, transparent: true, opacity: 0.2 })
  );
  bunBot.position.y = -0.3;
  group.add(bunBot);

  /* Orbiting ring */
  const orbitGeo = new THREE.TorusGeometry(2.2, 0.015, 6, 80);
  const orbit = new THREE.Mesh(orbitGeo, new THREE.MeshBasicMaterial({
    color: 0xD62828, transparent: true, opacity: 0.2
  }));
  orbit.rotation.x = Math.PI / 2.5;
  scene.add(orbit);

  const orbit2Geo = new THREE.TorusGeometry(2.8, 0.01, 6, 80);
  const orbit2 = new THREE.Mesh(orbit2Geo, new THREE.MeshBasicMaterial({
    color: 0xD62828, transparent: true, opacity: 0.1
  }));
  orbit2.rotation.x = -Math.PI / 3;
  scene.add(orbit2);

  /* Floating particles around */
  const pCount = 120;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 3;
    pPos[i * 3] = Math.cos(angle) * radius;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
    pPos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xD62828, size: 0.05, transparent: true, opacity: 0.5
  }));
  scene.add(pMesh);

  /* Offset group to right side */
  group.position.set(3.5, 0, 0);
  orbit.position.set(3.5, 0, 0);
  orbit2.position.set(3.5, 0, 0);

  let t = 0;
  function animateShowcase() {
    requestAnimationFrame(animateShowcase);
    t += 0.008;

    group.rotation.y = t * 0.5;
    group.position.y = Math.sin(t * 0.6) * 0.2;
    orbit.rotation.z = t * 0.4;
    orbit2.rotation.z = -t * 0.3;
    pMesh.rotation.y = t * 0.08;

    renderer.render(scene, camera);
  }
  animateShowcase();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = e.target.style.transitionDelay || '0ms';
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

/* ============================================
   COUNT-UP ANIMATION
   ============================================ */
function countUp(el, target, duration) {
  let start = 0, startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString('ro-RO');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('ro-RO');
  };
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      countUp(e.target, target, 2000);
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.astat-n').forEach(el => statObs.observe(el));

/* ============================================
   HERO PARALLAX ON SCROLL
   ============================================ */
const heroBg = document.querySelector('.hero-photo');
window.addEventListener('scroll', () => {
  if (heroBg) {
    const y = scrollY * 0.3;
    heroBg.style.transform = `scale(1.06) translateY(${y}px)`;
  }
}, { passive: true });

/* ============================================
   MENU HERO CARD — IMAGE PARALLAX ON MOUSE
   ============================================ */
const mhc = document.querySelector('.menu-hero-card');
const mhcImg = document.getElementById('mhcImg');
if (mhc && mhcImg) {
  mhc.addEventListener('mousemove', e => {
    const r = mhc.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
    mhcImg.style.transform = `scale(1.06) translate(${x}px,${y}px)`;
  });
  mhc.addEventListener('mouseleave', () => {
    mhcImg.style.transform = 'scale(1.06) translate(0,0)';
  });
}

/* Duo cards parallax */
document.querySelectorAll('.duo-card').forEach(card => {
  const img = card.querySelector('.duo-photo');
  if (!img) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
    img.style.transform = `scale(1.06) translate(${x}px,${y}px)`;
  });
  card.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1.06) translate(0,0)';
  });
});

/* ============================================
   RIPPLE EFFECT ON CARDS
   ============================================ */
document.querySelectorAll('.duo-card, .menu-hero-card').forEach(card => {
  card.addEventListener('click', e => {
    const r = card.getBoundingClientRect();
    const rip = document.createElement('div');
    const size = Math.max(r.width, r.height);
    rip.style.cssText = `
      position:absolute;border-radius:50%;
      width:${size}px;height:${size}px;
      left:${e.clientX - r.left - size / 2}px;
      top:${e.clientY - r.top - size / 2}px;
      background:rgba(214,40,40,0.08);
      transform:scale(0);animation:rippleAnim .7s ease-out forwards;
      pointer-events:none;z-index:10;
    `;
    if (!document.getElementById('rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes rippleAnim{to{transform:scale(4);opacity:0}}';
      document.head.appendChild(s);
    }
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(rip);
    setTimeout(() => rip.remove(), 800);
  });
});
