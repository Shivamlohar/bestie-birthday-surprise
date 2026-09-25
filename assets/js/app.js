/**
 * ====================================================================
 * 🌌 "A LITTLE UNIVERSE MADE FOR YOU ✨" - APP ORCHESTRATOR
 * Dedicated to: Manvi ❤️ (27 September)
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.SURPRISE_CONFIG || {};

  // 1. Initialize Cosmic Engine (twinkling & shooting stars)
  window.cosmicEngine = new CosmicEngine('ambient-canvas');

  // 2. Initialize Audio Player
  window.audioPlayer = new RomanticAudioPlayer(config);

  // 3. Initialize Interactive Birthday Cake
  window.cakeInteraction = new BirthdayCakeInteraction({
    onBlown: () => {
      if (window.cosmicEngine) {
        window.cosmicEngine.launchCelebrationConfetti();
      }
    }
  });

  // State Management
  const visitedChapters = new Set();
  const totalChaptersNeeded = 4;

  // 4. Setup Initial Void Screen
  setupInitialScreen(config);

  // 5. Setup Constellation Hub & Chapter Navigation
  setupUniverseHub(config, visitedChapters, totalChaptersNeeded);

  // 6. Setup Individual Chapter Handlers
  setupChapterMemories(config);
  setupChapterNeverSay(config);
  setupChapterChaos(config);
  setupChapterLetter(config);

  // 7. Setup QR Code Generator
  setupQRCodeModal(config);
});

/**
 * SCREEN 1: Initial Screen (Dark Void & Glowing Star)
 */
function setupInitialScreen(config) {
  const line1 = document.getElementById('initial-line-1');
  const line2 = document.getElementById('initial-line-2');
  const beginBtn = document.getElementById('begin-journey-btn');
  const voidScreen = document.getElementById('screen-initial-void');
  const universeScreen = document.getElementById('screen-universe');

  // Line 1 fades in
  setTimeout(() => {
    if (line1) line1.classList.add('visible');
  }, 400);

  // Line 2 fades in after 2 seconds
  setTimeout(() => {
    if (line2) line2.classList.add('visible');
  }, 2400);

  // Tap the cat for cute purr reaction & heart sparkles
  const catBox = document.getElementById('welcome-cat-box');
  if (catBox) {
    catBox.addEventListener('click', () => {
      const bubble = catBox.querySelector('.cat-speech-bubble span');
      if (bubble) {
        bubble.textContent = "Purr~ Love you Manvi! 💖🐾";
      }
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.3 },
          colors: ['#ff758c', '#ffd32a', '#c4b5fd']
        });
      }
    });
  }

  // Button appears with glowing animation
  setTimeout(() => {
    if (beginBtn) {
      beginBtn.classList.remove('hidden');
      beginBtn.classList.add('fade-in');
    }
  }, 3800);

  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      // Start ambient music on user tap
      if (window.audioPlayer && !window.audioPlayer.isPlaying) {
        window.audioPlayer.play();
      }

      voidScreen.classList.add('hidden');
      universeScreen.classList.remove('hidden');
      universeScreen.classList.add('fade-in');
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
}

/**
 * SCREEN 2: Constellation Star Universe Hub
 */
function setupUniverseHub(config, visitedChapters, totalNeeded) {
  const progressText = document.getElementById('progress-tracker-text');
  const star5Node = document.getElementById('star-node-5');
  const star5Icon = document.getElementById('star-5-icon');
  const star5Status = document.getElementById('status-star-5');
  const star5Subtext = document.getElementById('star-5-subtext');

  // Update name placeholders
  document.querySelectorAll('.insert-bestie-name').forEach(el => {
    el.textContent = config.bestieName || 'Manvi';
  });
  document.querySelectorAll('.insert-sender-name').forEach(el => {
    el.textContent = config.senderName || 'Your Bestie';
  });

  const updateProgress = () => {
    const count = visitedChapters.size;
    if (progressText) {
      progressText.textContent = `Chapters Explored: ${count}/${totalNeeded}`;
    }

    // Unlock Star 5 if 4 chapters completed!
    if (count >= totalNeeded && star5Node) {
      star5Node.classList.remove('locked');
      star5Node.classList.add('unlocked');
      if (star5Icon) star5Icon.textContent = '⭐';
      if (star5Status) {
        star5Status.textContent = 'Unlocked ✨';
        star5Status.classList.add('completed');
      }
      if (star5Subtext) {
        star5Subtext.textContent = 'Your final birthday surprise awaits!';
      }
    }
  };

  // Bind Star Clicks
  for (let i = 1; i <= 5; i++) {
    const starNode = document.getElementById(`star-node-${i}`);
    if (!starNode) continue;

    starNode.addEventListener('click', () => {
      // Check Star 5 locked status
      if (i === 5 && visitedChapters.size < totalNeeded) {
        alert("✨ Discover the first 4 chapters in the universe to unlock your final surprise!");
        return;
      }

      // Mark chapter visited
      if (i <= 4) {
        visitedChapters.add(i);
        const statusPill = document.getElementById(`status-star-${i}`);
        if (statusPill) {
          statusPill.textContent = 'Explored ✓';
          statusPill.classList.add('completed');
        }
        starNode.classList.add('visited');
        updateProgress();
      }

      // Transition to Chapter View
      document.getElementById('screen-universe').classList.add('hidden');
      const targetView = document.getElementById(`view-chapter-${i}`);
      if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Trigger specific chapter entry animations
        if (i === 2) triggerNeverSaySequence();
        if (i === 5 && typeof confetti === 'function') {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
        }
      }
    });
  }

  // Bind All "← Return to Universe" Buttons
  document.querySelectorAll('[data-back="true"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chapter-view-container').forEach(v => v.classList.add('hidden'));
      const universeScreen = document.getElementById('screen-universe');
      universeScreen.classList.remove('hidden');
      universeScreen.classList.add('fade-in');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Replay universe button
  const replayBtn = document.getElementById('replay-universe-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      document.querySelectorAll('.chapter-view-container').forEach(v => v.classList.add('hidden'));
      const universeScreen = document.getElementById('screen-universe');
      universeScreen.classList.remove('hidden');
      universeScreen.classList.add('fade-in');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * CHAPTER 1: Our Memories
 */
function setupChapterMemories(config) {
  const container = document.getElementById('memories-deck');
  if (!container || !Array.isArray(config.memories)) return;

  container.innerHTML = '';
  config.memories.forEach(mem => {
    const card = document.createElement('div');
    card.className = 'cinematic-memory-card glass-card';
    card.innerHTML = `
      <div class="memory-photo-container">
        <img src="${mem.image}" alt="${mem.title}" loading="lazy">
        ${mem.tag ? `<span class="memory-photo-tag">${mem.tag}</span>` : ''}
      </div>
      <div>
        <div class="memory-date">${mem.date || ''}</div>
        <h3 class="memory-title">${mem.title}</h3>
        <p class="memory-desc">${mem.caption}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * CHAPTER 2: Something I Never Say
 */
let neverSayTimeoutIds = [];
function setupChapterNeverSay(config) {
  const container = document.getElementById('sentence-stream');
  if (!container) return;

  container.innerHTML = '';
  const lines = config.neverSayLines || [];
  lines.forEach((lineText, idx) => {
    const p = document.createElement('p');
    p.className = `never-say-line ${idx === lines.length - 1 ? 'highlight' : ''}`;
    p.textContent = lineText;
    p.id = `never-say-line-${idx}`;
    container.appendChild(p);
  });
}

function triggerNeverSaySequence() {
  neverSayTimeoutIds.forEach(id => clearTimeout(id));
  neverSayTimeoutIds = [];

  const lines = document.querySelectorAll('.never-say-line');
  lines.forEach(l => l.classList.remove('active'));

  lines.forEach((lineEl, idx) => {
    const tId = setTimeout(() => {
      lineEl.classList.add('active');
    }, idx * 1600 + 400);
    neverSayTimeoutIds.push(tId);
  });
}

/**
 * CHAPTER 3: Our Chaos (Playful prank buttons)
 */
function setupChapterChaos(config) {
  const container = document.getElementById('chaos-container');
  if (container && config.chaos?.cards) {
    container.innerHTML = '';
    config.chaos.cards.forEach(c => {
      const card = document.createElement('div');
      card.className = 'chaos-card glass-card';
      card.innerHTML = `
        <div class="chaos-quote">${c.quote}</div>
        <div class="chaos-subtext">${c.subtext}</div>
      `;
      container.appendChild(card);
    });
  }

  const prankBtn = document.getElementById('prank-btn');
  const prankResponse = document.getElementById('prank-response');
  let prankStep = 0;

  if (prankBtn) {
    prankBtn.addEventListener('click', () => {
      if (prankStep === 0) {
        prankResponse.textContent = "See? I knew you would click it 😂";
        prankBtn.textContent = "Seriously, Don't Click 🙈";
        prankStep = 1;
      } else if (prankStep === 1) {
        prankResponse.textContent = "Okay, you're impossible. Never change! 💖";
        prankBtn.textContent = "You Win! 🏆";
        prankStep = 2;
      } else {
        prankResponse.textContent = "Certified Chaos Partner in Crime 🍕✨";
      }
    });
  }
}

/**
 * CHAPTER 4: Secret Letter (3D Opening Envelope)
 */
function setupChapterLetter(config) {
  const envelope = document.getElementById('envelope-3d');
  const openBtn = document.getElementById('open-envelope-btn');
  const letterSheet = document.getElementById('letter-sheet');
  const paragraphsArea = document.getElementById('letter-paragraphs-area');

  if (paragraphsArea && config.letter?.paragraphs) {
    paragraphsArea.innerHTML = '';
    config.letter.paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.textContent = p;
      if (p.includes("Love you")) {
        pEl.className = "letter-love-highlight";
      }
      paragraphsArea.appendChild(pEl);
    });
  }

  const openAction = () => {
    if (envelope) envelope.classList.add('open');
    if (openBtn) openBtn.classList.add('hidden');
    if (letterSheet) {
      letterSheet.classList.remove('hidden');
      letterSheet.classList.add('fade-in');
    }
  };

  if (openBtn) openBtn.addEventListener('click', openAction);
  if (envelope) envelope.addEventListener('click', openAction);
}

/**
 * QR Modal Setup
 */
function setupQRCodeModal(config) {
  const openBtn = document.getElementById('open-qr-modal-btn');
  const closeBtn = document.getElementById('close-qr-modal-btn');
  const modal = document.getElementById('qr-modal');
  const canvas = document.getElementById('qr-canvas-preview');
  const urlInput = document.getElementById('qr-target-url');
  const updateBtn = document.getElementById('qr-update-btn');
  const downloadBtn = document.getElementById('qr-download-btn');

  if (!modal) return;

  const renderQR = (url) => {
    if (canvas && typeof QRCode !== 'undefined' && QRCode.toCanvas) {
      QRCode.toCanvas(canvas, url, {
        width: 200,
        margin: 2,
        color: { dark: '#1e103f', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      });
    }
  };

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      renderQR(urlInput.value);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  if (updateBtn) {
    updateBtn.addEventListener('click', () => renderQR(urlInput.value));
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `Manvi-Birthday-QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
}
