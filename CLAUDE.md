# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single shareable web page, the "Temporary Date Reservation System™". It's a playful step-by-step booking wizard that ends by asking someone out on a date. There's no login, backend or build step. See [PLAN.md](PLAN.md) for the concept and the steps.

## Structure

- `index.html` is the whole app: inline CSS and JS, with Google Fonts as the only external request. Open it directly in a browser to test.
- The file is published as a claude.ai artifact, so it has no `<html>`/`<head>`/`<body>` tags because the publish step wraps the content. Keep it that way.
- Names, activities, time slots and terms all live in the `CONFIG` object at the top of the `<script>`. Edit content there, not in the markup. `.js-her` / `.js-me` elements are filled from `CONFIG`.
- Each step is a `<section data-step="N">`. `go(n)` shows one at a time and updates the progress bar. Steps 1–6 count toward progress, and step 7 is the confirmation ticket.
- Step 6 runs a fake "processing" sequence, then shows the Yes/No question. The No button dodges (it becomes `position: fixed` at random spots) and turns into a second Yes after enough tries.
