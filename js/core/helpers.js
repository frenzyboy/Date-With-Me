/* =========================================================
   Small helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DOTS = '<span class="dots" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>';
const fill = text => text
  .replaceAll("{me}", CONFIG.MY_NAME)
  .replaceAll("{name}", CONFIG.SECOND_NAME)
  .replaceAll("{letter}", CONFIG.SECOND_NAME.charAt(0).toUpperCase());
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
const fmtDate = (iso, opts) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
const fileSafe = s => s.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
const normalizeName = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
function editDistance(a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]; d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}
