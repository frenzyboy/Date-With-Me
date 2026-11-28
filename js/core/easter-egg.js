/* =========================================================
   EasterEgg: tap any bear 10 times in a row and a hidden message appears.
   Text lives in CONFIG.easterEgg.
   ========================================================= */
class EasterEgg {
  constructor(app) {
    this.app = app;
    this.count = 0;
    this.last = 0;
    this.modal = $("#egg");
    this.mascot = new Mascot($("#eggBear"), "happy");
    document.addEventListener("click", e => {
      if (e.target.closest(".bear-wrap, #buddyBear")) this.tap(e.target.closest(".bear-wrap, #buddyBear"));
    });
    $("#eggClose").addEventListener("click", () => this.close());
    this.modal.addEventListener("click", e => { if (e.target === this.modal) this.close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !this.modal.hidden) this.close(); });
  }

  tap(el) {
    const now = Date.now();
    this.count = now - this.last < 1500 ? this.count + 1 : 1;   // taps must come close together
    this.last = now;
    restart(el, "boop");
    this.app.sfx.blip();
    if (this.count >= CONFIG.easterEgg.taps) { this.count = 0; this.open(); }
  }

  open() {
    // Next secret each time she finds it, starting over after the last one
    const list = CONFIG.easterEgg.secrets;
    this.found = (this.found || 0) + 1;
    const s = list[(this.found - 1) % list.length];
    $("#eggTitle").textContent = fill(s.title);
    $("#eggText").textContent = fill(s.text);
    this.modal.hidden = false;
    this.app.confetti.burst(50);
    this.app.sfx.chime();
    $("#eggClose").focus();
  }
  close() { this.modal.hidden = true; }
}
