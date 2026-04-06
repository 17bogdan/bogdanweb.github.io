/* ============================================
   MOOD BURGERS — main.js
   No Three.js. Custom interactions only.
   ============================================ */

/* ============================================
   LOADER
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('done');
  }, 1500);
});

/* ============================================
   CUSTOM CURSOR (diamond/square)
   ============================================ */
const ring = document.getElementById('cursor-ring');
const dot  = document.getElementById('cursor-dot');

let mx = innerWidth / 2, my = innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

/* Cursor hover states */
document.querySelectorAll('a, button, .mb-item, .is-item, .itag, .ann, .mfr-img').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* ============================================
   HEADER — stick on scroll
   ============================================ */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('stuck', scrollY > 50);
}, { passive: true });

/* ============================================
   MARQUEE — duplicate for infinite loop
   ============================================ */
const marquee = document.getElementById('asMarquee');
if (marquee) marquee.innerHTML += marquee.innerHTML;

/* ============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.slide-in').forEach(el => revealObs.observe(el));

/* ============================================
   COUNT-UP ANIMATION
   ============================================ */
function countUp(el, target, duration) {
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = v.toLocaleString('ro-RO');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('ro-RO');
  };
  requestAnimationFrame(step);
}

const numObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target.dataset.target) {
      countUp(e.target, parseInt(e.target.dataset.target), 2000);
      numObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => numObs.observe(el));

/* ============================================
   HERO PHOTO PARALLAX
   ============================================ */
const heroBg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroBg) {
    heroBg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ============================================
   MENU ITEM — 3D PERSPECTIVE TILT
   ============================================ */
document.querySelectorAll('.mb-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const r = item.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    item.style.transform = `perspective(800px) rotateX(${-y * 2}deg) rotateY(${x * 3}deg)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'transform 0.4s ease';
    setTimeout(() => { item.style.transition = ''; }, 400);
  });
});

/* ============================================
   MANIFESTO IMAGES — hover 3D tilt
   ============================================ */
const mfrImgsWrap = document.querySelector('.mfr-imgs');
if (mfrImgsWrap) {
  mfrImgsWrap.addEventListener('mousemove', e => {
    const r   = mfrImgsWrap.getBoundingClientRect();
    const x   = (e.clientX - r.left) / r.width  - 0.5;
    const y   = (e.clientY - r.top)  / r.height - 0.5;
    const imgA = mfrImgsWrap.querySelector('.mfr-img-a');
    const imgB = mfrImgsWrap.querySelector('.mfr-img-b');
    if (imgA) imgA.style.transform = `rotate(-1.5deg) translate(${x * 8}px, ${y * 6}px) translateY(30px)`;
    if (imgB) imgB.style.transform = `rotate(1deg) translate(${x * 10}px, ${y * 8}px)`;
  });
  mfrImgsWrap.addEventListener('mouseleave', () => {
    const imgA = mfrImgsWrap.querySelector('.mfr-img-a');
    const imgB = mfrImgsWrap.querySelector('.mfr-img-b');
    if (imgA) { imgA.style.transition = 'transform .5s ease'; imgA.style.transform = 'rotate(-1.5deg) translateY(30px)'; }
    if (imgB) { imgB.style.transition = 'transform .5s ease'; imgB.style.transform = 'rotate(1deg)'; }
    setTimeout(() => {
      if (imgA) imgA.style.transition = '';
      if (imgB) imgB.style.transition = '';
    }, 500);
  });
}

/* ============================================
   NAV ACTIVE HIGHLIGHT ON SCROLL
   ============================================ */
(function navHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.hn-link');
  if (!sections.length || !links.length) return;

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => {
          const match = l.getAttribute('href') === `#${id}`;
          l.classList.toggle('active', match);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' });

  sections.forEach(s => sectionObs.observe(s));
})();

/* ============================================
   ANNOTATIONS — appear staggered on section enter
   ============================================ */
(function initAnnotations() {
  const layer = document.querySelector('.ann-layer');
  if (!layer) return;

  const annObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pins = layer.querySelectorAll('.ann');
        pins.forEach((pin, i) => {
          pin.style.opacity = '0';
          pin.style.transform = 'scale(.6)';
          pin.style.transition = `opacity .5s ease ${i * 0.14}s, transform .5s ease ${i * 0.14}s`;
          requestAnimationFrame(() => {
            pin.style.opacity = '1';
            pin.style.transform = 'scale(1)';
          });
        });
        annObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  annObs.observe(layer);
})();

/* ============================================
   MENU BOARD — number counter for main items only
   ============================================ */
(function animateMenuNumbers() {
  const nums = document.querySelectorAll('.mb-main .mb-num');
  const numSection = document.querySelector('.menu-section');
  if (!numSection) return;

  const o = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      nums.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = `opacity .4s ease ${i * .12}s, transform .4s ease ${i * .12}s`;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 50);
      });
      o.unobserve(numSection);
    }
  }, { threshold: 0.1 });
  o.observe(numSection);
})();

/* ============================================
   LED PANEL — random dot malfunction effect
   Occasionally one dot "burns out" briefly
   ============================================ */
(function ledMalfunction() {
  const panel = document.querySelector('.led-cabinet');
  if (!panel) return;

  function glitch() {
    const dots = panel.querySelectorAll('.d.on');
    if (!dots.length) return;
    /* Pick 1-3 random lit dots and briefly turn them off */
    const count = 1 + Math.floor(Math.random() * 2);
    const picked = [];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * dots.length);
      picked.push(dots[idx]);
    }
    picked.forEach(dot => {
      dot.style.opacity = '0.05';
      dot.style.boxShadow = 'none';
      const restore = 80 + Math.random() * 200;
      setTimeout(() => {
        dot.style.opacity = '';
        dot.style.boxShadow = '';
      }, restore);
    });
    /* Schedule next glitch: random 2–9s */
    setTimeout(glitch, 2000 + Math.random() * 7000);
  }

  /* Start after letters finish lighting up */
  setTimeout(glitch, 2200);
})();

/* ============================================
   LED TICKER — duplicate for infinite scroll
   ============================================ */
const ledTicker = document.getElementById('ledTicker');
if (ledTicker) ledTicker.innerHTML += ledTicker.innerHTML;

/* ============================================
   RIPPLE on interactive elements
   ============================================ */
(function ripple() {
  const style = document.createElement('style');
  style.textContent = '@keyframes ripOut{to{transform:scale(5);opacity:0}}';
  document.head.appendChild(style);

  document.querySelectorAll('.mb-item, .is-item').forEach(el => {
    el.addEventListener('click', e => {
      const r   = el.getBoundingClientRect();
      const rip = document.createElement('div');
      const sz  = Math.max(r.width, r.height);
      rip.style.cssText = `
        position:absolute;border-radius:50%;
        width:${sz}px;height:${sz}px;
        left:${e.clientX - r.left - sz / 2}px;
        top:${e.clientY - r.top  - sz / 2}px;
        background:rgba(255,107,0,.06);
        transform:scale(0);
        animation:ripOut .6s ease forwards;
        pointer-events:none; z-index:10;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(rip);
      rip.addEventListener('animationend', () => rip.remove());
    });
  });
})();

/* ============================================
   ORDER PHONE — parallax ghost text on mouse
   ============================================ */
(function ghostParallax() {
  const ghost   = document.querySelector('.order-ghost');
  const section = document.querySelector('.order-section');
  if (!ghost || !section) return;

  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    ghost.style.transform = `translate(calc(-50% + ${x * 20}px), calc(-50% + ${y * 10}px))`;
    ghost.style.transition = 'transform .1s ease';
  });
  section.addEventListener('mouseleave', () => {
    ghost.style.transform = 'translate(-50%, -50%)';
    ghost.style.transition = 'transform .6s ease';
  });
})();
