/**
 * ====================================================================
 * 🎂 INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWOUT
 * ====================================================================
 * Manages candle flame physics, tap-to-blow interactions,
 * smoke animations, sound synthesis, and celebration confetti.
 */

class BirthdayCakeInteraction {
  constructor(options = {}) {
    this.container = document.getElementById('birthday-cake-container');
    this.instructionEl = document.getElementById('cake-instruction');
    this.continueBtn = document.getElementById('cake-continue-btn');
    this.isBlown = false;
    this.onBlownCallback = options.onBlown || null;

    this.initAudio();
    this.bindEvents();
  }

  initAudio() {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = null;
  }

  ensureAudio() {
    if (!this.audioCtx && this.AudioContext) {
      this.audioCtx = new this.AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  bindEvents() {
    if (!this.container) return;

    // Tap/click cake or candles to blow out
    this.container.addEventListener('click', (e) => {
      this.handleBlow();
    });

    // Also support keyboard Enter/Space for accessibility
    this.container.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.handleBlow();
      }
    });

    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        const memoriesSection = document.getElementById('section-memories');
        if (memoriesSection) {
          memoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  handleBlow() {
    this.ensureAudio();

    if (!this.isBlown) {
      this.blowCandles();
    } else {
      this.relightCandles();
    }
  }

  blowCandles() {
    this.isBlown = true;
    this.playPuffSound();

    const flames = this.container.querySelectorAll('.flame');
    const glows = this.container.querySelectorAll('.flame-glow');
    const smokes = this.container.querySelectorAll('.smoke');

    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add('extinguished');
      }, index * 80);
    });

    glows.forEach((glow) => {
      glow.classList.add('extinguished');
    });

    smokes.forEach((smoke, index) => {
      setTimeout(() => {
        smoke.classList.add('active');
      }, index * 80 + 100);
    });

    // Celebration triggers
    setTimeout(() => {
      this.triggerCelebration();
    }, 250);
  }

  relightCandles() {
    this.isBlown = false;
    const flames = this.container.querySelectorAll('.flame');
    const glows = this.container.querySelectorAll('.flame-glow');
    const smokes = this.container.querySelectorAll('.smoke');

    flames.forEach(f => f.classList.remove('extinguished'));
    glows.forEach(g => g.classList.remove('extinguished'));
    smokes.forEach(s => s.classList.remove('active'));

    if (this.instructionEl) {
      this.instructionEl.innerHTML = window.SURPRISE_CONFIG?.birthdayHeader?.blowInstruction || 
        "Tap the candles to blow them out & make a wish! 🕯️✨";
      this.instructionEl.classList.remove('wish-granted');
    }
  }

  triggerCelebration() {
    // 1. Play joyful magical chime
    this.playCelebrationChime();

    // 2. Launch Confetti
    if (window.particleEngine) {
      const rect = this.container.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height * 0.35;
      window.particleEngine.launchCelebrationConfetti(x, y);
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb', '#fdcb6e']
      });
    }

    // 3. Update Instruction Text
    if (this.instructionEl) {
      this.instructionEl.innerHTML = window.SURPRISE_CONFIG?.birthdayHeader?.candlesBlownText || 
        "Wish granted! 🎉 May all your dreams come true! <span class='relight-hint'>(Tap cake to relight 🕯️)</span>";
      this.instructionEl.classList.add('wish-granted');
    }

    // 4. Reveal continue button
    if (this.continueBtn) {
      this.continueBtn.classList.remove('hidden');
      this.continueBtn.classList.add('animate-pop');
    }

    if (this.onBlownCallback) {
      this.onBlownCallback();
    }
  }

  // Soft air puff sound synthesis (white noise + lowpass sweep)
  playPuffSound() {
    if (!this.audioCtx) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.3;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.28);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
    } catch (e) {
      console.log("Puff sound error:", e);
    }
  }

  // Joyful celestial chime (arpeggio of bells)
  playCelebrationChime() {
    if (!this.audioCtx) return;
    const chimePitches = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.audioCtx.currentTime;

    chimePitches.forEach((pitch, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.85);
    });
  }
}

window.BirthdayCakeInteraction = BirthdayCakeInteraction;
