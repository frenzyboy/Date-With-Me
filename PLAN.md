# Plan: "Temporary Date Booking" page

## Context
The repo `WebLover` started out empty. The goal is one shareable web page, with no login, that asks a girl out without asking her directly. It works like a silly, official-looking "booking a temporary date" process, and the real question only comes out at the end. The tone is playful and romantic.

## Concept: "Temporary Date Reservation System™"
It's styled as an over-the-top bureaucratic booking wizard, with soft pink and cream colors, a hand-drawn feel and small hearts. She goes through it step by step, with a progress bar that says "Processing your reservation…".

1. **Welcome / "Ticket"**: "Congratulations! You've been selected for a *Temporary Date™* (trial version, no commitment, 100% refundable in smiles)." Button: "Start booking".
2. **Applicant verification**: "Applicant: HER_NAME ✔ verified. Requested by: MY_NAME (nervous)". There's a silly checkbox: "I confirm I am the cutest applicant today" (it's pre-checked and can't be unchecked).
3. **Pick the activity**: Cards to choose from, like coffee ☕, ice cream 🍦, a walk at sunset 🌅, street food 🌮 or "surprise me 🎁". Each card shows a silly caption when picked.
4. **Pick a date & time**: A date picker plus time slots such as "Morning (I'll bring coffee)" and "Evening (I'll bring jokes)".
5. **Terms & Conditions**: A scrollable list of funny-romantic clauses. She has to tick "I agree" to continue.
6. **Final confirmation, the reveal**: "One last question before we finalize your reservation…" and then **"So… will you go on this date with me? 💌"**
   - **Yes** button → a confetti and hearts animation, plus a "Booking Confirmed" ticket.
   - **No** button → it runs away from the cursor or tap, and each attempt it shrinks while the Yes button grows. Captions cycle.
7. **Ticket screen**: "Take a screenshot and send it to me 📸". It fits on one phone screen. No contact info is stored in the page.

## Implementation
- **A single self-contained file** `index.html` with inline CSS and JS and no build step or dependencies.
- Steps are `<section>`s, and only one is visible at a time. A small JS state object stores her choices.
- Confetti and hearts are drawn on a hand-written canvas, with no libraries.
- Mobile-first layout. The runaway "No" button handles both touch and mouse.
- Google Fonts is the only external request, with system fonts as the fallback.
- A `CONFIG` block at the top of the script holds `HER_NAME` and `MY_NAME` (placeholders) and the list of activities.

## Sharing
Publish it as a claude.ai artifact (private). You get the link and share it with her yourself. Once you fill in the names, republish to the same link.

## Verification
- Open `index.html` in a browser and click through every step on desktop and in mobile emulation.
- Check that the No button runs away on both hover and tap, that Yes triggers the confetti, and that the ticket shows the choices she entered.
- Check that the ticket fits on one phone screen for the screenshot.
