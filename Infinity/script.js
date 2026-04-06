/* ═══════════════════════════════════════════════════
   Restaurant Infinity — Premium JS
   Includes: preloader, custom cursor, header scroll,
   hero 3D (Three.js), scroll reveal, menu tabs,
   magnetic buttons, hamburger menu
═══════════════════════════════════════════════════ */

/* ─────────────── PRELOADER ─────────────── */
const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('done');
    document.body.classList.remove('js-loading');
    document.body.classList.add('ready');
    // Kick off hero reveals after preloader
    document.querySelectorAll('#hero .ri').forEach(el => el.classList.add('vis'));
  }, 1500);
});

/* ─────────────── CUSTOM CURSOR ─────────────── */
const dot  = document.getElementById('csr-dot');
const ring = document.getElementById('csr-ring');

if (window.matchMedia('(pointer:fine)').matches && dot && ring) {
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();
}

/* ─────────────── HEADER SCROLL ─────────────── */
const hdr = document.getElementById('site-hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─────────────── SMOOTH ANCHOR SCROLL (offset for sticky header) ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = hdr ? hdr.offsetHeight + 16 : 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────── HAMBURGER ─────────────── */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('main-nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    nav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─────────────── SCROLL REVEAL ─────────────── */
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); } }),
  { threshold: 0.18 }
);
document.querySelectorAll('.ri:not(#hero .ri)').forEach(el => revealObs.observe(el));

/* ─────────────── MENU TABS ─────────────── */
const tabs  = document.querySelectorAll('.m-tab');
const cards = document.querySelectorAll('.dish-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const cat = tab.dataset.cat;
    cards.forEach(c => {
      const match = cat === 'all' || c.dataset.cat === cat;
      c.classList.toggle('hidden', !match);
    });
  });
});

/* ─────────────── MAGNETIC BUTTONS ─────────────── */
document.querySelectorAll('.btn-mag').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.32;
    const dy = (e.clientY - cy) * 0.32;
    btn.style.transform = `translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─────────────── WHATSAPP BOOKING FORM ─────────────── */
(function () {
  const form    = document.getElementById('booking-form');
  if (!form) return;

  /* Set minimum date to today */
  const dateInput = document.getElementById('bk-date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = form.querySelectorAll('[required]');
    let valid = true;

    fields.forEach(field => {
      const wrapper = field.closest('.bk-field');
      if (!field.value.trim()) {
        valid = false;
        if (wrapper) wrapper.classList.add('invalid');
      } else {
        if (wrapper) wrapper.classList.remove('invalid');
      }
    });

    /* Live remove invalid on input */
    fields.forEach(field => {
      field.addEventListener('input', function () {
        const w = field.closest('.bk-field');
        if (field.value.trim() && w) w.classList.remove('invalid');
      }, { once: false });
    });

    if (!valid) return;

    const name   = document.getElementById('bk-name').value.trim();
    const phone  = document.getElementById('bk-phone').value.trim();
    const date   = document.getElementById('bk-date').value;
    const time   = document.getElementById('bk-time').value;
    const people = document.getElementById('bk-people').value;
    const notes  = document.getElementById('bk-notes').value.trim();

    /* Format date as DD.MM.YYYY */
    const [yr, mo, dy] = date.split('-');
    const dateFormatted = `${dy}.${mo}.${yr}`;

    let msg = `🍽️ *Rezervare Restaurant Infinity*\n\n`;
    msg += `👤 Nume: ${name}\n`;
    msg += `📞 Telefon: ${phone}\n`;
    msg += `👥 Persoane: ${people}\n`;
    msg += `📅 Data: ${dateFormatted}\n`;
    msg += `⏰ Ora: ${time}\n`;
    if (notes) msg += `📝 Mențiuni: ${notes}\n`;
    msg += `\nVă rog să confirmați rezervarea. Mulțumesc!`;

    const waURL = `https://wa.me/40748208209?text=${encodeURIComponent(msg)}`;
    window.open(waURL, '_blank', 'noopener,noreferrer');

    /* Show success message */
    const successEl = form.querySelector('.bk-success');
    if (successEl) successEl.removeAttribute('hidden');

    /* Scroll to success message */
    successEl && successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();

/* ─────────────── THREE.JS 3D HERO SCENE ─────────────── */
const canvas = document.getElementById('c3d');

if (canvas && window.THREE) {
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 5.8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Lighting ─ warm gold palette ── */
  scene.add(new THREE.AmbientLight(0xfff0d0, 0.9));

  const keyLight = new THREE.PointLight(0xc9a455, 80, 40, 2);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xff8844, 35, 30, 2);
  fillLight.position.set(-4, -3, 2);
  scene.add(fillLight);

  const backLight = new THREE.PointLight(0xffeec0, 25, 30, 2);
  backLight.position.set(0, -5, -3);
  scene.add(backLight);

  /* ── Central golden orb ── */
  const orbGeo = new THREE.IcosahedronGeometry(1.1, 18);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a455,
    metalness: 0.15,
    roughness: 0.12,
    transmission: 0.3,
    ior: 1.4,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    thickness: 1.8,
    envMapIntensity: 1.2,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  scene.add(orb);

  /* ── Wireframe shell ── */
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xc9a455, wireframe: true, opacity: 0.06, transparent: true });
  const wire    = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 3), wireMat);
  scene.add(wire);

  /* ── Torus ring A ── */
  const ringGeo = new THREE.TorusGeometry(2.0, 0.04, 20, 260);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xe8c97a, emissive: 0x7a4a10, emissiveIntensity: 0.4,
    metalness: 0.6, roughness: 0.3,
  });
  const ringA = new THREE.Mesh(ringGeo, ringMat);
  ringA.rotation.x = 1.2; ringA.rotation.y = 0.5;
  scene.add(ringA);

  /* ── Torus ring B ── */
  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.025, 16, 320),
    new THREE.MeshStandardMaterial({ color: 0xc9a455, emissive: 0x4a2e00, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.4 })
  );
  ringB.rotation.x = 0.4; ringB.rotation.z = 0.8;
  scene.add(ringB);

  /* ── Particle dust cloud ── */
  const pCount = 260;
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 3 + Math.random() * 2.5;
    const a = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * 5.5;
    pPos[i*3]     = Math.cos(a) * r;
    pPos[i*3 + 1] = h;
    pPos[i*3 + 2] = Math.sin(a) * r;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat  = new THREE.PointsMaterial({ color: 0xd4a94e, size: 0.04, transparent: true, opacity: 0.65 });
  const dots  = new THREE.Points(pGeo, pMat);
  scene.add(dots);

  /* ── Mouse follow target ── */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 1.2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.9;
  });

  /* ── Resize ── */
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener('resize', resize);

  /* ── Animation loop ── */
  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();

    orb.rotation.x = t * 0.22;
    orb.rotation.y = t * 0.35;
    wire.rotation.x = -t * 0.14;
    wire.rotation.y = t * 0.25;
    ringA.rotation.z = t * 0.3;
    ringB.rotation.y = t * 0.2;
    dots.rotation.y  = t * 0.07;

    /* Soft parallax */
    scene.rotation.y += (mouse.x * 0.5 - scene.rotation.y) * 0.04;
    scene.rotation.x += (-mouse.y * 0.35 - scene.rotation.x) * 0.04;

    /* Subtle float */
    orb.position.y = Math.sin(t * 0.7) * 0.12;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.22,
  }
);

revealElements.forEach((el) => observer.observe(el));

const canvasContainer = document.getElementById('hero-canvas');

if (canvasContainer && window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1000);
  camera.position.set(0, 0.3, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  scene.fog = new THREE.Fog(0xf6eee4, 6, 16);

  const ambient = new THREE.AmbientLight(0xfff5e8, 1.3);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xffa776, 50, 30, 2);
  keyLight.position.set(2.5, 3.5, 4.5);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xffe4c6, 35, 25, 2);
  rimLight.position.set(-3, -2, 2.5);
  scene.add(rimLight);

  const coreGeometry = new THREE.IcosahedronGeometry(1.35, 20);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc76f43,
    metalness: 0.08,
    roughness: 0.14,
    transmission: 0.24,
    ior: 1.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    thickness: 2,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  scene.add(coreMesh);

  const ringGeometry = new THREE.TorusGeometry(2.3, 0.05, 24, 220);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4c6a3,
    emissive: 0x7f3715,
    emissiveIntensity: 0.32,
    metalness: 0.55,
    roughness: 0.34,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = 1.25;
  ring.rotation.y = 0.6;
  scene.add(ring);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const i3 = i * 3;
    const radius = 3 + Math.random() * 2.2;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4;
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = height;
    positions[i3 + 2] = Math.sin(angle) * radius;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xd57f53,
    size: 0.035,
    transparent: true,
    opacity: 0.72,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const target = { x: 0, y: 0 };

  const resize = () => {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (event) => {
    target.x = (event.clientX / window.innerWidth - 0.5) * 0.9;
    target.y = (event.clientY / window.innerHeight - 0.5) * 0.7;
  });

  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();

    coreMesh.rotation.x = elapsed * 0.25;
    coreMesh.rotation.y = elapsed * 0.4;
    ring.rotation.z = elapsed * 0.35;
    particles.rotation.y = elapsed * 0.09;

    coreMesh.position.x += (target.x - coreMesh.position.x) * 0.03;
    coreMesh.position.y += (-target.y - coreMesh.position.y) * 0.03;

    ring.position.x += (target.x * 0.8 - ring.position.x) * 0.025;
    ring.position.y += (-target.y * 0.6 - ring.position.y) * 0.025;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
