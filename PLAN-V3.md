> **Status (2026-11-26):** Built: all 4 new steps (photo booth, quiz with his own questions about her, mood sliders, dress code — later replaced by the catch-the-hearts game), signature pad, and the new ticket rows with her Polaroid and signature. The "other ideas" are not built.

# Plan v3: the 10-step booking

Today the booking has **6 steps** and then the ticket. This plan grows it to **10 steps** and then the ticket.
Tick the boxes you want. Nothing is built until you say "go".

---

## The new flow at a glance

| # | Step | Status | Main gag |
|---|---|---|---|
| 1 | Security checkpoint | ✅ built | Bouncer bear checks her second name |
| 2 | Applicant details | ✅ built | Un-uncheckable "cutest" box, locked Back button |
| 3 | **Photo booth** | 🆕 | Selfie with camera flash and a bear photographer |
| 4 | **Compatibility quiz** | 🆕 | 3 questions about Gabriel, and every answer is "correct" |
| 5 | Choose your package | ✅ built | Ice cream blocked because of asthma |
| 6 | **Mood & snacks** | 🆕 | Silly sliders: hunger level, laugh level |
| 7 | Scheduling | ✅ built | Date and time slot |
| 8 | **Dress code** | 🆕 | She picks what Gabriel has to wear |
| 9 | Terms & signature | ✅ built + 🆕 | Sign with your finger |
| 10 | The big question | ✅ built | Brave pause, runaway No |
| — | Ticket | ✅ built (updated) | Shows all her new answers |

The progress bar changes to "Step 3 of 10 · Photo booth", and so on.

---

## The 4 new steps (plus one upgrade)

### Step 3 – Photo booth 📸
The selfie moves out of step 2 into its own step, so it feels like a moment instead of a form field.
- [ ] The bear holds an old camera and says *"Say cheese! 🧀"*.
- [ ] When she adds the photo: a white **flash**, a click sound (if music is on) and a Polaroid frame that drops in with her photo.
- [ ] A caption under the photo: *"Applicant photo · Rating: 11/10 · Approved by the bear"*.
- [ ] Skipping is allowed ("I'm shy 🙈"), and then the bear covers its eyes.

### Step 4 – Compatibility quiz 💞
*"How well do you know Gabriel?"* Three questions, one at a time. **Every answer is correct.**
- [ ] Q1: "What is Gabriel's favorite thing?" a) Food 🍔 b) Sleep 😴 c) **You** 💖
- [ ] Q2: "What will Gabriel do if you're late?" a) Wait b) Wait patiently c) Wait and smile like an idiot
- [ ] Q3: "Gabriel's dancing skills are…" a) Bad b) Very bad c) Let's not talk about it
- [ ] Each answer gets a ✔ CORRECT stamp, and the bear claps.
- [ ] Score at the end: **"300% compatible. The system is shocked."** with the bear in its shocked face.

*You can edit the questions and answers in `CONFIG.quiz`.*

### Step 6 – Mood & snacks 🍿
Two or three silly sliders she drags:
- [ ] **Hunger level:** "A little snack" → "I will eat the menu". The label and emoji change as she drags.
- [ ] **Laugh level:** "Polite smile" → "Snort-laughing allowed".
- [ ] **Talk level:** "Quiet & cozy" → "Non-stop stories".
- [ ] Gabriel's reply changes with the values: *"Noted: maximum hunger. Wallet is preparing itself."*

### Step 8 – Dress code 👔
She chooses **what Gabriel must wear**, a fun reversal.
- [ ] Tiles: "Smart & neat 👔", "Cozy hoodie 🧥", "Matching colors 🎨", "Surprise me 🎲".
- [ ] For "Matching colors", she also picks a color, and the ticket says "Dress code: matching pink 💗".
- [ ] The bear shows the outfit: a tiny tie, hoodie or color on the bear SVG.

### Step 9 – Terms & signature ✍️ (upgrade)
- [ ] After ticking "I agree", she **signs with her finger** on a small signature pad.
- [ ] The signature is printed on the downloadable ticket image (in the "Agreed & signed by" line).
- [ ] The "Clear" button says "Oops, let me sign prettier".

### Ticket updates 🎟️
- [ ] New ticket rows: **Dress code**, **Hunger level**, **Compatibility: 300%**.
- [ ] Her Polaroid selfie and her signature on the downloadable ticket image.

---

## Other ideas that could replace one of the new steps
Pick one if you like it more than one of the above:
- [ ] **Pickup line rating:** Gabriel shows 3 cheesy pickup lines and she rates each 1–5 ⭐. Low scores make the bear sad.
- [ ] **Name the bear:** she gives the bear a name, and the bear uses it for the rest of the page.
- [ ] **Catch the hearts mini-game:** 10 seconds to catch falling hearts. She "wins" no matter what.
- [ ] **Secret question:** "What did Gabriel say the first time you met?" with a free-text answer and no right answer, shown on the ticket.
- [ ] **Love letter envelope:** a sealed envelope she taps to open, with a short letter you write.

---

## Timing check
The new steps add about **1.5–2 minutes**. The whole page will take about **5–6 minutes**.
- [ ] Keep the current pace.
- [ ] Make the new steps a bit quicker (shorter typewriter and reveal) so 10 steps doesn't feel long.

---

## How it fits the code
Each new step gets its own file, the same way the others are organized:
```
js/steps/photo-booth.js
js/steps/quiz.js
js/steps/mood-sliders.js
js/steps/dress-code.js
js/steps/signature-pad.js
```
New texts go into `js/config.js` (`quiz`, `moods`, `dressCode`). The ticket renderer gets the new rows.
`Wizard.total` changes from 6 to 10.

---

## Questions for you
1. Do you want all 4 new steps, or should I replace one with an idea from the "other ideas" list?
2. Will you write the quiz questions yourself, or should I use the ones above?
3. Is it OK to move the selfie into its own Photo booth step?
4. Signature pad: yes or no?
