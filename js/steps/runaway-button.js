/* =========================================================
   RunawayButton: the "No" that dodges, then turns into a second Yes
   ========================================================= */
class RunawayButton {
  constructor(app, mascot) {
    this.app = app;
    this.mascot = mascot;
    this.no = $("#noBtn");
    this.yes = $("#yesBtn");
    this.plead = $("#plead");
    this.dodges = 0;
    this.timer = null;
    this.pleas = [
      "Are you sure? 🥺",
      "Hmm, that button seems broken.",
      "System error: 'No' not found.",
      "Please reconsider. I already told my mom.",
      "The Yes button is getting lonely…",
      "You're breaking the system's heart 💔",
      "Okay, the No button gave up."
    ];
    this.no.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") this.dodge(); });
    this.no.addEventListener("pointerdown", e => this.dodge(e));
    this.no.addEventListener("click", e => { if (this.no.dataset.converted) app.sayYes(); else this.dodge(e); });
    this.yes.addEventListener("click", () => app.sayYes());
  }

  dodge(e) {
    const no = this.no;
    if (no.dataset.converted || no.disabled) return;
    if (e) e.preventDefault();
    this.dodges++;
    this.mascot.set("sad");
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { if (!this.app.answered) this.mascot.set("nervous"); }, 1400);
    this.plead.textContent = this.pleas[Math.min(this.dodges - 1, this.pleas.length - 1)];
    const maxScale = window.innerWidth < 420 ? 1.3 : 1.6;
    this.yes.style.transform = `scale(${Math.min(1 + this.dodges * 0.06, maxScale)})`;

    if (this.dodges >= this.pleas.length) {
      no.classList.remove("loose");
      no.style.left = no.style.top = no.style.transform = "";
      no.textContent = "Yes 💖";
      no.dataset.converted = "1";
      return;
    }
    const r = no.getBoundingClientRect();
    const pad = 16, vw = window.innerWidth, vh = window.innerHeight;
    let x, y, tries = 0;
    do {
      x = pad + Math.random() * Math.max(0, vw - r.width - pad * 2);
      y = pad + 60 + Math.random() * Math.max(0, vh - r.height - pad * 2 - 60);
      tries++;
    } while (tries < 20 && Math.hypot(x - r.left, y - r.top) < 120);
    no.classList.add("loose");
    no.style.left = x + "px";
    no.style.top = y + "px";
    no.style.transform = `scale(${Math.max(1 - this.dodges * 0.08, 0.55)})`;
  }

  finish() {
    clearTimeout(this.timer);
    this.no.classList.remove("loose");
    this.no.hidden = true;
    this.yes.disabled = true;
    this.yes.style.transform = "";
    this.yes.textContent = "Yay!!! 💖";
    this.plead.textContent = "The bear is very, very happy.";
  }
}
