/* =========================================================
   PickupLines: she rates {me}'s cheesy pickup lines, 1 to 5 stars each.
   Low scores make the bear sad, high scores make it happy.
   Lines and replies live in CONFIG.pickup.
   ========================================================= */
class PickupLines {
  constructor(app) {
    this.app = app;
    this.cfg = CONFIG.pickup;
    this.ratings = this.cfg.lines.map(() => 0);
    this.note = $("#pickupNote");
    this.next = $("#pickupNext");
    this.cfg.lines.forEach((l, i) => $("#pickups").appendChild(this.card(l, i)));
  }

  card(l, i) {
    const box = document.createElement("div");
    box.className = "pickup";
    box.innerHTML = `<p class="pickup-line"></p><div class="stars" role="radiogroup"></div>`;
    $(".pickup-line", box).textContent = `“${fill(l.line)}”`;
    const stars = $(".stars", box);
    stars.setAttribute("aria-label", `Rate line ${i + 1}`);
    for (let r = 1; r <= 5; r++) {
      const b = Object.assign(document.createElement("button"), { type: "button", className: "star", textContent: "★" });
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", "false");
      b.setAttribute("aria-label", `${r} star${r > 1 ? "s" : ""}`);
      b.addEventListener("click", () => this.rate(i, r));
      stars.appendChild(b);
    }
    return box;
  }

  rate(i, r, quiet = false) {
    this.ratings[i] = r;
    const stars = $$(".stars", $("#pickups"))[i];
    $$(".star", stars).forEach((s, k) => {
      s.classList.toggle("on", k < r);
      s.setAttribute("aria-checked", String(k + 1 === r));
    });
    if (!quiet) {
      restart(stars, "bump");
      const l = this.cfg.lines[i];
      const [mood, text] = r <= 2 ? ["sad", l.low] : r === 3 ? ["think", l.mid] : ["happy", l.high];
      this.note.textContent = fill(text);
      this.app.buddy.say(text, mood);
    }
    const done = this.ratings.every(Boolean);
    this.next.disabled = !done;
    this.app.state.pickups = [...this.ratings];
    if (done && !quiet) {
      const avg = this.average();
      setTimeout(() => {
        this.note.textContent = fill(avg >= 4 ? this.cfg.goodAvg : avg >= 2.5 ? this.cfg.okAvg : this.cfg.badAvg).replace("{avg}", avg.toFixed(1));
      }, 1800 * this.app.pacer.speed);
    }
  }

  average() {
    const r = this.ratings.filter(Boolean);
    return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0;
  }

  // Text for the ticket, e.g. "⭐ 4.3 / 5"
  label() { return this.ratings.every(Boolean) ? `⭐ ${this.average().toFixed(1)} / 5` : "⭐ Not rated"; }

  restore(list) { (list || []).forEach((r, i) => { if (r && i < this.ratings.length) this.rate(i, r, true); }); }
}
