/**
 * ====================================================================
 * ✨ CANVAS EFFECTS ENGINE: Ambient Hearts, Sparkles & Confetti Cannon
 * ====================================================================
 * High-performance 60fps canvas particle system optimized for mobile.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    this.ambientParticles = [];
    this.confettiParticles = [];
    this.heartFountainParticles = [];
    
    this.isRunning = true;
    this.maxAmbient = 32; // balanced density for battery life
    
    this.initCanvasSize();
    this.initAmbientParticles();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initCanvasSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
    });

    document.addEventListener('visibilitychange', () => {
      this.isRunning = !document.hidden;
      if (this.isRunning) {
        requestAnimationFrame(this.animate);
      }
    });
  }

  // Soft romantic pastel palette
  static COLORS = [
    'rgba(255, 143, 163, ', // Soft Rose
    'rgba(255, 182, 193, ', // Light Pink
    'rgba(224, 195, 252, ', // Lavender
    'rgba(186, 215, 255, ', // Sky Blue
    'rgba(255, 223, 186, ', // Warm Peach
    'rgba(255, 255, 255, '  // Pure Sparkle White
  ];

  initAmbientParticles() {
    this.ambientParticles = [];
    for (let i = 0; i < this.maxAmbient; i++) {
      this.ambientParticles.push(this.createAmbientParticle(true));
    }
  }

  createAmbientParticle(randomY = false) {
    const isHeart = Math.random() > 0.45;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      size: isHeart ? (Math.random() * 12 + 10) : (Math.random() * 5 + 3),
      speedY: Math.random() * 0.7 + 0.35,
      speedX: (Math.random() - 0.5) * 0.5,
      wobbleSpeed: Math.random() * 0.03 + 0.015,
      wobbleAngle: Math.random() * Math.PI * 2,
      wobbleDistance: Math.random() * 30 + 10,
      baseColor: ParticleEngine.COLORS[Math.floor(Math.random() * ParticleEngine.COLORS.length)],
      alpha: Math.random() * 0.5 + 0.25,
      isHeart: isHeart,
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.02 + Math.random() * 0.02
    };
  }

  // Draw smooth vector heart
  drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -30, 8, 0, 30);
    ctx.bezierCurveTo(30, 8, 15, -15, 0, 0);
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(255, 120, 150, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  // Draw 4-point star sparkle
  drawSparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(size * 1.5, 0);
      ctx.lineTo(size * 0.3, size * 0.3);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  // 💥 CELEBRATION CONFETTI CANNON (Candle blowout celebration)
  launchCelebrationConfetti(originX = this.width / 2, originY = this.height * 0.45) {
    const count = 120;
    const colors = [
      '#ff6b8b', '#ff8e9e', '#f8a5c2', '#f7d794', '#786fa6',
      '#63cdda', '#ea8685', '#e77f67', '#f3a683', '#ffffff'
    ];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 12 + 6;
      this.confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.5),
        vy: (Math.sin(angle) * speed - 6) * (0.7 + Math.random() * 0.4),
        sizeX: Math.random() * 8 + 6,
        sizeY: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.1 + 0.05,
        gravity: 0.28,
        drag: 0.96,
        alpha: 1,
        isHeart: Math.random() > 0.65
      });
    }
  }

  // 💖 GRAND SURPRISE UPWARD HEART FOUNTAIN
  launchHeartFountain() {
    const burstCount = 60;
    const startX = this.width / 2;
    const startY = this.height * 0.65;
    
    for (let i = 0; i < burstCount; i++) {
      const spreadAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.3;
      const velocity = Math.random() * 9 + 5;
      this.heartFountainParticles.push({
        x: startX + (Math.random() - 0.5) * 40,
        y: startY,
        vx: Math.cos(spreadAngle) * velocity,
        vy: Math.sin(spreadAngle) * velocity,
        size: Math.random() * 18 + 14,
        color: ParticleEngine.COLORS[Math.floor(Math.random() * 3)], // soft pinks/roses
        alpha: 1,
        rotation: (Math.random() - 0.5) * 30,
        swaySpeed: Math.random() * 0.05 + 0.02,
        swayAngle: Math.random() * Math.PI * 2,
        gravity: -0.05 // floats effortlessly upward
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Update & Render Ambient Floating Hearts & Sparkles
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.wobbleAngle += p.wobbleSpeed;
      p.pulse += p.pulseSpeed;
      const currentAlpha = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3);

      p.y -= p.speedY;
      const driftX = p.x + Math.sin(p.wobbleAngle) * p.wobbleDistance;

      if (p.isHeart) {
        this.drawHeart(this.ctx, driftX, p.y, p.size, `${p.baseColor}${currentAlpha})`);
      } else {
        this.drawSparkle(this.ctx, driftX, p.y, p.size, `${p.baseColor}${currentAlpha})`);
      }

      // Recycle when scrolled off top
      if (p.y < -30) {
        this.ambientParticles[i] = this.createAmbientParticle(false);
      }
    }

    // 2. Update & Render Confetti Particles
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.vx *= c.drag;
      c.vy = c.vy * c.drag + c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotationSpeed;
      c.tiltAngle += c.tiltSpeed;
      c.alpha -= 0.007;

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, c.alpha);

      if (c.isHeart) {
        this.drawHeart(this.ctx, 0, 0, c.sizeX * 1.5, c.color);
      } else {
        this.ctx.fillStyle = c.color;
        const scaleY = Math.cos(c.tiltAngle);
        this.ctx.fillRect(-c.sizeX / 2, (-c.sizeY / 2) * scaleY, c.sizeX, c.sizeY * Math.abs(scaleY));
      }
      this.ctx.restore();
    }

    // 3. Update & Render Upward Heart Fountain
    for (let i = this.heartFountainParticles.length - 1; i >= 0; i--) {
      const h = this.heartFountainParticles[i];
      h.swayAngle += h.swaySpeed;
      h.x += h.vx + Math.sin(h.swayAngle) * 0.8;
      h.y += h.vy;
      h.vy += h.gravity;
      h.alpha -= 0.009;

      if (h.alpha <= 0 || h.y < -50) {
        this.heartFountainParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, h.alpha);
      this.drawHeart(this.ctx, h.x, h.y, h.size, `${h.color}${h.alpha})`);
      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

window.ParticleEngine = ParticleEngine;
