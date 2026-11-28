/* =========================================================
   NameGate: step 1, the bouncer checks her second name
   ========================================================= */
class NameGate {
  constructor(app) {
    this.app = app;
    this.sec = $('section[data-key="gate"]');
    this.input = $("#secondName");
    this.verifyBtn = $("#verifyBtn");
    this.confirmRow = $("#confirmRow");
    this.bubbleEl = $("#gateBubble");
    this.note = $("#gateNote");
    this.log = $("#gateLog");
    this.stampEl = $("#gateStamp");
    this.scanWrap = $("#scanWrap");
    this.mascot = new Mascot($("#bearGate"), "bouncer");
    this.wrongTries = 0;
    this.busy = false;
    this.passed = false;
    this.say(CONFIG.gate.hello);

    this.verifyBtn.addEventListener("click", () => this.verify());
    this.input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); this.verify(); } });
    this.input.addEventListener("input", () => { this.stampEl.hidden = true; });
  }

  enter(fresh) {
    const parts = [...this.sec.children];
    fresh ? this.app.pacer.reveal(parts) : this.app.pacer.show(parts);
  }

  // Restoring progress: she already got in, so show the welcome notice
  pass() {
    this.passed = true;
    this.mascot.set("happy");
    this.say(fill(CONFIG.gate.welcome), "happy");
    $$(".js-second").forEach(el => el.textContent = RUNTIME.secondName);
    $$(".gate-part", this.sec).forEach(e => e.hidden = true);
    $("#gateEyebrow").textContent = "Official notice · Access granted";
    $$(".welcome-part", this.sec).forEach(e => e.hidden = false);
  }

  // ---- what the bear says
  say(text, mood = "", thinking = false) {
    this.bubbleEl.innerHTML = "";
    this.bubbleEl.append(text);
    if (thinking) this.bubbleEl.insertAdjacentHTML("beforeend", DOTS);
    this.bubbleEl.className = "bubble" + (mood ? " " + mood : "");
    restart(this.bubbleEl, "pop");
  }
  stamp(text, kind) {
    this.stampEl.textContent = text;
    this.stampEl.className = "gate-stamp " + kind;
    this.stampEl.hidden = false;
    restart(this.stampEl, "gate-stamp");
  }
  lock(on) {
    this.busy = on;
    this.input.disabled = on;
    this.verifyBtn.disabled = on;
  }

  // "yes" = correct, "close" = 1–2 letters off, "no" = wrong (checked against CONFIG.NAME_LOCK hashes)
  judge(raw) {
    const r = NameLock.check(raw, CONFIG.NAME_LOCK);
    if (r.result === "yes") RUNTIME.secondName = r.name;
    return r.result;
  }

  async verify() {
    if (this.busy || this.passed) return;
    const raw = this.input.value;
    if (!raw.trim()) {
      this.say(CONFIG.gate.empty);
      restart(this.sec, "shake");
      this.input.focus();
      return;
    }
    this.lock(true);
    this.note.textContent = "";
    await this.analyze(CONFIG.gate.thinking, true);

    const result = this.judge(raw);
    if (result === "no") return this.deny();
    if (result === "close") return this.almost();

    const { pacer } = this.app;
    this.mascot.set("suspicious");
    if (!(await this.ask(fill(CONFIG.gate.sure1), "Yes, I'm sure", "Let me fix it"))) return this.retry();

    this.mascot.set("suspicious", "closer");
    this.say(CONFIG.gate.sniff);
    await pacer.wait(1300);
    if (!(await this.ask(fill(CONFIG.gate.sure2), "100% sure!", "Let me check again"))) return this.retry();

    await this.analyze(CONFIG.gate.lastScan, false);
    this.mascot.set("shocked");
    this.say(CONFIG.gate.shocked);
    await pacer.wait(1000);
    this.accept();
  }

  // The bear thinks: magnifying glass, scan line over her name, log lines
  async analyze(text, full) {
    const { pacer } = this.app;
    this.mascot.set("think");
    this.say(text, "", true);
    this.scanWrap.classList.add("scanning");
    if (full) {
      this.log.innerHTML = "";
      this.log.hidden = false;
      for (const item of CONFIG.gate.log) {
        const row = document.createElement("div");
        row.innerHTML = fill(item) + DOTS;
        this.log.appendChild(row);
        await pacer.wait(800);
        row.innerHTML = fill(item) + ' <span class="ok">done</span>';
      }
      this.say(CONFIG.gate.drumroll);
      await pacer.wait(700);
    } else {
      await pacer.wait(1500);
    }
    this.scanWrap.classList.remove("scanning");
    this.log.hidden = true;
  }

  async deny() {
    this.wrongTries++;
    const lines = CONFIG.gate.wrong;
    this.mascot.set("angry");
    this.stamp("✖ DENIED", "bad");
    this.app.sfx.thunk();
    restart(this.sec, "shake");
    this.say(lines[(this.wrongTries - 1) % lines.length], "angry");
    if (this.wrongTries >= 3) this.note.textContent = fill(CONFIG.gate.hint);
    await this.app.pacer.wait(2200);
    this.retry(null);
  }

  async almost() {
    this.mascot.set("suspicious");
    this.say(CONFIG.gate.close);
    await this.app.pacer.wait(1600);
    this.retry(null);
  }

  retry(text = CONFIG.gate.retry) {
    this.mascot.set("bouncer");
    if (text) this.say(text);
    this.confirmRow.hidden = true;
    this.verifyBtn.hidden = false;
    this.lock(false);
    this.input.focus();
    this.input.select();
  }

  // Shows two buttons and waits for her answer (true = yes)
  ask(text, yesLabel, noLabel) {
    this.say(text);
    this.verifyBtn.hidden = true;
    this.confirmRow.innerHTML = "";
    this.confirmRow.hidden = false;
    const no = Object.assign(document.createElement("button"), { className: "btn ghost", type: "button", textContent: noLabel });
    const yes = Object.assign(document.createElement("button"), { className: "btn", type: "button", textContent: yesLabel });
    this.confirmRow.append(no, yes);
    // Short pause so a double tap can't skip the question
    [no, yes].forEach(b => b.disabled = true);
    this.app.pacer.wait(700).then(() => [no, yes].forEach(b => b.disabled = false));
    return new Promise(res => {
      yes.addEventListener("click", () => { this.confirmRow.hidden = true; res(true); });
      no.addEventListener("click", () => res(false));
    });
  }

  async accept() {
    const { pacer } = this.app;
    this.passed = true;
    this.mascot.set("happy");
    this.stamp("✔ VERIFIED", "good");
    this.app.sfx.thunk();
    $$(".js-second").forEach(el => el.textContent = RUNTIME.secondName);
    this.say(fill(CONFIG.gate.welcome), "happy");
    this.app.confetti.burst(70);
    await pacer.wait(3200);

    // Swap the checkpoint for the welcome notice
    $$(".gate-part", this.sec).forEach(e => e.hidden = true);
    $("#gateEyebrow").textContent = "Official notice · Access granted";
    const welcome = $$(".welcome-part", this.sec);
    welcome.forEach(e => { e.hidden = false; e.classList.add("pre"); });
    await pacer.reveal(welcome);
  }
}
