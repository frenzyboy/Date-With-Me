# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single shareable web page, the "Temporary Date Reservation System™". It's a playful step-by-step booking wizard that ends by asking someone out on a date. There's no login or backend. See [PLAN.md](PLAN.md) for the original concept, [PLAN-V2.md](PLAN-V2.md) for the checkpoint/pacing redesign and extras, and [PLAN-V3.md](PLAN-V3.md) for the 10-step booking.

## Layout

```
index.html            head tags + page markup only; links the CSS and JS below
css/
  base.css            theme tokens, reset, card, typography, buttons, fields, pacing helpers, music button
  steps.css           step-specific styles: checkpoint, tiles, terms, final question, ticket, secret room
  bear.css            the bear's mood toggles, extras (rain, plead) and animations
  extras.css          envelope, intro, corner bear, easter egg, pickup stars, share button, room letter/countdown/flip cards/door
  gallery.css         secret room photo sections (wall, instant photos, outfit fan, scratch card) and the big photo viewer
  responsive.css      phone tweaks and reduced motion
js/                   plain scripts (not modules), loaded in the order index.html lists them
  config.js           CONFIG: all names, texts, activities, dates, terms, speed — edit content here
  lyrics.js           lyrics used by the selfie portrait
  core/               name-lock (hashed name check), helpers, Pacer, Mascot (bear SVG), Wizard, MusicPlayer,
                      Downloads, Confetti, Sfx, Progress, Buddy (corner bear), EasterEgg, Share
  steps/              Intro (envelope), NameGate (1), BearName (2), ApplicantForm (3), PhotoBooth (4), Quiz (5),
                      ChoiceTiles (6, 9), MoodSliders (7), PickupLines (8), HeartGame (10), SignaturePad (11),
                      FinalQuestion + RunawayButton (12), Gallery + Lightbox (room photos), SecretRoom (after the ticket)
  render/             PortraitRenderer, TicketRenderer (canvas images)
  app.js              App: creates everything, connects the pieces, saves/restores progress; `const app` is global for testing
tools/build.mjs       joins everything into dist/index.html and hides her second name
BMusic/               background song
images/hannah/        her photos in 4 batch folders, used by CONFIG.room.gallery
```

## Working on it

- Open `index.html` directly in a browser to test; no server needed. Add `?speed=0.3` to the URL to click through faster.
- Progress is saved in the browser (localStorage), so a reload continues where you left off. Add `?reset=1` to start fresh.
- The JS files share one global scope, so a file can only use classes/consts from files loaded before it. When adding a file, add its `<script>` tag in `index.html` in the right order.
- Keep `index.html` free of `<html>`/`<head>`/`<body>` tags: the artifact publish step wraps the page.
- Don't write her second name anywhere except `CONFIG.SECOND_NAME`: the build fails if it appears elsewhere in the output as a whole word, spelled exactly as in the config.

## Publishing

Artifact pages must have CSS and JS inline, so publish the built file, not `index.html`:

1. `node tools/build.mjs` → `dist/index.html` (gitignored). It replaces `SECOND_NAME` with `NAME_LOCK` hashes.
2. Publish `dist/index.html` to the existing artifact URL, with `BMusic/…mp3` and every photo in `CONFIG.room.gallery` in `files` (same paths; already stored on the artifact, so only new or changed photos need sending) and the `downloads` capability.

### Cloudflare Pages (the public link)

`node tools/build.mjs` also copies `BMusic/` and `images/` into `dist/` and writes `dist/_headers` (asks search engines not to list the page). Deploy the whole `dist/` folder: direct upload in the Cloudflare dashboard, or `npx wrangler pages deploy dist`. If Pages builds from the GitHub repo instead, set the build command to `node tools/build.mjs` and the output directory to `dist`. Never serve the repo root: `js/config.js` has her second name in plain text.

## How it works

- Each step is a `<section data-step="N" data-key="…">`: gate, bearname, applicant, photo, quiz, activity, mood, pickup, schedule, game, terms, final, then ticket. Every section except the last (the ticket) counts toward progress (`Wizard.total`, currently 12). Code refers to steps by `data-key`, so adding or reordering steps only means renumbering `data-step`. On first visit a step's children fade in one by one and headings type out (`Pacer.reveal`). `CONFIG.speed` scales every wait.
- Texts go through `fill()`: `{me}`, `{name}` (her second name, known only after the gate), `{letter}`, `{bear}`/`{Bear}` (the name she gives the bear, from `RUNTIME`).
- Bear moods are CSS-driven: every face part has class `f` plus `on-<mood>`, and `Mascot.set(mood, extra)` swaps the class on the `<svg>`. Moods: nervous, sad, happy, angry, think, suspicious, shocked, bouncer, camera, covered. Extras: `rain` (cloud), `plead` ("please" sign).
- Every visit opens with a sealed envelope (`Intro`) until she has passed the gate; the gate starts after she taps it. Tapping the title at the top ("Temporary Date Reservation System™") 5 times quickly replays the envelope without touching her progress.
- Step 1: the bouncer bear checks her second name with `NameLock` (hashes of the name and of it with up to 2 letters removed): thinking scan → angry on wrong, "almost" when close, hint after 3 misses → two "are you sure?" checks → happy, then the welcome notice.
- The corner bear (`Buddy`, `CONFIG.buddy`) shows on steps without their own bear and reacts to her picks.
- Step 12 (final) runs fake processing, a "needs a moment to be brave" pause, then types the question in two parts. The No button dodges (`position: fixed` at random spots), the bear gets sadder (rain at 3 tries, sign at 5), and No turns into a second Yes after enough tries.
- The ticket image (`TicketRenderer`) grows with its rows and includes her Polaroid selfie and signature when present. A "Send it to {me}" button (`Share`, `CONFIG.share`, currently turned off with `enabled: false`) shares the ticket image or opens WhatsApp.
- The secret room (`#room`, `SecretRoom`) opens from a button under the ticket. It is not a `data-step` section, so it does not count in `Wizard.total`. It has the sealed love letter, a countdown + .ics calendar file, the photo carousel, "reasons I like you" flip cards, notes, a prank door that only opens after 5 taps (a frog saying sorry, `CONFIG.room.prank`), and a door marked "you don't need to open this one" that opens to a more personal message (`CONFIG.room.door`), and "the last door" at the very end with another message (`CONFIG.room.lastDoor`); texts in `CONFIG.room`. After she has said yes, a reload opens the room directly. "Back to registration" returns to the ticket.
- A "Start over" button (`.js-restart`, `CONFIG.restart`) under the ticket and in the secret room needs a second tap, then clears saved progress and reloads from the envelope.
- In the secret room the letter and doors open one at a time (`SecretRoom.oneAtATime`); the two message doors play a knock-knock joke first (`knock` in `CONFIG.room.door` / `lastDoor`), with her answers as buttons.
- Tapping any bear 10 times quickly opens the `EasterEgg` message.
- `Progress` saves a snapshot from `App.collect()` after every interaction; `App.restore()` puts it back and goes to the saved step.
