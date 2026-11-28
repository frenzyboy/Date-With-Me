/* =========================================================
   CONFIG: edit content here, not in the markup
   ========================================================= */
const CONFIG = {
  // Her first name is typed by her in Section A; this is only used if she leaves it blank somehow
  HER_NAME: "Beautiful",
  // The answer to the welcome checkpoint (not case sensitive).
  // The published page never contains it: `node tools/build.mjs` swaps it for scrambled codes (NAME_LOCK).
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
    caption: "Applicant photo · Rating: 11/10 · Approved by {bear} ✔",
    taken: "Gorgeous. {Bear} needs a minute. 😍",
    shy: "{Bear} covered its eyes. No photo, no problem. 🙈 (You can still add one.)"
  },

  // Step 4: "How well do you know {me}?" — answer = index of the right option (0, 1, 2) or "any".
  // yes = shown when she's right, no = shown when she's wrong, miss = the stamp on a wrong pick.
  quiz: [
    {
      q: "What does {me} call you most of the time?",
      options: ["Tito 🧔", "Kuya 👦", "Hobby 💗", "Mader 👩", "Bakla 💅"],
      answer: 2,
      yes: "Correct, Hobby. 💗 Get used to it.",
      no: "It's Hobby! 💗 Always has been, Hobby."
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
    highWin: "{score} hearts! Okay, show-off. You caught {me}'s heart a long time ago anyway. 💘",
    // {me}'s own record, shown before she plays and compared after each round. {best} = this number
    myBest: 40,
    record: "🏆 {me}'s highest score: {best}. Can you beat it?",
    beatRecord: "🏆 NEW RECORD! You beat {me}'s {best}. He's never living this down. 😱",
    tieRecord: "🏆 You tied {me}'s record of {best}. A perfect match, obviously. 💞",
    underRecord: "🏆 {me}'s record is still {best}… for now. 😏"
  },

  activities: [
    { id: "coffee",  emo: "☕", t: "Coffee",          s: "Cozy & classic",       note: "Excellent choice. I will pretend to know about coffee." },
    { id: "icecream",emo: "🍦", t: "Ice cream",       s: "Two scoops included",
      // One message per tap, in order (it keeps cycling if she keeps trying)
      blocked: [
        "Sorry, this item is not available for you because of your asthma. {me}'s rules: your lungs come first 💗 Please choose another package.",
        "Still no ice cream. 🍦🚫 Your lungs and I had a meeting. They said no.",
        "Tapping it harder won't help. 😌 The system is very protective of you.",
        "Error 418: ice cream permanently out of stock (for you). The coffee is warm and safe ☕",
        "Okay, deal: no ice cream, but dessert on the date is 100% yours. 🍰 It's in the terms, I can't take it back."
      ] },
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
    // hour = start time used by the countdown and the calendar event (24h clock)
    { id: "morning",   emo: "☀️", t: "Morning",   s: "I'll bring the coffee",    hour: 10 },
    { id: "afternoon", emo: "🌤️", t: "Afternoon", s: "I'll bring the snacks",    hour: 15 },
    { id: "evening",   emo: "🌙", t: "Evening",   s: "I'll bring the bad jokes", hour: 18 }
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
    "The webpage made for this booking will be taken down when this agreement ends, unless extended by both parties (or extended to forever).",
    "At the applicant's discretion, this Temporary Date™ may be upgraded to a permanent one.",
    "The applicant reserves the right to smile, laugh, and enjoy the date without any expectations or obligations."
  ]
};

// Secret room: the little home page she can open after the ticket.
// {me} = MY_NAME, {name} = SECOND_NAME, {her} = her first name,
// {activity} / {date} / {time} = what she picked in the booking.
CONFIG.room = {
  title: "Welcome to the secret room 🔐",
  intro: "Only ticket holders get in here, {her}. {Bear} checked. Twice.",
  // Official notice at the top of the room
  notice: {
    title: "Official notice 📜",
    lines: [
      "This webpage was made just for you, {her}. Nobody else has the key. 🔐",
      "As stated in the Temporary Date™ Agreement, it will be taken down when the contract ends.",
      "Extension options: it can be extended if we keep dating… or extended to forever. ♾️"
    ],
    status: "Status: Active ✔ · Expires: end of contract · Extension: up to us 💗",
    stamp: "MADE FOR YOU"
  },
  dateTitle: "About our date",
  dateNote: "{activity} on {date}, {time}. I'll be there early (and slightly overdressed, as promised in the terms). You don't need to plan anything. Just bring yourself, that's the whole point. 💗",
  meTitle: "A little about me",
  meNote: "Hi, it's {me}. I'm the nervous one who built a whole booking system just to ask you out. 🙈 I like bad jokes, good food and, apparently, you. More about me coming soon… for now, ask me anything on the date.",
  sign: "— {me}",
  back: "Back to registration",

  // The sealed love letter. Tap the heart to open; each paragraph types itself out.
  // (Draft: rewrite it in your own words.)
  letterTitle: "A letter for you",
  letterHint: "Sealed. Tap the heart to open.",
  letter: [
    "Dear {her},",
    "If you're reading this, you said yes. I'm probably still smiling about it somewhere.",
    "I made this whole silly booking system because asking you normally felt too small for how much I wanted to ask. Thank you for clicking through every step, even the bear's interrogation.",
    "I can't wait to see you. Bring your appetite, your laugh, and maybe your singing voice.",
    "Yours (temporarily, for now),"
  ],
  letterSign: "{me} 💌",

  // Shown when she taps the letter or a door while another one is still opening
  oneAtATime: "One at a time 😌 Finish reading the one that's open first.",

  // The last door, at the very end of the room. Opens like `door` below.
  lastDoor: {
    title: "The last door",
    sign: "Open this one last",
    hint: "I saved the most honest one for the end.",
    // Knock-knock before it opens: the door's lines and her answers (buttons) take turns
    knock: ["Knock knock. 🚪", "Who's there?", "Real.", "Real who?", "Real-ly me. And everything I've ever told you was real. 🤍"],
    message: [
      "Hey {her} 💗",
      "I know we haven't known each other for very long. But there's one thing I want you to be sure of.",
      "Nothing I've ever told you was fake. Not one compliment. I know I turn into a bit of a fanboy when it comes to you 🙈, but every single word was real.",
      "And when I laugh with you, that's real too. I've never faked a laugh with you. You just make me laugh like that.",
      "It's only been a short time, but everything I've felt in it has been real. 🤍"
    ],
    messageSign: "— {me}"
  },

  // Prank door: the first taps only rattle it (one line each from `refusals`);
  // tap number `taps` opens it, and inside is a frog saying sorry.
  prank: {
    title: "Another door",
    sign: "You don't need to open this door",
    hint: "Really. Nothing to see here.",
    taps: 5,
    refusals: [
      "It's locked. 🔒",
      "Seriously, you don't need to open it. 😅",
      "{Bear} is holding it shut from the other side. 🐻",
      "Okay, okay… you're very persistent. One more push. 😩"
    ],
    sorry: "SORRY 🙏",
    reveal: "You opened it for… a frog. Sorry! 🐸 But you didn't give up, and honestly, that's one of my favorite things about you."
  },

  // A closed door near the bottom of the room. She doesn't have to open it;
  // if she taps it, it swings open and the message types out.
  door: {
    title: "One more door",
    sign: "You don't need to open this one",
    hint: "This room is something else.",
    // Knock-knock before it opens: the door's lines and her answers (buttons) take turns
    knock: ["Knock knock. 🚪", "Who's there?", "{me}.", "{me} who?", "{me}, who misses you every single day. 💗"],
    message: [
      "Hey {her} 💗",
      "I know we haven't had much time on our calls lately, and things don't feel quite like they used to. Those first 7 days of talking felt like our normal, and then life got in the way.",
      "My shift at work changed, so by the time I get home it's already 11pm. I don't want you to think it's because I care less, because it's the opposite.",
      "I just wanted you to know that I really miss you, every single day. I miss hearing your voice.",
      "I know we're still at the beginning, so I'm always careful not to push or overstep. I want to respect your space and go at a pace that feels right for you. But I didn't want to stay quiet about how I feel either.",
      "So here it is: I miss you, and I'm still here. If you're ever free, even for a short call, I'd love that. 🤍"
    ],
    messageSign: "— {me}"
  },

  // Countdown to the date she picked (uses the slot's hour)
  countdownTitle: "Countdown to our date",
  countdownToday: "It's today!! 💖 See you soon.",
  countdownPast: "Our first date already happened. Thank you for saying yes 💗",
  calendarBtn: "Add to calendar 📅",
  calendarTitle: "Temporary Date™ with {me} 💖",
  calendarHours: 3,

  // "Reasons I like you" flip cards. front = shown first, back = shown after a tap. (Draft: edit freely.)
  reasonsTitle: "Reasons I like you",
  reasonsHint: "Tap a card to flip it",
  reasons: [
    { front: "👀", back: "Your eyes. I forget what I was saying every single time." },
    { front: "🎤", back: "Your voice. You sing so well it's honestly unfair." },
    { front: "💗", back: "You're kind, even when nobody's watching." },
    { front: "🤍", back: "You care about people in a way that makes them feel safe." },
    { front: "📞", back: "How every \"quick call\" with you turns into hours, and I still never want it to end." },
    { front: "🍯", back: "I really like calling you \"honey\", even though I get shy every time I say it. 🙈" }
  ],
  // Extra photos for the carousel, e.g. { src: "images/us-1.jpg", caption: "…" }.
  // Her selfie from the photo booth is always shown first; with no photos at all the carousel is hidden.
  // (When publishing, add each photo to `files` too.)
  photos: []
};

// Photo sections in the secret room (js/steps/gallery.js). Captions can use {her}, {me}, {bear}.
// When publishing, every photo listed here must be in `files` too (same path).
CONFIG.room.gallery = (() => {
  const dir = "images/hannah/";
  const shots = (batch, names) => names.map(n => `${dir}${batch}/Screenshot_20261126-${n}_1.webp`);
  const wall = shots("batch 1", ["010713", "010727", "010740", "010752", "010809", "010821", "010830", "010842", "010914"]);
  const instant = shots("batch 3", ["011449", "011459", "011508", "011516"]);
  const outfits = shots("batch 2", ["011331", "011340", "011348"]);
  const [scratch] = shots("batch 4", ["011622"]);
  return {
    // 3×3 board of pinned Polaroids
    wall: {
      title: "Exhibit wall",
      hint: "Evidence that you're the cutest applicant. Tap any photo to inspect it.",
      photos: wall.map((src, i) => ({ src, caption: `Exhibit ${"ABCDEFGHI"[i]}` }))
    },
    // Blank instant photos: each one she taps develops from dark film to the photo
    instant: {
      title: "Fresh instant photos",
      hint: "Still developing… tap each one to shake it 📸",
      waiting: "Tap to develop",
      done: "All developed. {Bear} says the camera loves you. 📸",
      photos: [
        { src: instant[0], caption: "Shy mode: on 🙈" },
        { src: instant[1], caption: "Cutest passenger 🚗" },
        { src: instant[2], caption: "Window light, perfect timing" },
        { src: instant[3], caption: "11/10, no filter needed" }
      ]
    },
    // Fanned cards, each with a stamp that appears when they spread
    outfits: {
      title: "Outfit check",
      hint: "Tap the cards to spread them out.",
      hintOpen: "Security has been alerted. Tap a card to look closer.",
      photos: [
        { src: outfits[0], stamp: "10/10 OUTFIT", caption: "Outfit check: passed with honors" },
        { src: outfits[1], stamp: "DRESS CODE: EXCEEDED", caption: "The dress code was not ready for this" },
        { src: outfits[2], stamp: "TOO PRETTY ⚠️", caption: "Security alert: too pretty" }
      ]
    },
    // One photo under a scratch-card layer
    scratch: {
      title: "One last surprise",
      hint: "Scratch the card with your finger ✨",
      cover: "Scratch me ✨",
      photo: { src: scratch, caption: "Officially the prettiest applicant. {Bear} agrees. 💗" }
    }
  };
})();

// Envelope at the very start: "You have 1 new letter 💌"
CONFIG.intro = {
  title: "You have 1 new letter 💌",
  hint: "Tap the heart to open",
  letter: "Official business inside 🐻"
};

// Step 2: she names the bear. {bear} / {Bear} in any text becomes the name she picks.
CONFIG.bearName = {
  hello: "Hi! I'm your guide for today. I don't have a name yet… 🥺",
  reply: "{bear}? I LOVE it. That's me now. 🥹",
  note: "Name saved. {Bear} will walk you through the booking.",
  ideas: [
    { id: "honey",  emo: "🍯", t: "Mr. Honey",       s: "Sweet & sticky",      reply: "Mr. Honey! Sweet, like the person naming me. 🍯" },
    { id: "fluffy", emo: "☁️", t: "Sir Fluffington", s: "Very distinguished",  reply: "Sir Fluffington, at your service. 🎩" },
    { id: "junior", emo: "🧸", t: "Gabriel Jr.",     s: "Same nervous energy", reply: "Gabriel Jr.?! Okay, I AM nervous a lot. 😅" },
    { id: "boba",   emo: "🧋", t: "Boba",            s: "Short & cute",        reply: "Boba! Short, round, cute. Accurate. 🧋" }
  ]
};

// Pickup lines she rates. low = 1–2 stars, mid = 3 stars, high = 4–5 stars. {avg} = her average.
CONFIG.pickup = {
  lines: [
    { line: "Are you a phone call? Because I could listen to you for hours. 📞",
      low: "Okay, shorter calls then. 😅 (He's not agreeing to that.)", mid: "A 3? He'll call back with a better one.", high: "He's already planning a 3-hour call. 📞💖" },
    { line: "Are you a bear? Because I can't bear a single day without you. 🐻",
      low: "{Bear} is offended on behalf of all bears. 😤", mid: "{Bear} says it was un-bear-ably average.", high: "{Bear} approves. Bear-y approved. 🐻💖" },
    { line: "Your eyes are so pretty, I forgot my next pickup line.",
      low: "He really did forget it. That's on your eyes. 👀", mid: "Fair. He's still staring, though.", high: "He's still not over the eyes. 👀💖" }
  ],
  goodAvg: "Average ⭐ {avg}. {me} will never stop talking about this.",
  okAvg: "Average ⭐ {avg}. He'll keep practicing. On you.",
  badAvg: "Average ⭐ {avg}. Noted. The date will have zero pickup lines. (Probably.)"
};

// The little bear in the corner. Each reaction is [mood, text].
// Moods: nervous, sad, happy, angry, think, suspicious, shocked
CONFIG.buddy = {
  steps: ["applicant", "activity", "mood", "pickup", "schedule", "terms"],
  enter: {
    applicant: ["happy", "Psst, it's me, {bear}. I'll be down here. 👋"],
    activity:  ["think", "Ooh, I love this part. Choose wisely."],
    mood:      ["happy", "Be honest. {me} is taking notes."],
    pickup:    ["nervous", "He practiced these in the mirror. Be gentle. 😬"],
    schedule:  ["happy", "Any day works. His calendar is suspiciously empty."],
    terms:     ["suspicious", "Read the fine print. I wrote some of it. 🧐"]
  },
  activity: {
    coffee:   ["happy", "Coffee! Cozy. I'll take a cookie. ☕"],
    icecream: ["sad", "Nope. Your lungs come first. 💗"],
    sunset:   ["happy", "Golden hour! So romantic I might cry. 🥹"],
    food:     ["happy", "Street food?! I'm drooling. 🤤"],
    movie:    ["happy", "Movie night! I'm guarding the popcorn. 🍿"],
    surprise: ["shocked", "A SURPRISE?! He doesn't even have a plan yet!! 😱"]
  },
  slots: {
    morning:   ["happy", "Morning date! Fresh and early. ☀️"],
    afternoon: ["happy", "Afternoon. Snacks confirmed. 🌤️"],
    evening:   ["happy", "Evening. Stars and bad jokes. 🌙"]
  },
  misc: {
    date:    ["happy", "Saved! I'll circle it in my calendar. 📅"],
    moodMax: ["shocked", "Maximum?! Bold. I respect it."],
    moodMin: ["think", "Low-key. Also good."],
    cutest:  ["suspicious", "You can't uncheck that. I tried too."],
    noBack:  ["angry", "There's no going back! Only forward! 😤"],
    agree:   ["happy", "Agreed! Now sign it, officially. ✍️"],
    signed:  ["happy", "Beautiful signature. Very official. 🖋️"]
  }
};

// "Start over" button (under the ticket and in the secret room). It needs a second tap to confirm,
// then clears everything saved in her browser and starts again from the envelope.
CONFIG.restart = {
  button: "Start over 🔄",
  confirm: "Tap again to clear everything 🔄",
  wait: 4000   // ms before the button goes back to normal if she doesn't tap again
};

// Tap any bear 10 times quickly and this appears
CONFIG.easterEgg = {
  taps: 10,
  // Each time she finds it, the next secret shows (then it starts over)
  secrets: [
    { title: "You found the secret! 🤫",
      text: "{me} wanted you to know: he smiles every time he thinks about you. That's it. That's the secret. 💗" },
    { title: "You found another secret! 🤫",
      text: "Secret #2: the best part of {me}'s day is the call with you. Even when it's already 11pm. 📞" },
    { title: "Secret #3 unlocked 🔓",
      text: "{me} practiced the pickup lines. Out loud. More than once. 😳" },
    { title: "Secret #4 unlocked 🔓",
      text: "{Bear} isn't really a security guard. He just wanted to meet you. 🐻" },
    { title: "That's all of them! 💗",
      text: "There are no more secrets. Just {me}, liking you a lot. (You can stop tapping the bear now, he's getting dizzy. 😵‍💫)" }
  ]
};

// "Send to {me}" button under the ticket. Set enabled: false to hide it.
// On phones it opens the share sheet with the ticket image (WhatsApp, Messenger, …).
// Elsewhere it opens WhatsApp with a message. whatsapp = your number with country code
// (e.g. "63912…") to send it straight to you, or "" to let her pick the chat.
CONFIG.share = {
  enabled: false,
  whatsapp: "",
  button: "Send it to {me} 💬",
  text: "It's a date! 💖 Ticket {ticket}: {activity} on {date}. — {her}",
  done: "Sent! {me} is probably screaming right now 📱",
  fallback: "Opening WhatsApp… (download the ticket above to send the picture too)"
};

// TESTING ONLY: true = show the portrait right under the first card so it's easy to check.
// Set back to false before sending the link to her.
const PREVIEW_PORTRAIT = false;
