/**
 * ====================================================================
 * 💫 MAIN APP ORCHESTRATOR
 * ====================================================================
 * Coordinates the surprise progression, memory cards rendering,
 * typewriter letter animation, interactive grand heart reveal,
 * audio player, and QR modal generator.
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SURPRISE_CONFIG || {};

  // 1. Initialize Canvas Particle Engine
  window.particleEngine = new ParticleEngine('ambient-canvas');

  // 2. Initialize Audio Player
  window.audioPlayer = new RomanticAudioPlayer(config);

  // 3. Initialize Interactive Birthday Cake
  window.cakeInteraction = new BirthdayCakeInteraction({
    onBlown: () => {
      // Optional callback when candles are blown
    }
  });

  // 4. Populate Dynamic Config Data
  populateConfigData(config);

  // 5. Setup Step Navigation & Animations
  setupProgressionFlow(config);

  // 6. Setup QR Code Generator Modal
  setupQRCodeModal(config);

  // 7. Setup Intersection Observer for Scroll Animations & Letter Typewriter
  setupScrollAnimations(config);
});

/**
 * Injects user configured names, memories, and text into DOM
 */
function populateConfigData(config) {
  const bestieName = config.bestieName || "Bestie";
  const senderName = config.senderName || "Your Bestie";

  // Replace all [BESTIE NAME] placeholders
  document.querySelectorAll('.insert-bestie-name').forEach(el => {
    el.textContent = bestieName;
  });

  document.querySelectorAll('.insert-sender-name').forEach(el => {
    el.textContent = senderName;
  });

  // Birthday subtitle & instructions
  const birthdaySub = document.getElementById('birthday-subtitle');
  if (birthdaySub && config.birthdayHeader?.subtitle) {
    birthdaySub.textContent = config.birthdayHeader.subtitle;
  }

  // Populate Memories Cards
  const memoriesContainer = document.getElementById('memories-container');
  if (memoriesContainer && Array.isArray(config.memories)) {
    memoriesContainer.innerHTML = '';
    config.memories.forEach((mem, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card glass-card';
      const tilt = mem.rotation || (index % 2 === 0 ? -1.5 : 1.5);
      card.style.setProperty('--card-tilt', `${tilt}deg`);

      card.innerHTML = `
        <div class="polaroid-frame">
          <div class="polaroid-photo-wrapper">
            <img src="${mem.image}" alt="${mem.title}" loading="lazy" class="polaroid-photo">
            ${mem.tag ? `<span class="polaroid-badge">${mem.tag}</span>` : ''}
          </div>
          <div class="polaroid-caption-area">
            <div class="polaroid-date">${mem.date || ''}</div>
            <h3 class="polaroid-title">${mem.title}</h3>
            <p class="polaroid-desc">${mem.caption}</p>
          </div>
        </div>
      `;

      // Tap card to highlight / enlarge slightly
      card.addEventListener('click', () => {
        card.classList.toggle('card-expanded');
      });

      memoriesContainer.appendChild(card);
    });
  }

  // Populate Surprise Teaser
  const surpriseTeaser = document.getElementById('surprise-teaser-title');
  if (surpriseTeaser && config.interactiveSurprise?.teaserTitle) {
    surpriseTeaser.textContent = config.interactiveSurprise.teaserTitle;
  }
  const surpriseBtn = document.getElementById('reveal-heart-btn');
  if (surpriseBtn && config.interactiveSurprise?.buttonText) {
    surpriseBtn.innerHTML = `${config.interactiveSurprise.buttonText} ✨`;
  }
  const heartMainText = document.getElementById('heart-main-text');
  if (heartMainText && config.interactiveSurprise?.insideHeart) {
    heartMainText.textContent = config.interactiveSurprise.insideHeart;
  }
  const heartSubText = document.getElementById('heart-sub-text');
  if (heartSubText && config.interactiveSurprise?.subText) {
    heartSubText.textContent = config.interactiveSurprise.subText;
  }
}

/**
 * Handles the step-by-step cinematic journey
 */
function setupProgressionFlow(config) {
  const landingSection = document.getElementById('section-landing');
  const introSection = document.getElementById('section-intro');
  const mainSurprise = document.getElementById('main-surprise');
  const startBtn = document.getElementById('start-surprise-btn');
  const introContinueBtn = document.getElementById('intro-continue-btn');
  const replayBtn = document.getElementById('replay-btn');

  // STEP 1: Landing -> Intro
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Suggest playing music on first interaction
      if (window.audioPlayer && !window.audioPlayer.isPlaying) {
        window.audioPlayer.play();
      }

      landingSection.classList.add('fade-out');
      setTimeout(() => {
        landingSection.classList.add('hidden');
        introSection.classList.remove('hidden');
        introSection.classList.add('fade-in');
        startIntroSequence(config);
      }, 600);
    });
  }

  // STEP 2: Intro -> Birthday & Full Surprise
  if (introContinueBtn) {
    introContinueBtn.addEventListener('click', () => {
      introSection.classList.add('fade-out');
      setTimeout(() => {
        introSection.classList.add('hidden');
        mainSurprise.classList.remove('hidden');
        mainSurprise.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Launch opening confetti burst
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.3 }
          });
        }
      }, 600);
    });
  }

  // STEP 3: Grand Heart Surprise Reveal
  const revealHeartBtn = document.getElementById('reveal-heart-btn');
  const glowingHeartContainer = document.getElementById('glowing-heart-container');

  if (revealHeartBtn && glowingHeartContainer) {
    revealHeartBtn.addEventListener('click', () => {
      revealHeartBtn.classList.add('fade-out');
      setTimeout(() => {
        revealHeartBtn.classList.add('hidden');
        glowingHeartContainer.classList.remove('hidden');
        glowingHeartContainer.classList.add('animate-heart-bloom');

        // Launch Upward Heart Fountain!
        if (window.particleEngine) {
          window.particleEngine.launchHeartFountain();
          setTimeout(() => {
            window.particleEngine.launchHeartFountain();
          }, 800);
        }

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 70,
            spread: 100,
            origin: { y: 0.7 },
            colors: ['#ff758c', '#ff7eb3', '#fbc2eb', '#ffffff']
          });
        }
      }, 400);
    });
  }

  // STEP 4: Replay Surprise
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        mainSurprise.classList.add('hidden');
        introSection.classList.add('hidden');
        landingSection.classList.remove('hidden', 'fade-out');
        landingSection.classList.add('fade-in');

        // Reset heart surprise button
        if (revealHeartBtn && glowingHeartContainer) {
          revealHeartBtn.classList.remove('hidden', 'fade-out');
          glowingHeartContainer.classList.add('hidden');
          glowingHeartContainer.classList.remove('animate-heart-bloom');
        }

        // Relight cake
        if (window.cakeInteraction) {
          window.cakeInteraction.relightCandles();
        }
      }, 500);
    });
  }
}

/**
 * Triggers lines appearing one by one in the cinematic intro
 */
function startIntroSequence(config) {
  const lineEls = [
    document.getElementById('intro-line-1'),
    document.getElementById('intro-line-2'),
    document.getElementById('intro-line-3')
  ];

  const continueBtn = document.getElementById('intro-continue-btn');

  // Custom lines from config if set
  if (config.introLines && config.introLines.length >= 3) {
    lineEls[0].textContent = config.introLines[0];
    lineEls[1].textContent = config.introLines[1];
    lineEls[2].textContent = config.introLines[2];
  }

  lineEls.forEach(el => {
    el.classList.remove('active');
    el.style.opacity = '0';
  });
  if (continueBtn) {
    continueBtn.classList.add('hidden');
    continueBtn.style.opacity = '0';
  }

  // Staggered reveals
  setTimeout(() => {
    lineEls[0].classList.add('active');
  }, 400);

  setTimeout(() => {
    lineEls[1].classList.add('active');
  }, 2200);

  setTimeout(() => {
    lineEls[2].classList.add('active');
  }, 4200);

  setTimeout(() => {
    if (continueBtn) {
      continueBtn.classList.remove('hidden');
      continueBtn.classList.add('fade-in');
      continueBtn.style.opacity = '1';
    }
  }, 5800);
}

/**
 * Typewriter effect for the heartfelt letter when scrolled into view
 */
function setupScrollAnimations(config) {
  const letterSection = document.getElementById('section-letter');
  const letterBody = document.getElementById('letter-content-body');
  let letterRevealed = false;

  if (letterSection && letterBody) {
    const paragraphs = config.letter?.paragraphs || [];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !letterRevealed) {
          letterRevealed = true;
          revealLetterParagraphs(letterBody, paragraphs);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(letterSection);
  }
}

function revealLetterParagraphs(container, paragraphs) {
  container.innerHTML = '';

  paragraphs.forEach((pText, pIndex) => {
    const pEl = document.createElement('p');
    pEl.className = 'letter-paragraph';
    pEl.style.opacity = '0';
    pEl.style.transform = 'translateY(12px)';
    pEl.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    pEl.textContent = pText;
    container.appendChild(pEl);

    setTimeout(() => {
      pEl.style.opacity = '1';
      pEl.style.transform = 'translateY(0)';
    }, pIndex * 1400 + 300);
  });
}

/**
 * Generates aesthetic QR code inside interactive modal
 */
function setupQRCodeModal(config) {
  const openQRBtn = document.getElementById('open-qr-modal-btn');
  const closeQRBtn = document.getElementById('close-qr-modal-btn');
  const qrModal = document.getElementById('qr-modal');
  const qrCanvas = document.getElementById('qr-canvas-preview');
  const qrUrlInput = document.getElementById('qr-target-url');
  const qrUpdateBtn = document.getElementById('qr-update-btn');
  const qrDownloadBtn = document.getElementById('qr-download-btn');

  if (!qrModal) return;

  const getTargetUrl = () => {
    // If running on localhost or file, provide helpful reminder
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    if (isLocal) {
      return "https://my-bestie-birthday-surprise.vercel.app";
    }
    return window.location.href;
  };

  const drawAestheticQRCode = (url) => {
    if (!qrCanvas) return;
    if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
      QRCode.toCanvas(qrCanvas, url, {
        width: 240,
        margin: 2,
        color: {
          dark: '#3d1544',  // elegant deep wine / plum for high scannability
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (err) => {
        if (err) console.error("QR Code Error:", err);
      });
    }
  };

  if (openQRBtn) {
    openQRBtn.addEventListener('click', () => {
      qrModal.classList.remove('hidden');
      if (qrUrlInput) {
        if (!qrUrlInput.value) {
          qrUrlInput.value = getTargetUrl();
        }
        drawAestheticQRCode(qrUrlInput.value);
      }
    });
  }

  if (closeQRBtn) {
    closeQRBtn.addEventListener('click', () => {
      qrModal.classList.add('hidden');
    });
  }

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.add('hidden');
    }
  });

  if (qrUpdateBtn && qrUrlInput) {
    qrUpdateBtn.addEventListener('click', () => {
      drawAestheticQRCode(qrUrlInput.value || getTargetUrl());
    });
  }

  // Export & Download high-res QR Polaroid Card
  if (qrDownloadBtn && qrCanvas) {
    qrDownloadBtn.addEventListener('click', () => {
      downloadAestheticQRCard(qrCanvas, config);
    });
  }
}

/**
 * Creates a high-res printable Polaroid Card image with QR Code & "Scan Me ❤️"
 */
function downloadAestheticQRCard(sourceCanvas, config) {
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 600;
  cardCanvas.height = 780;
  const ctx = cardCanvas.getContext('2d');

  // Background card with soft border & subtle shadow
  ctx.fillStyle = '#ffffff';
  ctx.roundRect(20, 20, 560, 740, 24);
  ctx.fill();

  // Subtle pastel gradient header banner
  const bannerGrad = ctx.createLinearGradient(20, 20, 580, 160);
  bannerGrad.addColorStop(0, '#ffd1dc');
  bannerGrad.addColorStop(1, '#e0c3fc');
  ctx.fillStyle = bannerGrad;
  ctx.beginPath();
  ctx.roundRect(20, 20, 560, 130, [24, 24, 0, 0]);
  ctx.fill();

  // Title on Banner
  ctx.fillStyle = '#5c2d58';
  ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  const bestieName = config.bestieName || 'Bestie';
  ctx.fillText(`For My Bestie ${bestieName} ✨`, 300, 75);

  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#7a3e74';
  ctx.fillText('A digital birthday surprise made just for you', 300, 108);

  // Draw QR code onto card
  ctx.drawImage(sourceCanvas, 130, 190, 340, 340);

  // "Scan Me ❤️" label
  ctx.fillStyle = '#ff4d6d';
  ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
  ctx.fillText('Scan Me ❤️', 300, 600);

  // Sub caption
  ctx.fillStyle = '#8e7992';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Point your phone camera to open the surprise', 300, 640);

  // Tiny hearts decoration
  ctx.font = '22px sans-serif';
  ctx.fillText('🎂 ✨ 🎁', 300, 690);

  // Download trigger
  const link = document.createElement('a');
  link.download = `Birthday-Surprise-QR-${bestieName}.png`;
  link.href = cardCanvas.toDataURL('image/png');
  link.click();
}
