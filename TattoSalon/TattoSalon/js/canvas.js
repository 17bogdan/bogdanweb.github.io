/**
 * INK ASYLUM — Canvas Particle Engine
 * Ember / Smoke particle system (gold ash floating upward)
 */

(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* ---- Config ---- */
  const CONFIG = {
    count:       110,
    baseSpeed:   0.4,
    speedRange:  0.6,
    sizeMin:     1.0,
    sizeMax:     3.2,
    windSpeed:   0.18,
    windChange:  0.004,
    colors: [
      'rgba(212, 175, 55,',   // gold
      'rgba(240, 208, 96,',   // gold-light
      'rgba(168, 136, 32,',   // gold-dark
      'rgba(255, 240, 180,',  // warm white
    ],
    glowColors: [
      '#d4af37',
      '#f0d060',
    ],
    glowParticleChance: 0.18,   // 18% of particles have glow
    smokeParticleChance: 0.12,  // 12% of particles are large smoke
  };

  /* ---- State ---- */
  let W = 0, H = 0;
  let particles = [];
  let wind = 0;
  let windTarget = 0.15;
  let animId = null;
  let active = true;

  /* ---- Resize ---- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* ---- Particle Class ---- */
  class Particle {
    constructor(initY) {
      this.reset(initY);
    }

    reset(startY) {
      this.x = Math.random() * W;
      // If initY provided (start spread), use it; else spawn from bottom
      this.y = (startY !== undefined) ? startY : H + Math.random() * 40;

      this.size    = CONFIG.sizeMin + Math.random() * (CONFIG.sizeMax - CONFIG.sizeMin);
      this.speed   = CONFIG.baseSpeed + Math.random() * CONFIG.speedRange;
      this.opacity = 0.1 + Math.random() * 0.65;
      this.drift   = (Math.random() - 0.5) * 0.4; // individual horizontal drift
      this.wobble  = Math.random() * Math.PI * 2;  // wobble phase
      this.wobbleSpeed = 0.02 + Math.random() * 0.03;
      this.colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.life    = 0;
      this.maxLife = 60 + Math.random() * 200; // frames before full opacity fade

      // Particle type
      const r = Math.random();
      if (r < CONFIG.glowParticleChance) {
        this.type = 'glow';
        this.glowColor = CONFIG.glowColors[Math.floor(Math.random() * CONFIG.glowColors.length)];
        this.glowRadius = this.size * (3 + Math.random() * 4);
      } else if (r < CONFIG.glowParticleChance + CONFIG.smokeParticleChance) {
        this.type = 'smoke';
        this.size = 8 + Math.random() * 20;
        this.speed *= 0.4;
        this.opacity *= 0.25;
      } else {
        this.type = 'ember';
      }
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.drift + Math.sin(this.wobble) * 0.3 + wind;
      this.y -= this.speed;
      this.life++;

      // Fade in
      if (this.life < 30) {
        this.currentOpacity = (this.life / 30) * this.opacity;
      }
      // Fade out near top
      else if (this.y < H * 0.15) {
        this.currentOpacity = this.opacity * (this.y / (H * 0.15));
      } else {
        this.currentOpacity = this.opacity;
      }

      // Rope wrap (horizontal)
      if (this.x < -20)  this.x = W + 20;
      if (this.x > W + 20) this.x = -20;

      // Reset when off top
      if (this.y < -this.size - 10) {
        this.reset();
      }
    }

    draw() {
      if (this.currentOpacity <= 0) return;

      ctx.save();

      if (this.type === 'glow') {
        // Glowing ember dot
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.glowRadius
        );
        gradient.addColorStop(0,   this.colorBase + this.currentOpacity + ')');
        gradient.addColorStop(0.4, this.colorBase + (this.currentOpacity * 0.5) + ')');
        gradient.addColorStop(1,   this.colorBase + '0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + Math.min(this.currentOpacity * 1.5, 1) + ')';
        ctx.fill();

      } else if (this.type === 'smoke') {
        // Soft smoke puff
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0,   'rgba(30, 24, 8, ' + this.currentOpacity + ')');
        gradient.addColorStop(0.6, 'rgba(20, 16, 5, ' + (this.currentOpacity * 0.5) + ')');
        gradient.addColorStop(1,   'rgba(10, 8, 2, 0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

      } else {
        // Standard ember spark
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.currentOpacity + ')';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ---- Init Particles ---- */
  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      // Spread initial positions across the full canvas height
      const p = new Particle(Math.random() * H);
      particles.push(p);
    }
  }

  /* ---- Wind Animation ---- */
  function updateWind() {
    wind += (windTarget - wind) * CONFIG.windChange;
    if (Math.abs(wind - windTarget) < 0.01) {
      windTarget = (Math.random() - 0.5) * CONFIG.windSpeed * 2;
    }
  }

  /* ---- Render Loop ---- */
  function render() {
    if (!active) return;

    ctx.clearRect(0, 0, W, H);

    updateWind();

    for (const p of particles) {
      p.update();
      p.draw();
    }

    animId = requestAnimationFrame(render);
  }

  /* ---- Visibility API (pause when tab hidden) ---- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      active = false;
      if (animId) cancelAnimationFrame(animId);
    } else {
      active = true;
      render();
    }
  });

  /* ---- ResizeObserver ---- */
  const ro = new ResizeObserver(() => {
    resize();
    initParticles();
  });
  ro.observe(canvas.parentElement || document.body);

  /* ---- Bootstrap ---- */
  resize();
  initParticles();
  render();

})();
