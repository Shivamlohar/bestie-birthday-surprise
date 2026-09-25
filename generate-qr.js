const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const targetUrl = process.argv[2] || 'https://shivamlohar.github.io/bestie-birthday-surprise/';
const bestieName = process.argv[3] || 'Manvi';
const birthdayDate = '27 September';

async function generateAll() {
  console.log(`Generating Cosmic QR Card for: ${targetUrl} (Bestie: ${bestieName}, Date: ${birthdayDate})`);

  // 1. Generate standalone high-res PNG (600x600)
  const pngPath = path.join(__dirname, 'assets', 'images', 'bestie-qr-code.png');
  await QRCode.toFile(pngPath, targetUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#1c0e35',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
  console.log(`✓ Standalone PNG saved: ${pngPath}`);

  // 2. Generate raw SVG QR
  const qrSvgRaw = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 1,
    color: {
      dark: '#1c0e35',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  const svgContentMatch = qrSvgRaw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const qrInnerSvg = svgContentMatch ? svgContentMatch[1] : qrSvgRaw;
  const viewBoxMatch = qrSvgRaw.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 37 37';

  // 3. Create full aesthetic Printable Polaroid Card SVG (600x820)
  const cardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 820" width="600" height="820">
  <defs>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#cca8c0" flood-opacity="0.35"/>
    </filter>

    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#120b26"/>
      <stop offset="50%" stop-color="#2a1452"/>
      <stop offset="100%" stop-color="#3d1b6d"/>
    </linearGradient>

    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff758c"/>
      <stop offset="100%" stop-color="#ff4757"/>
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700&amp;display=swap');
      .banner-title { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: bold; fill: #ffd32a; text-anchor: middle; }
      .banner-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 500; fill: #c4b5fd; text-anchor: middle; }
      .scan-title { font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-weight: bold; fill: #ff4757; text-anchor: middle; }
      .scan-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 600; fill: #7d6b85; text-anchor: middle; }
      .footer-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #a595aa; text-anchor: middle; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="820" fill="#070614"/>

  <!-- Printable Polaroid White Card with Shadow -->
  <rect x="25" y="25" width="550" height="770" rx="32" fill="#ffffff" filter="url(#cardShadow)"/>
  <rect x="25" y="25" width="550" height="770" rx="32" fill="none" stroke="#f1e6f5" stroke-width="2"/>

  <!-- Top Cosmic Banner -->
  <path d="M 25 57 Q 25 25, 57 25 L 543 25 Q 575 25, 575 57 L 575 160 L 25 160 Z" fill="url(#bannerGrad)"/>

  <!-- Tiny Gold Stars on Banner -->
  <text x="75" y="70" font-size="20" fill="#ffd32a">✨</text>
  <text x="525" y="70" font-size="20" fill="#ffd32a">✨</text>
  <text x="120" y="130" font-size="16" fill="#c4b5fd">⭐</text>
  <text x="480" y="130" font-size="16" fill="#c4b5fd">⭐</text>

  <!-- Banner Text -->
  <text x="300" y="85" class="banner-title">For My Bestie ${bestieName} ✨</text>
  <text x="300" y="122" class="banner-sub">A Little Universe Made For You • ${birthdayDate}</text>

  <!-- QR Frame Outer Container -->
  <rect x="95" y="195" width="410" height="410" rx="24" fill="#faf5f8" stroke="#f1d4e4" stroke-width="2"/>

  <!-- Inner Clean White QR Box -->
  <rect x="115" y="215" width="370" height="370" rx="16" fill="#ffffff"/>

  <!-- Embedded QR Code SVG -->
  <g transform="translate(130, 230)">
    <svg width="340" height="340" viewBox="${viewBox}">
      ${qrInnerSvg}
    </svg>
  </g>

  <!-- Center Heart Emblem -->
  <g transform="translate(300, 400)">
    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#ff758c" stroke-width="3"/>
    <path d="M 0 -8 C -4 -16, -16 -16, -16 -6 C -16 4, 0 16, 0 16 C 0 16, 16 4, 16 -6 C 16 -16, 4 -16, 0 -8 Z" fill="url(#heartGrad)"/>
  </g>

  <!-- "Scan Me ❤️" Text -->
  <text x="300" y="655" class="scan-title">Scan Me ❤️</text>
  <text x="300" y="695" class="scan-sub">Point your phone camera here to open Manvi's universe</text>

  <!-- Cute Footer Accents -->
  <text x="300" y="742" font-size="24" text-anchor="middle">🌌 🎂 ✨ 💖 ✨ 🎁</text>
  <text x="300" y="775" class="footer-sub">Open via Camera app • No install needed</text>
</svg>`;

  const cardSvgPath = path.join(__dirname, 'assets', 'images', 'bestie-qr-card.svg');
  fs.writeFileSync(cardSvgPath, cardSvg, 'utf8');
  console.log(`✓ Printable QR Card SVG saved: ${cardSvgPath}`);

  fs.writeFileSync(path.join(__dirname, 'bestie-qr-card.svg'), cardSvg, 'utf8');
  fs.copyFileSync(pngPath, path.join(__dirname, 'bestie-qr-code.png'));

  // Copy to brain artifacts
  const artifactDir = 'C:\\Users\\shivb\\.gemini\antigravity\\brain\\6d8e18bf-7e55-4f8a-851f-3791fd30762e';
  try {
    fs.writeFileSync(path.join(artifactDir, 'bestie-qr-card.svg'), cardSvg, 'utf8');
    fs.copyFileSync(pngPath, path.join(artifactDir, 'bestie-qr-code.png'));
    console.log(`✓ Copied to artifacts directory for direct viewing!`);
  } catch (e) {
    console.log(`Artifact copy note:`, e.message);
  }

  console.log(`\n🎉 Cosmic QR Cards for Manvi generated successfully!`);
}

generateAll().catch(err => console.error(err));
