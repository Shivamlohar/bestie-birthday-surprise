const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const targetUrl = 'https://shivamlohar.github.io/bestie-birthday-surprise/';
const bestieName = 'Manvi';
const birthdayDate = '27 September';

async function generateHeartQR() {
  console.log(`Generating Heart Shaped QR for: ${targetUrl}`);

  // Create QR code with Highest Error Correction (H = 30% recovery)
  const qr = QRCode.create(targetUrl, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size; // e.g. 41
  const cellSize = 8;
  const qrPixelSize = size * cellSize; // e.g. 328px

  // Center coordinates for QR inside 700x750 canvas
  const canvasW = 720;
  const canvasH = 750;
  const qrOffsetX = (canvasW - qrPixelSize) / 2;
  const qrOffsetY = 190;

  // Build SVG circles / rounded modules for the QR matrix
  let qrModulesSvg = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isDark = qr.modules.get(r, c);
      if (!isDark) continue;

      const x = qrOffsetX + c * cellSize;
      const y = qrOffsetY + r * cellSize;

      // Check if this cell is inside any of the 3 Finder Patterns (7x7 corners)
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= size - 7;
      const isBottomLeft = r >= size - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        // Keep corner eyes crisp & rounded for 100% phone camera scannability
        qrModulesSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#b80d48" rx="2"/>\n`;
      } else {
        // Aesthetic circular / pill dots for body modules
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        const radius = cellSize * 0.46;
        qrModulesSvg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#d63062"/>\n`;
      }
    }
  }

  // Smooth heart path for the card background
  // Bounding box centered at (360, 360), width ~680, height ~660
  // Standard parametric / bezier heart formula:
  const heartPath = `
    M 360 690
    C 210 560, 40 430, 40 270
    C 40 140, 140 60, 260 60
    C 315 60, 345 95, 360 125
    C 375 95, 405 60, 460 60
    C 580 60, 680 140, 680 270
    C 680 430, 510 560, 360 690
    Z
  `;

  const innerHeartBorder = `
    M 360 665
    C 220 540, 60 415, 60 270
    C 60 155, 150 80, 260 80
    C 310 80, 345 110, 360 140
    C 375 110, 410 80, 460 80
    C 570 80, 660 155, 660 270
    C 660 415, 500 540, 360 665
    Z
  `;

  // Construct complete Heart QR SVG
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasW} ${canvasH}" width="${canvasW}" height="${canvasH}">
  <defs>
    <!-- Soft Dreamy Glow & Drop Shadow -->
    <filter id="heartShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#ff4757" flood-opacity="0.38"/>
    </filter>

    <radialGradient id="heartBgGrad" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#fff5f7"/>
      <stop offset="100%" stop-color="#ffe4ea"/>
    </radialGradient>

    <linearGradient id="heartRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b81"/>
      <stop offset="50%" stop-color="#ff4757"/>
      <stop offset="100%" stop-color="#ee5253"/>
    </linearGradient>

    <linearGradient id="centerHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff758c"/>
      <stop offset="100%" stop-color="#ff4757"/>
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&amp;family=Plus+Jakarta+Sans:wght@600;700&amp;display=swap');
      .heart-header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: bold; fill: #a31545; text-anchor: middle; }
      .heart-header-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; font-weight: 600; fill: #d63062; text-anchor: middle; letter-spacing: 0.5px; }
      .scan-me-banner-text { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: bold; fill: #ffffff; text-anchor: middle; }
      .scan-me-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; fill: #7d5366; text-anchor: middle; }
    </style>
  </defs>

  <!-- Dark Cosmic Background to make Heart POP -->
  <rect width="${canvasW}" height="${canvasH}" fill="#070614"/>

  <!-- Ambient Sparkling Stars in Background -->
  <g fill="#ffd32a" opacity="0.8">
    <circle cx="80" cy="90" r="2.5"/>
    <circle cx="640" cy="110" r="3"/>
    <circle cx="60" cy="500" r="2"/>
    <circle cx="650" cy="540" r="2.5"/>
    <text x="70" y="240" font-size="22">✨</text>
    <text x="630" y="250" font-size="22">✨</text>
    <text x="120" y="650" font-size="18">⭐</text>
    <text x="580" y="660" font-size="18">⭐</text>
  </g>

  <!-- OUTER GLOWING HEART SHAPE -->
  <path d="${heartPath}" fill="url(#heartBgGrad)" filter="url(#heartShadow)"/>
  
  <!-- Romantic Inner Border -->
  <path d="${innerHeartBorder}" fill="none" stroke="#ffb8c6" stroke-width="2" stroke-dasharray="6,4"/>

  <!-- Header Text inside upper heart lobes -->
  <text x="360" y="130" class="heart-header-title">For My Bestie ${bestieName} ❤️</text>
  <text x="360" y="156" class="heart-header-sub">A Little Universe Made For You • ${birthdayDate} ✨</text>

  <!-- Clean QR Matrix Container (Crisp White Backplate for 100% Reliable Scanning) -->
  <rect x="${qrOffsetX - 12}" y="${qrOffsetY - 12}" width="${qrPixelSize + 24}" height="${qrPixelSize + 24}" rx="18" fill="#ffffff" stroke="#ffe0e6" stroke-width="1.5"/>

  <!-- All QR Code Modules (Dark Rose Dots & Finder Eyes) -->
  <g>
    ${qrModulesSvg}
  </g>

  <!-- Center Heart Emblem (30% Error Correction absorbs this effortlessly) -->
  <g transform="translate(360, ${qrOffsetY + qrPixelSize / 2})">
    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#ff758c" stroke-width="3"/>
    <path d="M 0 -8 C -4 -16, -16 -16, -16 -6 C -16 4, 0 16, 0 16 C 0 16, 16 4, 16 -6 C 16 -16, 4 -16, 0 -8 Z" fill="url(#centerHeartGrad)"/>
  </g>

  <!-- Romantic "Scan Me ❤️" Banner Ribbon near bottom tip -->
  <g transform="translate(360, 568)">
    <rect x="-130" y="-22" width="260" height="44" rx="22" fill="url(#heartRibbonGrad)" filter="drop-shadow(0 4px 12px rgba(238,82,83,0.4))"/>
    <text x="0" y="9" class="scan-me-banner-text">Scan Me ❤️</text>
  </g>

  <!-- Instruction Subtext -->
  <text x="360" y="622" class="scan-me-sub">Point phone camera here to open Manvi's universe</text>
  <text x="360" y="648" font-size="18" text-anchor="middle">🎂 🐾 ✨ 💖 ✨ 🎁</text>
</svg>`;

  const svgOutputPath = path.join(__dirname, 'assets', 'images', 'manvi-heart-qr.svg');
  fs.writeFileSync(svgOutputPath, svgContent, 'utf8');
  console.log(`✓ Heart-shaped QR SVG saved: ${svgOutputPath}`);

  // Also write to root for convenient 1-click access
  fs.writeFileSync(path.join(__dirname, 'manvi-heart-qr.svg'), svgContent, 'utf8');

  // Copy to brain artifacts
  const artifactDir = 'C:\\Users\\shivb\\.gemini\\antigravity\\brain\\6d8e18bf-7e55-4f8a-851f-3791fd30762e';
  fs.writeFileSync(path.join(artifactDir, 'manvi-heart-qr.svg'), svgContent, 'utf8');
  console.log(`✓ Copied to artifacts directory for direct inline rendering!`);

  console.log(`\n🎉 Heart-Shaped QR Code created successfully!`);
}

generateHeartQR().catch(err => console.error(err));
