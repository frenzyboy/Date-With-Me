# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single shareable web page, the "Temporary Date Reservation System™". It's a playful step-by-step booking wizard that ends by asking someone out on a date. There's no login or backend. See [PLAN.md](PLAN.md) for the original concept and [PLAN-V2.md](PLAN-V2.md) for the checkpoint/pacing redesign and optional ideas.

## Layout

```
index.html            head tags + page markup only; links the CSS and JS below
css/
  base.css            theme tokens, reset, card, typography, buttons, fields, pacing helpers, music button
  steps.css           step-specific styles: checkpoint, tiles, terms, final question, ticket
  bear.css            the bear's mood toggles and animations
  responsive.css      phone tweaks and reduced motion
js/                   plain scripts (not modules), loaded in the order index.html lists them
  config.js           CONFIG: all names, texts, activities, dates, terms, speed — edit content here
  lyrics.js           lyrics used by the selfie portrait
  core/               helpers, Pacer, Mascot (bear SVG), Wizard, MusicPlayer, Downloads, Confetti
  steps/              NameGate (1), ApplicantForm (2), PhotoBooth (3), Quiz (4), ChoiceTiles (5, 7),
                      MoodSliders (6), HeartGame (8), SignaturePad (9), FinalQuestion + RunawayButton (10)
  render/             PortraitRenderer, TicketRenderer (canvas images)
  app.js              App: creates everything and connects the pieces; `const app` is global for testing
tools/build.mjs       joins everything into dist/index.html
BMusic/               background song
```

## Working on it

- Open `index.html` directly in a browser to test; no server needed. Add `?speed=0.3` to the URL to click through faster.
- The JS files share one global scope, so a file can only use classes/consts from files loaded before it. When adding a file, add its `<script>` tag in `index.html` in the right order.
- Keep `index.html` free of `<html>`/`<head>`/`<body>` tags: the artifact publish step wraps the page.

## Publishing

Artifact pages must have CSS and JS inline, so publish the built file, not `index.html`:

1. `node tools/build.mjs` → `dist/index.html` (gitignored)
2. Publish `dist/index.html` to the existing artifact URL, with `BMusic/…mp3` in `files` (already stored on the artifact) and the `downloads` capability.

## How it works

- Each step is a `<section data-step="N" data-key="…">`: gate, applicant, photo, quiz, activity, mood, schedule, game, terms, final, then ticket. Every section except the last (the ticket) counts toward progress (`Wizard.total`, currently 10). Code refers to steps by `data-key`, so adding or reordering steps only means renumbering `data-step`. On first visit a step's children fade in one by one and headings type out (`Pacer.reveal`). `CONFIG.speed` scales every wait.
- Bear moods are CSS-driven: every face part has class `f` plus `on-<mood>`, and `Mascot.set(mood)` swaps the class on the `<svg>`. Moods: nervous, sad, happy, angry, think, suspicious, shocked, bouncer, camera, covered.
- The ticket image (`TicketRenderer`) grows with its rows and includes her Polaroid selfie and signature when present.
- Step 1: the bouncer bear checks her second name (`CONFIG.SECOND_NAME`): thinking scan → angry on wrong, "almost" on 1–2 letters off, hint after 3 misses → two "are you sure?" checks → happy, then the welcome notice.
- Step 10 (final) runs fake processing, a "needs a moment to be brave" pause, then types the question in two parts. The No button dodges (`position: fixed` at random spots) and turns into a second Yes after enough tries.
