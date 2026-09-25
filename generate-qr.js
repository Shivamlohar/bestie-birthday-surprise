const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Read config if available
let config = { bestieName: 'Bestie' };
try {
  const configText = fs.readFileSync(path.join(__dirname, 'config.js'), 'utf8');
  const match = configText.match(/bestieName:\s*["']([^"']+)["']/);
  if (match) config.bestieName = match[1];
} catch (e) {}

// Get target URL from command line argument or default
const targetUrl = process.argv[2] || 'https://my-bestie-birthday-surprise.vercel.app';
const bestieName = process.argv[3] || config.bestieName || 'Bestie';

async function generateAll() {
  console.log(`Generating QR Code for: ${targetUrl} (Bestie: ${bestieName})`);

  // 1. Generate standalone high-res PNG (600x600)
  const pngPath = path.join(__dirname, 'assets', 'images', 'bestie-qr-code.png');
  await QRCode.toFile(pngPath, targetUrl, {
    width: 600,
    margin: 2,
    color: {
      dark: '#3e204a',
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
      dark: '#3e204a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  // Extract inner SVG content (rects / paths)
  const svgContentMatch = qrSvgRaw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const qrInnerSvg = svgContentMatch ? svgContentMatch[1] : qrSvgRaw;
  const viewBoxMatch = qrSvgRaw.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 37 37';

  // 3. Create full aesthetic Printable Polaroid Card SVG (600x820)
  const cardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 820" width="600" height="820">
  <defs>
    <!-- Soft background card gradient / shadow -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#cca8c0" flood-opacity="0.35"/>
    </filter>

    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fed6e3"/>
      <stop offset="50%" stop-color="#fbc2eb"/>
      <stop offset="100%" stop-color="#a6c1ee"/>
    </linearGradient>

    <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff758c"/>
      <stop offset="100%" stop-color="#ff4757"/>
    </linearGradient>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Plus+Jakarta+Sans:wght@500;600;700&amp;display=swap');
      .banner-title { font-family: 'Playfair Display', Georgia, serif; font-size: 30px; font-weight: bold; fill: #3e204a; text-anchor: middle; }
      .banner-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 500; fill: #6d4b68; text-anchor: middle; }
      .scan-title { font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-weight: bold; fill: #ff4757; text-anchor: middle; }
      .scan-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 600; fill: #7d6b85; text-anchor: middle; }
      .footer-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #a595aa; text-anchor: middle; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="600" height="820" fill="#fdf4f7"/>

  <!-- Printable Polaroid White Card with Shadow -->
  <rect x="25" y="25" width="550" height="770" rx="32" fill="#ffffff" filter="url(#cardShadow)"/>
  <rect x="25" y="25" width="550" height="770" rx="32" fill="none" stroke="#fce4ec" stroke-width="2"/>

  <!-- Top Pastel Banner -->
  <path d="M 25 57 Q 25 25, 57 25 L 543 25 Q 575 25, 575 57 L 575 160 L 25 160 Z" fill="url(#bannerGrad)"/>

  <!-- Floating cute decorative hearts on banner -->
  <path d="M 90 70 C 85 58, 65 58, 65 72 C 65 85, 90 100, 90 100 C 90 100, 115 85, 115 72 C 115 58, 95 58, 90 70 Z" fill="#ffffff" opacity="0.65"/>
  <path d="M 510 65 C 505 53, 485 53, 485 67 C 485 80, 510 95, 510 95 C 510 95, 535 80, 535 67 C 535 53, 515 53, 510 65 Z" fill="#ffffff" opacity="0.65"/>

  <!-- Banner Text -->
  <text x="300" y="85" class="banner-title">For My Bestie ${bestieName} ✨</text>
  <text x="300" y="122" class="banner-sub">A digital birthday surprise made just for you</text>

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

  <!-- Center Heart Emblem (Small, non-intrusive on scannability due to Error Correction H) -->
  <g transform="translate(300, 400)">
    <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#ff758c" stroke-width="3"/>
    <path d="M 0 -8 C -4 -16, -16 -16, -16 -6 C -16 4, 0 16, 0 16 C 0 16, 16 4, 16 -6 C 16 -16, 4 -16, 0 -8 Z" fill="url(#heartGrad)"/>
  </g>

  <!-- "Scan Me ❤️" Text -->
  <text x="300" y="655" class="scan-title">Scan Me ❤️</text>
  <text x="300" y="695" class="scan-sub">Point your phone camera here to open your surprise</text>

  <!-- Cute Footer Accents -->
  <text x="300" y="742" font-size="24" text-anchor="middle">🎂 ✨ 💖 ✨ 🎁</text>
  <text x="300" y="775" class="footer-sub">Open via Camera app • No install needed</text>
</svg>`;

  const cardSvgPath = path.join(__dirname, 'assets', 'images', 'bestie-qr-card.svg');
  fs.writeFileSync(cardSvgPath, cardSvg, 'utf8');
  console.log(`✓ Printable QR Card SVG saved: ${cardSvgPath}`);

  // Also copy to root for quick access
  fs.writeFileSync(path.join(__dirname, 'bestie-qr-card.svg'), cardSvg, 'utf8');
  fs.copyFileSync(pngPath, path.join(__dirname, 'bestie-qr-code.png'));

  // Also copy to artifact dir so user can preview it directly
  const artifactDir = 'C:\\Users\\shivb\\.gemini\\antigravity\\brain\\6d8e18bf-7e55-4f8a-851f-3791fd30762e';
  try {
    fs.writeFileSync(path.join(artifactDir, 'bestie-qr-card.svg'), cardSvg, 'utf8');
    fs.copyFileSync(pngPath, path.join(artifactDir, 'bestie-qr-code.png'));
    console.log(`✓ Copied to artifacts directory for direct viewing!`);
  } catch (e) {
    console.log(`Note on copying to artifacts:`, e.message);
  }

  console.log(`\n🎉 All QR Codes generated successfully!`);
}

generateAll().catch(err => console.error(err));
