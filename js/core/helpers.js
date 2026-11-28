/* =========================================================
   Small helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DOTS = '<span class="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>';
// Names known only while the page runs: her second name (after the bear checks it) and the bear's name
const RUNTIME = { secondName: "", bearName: "" };
// {me} = MY_NAME, {name} = her second name, {letter} = its first letter, {bear}/{Bear} = the bear's name
const fill = text => text
  .replaceAll("{me}", CONFIG.MY_NAME)
  .replaceAll("{name}", RUNTIME.secondName || "you")
  .replaceAll("{letter}", (CONFIG.NAME_LOCK && CONFIG.NAME_LOCK.letter) || "")
  .replaceAll("{bear}", RUNTIME.bearName || "the bear")
  .replaceAll("{Bear}", RUNTIME.bearName || "The bear");
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
const fmtDate = (iso, opts) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
const fileSafe = s => s.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
