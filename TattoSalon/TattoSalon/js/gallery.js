/**
 * INK ASYLUM — Gallery Ink Reveal
 * Enhances portfolio items with ink-drop reveal effect
 * and lightbox preview on click.
 */

(function () {
  'use strict';

  /* ============================================================
     INK REVEAL — Augments existing CSS clip-path animation
     with a Canvas-based ink splatter overlay on first hover
  ============================================================ */

  function initInkReveal() {
    const items = document.querySelectorAll('.portfolio-img-wrap');
    if (!items.length) return;

    items.forEach((wrap) => {
      let revealed = false;

      wrap.addEventListener('mouseenter', () => {
        if (revealed) return;
        revealed = true;
        // CSS handles the clip-path animation via :hover
        // Canvas splash is an extra layer added once on first hover
        addInkSplashCanvas(wrap);
      });
    });
  }

  /* ---- One-time ink splash canvas on first hover ---- */
  function addInkSplashCanvas(wrap) {
    const rect    = wrap.getBoundingClientRect();
    const canvas  = document.createElement('canvas');
    const w  = rect.width;
    const h  = rect.height;
    canvas.width  = w;
    canvas.height = h;
    canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      border-radius: inherit;
    `;
    wrap.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const cx  = w / 2;
    const cy  = h / 2;

    // Ink drop particles radiating from center
    const drops = [];
    const count = 16 + Math.floor(Math.random() * 12);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 5;
      const size  = 2 + Math.random() * 6;
      drops.push({
        x:    cx,
        y:    cy,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed,
        size: size,
        alpha: 0.8 + Math.random() * 0.2,
        decay: 0.03 + Math.random() * 0.04,
        gravity: 0.08,
      });
    }

    let frame = 0;
    const maxFrames = 50;

    function animateSplash() {
      ctx.clearRect(0, 0, w, h);
      let alive = false;

      drops.forEach((d) => {
        if (d.alpha <= 0) return;
        alive = true;
        d.x  += d.vx;
        d.y  += d.vy;
        d.vy += d.gravity;
        d.vx *= 0.92;
        d.vy *= 0.92;
        d.alpha -= d.decay;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, d.alpha)})`;
        ctx.fill();
      });

      frame++;
      if (alive && frame < maxFrames) {
        requestAnimationFrame(animateSplash);
      } else {
        // Remove canvas once animation done
        canvas.remove();
      }
    }

    animateSplash();
  }

  /* ============================================================
     LIGHTBOX
  ============================================================ */
  function initLightbox() {
    // Create lightbox DOM
    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Vizualizare imagine');
    overlay.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.94);
      z-index: 8000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      cursor: none;
      backdrop-filter: blur(6px);
    `;

    const inner = document.createElement('div');
    inner.style.cssText = `
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 12px;
      overflow: hidden;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      display: block;
      max-width: 100%;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 12px;
    `;
    img.alt = 'Portfolio image';

    const caption = document.createElement('div');
    caption.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.85));
      padding: 1.5rem;
      color: #f0ece0;
      font-family: 'Raleway', sans-serif;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Închide');
    closeBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 24px;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #d4af37;
      font-size: 1.8rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: none;
      transition: background 0.2s ease;
      line-height: 1;
      z-index: 8001;
    `;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(212, 175, 55, 0.4)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(212, 175, 55, 0.15)';
    });

    inner.appendChild(img);
    inner.appendChild(caption);
    overlay.appendChild(closeBtn);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // --- Open / Close ---
    function openLightbox(src, title, subtitle) {
      img.src = src;
      caption.innerHTML = `<strong style="font-family:'Cinzel',serif;font-size:1rem;display:block;margin-bottom:0.3rem;">${title || ''}</strong><span style="font-size:0.78rem;color:#d4af37;">${subtitle || ''}</span>`;
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Animate in
      overlay.style.opacity = '0';
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.35s ease';
        overlay.style.opacity    = '1';
        inner.style.transform    = 'scale(0.92)';
        inner.style.transition   = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
        requestAnimationFrame(() => {
          inner.style.transform = 'scale(1)';
        });
      });
    }

    function closeLightbox() {
      overlay.style.opacity   = '0';
      inner.style.transform   = 'scale(0.95)';
      setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        img.src = '';
      }, 350);
    }

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display !== 'none') {
        closeLightbox();
      }
    });

    // --- Bind to portfolio items ---
    document.querySelectorAll('.portfolio-item').forEach((item) => {
      const imgEl    = item.querySelector('img');
      const titleEl  = item.querySelector('.portfolio-info h4');
      const subtitleEl = item.querySelector('.portfolio-info p');

      item.addEventListener('click', () => {
        if (!imgEl) return;
        openLightbox(
          imgEl.src,
          titleEl  ? titleEl.textContent  : '',
          subtitleEl ? subtitleEl.textContent : ''
        );
      });

      item.style.cursor = 'none';
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    initInkReveal();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
