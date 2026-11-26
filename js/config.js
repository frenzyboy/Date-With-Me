/* =========================================================
   CONFIG: edit content here, not in the markup
   ========================================================= */
const CONFIG = {
  // Her first name is typed by her in Section A; this is only used if she leaves it blank somehow
  HER_NAME: "Beautiful",
  // The answer to the welcome checkpoint (not case sensitive)
  SECOND_NAME: "Christina",
  MY_NAME: "Gabriel",
  // Pace of the whole page: 1 = normal, 1.5 = slower, 0.7 = faster.
  // For testing you can also add ?speed=0.2 to the link.
  speed: 1,

  // Welcome checkpoint lines. {me} = MY_NAME, {name} = SECOND_NAME, {letter} = its first letter
  gate: {
    hello: "Halt! ✋ Who goes there?",
    empty: "Name first, please. I can't check an empty box. 🐻",
    thinking: "Wait a minute… I need to check this one. 🤔",
    log: ["Checking the guest list", "Comparing with {me}'s heart", "Running cuteness scan"],
    drumroll: "Drumroll… 🥁",
    wrong: [
      "You're not the girl I'm looking for 😤",
      "ACCESS DENIED. The bear is not impressed. 😠",
      "Hmm… suspicious. Try again, mystery girl. 🕵️"
    ],
    hint: "Okay, okay, here's a hint: it starts with “{letter}”… 🤫",
    close: "Sooo close… check the spelling 👀",
    sure1: "{name}? …Are you sure? 🤨",
    sniff: "*sniff sniff* 👃",
    sure2: "Hmm… REALLY sure? 🧐 Because the real {name} is very cute. Impostors get sent home. 🐻",
    retry: "Take your time. I'm patient. Mostly. 🕶️",
    lastScan: "Fine… one last scan…",
    shocked: "…!!! 😳",
    welcome: "IT'S REALLY YOU! Hi {name}, my favorite person 💖 {me} has been waiting for you."
  },

  // Step 3: photo booth
  booth: {
    caption: "Applicant photo · Rating: 11/10 · Approved by the bear ✔",
    taken: "Gorgeous. The bear needs a minute. 😍",
    shy: "The bear covered its eyes. No photo, no problem. 🙈 (You can still add one.)"
  },

  // Step 4: "How well do you know {me}?" — answer = index of the right option (0, 1, 2) or "any".
  // yes = shown when she's right, no = shown when she's wrong, miss = the stamp on a wrong pick.
  quiz: [
    {
      q: "What does {me} call you most of the time?",
      options: ["Bro 🤝", "Hey you 👋", "Honey 🍯"],
      answer: 2,
      yes: "Correct, honey. 🍯 Get used to it.",
      no: "It's Honey! 🍯 Always has been, honey."
    },
    {
      q: "Which part of your face does {me} like the most?",
      options: ["Your nose 👃", "Your eyes 👀", "Your angry eyebrows 😤"],
      answer: 1,
      yes: "Your eyes. 👀 Every time he looks at them, he forgets what he was saying.",
      no: "It's your eyes. 👀 He forgets his own words when he looks at them."
    },
    {
      q: "What would {me} play on repeat all day?",
      options: ["Rain sounds 🌧️", "You singing 🎤", "His own jokes 🤡"],
      answer: 1,
      yes: "Your voice. 🎶 You sing so good, it's honestly unfair.",
      no: "It's you singing! 🎤 Your voice is his favorite song."
    },
    {
      q: "Why does {me} think you're so special?",
      options: ["You're kind 💗", "You're caring 🤍", "Both. Obviously. ✨"],
      answer: 2,
      miss: "ALMOST 💗",
      yes: "Kind AND caring. That's rare, honey. 💗",
      no: "Not wrong… but it's both. Kind AND caring. That's rare, honey. 💗"
    },
    {
      q: "Fill in the blank: {me} is ___ lucky to know you.",
      options: ["A little 🤏", "Very 🙌", "Ridiculously 🍀"],
      answer: "any",
      yes: "Trick question: all correct. He's all of them. 🍀"
    }
  ],
  quizResult: {
    percent: 300,
    text: "The system is shocked. {me} is not surprised. 💞",
    score: "You got {score} of {total} right. The rest he'll explain on the date."
  },

  // Step 6: sliders. Each stop has its own reply from {me}. Every slider is also shown on the ticket.
  moods: [
    {
      id: "hunger", label: "Hunger level",
      stops: ["🥨 A little snack", "🍟 Snack & a drink", "🍔 A proper meal", "🍕 Two meals", "🍽️ I will eat the menu"],
      replies: [
        "Just a snack? I'll bring backup snacks anyway.",
        "Snack & a drink. Classic.",
        "A proper meal. Excellent decision.",
        "Two meals. Respect. 🫡",
        "Noted: maximum hunger. {me}'s wallet is preparing itself. 💸"
      ]
    },
    {
      id: "laugh", label: "Laugh level",
      stops: ["🙂 Polite smile", "😄 Giggles", "😂 Real laughs", "🤣 Can't breathe", "🐷 Snort-laughing allowed"],
      replies: [
        "A polite smile… challenge accepted. 😏",
        "Giggles. I can work with that.",
        "Real laughs. My bad jokes are ready.",
        "Can't breathe?! I'll bring water.",
        "Snort-laughing allowed. Cutest sound anyway."
      ]
    },
    {
      id: "talk", label: "Talk level",
      stops: ["🤫 Quiet & cozy", "💬 Easy chat", "🗣️ Lots of stories", "📢 Non-stop stories", "🎤 Karaoke mode"],
      replies: [
        "Quiet & cozy. Comfortable silence is nice too.",
        "Easy chat. Perfect.",
        "Lots of stories. I'm all ears. 👂",
        "Non-stop stories. I want to hear every one.",
        "Karaoke mode?! Yes please. You know I love your voice. 🎤"
      ]
    }
  ],

  // Step 8: catch-the-hearts mini-game. {score} = hearts caught, {me} = MY_NAME
  game: {
    seconds: 10,
    hearts: ["❤️", "💖", "💗", "💕", "💘"],
    honey: "🍯", honeyChance: 0.12, honeyPoints: 5,
    intro: "Tap the hearts as they fall. 🍯 honey jars are worth 5!",
    badge: "💘 Official Heart Catcher",
    lowScore: 8,
    lowWin: "Only {score}? Doesn't matter. You caught the one that counts: {me}'s. 💘",
    highWin: "{score} hearts! Okay, show-off. You caught {me}'s heart a long time ago anyway. 💘"
  },

  activities: [
    { id: "coffee",  emo: "☕", t: "Coffee",          s: "Cozy & classic",       note: "Excellent choice. I will pretend to know about coffee." },
    { id: "icecream",emo: "🍦", t: "Ice cream",       s: "Two scoops included",
      blocked: "Sorry, this item is not available for you because of your asthma. Gabriel's rules: your lungs come first 💗 Please choose another package." },
    { id: "sunset",  emo: "🌅", t: "Sunset walk",     s: "Golden hour views",    note: "Romantic. Comfortable shoes recommended." },
    { id: "food",    emo: "🌮", t: "Street food",     s: "Tasting tour",         note: "Great taste. Napkins are on me." },
    { id: "movie",   emo: "🍿", t: "Movie",           s: "You pick the film",    note: "You pick the movie. I hold the popcorn. Deal." },
    { id: "surprise",emo: "🎁", t: "Surprise me",     s: "Trust the process",    note: "Risky. I like it. Planning has already begun." }
  ],
  // Only these dates can be picked (YYYY-MM-DD)
  dates: [
    { id: "2026-12-24", emo: "🎄", s: "Christmas Eve" },
    { id: "2026-12-25", emo: "🎁", s: "Christmas Day" },
    { id: "2026-12-30", emo: "✨", s: "Almost New Year" }
  ],
  slots: [
    { id: "morning",   emo: "☀️", t: "Morning",   s: "I'll bring the coffee" },
    { id: "afternoon", emo: "🌤️", t: "Afternoon", s: "I'll bring the snacks" },
    { id: "evening",   emo: "🌙", t: "Evening",   s: "I'll bring the bad jokes" }
  ],
  terms: [
    "This Temporary Date™ is valid for one (1) outing and may be extended without prior notice.",
    "The applicant agrees to be laughed *with*, never *at*.",
    "Food can be shared, but dessert is 100% yours. No negotiations.",
    "The requester promises to arrive on time and slightly overdressed.",
    "Awkward silences will be filled with bad jokes. Complaints may be filed in the form of eye-rolls.",
    "Photos are allowed. Unflattering photos must be deleted immediately upon request. Taking photos together is optional, unless the applicant happens to want one.",
    "Holding hands is optional and subject to the applicant's approval at any time.",
    "Phones are allowed, but friendly reminder: the person across the table is way more interesting than your feed. (Food pictures are exempt.)",
    "The requester promises to make sure the applicant gets home safe and sound.",
    "At the applicant's discretion, this Temporary Date™ may be upgraded to a permanent one.",
    "The applicant reserves the right to smile, laugh, and enjoy the date without any expectations or obligations."
  ]
};

// TESTING ONLY: true = show the portrait right under the first card so it's easy to check.
// Set back to false before sending the link to her.
const PREVIEW_PORTRAIT = false;
