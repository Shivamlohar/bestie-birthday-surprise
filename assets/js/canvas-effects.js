/**
 * ====================================================================
 * 🌌 COSMIC CANVAS ENGINE: Twinkling Stars, Shooting Stars & Fireworks
 * ====================================================================
 * 60fps high-performance cosmic simulation optimized for mobile.
 */

class CosmicEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.stars = [];
    this.shootingStars = [];
    this.confettiParticles = [];
    this.maxStars = 140; // balanced for buttery smooth mobile frame rate
    this.isRunning = true;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    this.initCanvasSize();
    this.initStars();
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

    // Subtle parallax on touch/mouse
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - this.width / 2) * 0.03;
      this.mouse.targetY = (e.clientY - this.height / 2) * 0.03;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX - this.width / 2) * 0.02;
        this.mouse.targetY = (e.touches[0].clientY - this.height / 2) * 0.02;
      }
    }, { passive: true });
  }

  initStars() {
    this.stars = [];
    const colors = ['#ffffff', '#f1f2f6', '#fed330', '#a1c4fd', '#ff9a9e'];

    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        driftY: (Math.random() - 0.5) * 0.15,
        driftX: (Math.random() - 0.5) * 0.15
      });
    }
  }

  // 🌠 Periodic shooting star
  maybeCreateShootingStar() {
    if (this.shootingStars.length < 2 && Math.random() < 0.015) {
      const startX = Math.random() * this.width * 0.8;
      const startY = Math.random() * (this.height * 0.4);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 deg downward
      const speed = Math.random() * 8 + 12;

      this.shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 70 + 50,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  // 💥 Confetti Cannon for Star 5 & Candle blow
  launchCelebrationConfetti(originX = this.width / 2, originY = this.height * 0.5) {
    const count = 130;
    const colors = ['#ff758c', '#ff9a9e', '#ffd1dc', '#fed330', '#a1c4fd', '#c2e9fb', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 14 + 7;

      this.confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: (Math.sin(angle) * speed - 6),
        sizeX: Math.random() * 9 + 6,
        sizeY: Math.random() * 13 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 16,
        gravity: 0.28,
        drag: 0.96,
        alpha: 1
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth mouse parallax interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Draw Twinkling Night Stars
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.twinklePhase += s.twinkleSpeed;
      s.x += s.driftX;
      s.y += s.driftY;

      // Wrap edges
      if (s.x < 0) s.x = this.width;
      if (s.x > this.width) s.x = 0;
      if (s.y < 0) s.y = this.height;
      if (s.y > this.height) s.y = 0;

      const currentAlpha = s.alpha * (0.6 + Math.sin(s.twinklePhase) * 0.4);
      const drawX = s.x + this.mouse.x;
      const drawY = s.y + this.mouse.y;

      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0, currentAlpha);
      this.ctx.shadowColor = s.color;
      this.ctx.shadowBlur = s.size > 1.8 ? 6 : 0;
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // 2. Shooting Stars
    this.maybeCreateShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.alpha -= ss.decay;

      if (ss.alpha <= 0 || ss.x > this.width || ss.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ss.alpha);
      const grad = this.ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - ss.vx * 3.5, ss.y - ss.vy * 3.5
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(ss.x - ss.vx * 3.5, ss.y - ss.vy * 3.5);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 3. Confetti Particles
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.vx *= c.drag;
      c.vy = c.vy * c.drag + c.gravity;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotationSpeed;
      c.alpha -= 0.008;

      if (c.alpha <= 0 || c.y > this.height + 50) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, c.alpha);
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.sizeX / 2, -c.sizeY / 2, c.sizeX, c.sizeY);
      this.ctx.restore();
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(this.animate);
  }
}

window.CosmicEngine = CosmicEngine;
window.ParticleEngine = CosmicEngine; // backward compatibility
