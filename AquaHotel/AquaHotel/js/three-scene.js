/* ============================================================
   Three.js Hero Scene — Aqua Hotel
   Senior Design Engineer 2026
   ============================================================ */

class HeroScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.particles = null;
    this.waterMesh = null;
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.animationId = null;
    this.isReady = false;

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 30);

    // Build scene elements
    this._createParticles();
    this._createWaterWaves();
    this._createGlowRings();
    this._createAmbientLight();

    this.isReady = true;
  }

  _createParticles() {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0xC9A84C); // gold
    const color2 = new THREE.Color(0x00CFDE); // aqua
    const color3 = new THREE.Color(0x3B6FD4); // blue

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60 - 10;

      sizes[i] = Math.random() * 1.5 + 0.3;

      const t = Math.random();
      let c;
      if (t < 0.5) {
        c = color1.clone().lerp(color2, t * 2);
      } else {
        c = color2.clone().lerp(color3, (t - 0.5) * 2);
      }

      colors[i3]     = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  _createWaterWaves() {
    const geo = new THREE.PlaneGeometry(200, 200, 80, 80);

    // Store initial positions for wave animation
    const posAttr = geo.attributes.position;
    const initY = [];
    for (let i = 0; i < posAttr.count; i++) {
      initY.push(posAttr.getY(i));
    }
    geo.userData.initY = initY;

    const mat = new THREE.MeshStandardMaterial({
      color: 0x0A2555,
      emissive: 0x001833,
      emissiveIntensity: 0.8,
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
      wireframeLinewidth: 0.5,
    });

    this.waterMesh = new THREE.Mesh(geo, mat);
    this.waterMesh.rotation.x = -Math.PI / 3.5;
    this.waterMesh.position.y = -20;
    this.waterMesh.position.z = -10;
    this.scene.add(this.waterMesh);
  }

  _createGlowRings() {
    this.glowRings = [];

    const configs = [
      { radius: 12, color: 0xC9A84C, opacity: 0.25, z: -5 },
      { radius: 18, color: 0x00CFDE, opacity: 0.12, z: -8 },
      { radius: 8,  color: 0xC9A84C, opacity: 0.15, z: -3 },
    ];

    configs.forEach(cfg => {
      const geo = new THREE.RingGeometry(cfg.radius - 0.1, cfg.radius + 0.1, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.z = cfg.z;
      mesh.userData.baseOpacity = cfg.opacity;
      this.glowRings.push(mesh);
      this.scene.add(mesh);
    });
  }

  _createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x0A1628, 2);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xC9A84C, 60, 100);
    pointLight1.position.set(10, 10, 20);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00CFDE, 30, 80);
    pointLight2.position.set(-15, -5, 15);
    this.scene.add(pointLight2);
  }

  bindEvents() {
    window.addEventListener('resize', this._onResize.bind(this));
    window.addEventListener('mousemove', this._onMouseMove.bind(this));
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _onMouseMove(e) {
    this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    if (!this.isReady) return;

    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse follow
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Rotate particles slowly
    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.02;
      this.particles.rotation.x = elapsed * 0.005;
      // Mouse parallax
      this.particles.rotation.y += this.mouse.x * 0.03;
      this.particles.rotation.x += this.mouse.y * 0.02;
    }

    // Water wave
    if (this.waterMesh) {
      const posAttr = this.waterMesh.geometry.attributes.position;
      const initY = this.waterMesh.geometry.userData.initY;
      const posArr = posAttr.array;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posArr[i * 3];
        const z = posArr[i * 3 + 2];
        posArr[i * 3 + 1] = initY[i] + Math.sin(elapsed * 0.8 + x * 0.15 + z * 0.1) * 1.2;
      }
      posAttr.needsUpdate = true;

      this.waterMesh.position.x = this.mouse.x * 2;
    }

    // Pulse glow rings
    if (this.glowRings) {
      this.glowRings.forEach((ring, i) => {
        ring.rotation.z = elapsed * (0.08 + i * 0.03);
        const scale = 1 + Math.sin(elapsed * 0.5 + i * 1.5) * 0.04;
        ring.scale.setScalar(scale);
        ring.material.opacity = ring.userData.baseOpacity * (0.7 + Math.sin(elapsed * 0.4 + i) * 0.3);
      });
    }

    // Camera subtle float
    this.camera.position.x = this.mouse.x * 1.5;
    this.camera.position.y = this.mouse.y * 1.0;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this._onResize.bind(this));
    window.removeEventListener('mousemove', this._onMouseMove.bind(this));
    this.renderer.dispose();
  }
}


/* ============================================================
   Page Header Particles — smaller, lightweight
   ============================================================ */

class HeaderParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;

    this.resize();
    this._initParticles();
    this._animate();

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width  = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
  }

  _initParticles() {
    const count = Math.floor(this.canvas.width / 10);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '201, 168, 76' : '0, 207, 222',
      });
    }
  }

  _animate() {
    this.animationId = requestAnimationFrame(this._animate.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -5) {
        p.y = this.canvas.height + 5;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.fill();
    });
  }
}


/* ============================================================
   3D Floating Water — Background ambient
   ============================================================ */

class AmbientWater {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.animationId = null;

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
    this._animate();
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _wave(x, amplitude, frequency, phase, offsetY) {
    return offsetY + Math.sin(x * frequency + phase + this.time) * amplitude
         + Math.sin(x * frequency * 0.5 + phase * 1.3 + this.time * 0.7) * amplitude * 0.4;
  }

  _animate() {
    this.animationId = requestAnimationFrame(this._animate.bind(this));
    this.time += 0.008;

    const { width: W, height: H } = this.canvas;
    this.ctx.clearRect(0, 0, W, H);

    const waves = [
      { amplitude: 30, frequency: 0.008, phase: 0,    offsetY: H * 0.75, color: 'rgba(0, 30, 80, 0.12)' },
      { amplitude: 24, frequency: 0.010, phase: 1.5,  offsetY: H * 0.78, color: 'rgba(0, 50, 120, 0.09)' },
      { amplitude: 18, frequency: 0.012, phase: 3.0,  offsetY: H * 0.81, color: 'rgba(0, 100, 160, 0.06)' },
    ];

    waves.forEach(w => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, H);

      for (let x = 0; x <= W; x += 2) {
        const y = this._wave(x, w.amplitude, w.frequency, w.phase, w.offsetY);
        this.ctx.lineTo(x, y);
      }

      this.ctx.lineTo(W, H);
      this.ctx.closePath();
      this.ctx.fillStyle = w.color;
      this.ctx.fill();
    });
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Hero 3D scene (Three.js)
  if (typeof THREE !== 'undefined') {
    if (document.getElementById('hero-canvas')) {
      window.heroScene = new HeroScene('hero-canvas');
    }
  }

  // Page header particles (Canvas 2D)
  if (document.getElementById('header-particles')) {
    window.headerParticles = new HeaderParticles('header-particles');
  }

  // Ambient water background
  if (document.getElementById('particles-canvas')) {
    window.ambientWater = new AmbientWater('particles-canvas');
  }
});
