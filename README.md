# 🎂 Bestie Birthday Surprise - Personal Digital Experience ✨

A romantic-but-not-cheesy, emotionally resonant, aesthetic, and mobile-first interactive birthday surprise website made specially for your best friend.

Designed to be gifted via a **scannable QR code** (e.g. inside a birthday card, gift box, or message).

---

## 🌸 Key Features

1. **Mobile-First Aesthetic**: Tailored for phone screens with soft pastel pink/purple gradients, frosted glassmorphism, and floating canvas hearts & sparkles.
2. **Cinematic Landing & Intro**:
   - *"Hey Bestie... ❤️"* landing screen with a glowing *"Open Your Surprise ✨"* button.
   - Cinematic line-by-line quote reveal leading to the celebration.
3. **Interactive Birthday Cake & Candles**:
   - Layered pastel birthday cake with 3 flickering candles.
   - Tap/click candles to blow them out with a realistic smoke curl & air puff sound.
   - Triggers celebratory confetti cannons and joy chimes!
4. **"Our Little Memories" Polaroid Gallery**:
   - Interactive polaroids with photos, dates, tags, and story captions.
5. **Heartfelt Letter Section**:
   - Wax-sealed letter card with a gentle typewriter-style text reveal as she scrolls.
6. **The Grand Surprise**:
   - *"There's one more thing... 👀"* button revealing a 3D beating glowing heart and an upward fountain stream of hearts.
7. **Romantic Music Player**:
   - Floating *"🎵 Play Our Song"* pill with animated dancing equalizer bars.
   - Plays audio seamlessly and includes an ambient romantic piano synthesizer fallback.
8. **Built-in QR Code Generator & Studio**:
   - Generates high-contrast, rounded scannable QR cards with *"Scan Me ❤️"*.
   - One-click high-resolution PNG download ready to print or gift!

---

## 🛠️ How to Customize Everything (Single File!)

Open **`config.js`** in any text editor. Everything is clearly labeled:

```javascript
window.SURPRISE_CONFIG = {
  // 1. Change names & dates
  bestieName: "Alex",          // Your bestie's name or nickname
  senderName: "Your Bestie",   // Your name

  // 2. Add your song
  // Place an mp3 file in assets/audio/our-song.mp3 or paste an online URL
  music: {
    title: "Our Song",
    src: "assets/audio/our-song.mp3"
  },

  // 3. Add photos & memories
  memories: [
    {
      title: "That one unforgettable day ❤️",
      date: "July 14, 2024",
      caption: "When we laughed until we couldn't breathe!",
      image: "assets/images/my-photo1.jpg", // replace with your photo
      tag: "Unforgettable ✨"
    },
    ...
  ],

  // 4. Customize the letter & final words
  letter: {
    heading: "A Little Something I Wanted To Say...",
    paragraphs: [ ... ]
  }
};
```

---

## 🚀 How to Deploy in 2 Minutes (Free)

To let your bestie open this on her phone, deploy the site online:

### Option A: Netlify Drop (Easiest - 60 seconds, no terminal needed)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this whole folder (`bestie-birthday-surprise`) onto the browser window.
3. Done! Netlify gives you a live link like `https://sweet-birthday-surprise.netlify.app`.

### Option B: Vercel
1. Install Vercel CLI or import the folder via [vercel.com](https://vercel.com).
2. Run `npx vercel` in this folder.

### Option C: GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings** > **Pages** > Select `main` branch > **Save**.

---

## 📱 How to Generate the Printable QR Code

1. Once your website is deployed, copy its live link (e.g., `https://sweet-birthday-surprise.netlify.app`).
2. Open `qr-generator.html` in your browser (or click the **📱** button in the website header).
3. Paste your live link into the box.
4. Click **"Download Printable QR Card (PNG) 💌"**.
5. Print the card or slip it into her birthday gift! When she points her phone camera at it, the surprise starts!

---

## 💻 Local Preview
To test locally right now:
```bash
npx serve
```
or open `index.html` directly in your browser.
