/**
 * ====================================================================
 * 🎵 ROMANTIC AUDIO CONTROLLER & CELESTIAL SYNTHESIZER
 * ====================================================================
 * Smooth romantic audio playback, mobile user-activation compliance,
 * animated equalizer pills, and an ambient acoustic piano fallback synthesizer.
 */

class RomanticAudioPlayer {
  constructor(config) {
    this.config = config.music || {};
    this.isPlaying = false;
    this.isSynth = false;

    // Initialize audio element with volume & loop
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = 0.7;
    this.audioElement.preload = 'auto';

    if (this.config.src) {
      this.audioElement.src = this.config.src;
    }

    // UI elements
    this.btn = document.getElementById('music-toggle-btn');
    this.btnText = document.getElementById('music-btn-text');
    this.equalizer = document.getElementById('music-equalizer');

    this.initAudioContext();
    this.bindEvents();
  }

  initAudioContext() {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = null;
    this.synthInterval = null;
  }

  ensureAudioContext() {
    if (!this.audioCtx && this.AudioContext) {
      this.audioCtx = new this.AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  bindEvents() {
    if (!this.btn) return;
    this.btn.addEventListener('click', () => {
      this.togglePlay();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.isSynth = false;
      this.updateUI(true);
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.isSynth) {
        this.isPlaying = false;
        this.updateUI(false);
      }
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn("External MP3 unavailable, switching to romantic synth fallback:", e);
      if (this.isPlaying) {
        this.startLofiSynth();
      }
    });
  }

  togglePlay() {
    this.ensureAudioContext();

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.ensureAudioContext();

    if (this.config.src) {
      if (!this.audioElement.src || this.audioElement.src === '') {
        this.audioElement.src = this.config.src;
      }
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.isSynth = false;
            this.updateUI(true);
          })
          .catch((err) => {
            console.log("Audio playback blocked by browser or file issue. Using romantic synth fallback:", err);
            this.startLofiSynth();
          });
      }
    } else {
      this.startLofiSynth();
    }
  }

  pause() {
    this.isPlaying = false;
    this.audioElement.pause();
    this.stopLofiSynth();
    this.updateUI(false);
  }

  updateUI(playing) {
    if (!this.btn) return;
    if (playing) {
      this.btn.classList.add('playing');
      if (this.btnText) this.btnText.textContent = "Romantic Melody ❤️";
      if (this.equalizer) this.equalizer.classList.remove('paused');
    } else {
      this.btn.classList.remove('playing');
      if (this.btnText) this.btnText.textContent = "🎵 Play Our Song";
      if (this.equalizer) this.equalizer.classList.add('paused');
    }
  }

  // 🎹 Ambient Romantic Lo-Fi Piano Synthesizer (Zero dependencies fallback)
  startLofiSynth() {
    this.isSynth = true;
    this.isPlaying = true;
    this.updateUI(true);

    if (!this.audioCtx) return;

    // Romantic acoustic love chord frequencies (C, Em, Am, F)
    const notes = [
      261.63, 329.63, 392.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00
    ];

    const sequence = [
      [0, 2, 4, 6], // C major arpeggio
      [7, 4, 2, 0],
      [5, 4, 2, 0], // G/B
      [0, 1, 3, 5], // A minor
      [6, 4, 2, 1],
      [5, 3, 2, 0]  // F major
    ];

    let step = 0;
    this.stopLofiSynth();

    const playChordStep = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      const chord = sequence[step % sequence.length];
      chord.forEach((noteIdx, i) => {
        setTimeout(() => {
          if (this.isPlaying) {
            this.playChimeNote(notes[noteIdx % notes.length]);
          }
        }, i * 360);
      });
      step++;
    };

    playChordStep();
    this.synthInterval = setInterval(playChordStep, 1800);
  }

  playChimeNote(freq) {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(1.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.95);
  }

  stopLofiSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynth = false;
  }
}

window.RomanticAudioPlayer = RomanticAudioPlayer;
