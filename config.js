/**
 * ====================================================================
 * 🎂 BESTIE BIRTHDAY SURPRISE - CONFIGURATION FILE
 * ====================================================================
 * You can customize everything here! Replace names, dates, memories,
 * photos, and heartfelt words to make this unique for your bestie.
 */

window.SURPRISE_CONFIG = {
  // 🌟 NAMES & BASIC INFO
  bestieName: "Bestie",         // Change to your bestie's real name or nickname (e.g., "Sarah", "Alex", "Chloe")
  senderName: "Your Bestie",     // Change to your name (e.g., "Emma", "Sam")
  birthdayDate: "Special Day ✨", // e.g. "October 14th" or "Today!"

  // 🎵 BACKGROUND MUSIC
  // Put your favorite mp3 inside assets/audio/ and name it "our-song.mp3", or provide any URL!
  // If no audio file is provided, an elegant romantic ambient lofi synth plays automatically!
  music: {
    title: "Our Favorite Melody",
    artist: "Special Acoustic & Piano",
    src: "assets/audio/our-song.mp3", // path or URL to your audio file
    autoSynthFallback: true           // plays soft soothing piano chimes if mp3 is missing
  },

  // 🎬 INTRO CINEMATIC LINES (Appears one by one with smooth fade/slide)
  introLines: [
    "Some people enter your life...",
    "and somehow become a very special part of it. ❤️",
    "You're one of those people."
  ],

  // 🎂 BIRTHDAY & CAKE SECTION
  birthdayHeader: {
    subtitle: "To the person who makes ordinary days a little more special...",
    blowInstruction: "Tap the candles to blow them out & make a wish! 🕯️✨",
    candlesBlownText: "Wish granted! 🎉 May all your dreams come true!"
  },

  // 📸 MEMORIES SECTION ("Our Little Memories")
  // Add as many memory cards as you want!
  // Images can be placed in assets/images/ or be online URLs (Unsplash, Imgur, etc.)
  memories: [
    {
      title: "That one unforgettable day ❤️",
      date: "A day to remember",
      caption: "We got completely lost, laughed until our stomachs ached, and somehow made the best memory out of complete chaos.",
      image: "assets/images/memory1.svg",
      tag: "Pure Joy ✨",
      rotation: -2 // aesthetic tilt angle in degrees
    },
    {
      title: "That stupid conversation we still laugh about 😂",
      date: "Late night talks",
      caption: "It started as a 5-minute check-in and turned into a 3-hour marathon of ridiculous inside jokes and deep life thoughts.",
      image: "assets/images/memory2.svg",
      tag: "Core Memory 🌙",
      rotation: 1.5
    },
    {
      title: "One of my favorite memories with you ✨",
      date: "The golden hour",
      caption: "No big plans, just good coffee, comfortable silence, and having each other's back through everything.",
      image: "assets/images/memory3.svg",
      tag: "Always & Forever ☕",
      rotation: -1
    },
    {
      title: "Through every high and low 🌸",
      date: "Every single day",
      caption: "Whenever things felt heavy, one text from you was always enough to make the world feel lighter again.",
      image: "assets/images/memory4.svg",
      tag: "Unconditional 💖",
      rotation: 2
    }
  ],

  // 💌 HEARTFELT LETTER
  // This renders like an intimate handwritten letter with a gentle typewriter reveal.
  letter: {
    heading: "A Little Something I Wanted To Say...",
    paragraphs: [
      "You've become one of those people whose presence just makes things feel better.",
      "Thank you for all the laughs, the random conversations, the stupid jokes, the unforgettable memories, and simply for being you.",
      "I don't know what the future holds, but I genuinely hope there are many more memories, laughs and crazy moments waiting for us.",
      "Happy Birthday, Bestie. ❤️",
      "You deserve all the happiness in the world."
    ]
  },

  // 💖 THE INTERACTIVE SURPRISE
  // Triggered when she taps "There's one more thing..."
  interactiveSurprise: {
    teaserTitle: "But wait... 👀",
    buttonText: "There's one more thing...",
    insideHeart: "You are genuinely one of my favorite people. ❤️",
    subText: "Never change the person you are."
  },

  // 🎬 FINAL SCREEN
  finalScreen: {
    title: "Happy Birthday,",
    lines: [
      "Keep smiling.",
      "Keep being amazing.",
      "And keep making memories. ✨"
    ],
    signOff: "— From your bestie ❤️",
    replayButton: "Replay Surprise ↻"
  },

  // 📱 QR CODE SETTINGS
  qr: {
    cardTitle: "A Surprise For You",
    scanText: "Scan Me ❤️",
    subText: "Made with love for your special day"
  }
};
