> **Status (2026-11-26):** Part 1 is built — slower pacing, security checkpoint with the bouncer bear (answer: Christina, hint "C"), angry/think/suspicious/shocked bear moods, class-based code, review fixes. Hashing the answer is done too. Part 2: everything is built except "Know when she says Yes". A "secret room" home page after the ticket was added later (not from this plan).

# Plan v2: slower, sillier, better organized

Tick the boxes you want. Anything left unticked won't be built.

---

## Part 1 – Core changes (what you asked for)

### 1. Slow it down so it doesn't feel rushed
Only the emotional moments get slower. The boring form steps stay quick, so she doesn't get bored.

- [x] **Typewriter text:** headings type out letter by letter (about 40 ms per letter), and buttons fade in only after the text finishes.
- [x] **Slower card change:** a 0.45s slide becomes about 0.8s, plus a short "Saving your answer…" pause (about 0.7s) between steps.
- [x] **Slower processing (step 6):** each line takes about 1.5s instead of 0.65s, with animated dots ("Calculating chemistry . . .").
- [x] **New "nervous pause" screen before the big question:** "Hold on… Gabriel needs a moment to be brave 😳". The bear takes a deep breath (about 3s).
- [x] **The question appears in two parts:** "So, [name]…", a 1.5s pause, then "will you go on this date with me? 💌".
- [x] **Longer celebration before the ticket:** about 2.2s becomes about 4s, so she can enjoy the happy bear.
- [x] **One place to adjust speed:** `CONFIG.speed = 1` (try 1.5 for slower or 0.7 for faster), so you can tune everything with one number.

### 2. New silly welcome page: "Security checkpoint"
The bear becomes a bouncer, with sunglasses and an "OFFICIAL" badge, guarding the page.

**Notice at the top (red stamp style):**
> ⚠️ **RESTRICTED AREA**
> This page is for **ONE lucky girl only**: the one Gabriel loves.
> Unauthorized girls will be politely escorted out by the bear. 🐻

**Then:**
> "To continue, please enter your **second name**."
> `[ type here ]`  `[ Verify me ]`

**Correct answer:** `Christina` (set in `CONFIG.SECOND_NAME`)

#### Step A: the bouncer thinks (every time, right or wrong, about 2.5s)
She taps **Verify me**. The input locks and the bear goes into "analyzing" mode:
- It pulls out a 🔍 magnifying glass, its eyes look left and right, and a thought bubble appears with dots that fill in one by one.
- The speech bubble says: **"Wait a minute… I need to check this one. 🤔"**
- A scan line sweeps across her typed name, and small mono-font lines tick by:
  - `Checking the guest list…`
  - `Comparing with Gabriel's heart…`
  - `Running cuteness scan…`
- It ends with a short drumroll pause (about 0.5s), and then the result appears.

#### Step B1: wrong name → the bear gets ANGRY 😤
A red **✖ DENIED** stamp slams onto the card, the card shakes, and the bear turns red, with steam from its ears and stomping feet. The messages rotate:
1. "You're not the girl I'm looking for 😤"
2. "ACCESS DENIED. The bear is not impressed."
3. "Hmm… suspicious. Try again, mystery girl."
4. "Okay, okay, here's a hint: it starts with **C**…" *(appears after 3 wrong tries, so she never gets stuck)*

**Almost right** (e.g. "Cristina", "Christine", or 1 to 2 letters off): the bear doesn't get angry, it squints instead. **"Sooo close… check the spelling 👀"**

After about 2s the bear calms down and she can type again.

#### Step B2: right name → "Are you sure?" (twice)
The bear doesn't believe it right away:

**1st check: raised eyebrow 🤨**
> "Christina? …Are you sure?"
> `[ Yes, I'm sure ]`  `[ Let me fix it ]`

**2nd check: full suspicion 🧐.** The bear leans in close, squints, and moves the magnifying glass over her selfie or name. It sniffs.
> "Hmm… REALLY sure? Because the real Christina is *very* cute.
> Impostors get sent home. 🐻"
> `[ 100% sure! ]`  `[ Okay, let me check again ]`

*"Let me fix it" / "check again" just unlocks the input. No anger.*

**Final scan (about 1.5s):** "Fine… one last scan…", then the bear's eyes go wide 😳.

#### Step C: accepted → the bear gets HAPPY 🥰
A green **✔ VERIFIED** stamp lands. The bear takes off its sunglasses, hops and throws hearts:
> "IT'S REALLY YOU! Hi Christina, my favorite person 💖
> Gabriel has been waiting for you."
> `[ Start booking ]`

#### Matching rules
- Uppercase, lowercase and extra spaces are all OK (`christina`, ` CHRISTINA `).
- Also accepted if she types it with other names (`Maria Christina`).
- 1 to 2 letters off counts as "almost": a friendly nudge, not anger.
- All the waits use `CONFIG.speed`, so you can make them slower or faster.

> ⚠️ Note: anyone who opens the page's source code could see the answer. That's fine for a joke. If you want, it can be stored scrambled (hashed) instead. Tick here: [x] *(done: the build swaps the name for hashes)*

### 3. The angry / happy "GIF"
Pick **one**:
- [x] **A (recommended): animated bear (already in the page) with a new "angry" mood.** No files to download, it loads instantly, works offline and matches the style. Moods: nervous → angry → happy → sad.
- [ ] **B: real GIF files.** *(not chosen, went with A)* You put e.g. `images/angry.gif` and `images/happy.gif` in the folder (from Tenor/Giphy, or your own). The page swaps between them. Keep each GIF under about 2 MB so it loads fast on mobile data.

### 4. Organize the code with simple classes (OOP)
It stays **one file** (`index.html`), split into clear sections and small classes:

| Class | Job |
|---|---|
| `App` | starts everything and connects the pieces |
| `Wizard` | shows one step at a time and updates the progress bar |
| `Pacer` | all the waits and typewriter effects (uses `CONFIG.speed`) |
| `Mascot` | the bear and its moods (nervous / angry / happy / sad) |
| `NameGate` | the welcome checkpoint (second-name check) |
| `ChoiceTiles` | activity / date / time tiles |
| `RunawayButton` | the "No" button that escapes |
| `MusicPlayer` | background music and the mute button |
| `TicketRenderer` | draws the downloadable ticket PNG |
| `PortraitRenderer` | draws the lyrics portrait from her selfie |
| `Confetti` | confetti and hearts |

Honest note: the file won't get much *shorter* (the features are the same), but each thing will be in **one named place**, so it's easy to find and change.
- [x] Optional: split the JS into separate files (`js/mascot.js` etc.). It's cleaner, but it's no longer a single file.

### 5. Fixes from the review (small, included for free)
- Music starts on the first tap on phones (adds `click`/`touchend`).
- Downloaded portrait is high resolution (about 2000px), not tied to screen size.
- Remove duplicate CSS and stale comments.
- Update `CLAUDE.md` to match.

---

## Part 2 – Extra ideas (optional, tick what you like)

**Before the booking**
- [x] **Envelope intro:** "You have 1 new letter 💌". She taps it, the envelope opens and the checkpoint comes out. It sets a slow, sweet mood.
- [x] **"How well do you know Gabriel?" mini quiz:** *(built in Plan v3 as step 4, with 5 real questions about her)* 3 silly questions where every answer is "correct" ("What's Gabriel's favorite thing? a) food b) sleep c) YOU ✔").

**During the booking**
- [x] **The bear walks with her through every step** (small, in the corner), reacting to her choices (drools at street food, gets scared at "Surprise me").
- [x] **More dramatic "No":** each try, the bear gets sadder, then small rain clouds appear 🌧️, then the bear holds a "please 🥺" sign.
- [x] **Small sound effects** (pop on tiles, stamp "thunk" on APPROVED). They follow the mute button.

**After she says Yes**
- [x] **A short love letter** *(in the secret room, sealed in an envelope)* that types itself out under the ticket (you write the text in `CONFIG`).
- [x] **Countdown:** "Our date is in 27 days, 4 hours 💖".
- [x] **Add to calendar button:** downloads a calendar event for the chosen date and time.
- [x] **Share button:** *(optional: CONFIG.share.enabled, WhatsApp number optional)* sends the ticket image straight to Messenger/WhatsApp from her phone.
- [x] **"Reasons I like you" flip cards:** tap to flip, 5 to 10 cards you write.
- [ ] **Know when she says Yes:** on claude.ai the page can save her answer so you can check it (no need to wait for the screenshot). *Only works when hosted on claude.ai.*

**Small but nice**
- [x] **Remember progress:** if she accidentally refreshes, she continues where she left off.
- [x] **Secret easter egg:** tap the bear 10 times and a hidden message appears.

---

## Questions for you
1. ~~"Second name"~~ ✔ **Christina**
2. ~~**Hint letter**~~ ✔ yes, "starts with C" after 3 wrong tries
3. ~~**GIF**~~ ✔ option A, the animated bear
4. For the love letter and flip cards, will you write the text, or should I draft it for you to edit?
5. ~~**Her first name**~~ ✔ step 2 asks her to type it

## Build order
1. Reorganize into classes, with no visible change (safe base).
2. Pacing (`Pacer`, `CONFIG.speed`).
3. Welcome checkpoint, angry/happy bear.
4. Review fixes.
5. Whichever extra ideas you ticked.

## How we test
- Click through every step on a phone and on desktop.
- Type a wrong second name: the bear gets angry, messages rotate and the hint shows after 3 tries.
- Type the right one in different casing or with spaces: it's accepted and the bear is happy.
- Time the whole flow: aim for about 3 to 4 minutes, so it feels calm, not rushed.
- Check that music starts on the first tap on a phone.
