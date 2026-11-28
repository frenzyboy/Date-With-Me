/* =========================================================
   BearName: step 2, she gives the bear a name.
   The name is used for the rest of the page ({bear} / {Bear} in texts).
   Ideas and replies live in CONFIG.bearName.
   ========================================================= */
class BearName {
  constructor(app) {
    this.app = app;
    this.cfg = CONFIG.bearName;
    this.input = $("#bearNameInput");
    this.bubble = $("#bearNameBubble");
    this.next = $("#bearNameNext");
    this.mascot = new Mascot($("#bearNameBear"), "nervous");
    this.bubble.textContent = fill(this.cfg.hello);
    this.tiles = new ChoiceTiles($("#bearNames"), this.cfg.ideas, {
      onPick: it => { this.input.value = it.t; this.apply(it.t, it.reply); }
    });
    this.input.addEventListener("input", () => {
      $$("#bearNames .tile").forEach(t => t.setAttribute("aria-pressed", "false"));
      this.apply(this.input.value);
    });
    this.input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !this.next.disabled) { e.preventDefault(); app.wizard.next(this.next); }
    });
  }

  apply(raw, reply) {
    const name = raw.trim().replace(/\s+/g, " ").slice(0, 20);
    RUNTIME.bearName = name;
    this.next.disabled = !name;
    if (!name) {
      this.mascot.set("nervous");
      this.bubble.textContent = fill(this.cfg.hello);
      return;
    }
    this.mascot.set("happy");
    this.bubble.textContent = fill(reply || this.cfg.reply);
    restart(this.bubble, "pop");
    $("#bearNameNote").textContent = fill(this.cfg.note);
  }

  // Used when restoring progress
  set(name) { if (name) { this.input.value = name; this.apply(name); } }
}
