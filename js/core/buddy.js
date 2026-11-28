/* =========================================================
   Buddy: the small bear in the bottom-left corner.
   Walks with her through the steps that don't have their own bear,
   and reacts to her choices with a short speech bubble.
   Lines live in CONFIG.buddy.
   ========================================================= */
class Buddy {
  constructor(app) {
    this.app = app;
    this.el = $("#buddy");
    this.bubble = $("#buddyBubble");
    this.tag = $("#buddyName");
    this.mascot = new Mascot($("#buddyBear"), "nervous");
    this.timer = null;
  }

  // Shown on the steps listed in CONFIG.buddy.steps
  enter(key) {
    const on = CONFIG.buddy.steps.includes(key);
    this.el.hidden = !on;
    document.body.classList.toggle("has-buddy", on);
    this.tag.textContent = RUNTIME.bearName || "";
    this.tag.hidden = !RUNTIME.bearName;
    if (!on) return;
    const line = CONFIG.buddy.enter[key];
    this.mascot.set("nervous");
    if (line) setTimeout(() => this.say(line[1], line[0]), 900 * this.app.pacer.speed);
  }

  // mood: a bear mood, text: what it says (gets {me}/{bear}/… filled in)
  say(text, mood = "happy", ms = 3600) {
    if (this.el.hidden) return;
    this.mascot.set(mood);
    this.bubble.textContent = fill(text);
    this.bubble.hidden = false;
    restart(this.bubble, "pop");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { this.bubble.hidden = true; this.mascot.set("nervous"); }, ms * Math.max(this.app.pacer.speed, 0.5));
  }

  // say a reaction from CONFIG.buddy[group][id], e.g. react("activity", "food")
  react(group, id) {
    const r = CONFIG.buddy[group] && CONFIG.buddy[group][id];
    if (r) this.say(r[1], r[0]);
  }
}
