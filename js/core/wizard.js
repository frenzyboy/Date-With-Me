/* =========================================================
   Wizard: shows one step at a time and updates the progress bar
   Every <section data-step> counts toward progress except the last one (the ticket).
   Steps are told apart by data-key ("gate", "quiz", "final", …) so renumbering is safe.
   ========================================================= */
class Wizard {
  constructor(app) {
    this.app = app;
    this.total = $$("section[data-step]").length - 1;
    this.current = 0;
    this.visited = new Set();
    this.busy = false;
    $$("[data-next]").forEach(b => b.addEventListener("click", () => this.next(b)));
    $$("[data-back]").forEach(b => b.addEventListener("click", () => this.go(this.current - 1)));
  }

  section(n) { return $(`section[data-step="${n}"]`); }
  stepOf(key) { return Number($(`section[data-key="${key}"]`).dataset.step); }

  // Forward buttons show a short "Saving…" pause so it never feels rushed
  async next(btn) {
    if (btn.disabled || this.busy) return;
    this.busy = true;
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add("saving");
    btn.innerHTML = (btn.dataset.saving || "Saving") + DOTS;
    await this.app.pacer.wait(800);
    btn.innerHTML = label;
    btn.classList.remove("saving");
    btn.disabled = false;
    this.busy = false;
    this.go(this.current + 1);
  }

  go(n) {
    $$("section[data-step]").forEach(s => { s.hidden = Number(s.dataset.step) !== n; s.classList.remove("enter"); });
    const sec = this.section(n), key = sec.dataset.key;
    void sec.offsetWidth; sec.classList.add("enter");
    this.current = n;
    const done = n > this.total, shown = Math.min(n, this.total);
    $("#fill").style.width = (done ? 100 : ((shown - 1) / this.total) * 100 + 100 / this.total / 2) + "%";
    $("#stepLabel").textContent = done ? "Complete" : `Step ${shown} of ${this.total} · ${sec.dataset.name}`;
    $("#stepStatus").textContent = done ? "Reservation confirmed ✔" : "Processing your reservation…";
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    const fresh = !this.visited.has(n);
    this.visited.add(n);
    this.app.onEnter(key, sec, fresh);
    const h = $$("h1, h2", sec).find(h => !h.hidden && !h.closest("[hidden]"));
    if (h && key !== "final") h.focus({ preventScroll: true });
  }
}
